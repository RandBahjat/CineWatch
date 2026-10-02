const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

// 1. Clean admin.html
const adminPath = path.join(rootDir, 'admin.html');
if (fs.existsSync(adminPath)) {
  let content = fs.readFileSync(adminPath, 'utf8');
  content = content.replace(/'AC6df9f65f988b401630fe3807e6aa8d46'/g, "''");
  content = content.replace(/'6c4772223874fd181d4e9ee2773c89c3'/g, "''");
  content = content.replace(/'\+17372508034'/g, "''");
  fs.writeFileSync(adminPath, content, 'utf8');
  console.log('Cleaned admin.html');
}

// 2. Clean server.js
const serverPath = path.join(rootDir, 'server.js');
if (fs.existsSync(serverPath)) {
  let content = fs.readFileSync(serverPath, 'utf8');
  content = content.replace(/'AC6df9f65f988b401630fe3807e6aa8d46'/g, "process.env.TWILIO_ACCOUNT_SID || ''");
  content = content.replace(/'6c4772223874fd181d4e9ee2773c89c3'/g, "process.env.TWILIO_AUTH_TOKEN || ''");
  content = content.replace(/'\+17372508034'/g, "process.env.TWILIO_FROM_PHONE || ''");
  fs.writeFileSync(serverPath, content, 'utf8');
  console.log('Cleaned server.js');
}
