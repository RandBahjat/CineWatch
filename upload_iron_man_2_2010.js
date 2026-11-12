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

const SUBTITLE_FILE = 'E:\\Iron_Man_2_2010_English.vtt';
const SUBTITLE_KEY = 'Iron_Man_2_2010_English.vtt';

const VIDEO_FILE = 'E:\\HandBrake_Output\\Iron.Man.2.2010.2160P.Multi.Audio.Hindi.Tamil.Telugu.English.Bluray.Remux.10Bit.Hevc.5.1.Dsnp.Ddp.5.1.Truehd.Atmos.7.1.X265.Kmmovies.Com.mp4';
const VIDEO_KEY = 'Iron_Man_2_2010_4K_UHD.mp4';

const LOG_FILE = 'E:\\iron_man_2_2010_upload.log';
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
}

async function getOrInitMultipartUpload() {
  logMsg('[INIT] Checking for existing multipart uploads on R2...');
  try {
    const listRes = await s3Client.send(new ListMultipartUploadsCommand({
      Bucket: BUCKET,
      Prefix: VIDEO_KEY
    }));

    if (listRes.Uploads && listRes.Uploads.length > 0) {
      const existing = listRes.Uploads.find(u => u.Key === VIDEO_KEY);
      if (existing) {
        logMsg(`[RESUME] Found existing multipart upload ID: ${existing.UploadId}`);
        return existing.UploadId;
      }
    }
  } catch (err) {
    logMsg(`[WARN] ListMultipartUploads check failed: ${err.message}`);
  }

  logMsg('[NEW] Starting new multipart upload on Cloudflare R2...');
  const createRes = await s3Client.send(new CreateMultipartUploadCommand({
    Bucket: BUCKET,
    Key: VIDEO_KEY,
    ContentType: 'video/mp4'
  }));
  logMsg(`[NEW] Created upload ID: ${createRes.UploadId}`);
  return createRes.UploadId;
}

async function getAlreadyUploadedParts(uploadId) {
  const completedParts = [];
  let partNumberMarker = undefined;

  while (true) {
    try {
      const res = await s3Client.send(new ListPartsCommand({
        Bucket: BUCKET,
        Key: VIDEO_KEY,
        UploadId: uploadId,
        PartNumberMarker: partNumberMarker
      }));

      if (res.Parts && res.Parts.length > 0) {
        for (const part of res.Parts) {
          completedParts.push({
            PartNumber: part.PartNumber,
            ETag: part.ETag
          });
        }
      }

      if (res.IsTruncated) {
        partNumberMarker = res.NextPartNumberMarker;
      } else {
        break;
      }
    } catch (err) {
      logMsg(`[WARN] Error listing uploaded parts: ${err.message}`);
      break;
    }
  }

  return completedParts;
}

async function uploadPartWithRetry(uploadId, partNumber, totalParts, fileFd, startOffset, length, maxRetries = 6) {
  const buffer = Buffer.alloc(length);
  fs.readSync(fileFd, buffer, 0, length, startOffset);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await s3Client.send(new UploadPartCommand({
        Bucket: BUCKET,
        Key: VIDEO_KEY,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: buffer
      }));
      return res.ETag;
    } catch (err) {
      if (attempt === maxRetries) {
        throw new Error(`Part ${partNumber} failed permanently after ${maxRetries} attempts: ${err.message}`);
      }
      const backoff = Math.min(attempt * 2500, 15000);
      logMsg(`[RETRY] Part ${partNumber}/${totalParts} error: ${err.message}. Retrying in ${backoff/1000}s...`);
      await new Promise(r => setTimeout(r, backoff));
    }
  }
}

async function startResumableUpload() {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, `=== CINEWATCH 4K UPLOAD LOG: IRON MAN 2 (2010) ===\nStarted: ${new Date().toISOString()}\n\n`);
    } else {
      fs.appendFileSync(LOG_FILE, `\n=== RESUMED CINEWATCH 4K UPLOAD: IRON MAN 2 (2010) ===\nResumed at: ${new Date().toISOString()}\n\n`);
    }
  } catch (e) {}

  if (!fs.existsSync(VIDEO_FILE)) {
    logMsg(`[FATAL] Target video file not found at: ${VIDEO_FILE}`);
    process.exit(1);
  }

  const stat = fs.statSync(VIDEO_FILE);
  const totalBytes = stat.size;
  const totalParts = Math.ceil(totalBytes / PART_SIZE);
  const totalGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);

  logMsg(`[INFO] Video File: ${VIDEO_FILE}`);
  logMsg(`[INFO] Total Size: ${totalGB} GB (${totalBytes.toLocaleString()} bytes)`);
  logMsg(`[INFO] Total Parts: ${totalParts} (Part size: 20MB) | Parallel Streams: ${CONCURRENCY}`);

  await uploadAssetsIfNeeded();

  const uploadId = await getOrInitMultipartUpload();
  const alreadyUploaded = await getAlreadyUploadedParts(uploadId);
  const completedParts = [...alreadyUploaded];
  const uploadedPartNums = new Set(alreadyUploaded.map(p => p.PartNumber));

  logMsg(`[STATUS] Already verified uploaded: ${alreadyUploaded.length}/${totalParts} parts.`);

  const pendingParts = [];
  for (let i = 1; i <= totalParts; i++) {
    if (!uploadedPartNums.has(i)) {
      pendingParts.push(i);
    }
  }

  if (pendingParts.length === 0) {
    logMsg('[SUCCESS] All parts already uploaded! Finalizing multipart upload...');
  } else {
    logMsg(`[START] Uploading remaining ${pendingParts.length} parts...`);
  }

  const fileFd = fs.openSync(VIDEO_FILE, 'r');
  let activeIndex = 0;
  let finishedCount = alreadyUploaded.length;
  let currentUploadedBytes = alreadyUploaded.reduce((acc, p) => {
    const isLast = p.PartNumber === totalParts;
    const sz = isLast ? (totalBytes - (p.PartNumber - 1) * PART_SIZE) : PART_SIZE;
    return acc + sz;
  }, 0);

  const startTime = Date.now();
  let bytesSinceStart = 0;

  function renderProgress(justUploadedBytes) {
    bytesSinceStart += justUploadedBytes;
    currentUploadedBytes += justUploadedBytes;

    const percent = Math.min(100, Math.floor((currentUploadedBytes / totalBytes) * 100));
    const elapsedSec = (Date.now() - startTime) / 1000;
    const speedMBps = elapsedSec > 0 ? (bytesSinceStart / (1024 * 1024)) / elapsedSec : 0;
    const remainingBytes = Math.max(0, totalBytes - currentUploadedBytes);
    const etaSec = speedMBps > 0 ? (remainingBytes / (1024 * 1024)) / speedMBps : 0;
    const etaMin = Math.floor(etaSec / 60);
    const etaRemainderSec = Math.floor(etaSec % 60);
    const etaStr = `${etaMin}m ${etaRemainderSec.toString().padStart(2, '0')}s`;

    const barWidth = 25;
    const filled = Math.round((percent / 100) * barWidth);
    const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);

    logMsg(`[PROGRESS] [${bar}] ${percent}% | ${(currentUploadedBytes / (1024*1024*1024)).toFixed(2)} GB / ${totalGB} GB | Part ${finishedCount}/${totalParts} | Speed: ${speedMBps.toFixed(1)} MB/s | ETA: ${etaStr}`);
  }

  async function worker() {
    while (activeIndex < pendingParts.length) {
      const idx = activeIndex++;
      const pNum = pendingParts[idx];
      const startOffset = (pNum - 1) * PART_SIZE;
      const length = Math.min(PART_SIZE, totalBytes - startOffset);

      try {
        const etag = await uploadPartWithRetry(uploadId, pNum, totalParts, fileFd, startOffset, length);
        completedParts.push({ PartNumber: pNum, ETag: etag });
        finishedCount++;
        renderProgress(length);
      } catch (err) {
        logMsg(`[ERROR] Failed to upload part ${pNum}: ${err.message}`);
        fs.closeSync(fileFd);
        process.exit(1);
      }
    }
  }

  const workers = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  fs.closeSync(fileFd);

  logMsg('[FINALIZE] Assembling and finalizing multipart upload in Cloudflare R2...');
  completedParts.sort((a, b) => a.PartNumber - b.PartNumber);

  await s3Client.send(new CompleteMultipartUploadCommand({
    Bucket: BUCKET,
    Key: VIDEO_KEY,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: completedParts.map(p => ({ PartNumber: p.PartNumber, ETag: p.ETag }))
    }
  }));

  logMsg('========================================================================');
  logMsg('[SUCCESS] Iron Man 2 (2010) 4K UHD is LIVE!');
  logMsg(`Public Stream URL: https://pub-8831c11f477044598f386d280daece6c.r2.dev/${VIDEO_KEY}`);
  logMsg('========================================================================');
}

startResumableUpload().catch(err => {
  logMsg(`[FATAL ERROR] ${err.stack || err.message}`);
  process.exit(1);
});

