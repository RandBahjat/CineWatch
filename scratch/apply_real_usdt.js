const fs = require('fs');

const realAddress = "TFCWRviskL9EWhC17KxjzKWGf7KqLB8vm5";

// 1. Update JS files
['movie.js', 'cinewatch-app/movie.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let js = fs.readFileSync(file, 'utf8');

  js = js.replace(
    /number:\s*"TYu8kExampleTRC20Address\.\.\. \(Click Copy\)"/,
    `number: "${realAddress}"`
  );

  js = js.replace(
    /holder:\s*"Network: TRON \(TRC-20\) \/ Binance Pay ID"/,
    `holder: "Network: TRON (TRC-20) / Binance"`
  );

  js = js.replace(
    /note:\s*"Send USDT from Binance, Trust Wallet, Revolut, or any international crypto app\. Instant worldwide\."/,
    `note: "Send USDT via TRON (TRC-20) network from Binance, Trust Wallet, Revolut, Cash App, or any exchange. Instant worldwide activation."`
  );

  fs.writeFileSync(file, js, 'utf8');
  console.log('Updated JS with real USDT address:', file);
});

// 2. Update CSS files for responsive address display
['movie.css', 'cinewatch-app/movie.css'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let css = fs.readFileSync(file, 'utf8');

  css = css.replace(
    /\.wallet-num-val\s*\{\s*font-size:\s*1\.15rem;\s*font-weight:\s*800;\s*color:\s*#fff;\s*letter-spacing:\s*0\.03em;\s*\}/,
    `.wallet-num-val {
  font-size: 1.05rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.03em;
  word-break: break-all;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}`
  );

  css = css.replace(
    /\.wallet-copy-btn\s*\{/,
    `.wallet-copy-btn {
  flex-shrink: 0;`
  );

  fs.writeFileSync(file, css, 'utf8');
  console.log('Updated CSS wallet-num-val and copy button:', file);
});
