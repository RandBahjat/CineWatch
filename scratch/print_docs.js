async function getDocs() {
  const r = await fetch('https://mappletv.uk');
  const t = await r.text();
  const re = /font-code text-\[13px\] text-foreground.*?children":"([^"]+)".*?text-sm text-muted-foreground.*?children":"([^"]+)"/g;
  let m;
  while ((m = re.exec(t)) !== null) {
    console.log(m[1].padEnd(15), '->', m[2]);
  }
}
getDocs();
