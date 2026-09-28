const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const optionsHtml = fs.readFileSync('scratch/country_options.html', 'utf8').trim();
const targetRegex = /<span class="phone-prefix">\+964<\/span>/;
if (targetRegex.test(html)) {
  const selectHtml = `<select class="phone-prefix vip-country-select" id="vipCustPhonePrefix" title="Select Country Code" style="display: flex; align-items: center; justify-content: center; padding: 0 24px 0 10px; background: rgba(255, 255, 255, 0.08); color: #38bdf8; font-weight: 600; font-size: 13px; border: none; border-right: 1px solid rgba(255, 255, 255, 0.12); outline: none; cursor: pointer; max-width: 145px; min-width: 115px; text-overflow: ellipsis; white-space: nowrap; appearance: none; -webkit-appearance: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'12\\\' height=\\\'12\\\' viewBox=\\\'0 0 24 24\\\' fill=\\\'none\\\' stroke=\\\'%2338bdf8\\\' stroke-width=\\\'2.5\\\' stroke-linecap=\\\'round\\\' stroke-linejoin=\\\'round\\\'><polyline points=\\\'6 9 12 15 18 9\\\'></polyline></svg>'); background-repeat: no-repeat; background-position: right 6px center;">\n${optionsHtml}\n                                        </select>`;
  html = html.replace(targetRegex, selectHtml);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Successfully updated customer phone prefix in index.html');
} else {
  console.log('Customer phone prefix regex not matched');
}
