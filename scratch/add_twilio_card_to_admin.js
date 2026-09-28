const fs = require('fs');

let adminHtml = fs.readFileSync('admin.html', 'utf8');

const twilioCardHtml = `
    <!-- Twilio SMS Notifications Config -->
    <div class="card" style="border: 1px solid #38bdf8; background: #0f172a;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 style="color: #38bdf8; margin-bottom: 0.3rem;">📱 Twilio SMS Approval Notifications</h3>
          <p style="color: #94a3b8; font-size: 0.85rem;">Automatically send an SMS to user's phone when their VIP payment is approved.</p>
        </div>
        <div>
          <a href="https://www.twilio.com/try-twilio" target="_blank" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); font-size: 0.85rem; padding: 0.45rem 0.9rem; border-radius: 6px; text-decoration: none; display: inline-block;">Get Twilio API Keys ↗</a>
        </div>
      </div>

      <div class="flex-row">
        <div>
          <label>Twilio Account SID</label>
          <input type="text" id="twAccountSid" placeholder="e.g. ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
        </div>
        <div>
          <label>Twilio Auth Token</label>
          <input type="password" id="twAuthToken" placeholder="Paste your Auth Token..." />
        </div>
      </div>

      <div class="flex-row">
        <div>
          <label>Twilio Sender Phone Number</label>
          <input type="text" id="twFromPhone" placeholder="e.g. +1234567890" />
        </div>
        <div>
          <label>Test Recipient Phone Number</label>
          <input type="text" id="twTestPhone" placeholder="e.g. +9647701234567" />
        </div>
      </div>

      <label>Approval SMS Message Template</label>
      <textarea id="twMessageTemplate" rows="2" style="resize: vertical;">🎬 CineWatch: Your VIP subscription has been approved! Enjoy unlimited streaming. Thank you for your support!</textarea>

      <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
        <button onclick="saveTwilioSettings()" style="background: #38bdf8; color: #0b0c10;">💾 Save Twilio Settings</button>
        <button onclick="sendTestTwilioSms()" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #38bdf8;">📤 Send Test SMS</button>
        <span id="twStatusMsg" style="font-size: 0.85rem; font-weight: 500; color: #10b981;"></span>
      </div>
    </div>
`;

if (!adminHtml.includes('twAccountSid')) {
  const insertMarker = '    <!-- TMDB Code Generator -->';
  if (adminHtml.includes(insertMarker)) {
    adminHtml = adminHtml.replace(insertMarker, twilioCardHtml + '\n' + insertMarker);
    console.log('Inserted Twilio Card into admin.html');
  } else {
    console.log('Insert marker not found in admin.html');
  }
}

// Add Twilio JS functions and magic-link handler update
const twilioJsCode = `
    // Twilio SMS Integration
    function loadTwilioSettings() {
      const sid = localStorage.getItem('tw_account_sid') || '';
      const token = localStorage.getItem('tw_auth_token') || '';
      const from = localStorage.getItem('tw_from_phone') || '';
      const msg = localStorage.getItem('tw_msg_template') || '🎬 CineWatch: Your VIP subscription has been approved! Enjoy unlimited streaming. Thank you for your support!';

      if (document.getElementById('twAccountSid')) document.getElementById('twAccountSid').value = sid;
      if (document.getElementById('twAuthToken')) document.getElementById('twAuthToken').value = token;
      if (document.getElementById('twFromPhone')) document.getElementById('twFromPhone').value = from;
      if (document.getElementById('twMessageTemplate')) document.getElementById('twMessageTemplate').value = msg;
    }

    function saveTwilioSettings() {
      const sid = document.getElementById('twAccountSid').value.trim();
      const token = document.getElementById('twAuthToken').value.trim();
      const from = document.getElementById('twFromPhone').value.trim();
      const msg = document.getElementById('twMessageTemplate').value.trim();

      localStorage.setItem('tw_account_sid', sid);
      localStorage.setItem('tw_auth_token', token);
      localStorage.setItem('tw_from_phone', from);
      localStorage.setItem('tw_msg_template', msg);

      const statusEl = document.getElementById('twStatusMsg');
      if (statusEl) {
        statusEl.textContent = '✅ Twilio settings saved!';
        statusEl.style.color = '#10b981';
        setTimeout(() => statusEl.textContent = '', 3000);
      }
    }

    async function sendTwilioSms(toPhone, customMsg) {
      const sid = localStorage.getItem('tw_account_sid');
      const token = localStorage.getItem('tw_auth_token');
      const from = localStorage.getItem('tw_from_phone');
      const msg = customMsg || localStorage.getItem('tw_msg_template') || '🎬 CineWatch: Your VIP subscription has been approved!';

      if (!sid || !token || !from) {
        console.warn("Twilio credentials not configured in admin panel.");
        return { success: false, reason: "Twilio credentials not configured. Please enter Account SID, Auth Token and Phone Number in Admin Settings." };
      }

      if (!toPhone) {
        return { success: false, reason: "No phone number provided." };
      }

      try {
        const endpoint = \`https://api.twilio.com/2010-04-01/Accounts/\${encodeURIComponent(sid)}/Messages.json\`;
        const formData = new URLSearchParams();
        formData.append('To', toPhone);
        formData.append('From', from);
        formData.append('Body', msg);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(\`\${sid}:\${token}\`),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData
        });

        const data = await res.json();
        if (res.ok) {
          console.log("Twilio SMS sent:", data);
          return { success: true, data };
        } else {
          console.error("Twilio API error:", data);
          return { success: false, reason: data.message || "Twilio error" };
        }
      } catch (err) {
        console.error("Twilio network error:", err);
        return { success: false, reason: err.message };
      }
    }

    async function sendTestTwilioSms() {
      const testPhone = document.getElementById('twTestPhone').value.trim();
      const statusEl = document.getElementById('twStatusMsg');
      if (!testPhone) {
        alert("Please enter a test recipient phone number (e.g. +9647701234567)");
        return;
      }
      saveTwilioSettings();
      if (statusEl) {
        statusEl.textContent = '⏳ Sending SMS via Twilio...';
        statusEl.style.color = '#38bdf8';
      }
      const res = await sendTwilioSms(testPhone, "🎬 CineWatch: This is a test notification from CineWatch Admin! Your setup works!");
      if (res.success) {
        alert("🎉 Success! Test SMS sent to " + testPhone);
        if (statusEl) statusEl.textContent = '✅ Test SMS delivered!';
      } else {
        alert("❌ Failed to send SMS: " + res.reason);
        if (statusEl) {
          statusEl.textContent = '❌ Failed: ' + res.reason;
          statusEl.style.color = '#ef4444';
        }
      }
    }
`;

if (!adminHtml.includes('loadTwilioSettings')) {
  // Inject into DOMContentLoaded
  adminHtml = adminHtml.replace('fetchAnalytics();', 'fetchAnalytics();\n      loadTwilioSettings();');
  // Inject functions before closing script
  adminHtml = adminHtml.replace('</script>', twilioJsCode + '\n  </script>');
  console.log('Injected Twilio JS functions into admin.html');
}

// Enhance magic-link auto approve logic to automatically dispatch SMS if phone present
const oldAuto = `          if (!error) {
            alert(\`✅ Order \${autoOrder} successfully marked as \${autoAction.toUpperCase()}!\`);
            window.history.replaceState({}, document.title, "/admin.html");
            renderVipOrders();
          }`;

const newAuto = `          if (!error) {
            const autoPhone = urlParams.get('phone');
            if (autoAction === 'approved' && autoPhone) {
              sendTwilioSms(autoPhone).then(smsRes => {
                if (smsRes.success) {
                  alert(\`✅ Order \${autoOrder} marked as APPROVED!\\n📱 SMS approval confirmation sent to \${autoPhone}\`);
                } else {
                  alert(\`✅ Order \${autoOrder} marked as APPROVED!\\n📱 Note: SMS not sent (\${smsRes.reason})\`);
                }
              });
            } else {
              alert(\`✅ Order \${autoOrder} successfully marked as \${autoAction.toUpperCase()}!\`);
            }
            window.history.replaceState({}, document.title, "/admin.html");
            renderVipOrders();
          }`;

if (adminHtml.includes(oldAuto)) {
  adminHtml = adminHtml.replace(oldAuto, newAuto);
  console.log('Enhanced magic link auto approve logic with SMS dispatch');
}

fs.writeFileSync('admin.html', adminHtml, 'utf8');
console.log('Saved admin.html successfully');
