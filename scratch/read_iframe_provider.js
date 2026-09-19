async function f() {
  const res = await fetch('https://mapple.fun/_next/static/chunks/0nj-smhzwt-ps.js?dpl=db2da861-8583-4a77-85ab-2956d7a4a72c');
  const text = await res.text();
  const idx = text.indexOf('isIframe');
  if (idx !== -1) {
    console.log(text.substring(idx - 100, idx + 1500));
  }
}
f();
