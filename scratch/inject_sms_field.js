const fs = require('fs');
let text = fs.readFileSync('index.html', 'utf8');

const smsField = `
                            <div class="vip-ref-box" id="vipSmsPhoneBox" style="margin-top: 16px; margin-bottom: 0px; text-align: left;">
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label id="vipSmsPhoneLabel" style="display: block; font-size: 13px; font-weight: 500; color: #cbd5e1; margin-bottom: 8px;">Your Phone Number (For SMS Approval Notification)</label>
                                    <div class="input-with-prefix" id="vipSmsInputGroup" style="display: flex; align-items: stretch; border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 8px; overflow: hidden; background: rgba(255, 255, 255, 0.06); transition: border-color 0.2s, box-shadow 0.2s;">
                                        <span class="phone-prefix" id="vipSmsPrefix" style="display: flex; align-items: center; justify-content: center; padding: 0 14px; background: rgba(255, 255, 255, 0.08); color: #94a3b8; font-weight: 600; font-size: 13px; border-right: 1px solid rgba(255, 255, 255, 0.12); user-select: none; letter-spacing: 0.5px;">+964</span>
                                        <input type="text" class="form-control" placeholder="77X XXX XXXX" id="vipSmsPhoneInput" style="flex: 1; border: none; background: transparent; padding: 12px 14px; color: #fff; font-size: 14px; outline: none; box-shadow: none;">
                                    </div>
                                </div>
                            </div>
`;

if (!text.includes('vipSmsPhoneInput')) {
    text = text.replace('<div class="vip-ref-box" id="vipRefBox"', smsField + '<div class="vip-ref-box" id="vipRefBox"');
    fs.writeFileSync('index.html', text, 'utf8');
    console.log('Injected SMS field into index.html');
} else {
    console.log('Already injected');
}
