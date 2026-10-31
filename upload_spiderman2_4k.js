const fs = require('fs');
const https = require('https');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { NodeHttpHandler } = require('@smithy/node-http-handler');

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 10,
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

const SOURCE_FILE = 'E:\\HandBrake_Output\\The Amazing Spider-Man 2 (2014) 2160P 4K Uhd Hdr10 Bluray Remux X265 10Bit Hevc [Org Hindi Bd 5.1 640Kbps + English Dts-Hdma Truehd Atmos 7.1] Msubs Fgt.mp4';
const TARGET_KEY = 'The_Amazing_Spider_Man_2_2014_4K_UHD.mp4';
const LOG_FILE = 'E:\\spider_man_2_upload.log';

function logMsg(msg) {
  const timestamp = new Date().toLocaleTimeString();
  const formatted = `[${timestamp}] ${msg}`;
  console.log(formatted);
  try {
    fs.appendFileSync(LOG_FILE, formatted + '\n');
  } catch (e) {}
}

async function doUpload() {
  logMsg('========================================================================');
  logMsg(' LIVE CLOUDFLARE R2 UPLOAD: The Amazing Spider-Man 2 (2014) 4K UHD');
  logMsg(` Target Key : ${TARGET_KEY}`);
  logMsg(` Destination: s3://${BUCKET}/${TARGET_KEY}`);
  logMsg(' Keep-Alive HTTPS & Auto-Retry enabled');
  logMsg('========================================================================');

  if (!fs.existsSync(SOURCE_FILE)) {
    logMsg(`[ERROR] Source file does not exist: ${SOURCE_FILE}`);
    process.exit(1);
  }

  const stat = fs.statSync(SOURCE_FILE);
  const totalBytes = stat.size;
  const totalGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
  logMsg(`File Size: ${totalGB} GB (${totalBytes.toLocaleString()} bytes)`);

  const fileStream = fs.createReadStream(SOURCE_FILE, { highWaterMark: 10 * 1024 * 1024 });
  const startTime = Date.now();
  let lastLoggedTime = startTime;
  let lastLoadedBytes = 0;
  let lastPercent = -1;

  const parallelUploads3 = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET,
      Key: TARGET_KEY,
      Body: fileStream,
      ContentType: 'video/mp4'
    },
    partSize: 20 * 1024 * 1024, // 20MB parts - fast completions, robust against network stalls
    queueSize: 3, // 3 parallel streams for maximum stability on home broadband
    leavePartsOnError: false
  });

  parallelUploads3.on('httpUploadProgress', (progress) => {
    const loaded = progress.loaded || 0;
    const total = progress.total || totalBytes;
    const percent = Math.floor((loaded / total) * 100);

    const now = Date.now();
    const timeDelta = (now - lastLoggedTime) / 1000;

    // Log update every 1% or every 4 seconds
    if (percent > lastPercent || percent === 100 || (timeDelta >= 4 && loaded !== lastLoadedBytes)) {
      const bytesDelta = loaded - lastLoadedBytes;
      const speedMBs = timeDelta > 0 ? (bytesDelta / (1024 * 1024 * timeDelta)).toFixed(1) : '0.0';
      const loadedGB = (loaded / (1024 * 1024 * 1024)).toFixed(2);
      
      const overallSeconds = (now - startTime) / 1000;
      const overallSpeed = overallSeconds > 0 ? (loaded / (1024 * 1024 * overallSeconds)) : 0;
      const remainingBytes = total - loaded;
      const etaSeconds = overallSpeed > 0 ? Math.round(remainingBytes / (1024 * 1024 * overallSpeed)) : 0;
      const etaMins = Math.floor(etaSeconds / 60);
      const etaSecs = etaSeconds % 60;
      const etaStr = `${etaMins}m ${etaSecs < 10 ? '0' : ''}${etaSecs}s`;

      const progressBarLength = 25;
      const filledLength = Math.round((percent / 100) * progressBarLength);
      const bar = '█'.repeat(filledLength) + '░'.repeat(progressBarLength - filledLength);

      logMsg(`[PROGRESS] [${bar}] ${percent}% | ${loadedGB} GB / ${totalGB} GB | Speed: ${speedMBs} MB/s | ETA: ${etaStr}`);
      lastPercent = percent;
      lastLoggedTime = now;
      lastLoadedBytes = loaded;
    }
  });

  await parallelUploads3.done();
  const totalTimeMins = ((Date.now() - startTime) / 60000).toFixed(1);
  logMsg('========================================================================');
  logMsg(`[SUCCESS] The Amazing Spider-Man 2 4K upload complete in ${totalTimeMins} minutes!`);
  logMsg(`Public Stream URL: https://pub-8831c11f477044598f386d280daece6c.r2.dev/${TARGET_KEY}`);
  logMsg('========================================================================');
}

async function main() {
  if (fs.existsSync(LOG_FILE)) {
    try { fs.unlinkSync(LOG_FILE); } catch (e) {}
  }

  const MAX_RETRIES = 5;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 1) {
        logMsg(`[RETRY] Attempt ${attempt} of ${MAX_RETRIES} after connection hiccup...`);
      }
      await doUpload();
      break;
    } catch (err) {
      logMsg(`[NETWORK WARNING] Attempt ${attempt} encountered error: ${err.message}`);
      if (attempt < MAX_RETRIES) {
        logMsg('Waiting 5 seconds before retrying...');
        await new Promise(r => setTimeout(r, 5000));
      } else {
        logMsg('[FATAL ERROR] Upload failed after multiple retries.');
        process.exit(1);
      }
    }
  }
}

main();
