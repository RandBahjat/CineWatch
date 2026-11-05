const fs = require('fs');
const https = require('https');
const {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  ListMultipartUploadsCommand,
  ListPartsCommand,
  CompleteMultipartUploadCommand,
  PutObjectCommand
} = require('@aws-sdk/client-s3');
const { NodeHttpHandler } = require('@smithy/node-http-handler');

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 20,
  timeout: 120000
});

const R2_CONFIG = {
  region: 'auto',
  endpoint: 'https://e3bec917f8b60cb1a2ca14c07469f535.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '02709ea3500727b8d620141a4cc5407b',
    secretAccessKey: 'cb72b1e67b42bad16d5964ae391b60db18fc79be72635a32d67a62902064e663'
  },
  forcePathStyle: true,
  maxAttempts: 10,
  requestHandler: new NodeHttpHandler({
    httpsAgent,
    connectionTimeout: 45000,
    requestTimeout: 180000
  })
};

const BUCKET = 'cinewatch';
const s3Client = new S3Client(R2_CONFIG);

const SUBTITLE_FILE = 'E:\\Resident_Evil_2026_English.vtt';
const SUBTITLE_KEY = 'Resident_Evil_2026_English.vtt';

const BACKDROP_FILE = 'E:\\1370604.jpeg';
const BACKDROP_KEY = 'Resident_Evil_2026_Backdrop.jpg';

const VIDEO_FILE = 'E:\\HandBrake_Output\\Resident Evil (2026) 2160P Web-Dl Dv Hdr 10Bit Hevc [Hindi Ddp 5.1 + English Ddp 5.1] X265 (Chdweb-Uhdmovies).mp4';
const VIDEO_KEY = 'Resident_Evil_2026_4K_UHD.mp4';

const LOG_FILE = 'E:\\resident_evil_2026_upload.log';
const PART_SIZE = 20 * 1024 * 1024; // 20MB parts
const CONCURRENCY = 3; // 3 parallel streams

function logMsg(msg) {
  const timestamp = new Date().toLocaleTimeString();
  const formatted = `[${timestamp}] ${msg}`;
  console.log(formatted);
  try {
    fs.appendFileSync(LOG_FILE, formatted + '\n');
  } catch (e) {}
}

async function uploadAssetsIfNeeded() {
  if (fs.existsSync(SUBTITLE_FILE)) {
    try {
      const content = fs.readFileSync(SUBTITLE_FILE);
      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: SUBTITLE_KEY,
        Body: content,
        ContentType: 'text/vtt; charset=utf-8'
      }));
      logMsg(`[SUBTITLE] English subtitle uploaded: https://pub-8831c11f477044598f386d280daece6c.r2.dev/${SUBTITLE_KEY}`);
    } catch (err) {
      logMsg(`[SUBTITLE WARN] ${err.message}`);
    }
  }

  if (fs.existsSync(BACKDROP_FILE)) {
    try {
      const content = fs.readFileSync(BACKDROP_FILE);
      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: BACKDROP_KEY,
        Body: content,
        ContentType: 'image/jpeg'
      }));
      logMsg(`[BACKDROP] 4K Backdrop uploaded: https://pub-8831c11f477044598f386d280daece6c.r2.dev/${BACKDROP_KEY}`);
    } catch (err) {
      logMsg(`[BACKDROP WARN] ${err.message}`);
    }
  }
}

async function getOrCreateUploadId() {
  const list = await s3Client.send(new ListMultipartUploadsCommand({ Bucket: BUCKET }));
  const existing = (list.Uploads || []).find(u => u.Key === VIDEO_KEY);
  if (existing) {
    logMsg(`[RESUME] Found active upload session: ${existing.UploadId.slice(0, 25)}...`);
    return existing.UploadId;
  }

  logMsg('[INIT] Creating new multipart upload session...');
  const createRes = await s3Client.send(new CreateMultipartUploadCommand({
    Bucket: BUCKET,
    Key: VIDEO_KEY,
    ContentType: 'video/mp4'
  }));
  logMsg(`[INIT] New upload session created: ${createRes.UploadId.slice(0, 25)}...`);
  return createRes.UploadId;
}

async function getExistingParts(uploadId) {
  const parts = new Map();
  let partNumberMarker = undefined;

  while (true) {
    const res = await s3Client.send(new ListPartsCommand({
      Bucket: BUCKET,
      Key: VIDEO_KEY,
      UploadId: uploadId,
      PartNumberMarker: partNumberMarker
    }));

    if (res.Parts) {
      for (const p of res.Parts) {
        parts.set(p.PartNumber, { PartNumber: p.PartNumber, ETag: p.ETag, Size: p.Size });
      }
    }

    if (res.IsTruncated && res.NextPartNumberMarker) {
      partNumberMarker = res.NextPartNumberMarker;
    } else {
      break;
    }
  }

  return parts;
}

async function uploadPartWithRetry(uploadId, partNumber, totalParts, fileFd, startOffset, length, maxRetries = 10) {
  const buf = Buffer.alloc(length);
  fs.readSync(fileFd, buf, 0, length, startOffset);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await s3Client.send(new UploadPartCommand({
        Bucket: BUCKET,
        Key: VIDEO_KEY,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: buf
      }));
      return res.ETag;
    } catch (err) {
      if (attempt === maxRetries) {
        throw new Error(`Part ${partNumber} failed after ${maxRetries} attempts: ${err.message}`);
      }
      const delay = Math.min(attempt * 2000, 10000);
      logMsg(`[WARN] Part ${partNumber}/${totalParts} failed attempt ${attempt} (${err.message}). Retrying in ${delay / 1000}s...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

async function startResumableUpload() {
  if (!fs.existsSync(VIDEO_FILE)) {
    logMsg(`[FATAL] Video file not found at ${VIDEO_FILE}`);
    process.exit(1);
  }

  const stat = fs.statSync(VIDEO_FILE);
  const totalBytes = stat.size;
  const totalGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
  const totalParts = Math.ceil(totalBytes / PART_SIZE);

  logMsg('========================================================================');
  logMsg(' LIVE RESUMABLE R2 4K UPLOAD: Resident Evil (2026)');
  logMsg(` Target Key : ${VIDEO_KEY}`);
  logMsg(` Total Size : ${totalGB} GB (${totalBytes.toLocaleString()} bytes)`);
  logMsg(` Total Parts: ${totalParts} parts (${(PART_SIZE / 1024 / 1024)} MB each)`);
  logMsg(` Concurrency: ${CONCURRENCY} parallel streams`);
  logMsg('========================================================================');

  await uploadAssetsIfNeeded();

  const uploadId = await getOrCreateUploadId();
  const existingPartsMap = await getExistingParts(uploadId);
  const completedParts = [];

  let alreadyUploadedBytes = 0;
  for (const [pNum, pInfo] of existingPartsMap.entries()) {
    completedParts.push({ PartNumber: pNum, ETag: pInfo.ETag });
    alreadyUploadedBytes += pInfo.Size || PART_SIZE;
  }

  logMsg(`[RESUME STATUS] Verified ${completedParts.length} / ${totalParts} parts already on Cloudflare R2 (${(alreadyUploadedBytes / (1024 * 1024 * 1024)).toFixed(2)} GB).`);

  const pendingParts = [];
  for (let pNum = 1; pNum <= totalParts; pNum++) {
    if (!existingPartsMap.has(pNum)) {
      pendingParts.push(pNum);
    }
  }

  if (pendingParts.length === 0) {
    logMsg('[COMPLETE] All parts already uploaded! Finalizing upload...');
  } else {
    logMsg(`[START] Uploading remaining ${pendingParts.length} parts...`);

    const fileFd = fs.openSync(VIDEO_FILE, 'r');
    const startTime = Date.now();
    let uploadedSinceStartBytes = 0;
    let nextIndex = 0;

    async function worker(workerId) {
      while (nextIndex < pendingParts.length) {
        const currentIdx = nextIndex++;
        const partNumber = pendingParts[currentIdx];
        const startOffset = (partNumber - 1) * PART_SIZE;
        const currentPartLength = Math.min(PART_SIZE, totalBytes - startOffset);

        const etag = await uploadPartWithRetry(uploadId, partNumber, totalParts, fileFd, startOffset, currentPartLength);
        completedParts.push({ PartNumber: partNumber, ETag: etag });

        uploadedSinceStartBytes += currentPartLength;
        const totalUploadedBytes = alreadyUploadedBytes + uploadedSinceStartBytes;
        const percent = Math.min(100, Math.floor((totalUploadedBytes / totalBytes) * 100));

        const now = Date.now();
        const elapsedSecs = (now - startTime) / 1000;
        const overallSpeed = elapsedSecs > 0 ? (uploadedSinceStartBytes / (1024 * 1024 * elapsedSecs)) : 0;
        const remainingBytes = totalBytes - totalUploadedBytes;
        const etaSecs = overallSpeed > 0 ? Math.round(remainingBytes / (1024 * 1024 * overallSpeed)) : 0;
        const etaMins = Math.floor(etaSecs / 60);
        const etaSeconds = etaSecs % 60;
        const etaStr = `${etaMins}m ${etaSeconds < 10 ? '0' : ''}${etaSeconds}s`;

        const progressBarLength = 25;
        const filledLength = Math.round((percent / 100) * progressBarLength);
        const bar = '█'.repeat(filledLength) + '░'.repeat(progressBarLength - filledLength);
        const uploadedGB = (totalUploadedBytes / (1024 * 1024 * 1024)).toFixed(2);

        logMsg(`[PROGRESS] [${bar}] ${percent}% | ${uploadedGB} GB / ${totalGB} GB | Part ${completedParts.length}/${totalParts} | Speed: ${overallSpeed.toFixed(1)} MB/s | ETA: ${etaStr}`);
      }
    }

    const workers = [];
    for (let i = 0; i < CONCURRENCY; i++) {
      workers.push(worker(i + 1));
    }

    await Promise.all(workers);
    fs.closeSync(fileFd);
  }

  completedParts.sort((a, b) => a.PartNumber - b.PartNumber);

  logMsg('[FINALIZE] Assembling and finalizing multipart upload in Cloudflare R2...');
  await s3Client.send(new CompleteMultipartUploadCommand({
    Bucket: BUCKET,
    Key: VIDEO_KEY,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: completedParts.map(p => ({
        PartNumber: p.PartNumber,
        ETag: p.ETag
      }))
    }
  }));

  logMsg('========================================================================');
  logMsg('[SUCCESS] Resident Evil (2026) 4K is LIVE!');
  logMsg(`Public Stream URL: https://pub-8831c11f477044598f386d280daece6c.r2.dev/${VIDEO_KEY}`);
  logMsg('========================================================================');
}

startResumableUpload().catch(err => {
  logMsg(`[FATAL ERROR] ${err.message}`);
  process.exit(1);
});

