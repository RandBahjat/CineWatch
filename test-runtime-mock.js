const fs = require('fs');

global.window = { location: { hash: '' }, addEventListener: () => {} };
global.document = {
    getElementById: () => ({ style: {}, classList: { toggle: () => {} }, addEventListener: () => {} }),
    querySelectorAll: () => ([]),
    querySelector: () => ({ classList: { toggle: () => {}, remove: () => {} }, style: {}, addEventListener: () => {} }),
    body: { classList: { add: () => {}, remove: () => {} } },
    addEventListener: () => {}
};
global.performance = { now: () => 0 };
global.localStorage = { getItem: () => null, setItem: () => {} };
global.setTimeout = (cb) => cb();
global.URLSearchParams = class { get() { return null; } };

try {
    eval(fs.readFileSync('movies-data.js', 'utf8'));
    eval(fs.readFileSync('series-data.js', 'utf8'));
    eval(fs.readFileSync('anime-data.js', 'utf8'));
    eval(fs.readFileSync('movie.js', 'utf8'));
    
    // Call init if it exists
    if (typeof init === 'function') init();
    console.log("Runtime check passed successfully.");
} catch (e) {
    console.error("Runtime error:");
    console.error(e.stack);
}
