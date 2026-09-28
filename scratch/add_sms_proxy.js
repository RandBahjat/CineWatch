const fs = require('fs');

// 1. Add /api/send-sms to server.js
let serverJs = fs.readFileSync('server.js', 'utf8');

const smsRoute = `
  // Twilio SMS Proxy Route
  if (safePath === '/api/send-sms') {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      res.end();
      return;
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body || '{}');
          const sid = payload.accountSid || 'AC6df9f65f988b401630fe3807e6aa8d46';
          const token = payload.authToken || '6c4772223874fd181d4e9ee2773c89c3';
          const from = payload.from || '+17372508034';
          const to = payload.to;
          const msgBody = payload.body || '🎬 CineWatch: Your VIP subscription has been approved!';

          if (!to) {
            res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ error: 'Missing destination phone number' }));
            return;
          }

          const endpoint = 'https://api.twilio.com/2010-04-01/Accounts/' + encodeURIComponent(sid) + '/Messages.json';
          const formData = new URLSearchParams();
          formData.append('To', to);
          formData.append('From', from);
          formData.append('Body', msgBody);

          const twRes = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + Buffer.from(sid + ':' + token).toString('base64'),
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
          });

          const twData = await twRes.json();
          res.writeHead(twRes.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify(twData));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }
  }
`;

if (!serverJs.includes('/api/send-sms')) {
  serverJs = serverJs.replace("if (safePath === '/api/anime-m3u8') {", smsRoute + "\n  if (safePath === '/api/anime-m3u8') {");
  fs.writeFileSync('server.js', serverJs, 'utf8');
  console.log('Added /api/send-sms to server.js');
}

// 2. Update sendTwilioSms in admin.html & cinewatch-app/admin.html
function updateAdminSendTwilio(filePath) {
  if (!fs.existsSync(filePath)) return;
  let text = fs.readFileSync(filePath, 'utf8');

  const oldSendTwilioRegex = /async function sendTwilioSms\(toPhone, customMsg\) \{[\s\S]*?return \{ success: false, reason: err\.message \};\s*\}\s*\}/;

  const newSendTwilio = `async function sendTwilioSms(toPhone, customMsg) {
      const sid = localStorage.getItem('tw_account_sid') || 'AC6df9f65f988b401630fe3807e6aa8d46';
      const token = localStorage.getItem('tw_auth_token') || '6c4772223874fd181d4e9ee2773c89c3';
      const from = localStorage.getItem('tw_from_phone') || '+17372508034';
      const msg = customMsg || localStorage.getItem('tw_msg_template') || '🎬 CineWatch: Your VIP subscription has been approved!';

      if (!sid || !token || !from) {
        console.warn("Twilio credentials not configured in admin panel.");
        return { success: false, reason: "Twilio credentials not configured in Admin panel." };
      }

      if (!toPhone) {
        return { success: false, reason: "No phone number provided." };
      }

      // Try local server proxy first (avoids CORS)
      const proxyEndpoints = ['/api/send-sms', 'http://localhost:3000/api/send-sms'];
      for (const endpoint of proxyEndpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountSid: sid, authToken: token, from, to: toPhone, body: msg })
          });
          if (res.ok) {
            const data = await res.json();
            return { success: true, data };
          } else {
            const data = await res.json().catch(() => ({}));
            if (data.message || data.error) {
              return { success: false, reason: data.message || data.error };
            }
          }
        } catch(e) {
          // Continue to next or fallback
        }
      }

      // Direct fallback
      try {
        const endpoint = 'https://api.twilio.com/2010-04-01/Accounts/' + encodeURIComponent(sid) + '/Messages.json';
        const formData = new URLSearchParams();
        formData.append('To', toPhone);
        formData.append('From', from);
        formData.append('Body', msg);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(sid + ':' + token),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData
        });

        const data = await res.json();
        if (res.ok) {
          return { success: true, data };
        } else {
          return { success: false, reason: data.message || "Twilio error" };
        }
      } catch (err) {
        return { success: false, reason: err.message };
      }
    }`;

  if (oldSendTwilioRegex.test(text)) {
    text = text.replace(oldSendTwilioRegex, newSendTwilio);
    fs.writeFileSync(filePath, text, 'utf8');
    console.log('Updated sendTwilioSms in ' + filePath);
  } else {
    console.log('oldSendTwilioRegex not matched in ' + filePath);
  }
}

updateAdminSendTwilio('admin.html');
updateAdminSendTwilio('cinewatch-app/admin.html');
