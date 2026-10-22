const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

const R2_CONFIG = {
  region: 'auto',
  endpoint: 'https://e3bec917f8b60cb1a2ca14c07469f535.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '02709ea3500727b8d620141a4cc5407b',
    secretAccessKey: 'cb72b1e67b42bad16d5964ae391b60db18fc79be72635a32d67a62902064e663'
  }
};

const BUCKET = 'cinewatch';
const s3Client = new S3Client(R2_CONFIG);

const SOURCE_MKV = 'E:\\Spider-Man 2 (2004) 2160p 4K UHD HDR10 BluRay REMUX x265 10bit HEVC [Org DD 5.1 Hindi + DTS-HDMA TrueHD Atmos 7.1 English] MSubs FGT.mkv';
const OUT_1080P = 'E:\\Spider-Man_2_2004_1080p.mp4';
const OUT_720P = 'E:\\Spider-Man_2_2004_720p.mp4';
const OUT_480P = 'E:\\Spider-Man_2_2004_480p.mp4';

function runFFmpeg(args, taskName) {
  return new Promise((resolve, reject) => {
    console.log(`\n========================================`);
    console.log(`[STARTING] ${taskName}`);
    console.log(`Command: ffmpeg ${args.join(' ')}`);
    console.log(`========================================\n`);

    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let lastLogTime = Date.now();

    proc.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      if (Date.now() - lastLogTime > 5000) {
        const match = text.match(/frame=\s*\d+.*?time=[\d:.]+/i);
        if (match) {
          console.log(`[${taskName}] ${match[0]}`);
          lastLogTime = Date.now();
        }
      }
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`[COMPLETED] ${taskName} successfully.`);
        resolve();
      } else {
        console.error(`[FAILED] ${taskName} with exit code ${code}`);
        reject(new Error(`${taskName} failed with code ${code}`));
      }
    });

    proc.on('error', (err) => {
      console.error(`[ERROR] ${taskName}:`, err);
      reject(err);
    });
  });
}

async function uploadToR2(filePath, s3Key) {
  const fileStat = fs.statSync(filePath);
  const fileSizeMB = (fileStat.size / (1024 * 1024)).toFixed(2);
  console.log(`\n[UPLOAD] Uploading ${filePath} (${fileSizeMB} MB) -> s3://${BUCKET}/${s3Key}`);

  const fileStream = fs.createReadStream(filePath);
  const parallelUploads3 = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET,
      Key: s3Key,
      Body: fileStream,
      ContentType: 'video/mp4'
    },
    partSize: 20 * 1024 * 1024,
    queueSize: 4
  });

  let lastPercent = 0;
  parallelUploads3.on('httpUploadProgress', (progress) => {
    const percent = Math.floor((progress.loaded / progress.total) * 100);
    if (percent >= lastPercent + 10 || percent === 100) {
      console.log(`[UPLOAD] ${s3Key}: ${percent}% (${(progress.loaded / 1024 / 1024).toFixed(1)}MB / ${(progress.total / 1024 / 1024).toFixed(1)}MB)`);
      lastPercent = percent;
    }
  });

  await parallelUploads3.done();
  console.log(`[UPLOAD SUCCESS] ${s3Key} is live at https://pub-8831c11f477044598f386d280daece6c.r2.dev/${s3Key}`);
}

async function main() {
  const startTime = Date.now();
  console.log(`Pipeline started at ${new Date().toISOString()}`);

  // 1. Encode 1080p if not already generated
  if (!fs.existsSync(OUT_1080P) || fs.statSync(OUT_1080P).size < 10000000) {
    await runFFmpeg([
      '-y',
      '-i', SOURCE_MKV,
      '-map', '0:v:0',
      '-map', '0:4',
      '-vf', 'scale=1920:1080,format=nv12',
      '-c:v', 'h264_mf',
      '-b:v', '3200k',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-ac', '2',
      '-movflags', '+faststart',
      OUT_1080P
    ], 'Encoding Spider-Man 2 to 1080p MP4');
  } else {
    console.log(`[SKIP] 1080p file already exists (${(fs.statSync(OUT_1080P).size / 1024 / 1024).toFixed(2)} MB)`);
  }

  // 2. Encode 720p from 1080p
  if (!fs.existsSync(OUT_720P) || fs.statSync(OUT_720P).size < 10000000) {
    await runFFmpeg([
      '-y',
      '-i', OUT_1080P,
      '-vf', 'scale=1280:720,format=nv12',
      '-c:v', 'h264_mf',
      '-b:v', '1700k',
      '-c:a', 'copy',
      '-movflags', '+faststart',
      OUT_720P
    ], 'Encoding Spider-Man 2 to 720p MP4');
  } else {
    console.log(`[SKIP] 720p file already exists (${(fs.statSync(OUT_720P).size / 1024 / 1024).toFixed(2)} MB)`);
  }

  // 3. Encode 480p from 1080p
  if (!fs.existsSync(OUT_480P) || fs.statSync(OUT_480P).size < 10000000) {
    await runFFmpeg([
      '-y',
      '-i', OUT_1080P,
      '-vf', 'scale=854:480,format=nv12',
      '-c:v', 'h264_mf',
      '-b:v', '900k',
      '-c:a', 'copy',
      '-movflags', '+faststart',
      OUT_480P
    ], 'Encoding Spider-Man 2 to 480p MP4');
  } else {
    console.log(`[SKIP] 480p file already exists (${(fs.statSync(OUT_480P).size / 1024 / 1024).toFixed(2)} MB)`);
  }

  // 4. Upload all 3 to R2
  console.log(`\n========================================`);
  console.log(`ALL 3 QUALITIES ENCODED LOCALLY! STARTING CLOUDFLARE R2 UPLOADS...`);
  console.log(`========================================\n`);

  await uploadToR2(OUT_1080P, 'Spider-Man_2_2004_1080p.mp4');
  await uploadToR2(OUT_720P, 'Spider-Man_2_2004_720p.mp4');
  await uploadToR2(OUT_480P, 'Spider-Man_2_2004_480p.mp4');

  const totalMin = ((Date.now() - startTime) / 60000).toFixed(1);
  console.log(`\n🎉 ALL DONE in ${totalMin} minutes! 1080p, 720p, and 480p are live on Cloudflare R2.`);
}

main().catch((err) => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
