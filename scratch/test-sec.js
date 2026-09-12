const fs = require('fs');

global.window = {
  location: { search: '?verify=1', hostname: '127.0.0.1', protocol: 'http:' },
  sessionStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  }
};

global.navigator = { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };

const classes = new Set();
global.document = {
  readyState: 'complete',
  documentElement: {
    classList: {
      add: (c) => classes.add(c),
      remove: (c) => classes.delete(c)
    }
  },
  getElementById: () => null,
  querySelector: () => null,
  createElement: (tag) => ({
    id: '',
    setAttribute: () => {},
    innerHTML: '',
    appendChild: () => {}
  }),
  body: {
    prepend: (el) => {
      console.log('Prepended overlay to body with ID:', el.id);
    }
  },
  head: {
    appendChild: () => {}
  },
  addEventListener: (event, fn) => {
    console.log('Event listener added:', event);
  }
};

const code = fs.readFileSync('security-gate.js', 'utf8');
try {
  eval(code);
  console.log('Evaluation succeeded!');
  console.log('HTML classes:', Array.from(classes));
} catch (e) {
  console.error('Evaluation error:', e);
}
