import jsdom from 'jsdom';

const fs = require('fs');
const path = require('path');

const { JSDOM } = jsdom;
let html = null;
try {
  html = fs.readFileSync(path.relative(__dirname, '/src/stock-chart.html'), 'utf8');
} catch (e) {
  console.log('Error', e.stack);
}

const dom = new JSDOM(html);

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

Object.keys(window).forEach((key) => {
  if (!(key in window)) {
    global[key] = window[key];
  }
});

export default dom;
