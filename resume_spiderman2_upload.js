const fs = require('fs');
const https = require('https');
const dns = require('dns');
const { S3Client, ListPartsCommand, UploadPartCommand, CompleteMultipartUploadCommand } = require('@aws-sdk/client-s3');
const { NodeHttpHandler } = require('@smithy/node-http-handler');

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 15,
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
const TARGET_KEY = 'The_Amazing_Spider_Man_2_2014_4K_UHD.mp4';
const UPLOAD_ID = 'AOv8MD4NTR6ReuEfiCVrKAvT6TkotanSYHR-TDbptMdX8sbhMiWLRUMLxDox8XIWrI_r0ZX1vWbNn2Lb8u5PGPajtMfRMhIFZ-mZehPNPEqOsuA_0e9r-ELMs4yFDefSPZBYY5WKqWOiMIqM30RPXmubAroTq1SRzZt1yP-e7uQMXjSLJZfu5DdQkx7ifjp8299ekocsSRczESn1w7pUd51xayvj5C9Ge0-bO4I9w4rwJKUlb91GN_B6UJ5gN3mYZa4gcUV8uFULwewT_3nVHtrwfH0mSCBDjVFgENot2Z95HDUyCjl1lTYffqLfFw7e6DEFYapSF9ApvK1aPaZG7_A';
const SOURCE_FILE = 'E:\\HandBrake_Output\\The Amazing Spider-Man 2 (2014) 2160P 4K Uhd Hdr10 Bluray Remux X265 10Bit Hevc [Org Hindi Bd 5.1 640Kbps + English Dts-Hdma Truehd Atmos 7.1] Msubs Fgt.mp4';
const LOG_FILE = 'E:\\spider_man_2_upload.log';

const PART_SIZE = 20 * 1024 * 1024; // 20 MB
const CONCURRENCY = 3;

const s3Client = new S3Client(R2_CONFIG);

function logMsg(msg) {
  const timestamp = new Date().toLocaleTimeString();
  const formatted = `[${timestamp}] ${msg}`;
  console.log(formatted);
  try {
    fs.appendFileSync(LOG_FILE, formatted + '\n');
  } catch (e) {}
}

async function getAllUploadedParts() {
  let parts = [];
  let marker = undefined;
  while (true) {
    const res = await s3Client.send(new ListPartsCommand({
      Bucket: BUCKET,
      Key: TARGET_KEY,
      UploadId: UPLOAD_ID,
      PartNumberMarker: marker
    }));
    if (res.Parts) parts = parts.concat(res.Parts);
    if (!res.IsTruncated) break;
    marker = res.NextPartNumberMarker;
  }
  return parts;
}

function waitNetwork() {
  return new Promise((resolve) => {
    const check = () => {
      dns.lookup('e3bec917f8b60cb1a2ca14c07469f535.r2.cloudflarestorage.com', (err) => {
        if (!err) return resolve();
        logMsg('[NETWORK CHECK] Connection offline, waiting 10 seconds...');
        setTimeout(check, 10000);
      });
    };
    check();
  });
}

async function uploadSinglePart(fd, partNum, start, length, totalParts, onUploaded) {
  const buffer = Buffer.alloc(length);
  fs.readSync(fd, buffer, 0, length, start);

  let success = false;
  let attempts = 0;
  while (!success) {
    attempts++;
    try {
      const res = await s3Client.send(new UploadPartCommand({
        Bucket: BUCKET,
        Key: TARGET_KEY,
        UploadId: UPLOAD_ID,
        PartNumber: partNum,
        Body: buffer
      }));
      onUploaded(length);
      return { PartNumber: partNum, ETag: res.ETag };
    } catch (err) {
      logMsg(`[RETRY] Part ${partNum}/${totalParts} failed (Attempt ${attempts}): ${err.message}`);
      await waitNetwork();
      await new Promise(r => setTimeout(r, 4000));
    }
  }
}

async function main() {
  logMsg('========================================================================');
  logMsg(' RESUMING CLOUDFLARE R2 UPLOAD: The Amazing Spider-Man 2 (2014) 4K UHD');
  logMsg(` Target Key : ${TARGET_KEY}`);
  logMsg(` Destination: s3://${BUCKET}/${TARGET_KEY}`);
  logMsg('========================================================================');

  if (!fs.existsSync(SOURCE_FILE)) {
    logMsg(`[ERROR] Source file missing: ${SOURCE_FILE}`);
    process.exit(1);
  }

  const stat = fs.statSync(SOURCE_FILE);
  const totalBytes = stat.size;
  const totalGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
  const totalParts = Math.ceil(totalBytes / PART_SIZE);

  logMsg(`Connecting to Cloudflare R2 to audit already uploaded chunks...`);
  const uploadedParts = await getAllUploadedParts();
  const existingMap = new Map();
  let uploadedBytes = 0;

  uploadedParts.forEach(p => {
    existingMap.set(p.PartNumber, p.ETag);
    uploadedBytes += p.Size;
  });

  const existingGB = (uploadedBytes / (1024 * 1024 * 1024)).toFixed(2);
  const startPercent = Math.floor((uploadedBytes / totalBytes) * 100);
  logMsg(`[AUDIT COMPLETE] ${uploadedParts.length} parts (${existingGB} GB / ${startPercent}%) already verified on R2!`);
  logMsg(`Resuming remaining ${totalParts - uploadedParts.length} parts seamlessly...`);

  const fd = fs.openSync(SOURCE_FILE, 'r');
  const finalParts = [...uploadedParts.map(p => ({ PartNumber: p.PartNumber, ETag: p.ETag }))];

  const startTime = Date.now();
  let lastLoggedTime = startTime;
  let lastLoadedBytes = uploadedBytes;
  let lastPercent = startPercent;

  function onPartDone(bytes) {
    uploadedBytes += bytes;
    const now = Date.now();
    const percent = Math.floor((uploadedBytes / totalBytes) * 100);
    const timeDelta = (now - lastLoggedTime) / 1000;

    if (percent > lastPercent || percent === 100 || timeDelta >= 5) {
      const bytesDelta = uploadedBytes - lastLoadedBytes;
      const speedMBs = timeDelta > 0 ? (bytesDelta / (1024 * 1024 * timeDelta)).toFixed(1) : '0.0';
      const loadedGB = (uploadedBytes / (1024 * 1024 * 1024)).toFixed(2);

      const sessionSecs = (now - startTime) / 1000;
      const sessionSpeed = sessionSecs > 0 ? ((uploadedBytes - (existingMap.size * PART_SIZE)) / (1024 * 1024 * sessionSecs)) : 0;
      const remainingBytes = totalBytes - uploadedBytes;
      const etaSeconds = sessionSpeed > 0 ? Math.round(remainingBytes / (1024 * 1024 * sessionSpeed)) : 0;
      const etaMins = Math.floor(etaSeconds / 60);
      const etaSecs = etaSeconds % 60;
      const etaStr = `${etaMins}m ${etaSecs < 10 ? '0' : ''}${etaSecs}s`;

      const barLen = 25;
      const filled = Math.round((percent / 100) * barLen);
      const bar = '█'.repeat(filled) + '░'.repeat(barLen - filled);

      logMsg(`[PROGRESS] [${bar}] ${percent}% | ${loadedGB} GB / ${totalGB} GB | Speed: ${speedMBs} MB/s | ETA: ${etaStr}`);
      lastPercent = percent;
      lastLoggedTime = now;
      lastLoadedBytes = uploadedBytes;
    }
  }

  // Queue of remaining part numbers
  const queue = [];
  for (let p = 1; p <= totalParts; p++) {
    if (!existingMap.has(p)) {
      queue.push(p);
    }
  }

  async function worker() {
    while (queue.length > 0) {
      const partNum = queue.shift();
      const start = (partNum - 1) * PART_SIZE;
      const length = Math.min(PART_SIZE, totalBytes - start);

      const result = await uploadSinglePart(fd, partNum, start, length, totalParts, onPartDone);
      finalParts.push(result);
    }
  }

  const workers = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);

  fs.closeSync(fd);

  logMsg(`All ${totalParts} parts uploaded! Finalizing file on Cloudflare R2...`);
  finalParts.sort((a, b) => a.PartNumber - b.PartNumber);

  await s3Client.send(new CompleteMultipartUploadCommand({
    Bucket: BUCKET,
    Key: TARGET_KEY,
    UploadId: UPLOAD_ID,
    MultipartUpload: {
      Parts: finalParts
    }
  }));

  const totalTimeMins = ((Date.now() - startTime) / 60000).toFixed(1);
  logMsg('========================================================================');
  logMsg(`[SUCCESS] The Amazing Spider-Man 2 4K upload complete in ${totalTimeMins} minutes!`);
  logMsg(`Public Stream URL: https://pub-8831c11f477044598f386d280daece6c.r2.dev/${TARGET_KEY}`);
  logMsg('========================================================================');
}

main().catch(err => {
  logMsg(`[FATAL] ${err.message}`);
  console.error(err);
  process.exit(1);
});
