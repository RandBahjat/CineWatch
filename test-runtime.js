const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const movies = fs.readFileSync('movies-data.js', 'utf8');
const series = fs.readFileSync('series-data.js', 'utf8');
const anime = fs.readFileSync('anime-data.js', 'utf8');
const movieJs = fs.readFileSync('movie.js', 'utf8');

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="loading"></div></body></html>', { runScripts: "dangerously" });
try {
    dom.window.eval(movies);
    dom.window.eval(series);
    dom.window.eval(anime);
    dom.window.eval(movieJs);
    console.log("No error during initialization!");
} catch (e) {
    console.error("Runtime error:");
    console.error(e);
}
