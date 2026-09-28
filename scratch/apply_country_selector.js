const fs = require('fs');
const path = require('path');

const optionsHtml = fs.readFileSync('scratch/country_options.html', 'utf8').trim();

console.log('Loaded country options length:', optionsHtml.length);

// 1. Update index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Replace vipSmsPrefix span with select
const smsSpanRegex = /<span class="phone-prefix" id="vipSmsPrefix"[^>]*>\+964<\/span>/;
if (smsSpanRegex.test(indexHtml)) {
  const selectHtml = `<select class="phone-prefix vip-country-select" id="vipSmsPrefix" title="Select Country Code" style="display: flex; align-items: center; justify-content: center; padding: 0 24px 0 10px; background: rgba(255, 255, 255, 0.08); color: #38bdf8; font-weight: 600; font-size: 13px; border: none; border-right: 1px solid rgba(255, 255, 255, 0.12); outline: none; cursor: pointer; max-width: 145px; min-width: 115px; text-overflow: ellipsis; white-space: nowrap; appearance: none; -webkit-appearance: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'12\\\' height=\\\'12\\\' viewBox=\\\'0 0 24 24\\\' fill=\\\'none\\\' stroke=\\\'%2338bdf8\\\' stroke-width=\\\'2.5\\\' stroke-linecap=\\\'round\\\' stroke-linejoin=\\\'round\\\'><polyline points=\\\'6 9 12 15 18 9\\\'></polyline></svg>'); background-repeat: no-repeat; background-position: right 6px center;">\n${optionsHtml}\n                                        </select>`;
  indexHtml = indexHtml.replace(smsSpanRegex, selectHtml);
  console.log('Updated vipSmsPrefix in index.html');
} else {
  console.log('Warning: vipSmsPrefix span regex not matched in index.html');
}

// Replace vipRefPrefix span with select
const refSpanRegex = /<span class="phone-prefix" id="vipRefPrefix"[^>]*>\+964<\/span>/;
if (refSpanRegex.test(indexHtml)) {
  const selectHtml = `<select class="phone-prefix vip-country-select" id="vipRefPrefix" title="Select Country Code" style="display: flex; align-items: center; justify-content: center; padding: 0 24px 0 10px; background: rgba(255, 255, 255, 0.08); color: #38bdf8; font-weight: 600; font-size: 13px; border: none; border-right: 1px solid rgba(255, 255, 255, 0.12); outline: none; cursor: pointer; max-width: 145px; min-width: 115px; text-overflow: ellipsis; white-space: nowrap; appearance: none; -webkit-appearance: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'12\\\' height=\\\'12\\\' viewBox=\\\'0 0 24 24\\\' fill=\\\'none\\\' stroke=\\\'%2338bdf8\\\' stroke-width=\\\'2.5\\\' stroke-linecap=\\\'round\\\' stroke-linejoin=\\\'round\\\'><polyline points=\\\'6 9 12 15 18 9\\\'></polyline></svg>'); background-repeat: no-repeat; background-position: right 6px center;">\n${optionsHtml}\n                                        </select>`;
  indexHtml = indexHtml.replace(refSpanRegex, selectHtml);
  console.log('Updated vipRefPrefix in index.html');
} else {
  console.log('Warning: vipRefPrefix span regex not matched in index.html');
}

// Replace customer phone prefix in index.html (optional customer whatsapp)
const custPhoneSpan = '<div class="input-phone-wrap">\n                                        <span class="phone-prefix">+964</span>';
if (indexHtml.includes(custPhoneSpan)) {
  const custSelect = `<div class="input-phone-wrap">\n                                        <select class="phone-prefix vip-country-select" id="vipCustPhonePrefix" title="Select Country Code" style="display: flex; align-items: center; justify-content: center; padding: 0 24px 0 10px; background: rgba(255, 255, 255, 0.08); color: #38bdf8; font-weight: 600; font-size: 13px; border: none; border-right: 1px solid rgba(255, 255, 255, 0.12); outline: none; cursor: pointer; max-width: 145px; min-width: 115px; text-overflow: ellipsis; white-space: nowrap; appearance: none; -webkit-appearance: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'12\\\' height=\\\'12\\\' viewBox=\\\'0 0 24 24\\\' fill=\\\'none\\\' stroke=\\\'%2338bdf8\\\' stroke-width=\\\'2.5\\\' stroke-linecap=\\\'round\\\' stroke-linejoin=\\\'round\\\'><polyline points=\\\'6 9 12 15 18 9\\\'></polyline></svg>'); background-repeat: no-repeat; background-position: right 6px center;">\n${optionsHtml}\n                                        </select>`;
  indexHtml = indexHtml.replace(custPhoneSpan, custSelect);
  console.log('Updated customer phone prefix in index.html');
}

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Saved index.html');

// 2. Update cinewatch-app/index.html
if (fs.existsSync('cinewatch-app/index.html')) {
  let appHtml = fs.readFileSync('cinewatch-app/index.html', 'utf8');
  
  // Inject vipSmsPhoneBox if not present
  if (!appHtml.includes('vipSmsPhoneBox')) {
    const target = '<div class="vip-ref-box" id="vipRefBox"';
    const smsBoxHtml = `
                            <div class="vip-ref-box" id="vipSmsPhoneBox" style="margin-top: 16px; margin-bottom: 0px; text-align: left;">
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label id="vipSmsPhoneLabel" style="display: block; font-size: 13px; font-weight: 500; color: #cbd5e1; margin-bottom: 8px;">Your Phone Number (For SMS Approval Notification)</label>
                                    <div class="input-with-prefix" id="vipSmsInputGroup" style="display: flex; align-items: stretch; border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 8px; overflow: hidden; background: rgba(255, 255, 255, 0.06); transition: border-color 0.2s, box-shadow 0.2s;">
                                        <select class="phone-prefix vip-country-select" id="vipSmsPrefix" title="Select Country Code" style="display: flex; align-items: center; justify-content: center; padding: 0 24px 0 10px; background: rgba(255, 255, 255, 0.08); color: #38bdf8; font-weight: 600; font-size: 13px; border: none; border-right: 1px solid rgba(255, 255, 255, 0.12); outline: none; cursor: pointer; max-width: 145px; min-width: 115px; text-overflow: ellipsis; white-space: nowrap; appearance: none; -webkit-appearance: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'12\\\' height=\\\'12\\\' viewBox=\\\'0 0 24 24\\\' fill=\\\'none\\\' stroke=\\\'%2338bdf8\\\' stroke-width=\\\'2.5\\\' stroke-linecap=\\\'round\\\' stroke-linejoin=\\\'round\\\'><polyline points=\\\'6 9 12 15 18 9\\\'></polyline></svg>'); background-repeat: no-repeat; background-position: right 6px center;">
${optionsHtml}
                                        </select>
                                        <input type="text" class="form-control" placeholder="77X XXX XXXX" id="vipSmsPhoneInput" style="flex: 1; border: none; background: transparent; padding: 12px 14px; color: #fff; font-size: 14px; outline: none; box-shadow: none;">
                                    </div>
                                </div>
                            </div>\n`;
    appHtml = appHtml.replace(target, smsBoxHtml + target);
    console.log('Injected vipSmsPhoneBox into cinewatch-app/index.html');
  }

  // Update vipRefPrefix in cinewatch-app/index.html
  if (refSpanRegex.test(appHtml)) {
    const selectHtml = `<select class="phone-prefix vip-country-select" id="vipRefPrefix" title="Select Country Code" style="display: flex; align-items: center; justify-content: center; padding: 0 24px 0 10px; background: rgba(255, 255, 255, 0.08); color: #38bdf8; font-weight: 600; font-size: 13px; border: none; border-right: 1px solid rgba(255, 255, 255, 0.12); outline: none; cursor: pointer; max-width: 145px; min-width: 115px; text-overflow: ellipsis; white-space: nowrap; appearance: none; -webkit-appearance: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'12\\\' height=\\\'12\\\' viewBox=\\\'0 0 24 24\\\' fill=\\\'none\\\' stroke=\\\'%2338bdf8\\\' stroke-width=\\\'2.5\\\' stroke-linecap=\\\'round\\\' stroke-linejoin=\\\'round\\\'><polyline points=\\\'6 9 12 15 18 9\\\'></polyline></svg>'); background-repeat: no-repeat; background-position: right 6px center;">\n${optionsHtml}\n                                        </select>`;
    appHtml = appHtml.replace(refSpanRegex, selectHtml);
    console.log('Updated vipRefPrefix in cinewatch-app/index.html');
  }

  // Update customer phone prefix in cinewatch-app/index.html
  if (appHtml.includes(custPhoneSpan)) {
    const custSelect = `<div class="input-phone-wrap">\n                                        <select class="phone-prefix vip-country-select" id="vipCustPhonePrefix" title="Select Country Code" style="display: flex; align-items: center; justify-content: center; padding: 0 24px 0 10px; background: rgba(255, 255, 255, 0.08); color: #38bdf8; font-weight: 600; font-size: 13px; border: none; border-right: 1px solid rgba(255, 255, 255, 0.12); outline: none; cursor: pointer; max-width: 145px; min-width: 115px; text-overflow: ellipsis; white-space: nowrap; appearance: none; -webkit-appearance: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'12\\\' height=\\\'12\\\' viewBox=\\\'0 0 24 24\\\' fill=\\\'none\\\' stroke=\\\'%2338bdf8\\\' stroke-width=\\\'2.5\\\' stroke-linecap=\\\'round\\\' stroke-linejoin=\\\'round\\\'><polyline points=\\\'6 9 12 15 18 9\\\'></polyline></svg>'); background-repeat: no-repeat; background-position: right 6px center;">\n${optionsHtml}\n                                        </select>`;
    appHtml = appHtml.replace(custPhoneSpan, custSelect);
    console.log('Updated customer phone prefix in cinewatch-app/index.html');
  }

  fs.writeFileSync('cinewatch-app/index.html', appHtml, 'utf8');
  console.log('Saved cinewatch-app/index.html');
}

// 3. Add CSS rules to movie.css and cinewatch-app/movie.css
const cssRule = `
/* Worldwide Country Code Select Dropdown */
select.phone-prefix,
.vip-country-select {
  display: inline-flex;
  align-items: center;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: rgba(255, 255, 255, 0.08);
  color: #38bdf8 !important;
  font-weight: 600;
  font-size: 13px;
  border: none;
  border-right: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0 24px 0 10px;
  outline: none;
  cursor: pointer;
  max-width: 145px;
  min-width: 115px;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0.3px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2338bdf8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
  transition: all 0.2s ease;
}

select.phone-prefix:focus,
.vip-country-select:focus {
  background-color: rgba(56, 189, 248, 0.14);
  color: #67e8f9 !important;
}

select.phone-prefix option,
.vip-country-select option {
  background: #0f172a !important;
  color: #f1f5f9 !important;
  padding: 8px 12px;
  font-size: 13px;
}
`;

function appendCss(filePath) {
  if (fs.existsSync(filePath)) {
    let css = fs.readFileSync(filePath, 'utf8');
    if (!css.includes('.vip-country-select')) {
      css += '\n' + cssRule;
      fs.writeFileSync(filePath, css, 'utf8');
      console.log('Appended CSS to ' + filePath);
    } else {
      console.log('CSS already exists in ' + filePath);
    }
  }
}

appendCss('movie.css');
appendCss('cinewatch-app/movie.css');
