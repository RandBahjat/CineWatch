const fs = require('fs');

console.log('--- 1. Injecting OneSignal SDK into index.html and cinewatch-app/index.html ---');

const onesignalSnippet = `
    <!-- OneSignal Web Push SDK -->
    <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
    <script>
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      OneSignalDeferred.push(async function(OneSignal) {
        await OneSignal.init({
          appId: "88a941ed-f1be-4f05-86ac-1828bd010eeb",
          notifyButton: {
            enable: false,
          },
        });
      });
    </script>
`;

function injectOneSignalHtml(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  if (html.includes('88a941ed-f1be-4f05-86ac-1828bd010eeb')) {
    console.log('OneSignal already in ' + filePath);
    return;
  }
  const headTag = '</head>';
  if (html.includes(headTag)) {
    html = html.replace(headTag, onesignalSnippet + '\n</head>');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Injected OneSignal into ' + filePath);
  }
}

injectOneSignalHtml('index.html');
injectOneSignalHtml('cinewatch-app/index.html');

console.log('--- 2. Updating movie.js & cinewatch-app/movie.js to prompt for push on VIP checkout ---');

function updatePushInMovieJs(filePath) {
  if (!fs.existsSync(filePath)) return;
  let text = fs.readFileSync(filePath, 'utf8');
  const eol = text.includes('\r\n') ? '\r\n' : '\n';

  // Add push prompt and capture pushId right before submit
  const targetRegex = /submitBtn\.onclick\s*=\s*\(\)\s*=>\s*\{/;
  const replaceStr = `submitBtn.onclick = () => {
      // Prompt user for OneSignal Push Notification on VIP order submission
      try {
        if (window.OneSignalDeferred) {
          window.OneSignalDeferred.push(async function(OneSignal) {
            try {
              if (OneSignal.Slidedown && typeof OneSignal.Slidedown.promptPush === 'function') {
                await OneSignal.Slidedown.promptPush();
              }
              const pushId = OneSignal.User && OneSignal.User.PushSubscription ? OneSignal.User.PushSubscription.id : null;
              if (pushId) localStorage.setItem('cw_onesignal_push_id', pushId);
            } catch(e) {}
          });
        }
      } catch(e) {}`;

  if (!text.includes('cw_onesignal_push_id') && targetRegex.test(text)) {
    text = text.replace(targetRegex, replaceStr);
    console.log('Added OneSignal prompt in submitBtn.onclick in ' + filePath);
  }

  // Update orderData to include pushId
  const orderDataRegex = /const\s+orderData\s*=\s*\{[\s\S]*?createdAt:\s*timeStr\s*\};/;
  if (text.includes('createdAt: timeStr') && !text.includes('pushId: localStorage.getItem')) {
    text = text.replace('createdAt: timeStr', `createdAt: timeStr,\n        pushId: localStorage.getItem('cw_onesignal_push_id') || ''`);
    console.log('Added pushId to orderData in ' + filePath);
  }

  // Update Telegram buttons to include pushId parameter
  const telegramButtonsRegex = /url:\s*`\${window\.location\.origin}\/admin\.html\?order=\${orderId}&action=approved&phone=\${encodeURIComponent\(senderPhone\s*\|\|\s*refVal\)}`/;
  if (telegramButtonsRegex.test(text)) {
    text = text.replace(
      telegramButtonsRegex,
      "url: `${window.location.origin}/admin.html?order=${orderId}&action=approved&phone=${encodeURIComponent(senderPhone || refVal)}&pushId=${encodeURIComponent(localStorage.getItem('cw_onesignal_push_id') || '')}`"
    );
    console.log('Added pushId to Telegram Approve URL in ' + filePath);
  }

  const telegramDenyRegex = /url:\s*`\${window\.location\.origin}\/admin\.html\?order=\${orderId}&action=denied&phone=\${encodeURIComponent\(senderPhone\s*\|\|\s*refVal\)}`/;
  if (telegramDenyRegex.test(text)) {
    text = text.replace(
      telegramDenyRegex,
      "url: `${window.location.origin}/admin.html?order=${orderId}&action=denied&phone=${encodeURIComponent(senderPhone || refVal)}&pushId=${encodeURIComponent(localStorage.getItem('cw_onesignal_push_id') || '')}`"
    );
    console.log('Added pushId to Telegram Deny URL in ' + filePath);
  }

  fs.writeFileSync(filePath, text, 'utf8');
  console.log('Saved ' + filePath);
}

updatePushInMovieJs('movie.js');
updatePushInMovieJs('cinewatch-app/movie.js');
