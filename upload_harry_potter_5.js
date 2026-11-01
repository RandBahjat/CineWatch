const fs = require('fs');
const https = require('https');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
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

const SUBTITLE_FILE = 'E:\\Harry_Potter_Order_Of_The_Phoenix_2007_English.vtt';
const SUBTITLE_KEY = 'Harry_Potter_Order_Of_The_Phoenix_2007_English.vtt';

const VIDEO_FILE = 'E:\\HandBrake_Output\\Harry.Potter.And.The.Order.Of.The.Phoenix.2007.2160P.Multi.Audio.Hindi.English.10Bit.Bluray.Remux.Hevc.X265.Amzn.Ddp.5.1.Dts.7.1.Kmmovies.Com.mp4';
const VIDEO_KEY = 'Harry_Potter_And_The_Order_Of_The_Phoenix_2007_4K_UHD.mp4';

const LOG_FILE = 'E:\\harry_potter_5_upload.log';

function logMsg(msg) {
  const timestamp = new Date().toLocaleTimeString();
  const formatted = `[${timestamp}] ${msg}`;
  console.log(formatted);
  try {
    fs.appendFileSync(LOG_FILE, formatted + '\n');
  } catch (e) {}
}

async function uploadSubtitle() {
  if (!fs.existsSync(SUBTITLE_FILE)) {
    logMsg(`[WARN] Subtitle file not found: ${SUBTITLE_FILE}, skipping subtitle upload.`);
    return;
  }
  logMsg(`Uploading Subtitle: ${SUBTITLE_KEY}...`);
  const content = fs.readFileSync(SUBTITLE_FILE);
  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: SUBTITLE_KEY,
    Body: content,
    ContentType: 'text/vtt; charset=utf-8'
  }));
  logMsg(`[SUCCESS] Subtitle uploaded: https://pub-8831c11f477044598f386d280daece6c.r2.dev/${SUBTITLE_KEY}`);
}

async function uploadVideo() {
  logMsg('========================================================================');
  logMsg(' LIVE CLOUDFLARE R2 UPLOAD: Harry Potter and the Order of the Phoenix (2007) 4K');
  logMsg(` Target Key : ${VIDEO_KEY}`);
  logMsg(` Destination: s3://${BUCKET}/${VIDEO_KEY}`);
  logMsg(' Keep-Alive HTTPS & Auto-Retry enabled');
  logMsg('========================================================================');

  if (!fs.existsSync(VIDEO_FILE)) {
    logMsg(`[ERROR] Source video file does not exist: ${VIDEO_FILE}`);
    process.exit(1);
  }

  const stat = fs.statSync(VIDEO_FILE);
  const totalBytes = stat.size;
  const totalGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
  logMsg(`Video File Size: ${totalGB} GB (${totalBytes.toLocaleString()} bytes)`);

  const fileStream = fs.createReadStream(VIDEO_FILE, { highWaterMark: 10 * 1024 * 1024 });
  const startTime = Date.now();
  let lastLoggedTime = startTime;
  let lastLoadedBytes = 0;
  let lastPercent = -1;

  const parallelUploads3 = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET,
      Key: VIDEO_KEY,
      Body: fileStream,
      ContentType: 'video/mp4'
    },
    partSize: 20 * 1024 * 1024, // 20MB parts
    queueSize: 3, // 3 parallel uploads
    leavePartsOnError: false
  });

  parallelUploads3.on('httpUploadProgress', (progress) => {
    const loaded = progress.loaded || 0;
    const total = progress.total || totalBytes;
    const percent = Math.floor((loaded / total) * 100);

    const now = Date.now();
    const timeDelta = (now - lastLoggedTime) / 1000;

    // Log progress every 1% or every 4 seconds
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
  logMsg(`[SUCCESS] Harry Potter 5 (2007) 4K upload complete in ${totalTimeMins} minutes!`);
  logMsg(`Public Stream URL: https://pub-8831c11f477044598f386d280daece6c.r2.dev/${VIDEO_KEY}`);
  logMsg('========================================================================');
}

async function main() {
  if (fs.existsSync(LOG_FILE)) {
    try { fs.unlinkSync(LOG_FILE); } catch (e) {}
  }

  try {
    await uploadSubtitle();
  } catch (err) {
    logMsg(`[SUBTITLE ERROR] ${err.message}`);
  }

  const MAX_RETRIES = 5;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 1) {
        logMsg(`[RETRY] Attempt ${attempt} of ${MAX_RETRIES} after connection hiccup...`);
      }
      await uploadVideo();
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
