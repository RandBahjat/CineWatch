const fs = require('fs');

function updateAdmin(filePath) {
  if (!fs.existsSync(filePath)) return;
  let text = fs.readFileSync(filePath, 'utf8');

  // 1. Add OneSignal Settings Card right above TMDB Generator
  const osCardHtml = `
    <!-- OneSignal Web Push Notification Config -->
    <div class="card" style="border: 1px solid #10b981; background: #0b151a;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 style="color: #10b981; margin-bottom: 0.3rem;">🔔 OneSignal Phone Push Notifications</h3>
          <p style="color: #94a3b8; font-size: 0.85rem;">Sends lock-screen notifications directly to the customer's phone or computer when approved.</p>
        </div>
        <div>
          <a href="https://dashboard.onesignal.com" target="_blank" style="background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); font-size: 0.85rem; padding: 0.45rem 0.9rem; border-radius: 6px; text-decoration: none; display: inline-block;">OneSignal Dashboard ↗</a>
        </div>
      </div>

      <div class="flex-row">
        <div>
          <label>OneSignal App ID</label>
          <input type="text" id="osAppId" value="88a941ed-f1be-4f05-86ac-1828bd010eeb" readonly style="opacity: 0.8;" />
        </div>
        <div>
          <label>OneSignal REST API Key (Found in OneSignal Settings → Keys & IDs)</label>
          <input type="password" id="osRestApiKey" placeholder="Paste your OneSignal REST API Key here..." />
        </div>
      </div>

      <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
        <button onclick="saveOneSignalSettings()" style="background: #10b981; color: #0b0c10;">💾 Save OneSignal Key</button>
        <span id="osStatusMsg" style="font-size: 0.85rem; font-weight: 500; color: #10b981;"></span>
      </div>
    </div>
`;

  if (!text.includes('osRestApiKey')) {
    text = text.replace('<!-- TMDB Code Generator -->', osCardHtml + '\n    <!-- TMDB Code Generator -->');
    console.log('Inserted OneSignal card in ' + filePath);
  }

  // 2. Add OneSignal JS helpers
  const osJs = `
    // OneSignal Push Notification Sender
    function loadOneSignalSettings() {
      const restKey = localStorage.getItem('os_rest_api_key') || '';
      if (document.getElementById('osRestApiKey')) document.getElementById('osRestApiKey').value = restKey;
    }

    function saveOneSignalSettings() {
      const restKey = document.getElementById('osRestApiKey').value.trim();
      localStorage.setItem('os_rest_api_key', restKey);
      const statusEl = document.getElementById('osStatusMsg');
      if (statusEl) {
        statusEl.textContent = '✅ OneSignal key saved!';
        setTimeout(() => statusEl.textContent = '', 3000);
      }
    }

    async function sendOneSignalPush(pushId, title, message) {
      const appId = "88a941ed-f1be-4f05-86ac-1828bd010eeb";
      const restApiKey = localStorage.getItem('os_rest_api_key') || '';
      if (!restApiKey) return false;

      try {
        const payload = {
          app_id: appId,
          headings: { en: title || "🎬 CineWatch VIP" },
          contents: { en: message || "Your VIP subscription status has been updated!" },
          url: window.location.origin
        };
        if (pushId) {
          payload.include_subscription_ids = [pushId];
        }

        const res = await fetch("https://api.onesignal.com/notifications", {
          method: "POST",
          headers: {
            "Authorization": "Key " + restApiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        return res.ok;
      } catch(e) {
        return false;
      }
    }
  `;

  if (!text.includes('loadOneSignalSettings')) {
    text = text.replace('loadTwilioSettings();', 'loadTwilioSettings();\n      loadOneSignalSettings();');
    text = text.replace('</script>\n</body>', osJs + '\n  </script>\n</body>');
    console.log('Added OneSignal JS functions in ' + filePath);
  }

  // 3. Update magic-link auto approve to trigger push notification if pushId present
  const oldAutoLogic = `sendTwilioSms(autoPhone, defaultMsg).then(smsRes => {`;
  const newAutoLogic = `const autoPushId = urlParams.get('pushId');
              if (autoPushId) {
                const pushTitle = isApproved ? "🎬 CineWatch VIP Activated! 🎉" : "🎬 CineWatch VIP Notice";
                sendOneSignalPush(autoPushId, pushTitle, defaultMsg);
              }
              sendTwilioSms(autoPhone, defaultMsg).then(smsRes => {`;

  if (!text.includes('autoPushId') && text.includes(oldAutoLogic)) {
    text = text.replace(oldAutoLogic, newAutoLogic);
    console.log('Updated magic-link with OneSignal push trigger in ' + filePath);
  }

  fs.writeFileSync(filePath, text, 'utf8');
  console.log('Saved ' + filePath);
}

updateAdmin('admin.html');
updateAdmin('cinewatch-app/admin.html');
