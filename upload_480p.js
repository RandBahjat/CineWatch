const fs = require('fs');
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
const filePath = 'E:\\Spider-Man_2_2004_480p.mp4';
const s3Key = 'Spider-Man_2_2004_480p.mp4';

async function main() {
  const stat = fs.statSync(filePath);
  console.log(`Starting upload of ${filePath} (${(stat.size / 1024 / 1024).toFixed(2)} MB) to s3://${BUCKET}/${s3Key}`);

  const fileStream = fs.createReadStream(filePath);
  const uploader = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET,
      Key: s3Key,
      Body: fileStream,
      ContentType: 'video/mp4'
    },
    partSize: 10 * 1024 * 1024,
    queueSize: 3
  });

  let lastP = 0;
  uploader.on('httpUploadProgress', (p) => {
    const percent = Math.floor((p.loaded / p.total) * 100);
    if (percent >= lastP + 10 || percent === 100) {
      console.log(`[480p Upload] ${percent}% (${(p.loaded / 1024 / 1024).toFixed(1)}MB / ${(p.total / 1024 / 1024).toFixed(1)}MB)`);
      lastP = percent;
    }
  });

  await uploader.done();
  console.log(`SUCCESS: https://pub-8831c11f477044598f386d280daece6c.r2.dev/${s3Key} is live!`);
}

main().catch(console.error);
