/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var testsContext = __webpack_require__(1);

var runnable = testsContext.keys();

runnable.forEach(testsContext);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./StockChart.test.js": 2
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 1;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _chai = __webpack_require__(3);

var _testHelper = __webpack_require__(4);

var _testHelper2 = _interopRequireDefault(_testHelper);

var _StockChart = __webpack_require__(8);

var _StockChart2 = _interopRequireDefault(_StockChart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stockChartDOM = document.querySelector('.stockchart-container');
var stockChart = new _StockChart2.default(stockChartDOM);

describe('The StockChart Class', function () {

  describe('The setUpperRange method', function () {
    before(function () {
      stockChart.UpperVal = null;
    });
    it('will set this.UpperVal to priceData.High if stockChart.UpperVal is null', function () {
      var priceData = { High: 9 };
      // const { UpperVal } = stockChart;
      stockChart.setUpperRange(priceData);
      (0, _chai.expect)(stockChart.UpperVal).to.equal(9);
      (0, _chai.expect)(window.UpperVal).to.equal(9);
    });
  });

  describe('The setUpperRange method', function () {
    before(function () {
      stockChart.UpperVal = 8;
    });
    it('will set this.UpperVal to priceData.High if stockChart.UpperVal is less then priceData.High', function () {
      var priceData = { High: 9 };
      // const { UpperVal } = stockChart;
      stockChart.setUpperRange(priceData);
      (0, _chai.expect)(stockChart.UpperVal).to.equal(9);
      (0, _chai.expect)(window.UpperVal).to.equal(9);
    });
  });

  describe('The setLowerRange method', function () {
    before(function () {
      stockChart.LowerVal = null;
    });
    it('will set this.LowerVal to priceData.Low if stockChart.LowerVal is null', function () {
      var priceData = { Low: 1 };
      // const { LowerVal } = stockChart;
      stockChart.setLowerRange(priceData);
      (0, _chai.expect)(stockChart.LowerVal).to.equal(1);
      (0, _chai.expect)(window.LowerVal).to.equal(1);
    });
  });

  describe('The setLowerRange method', function () {
    before(function () {
      stockChart.LowerVal = 2;
    });
    it('will set this.LowerVal to priceData.Low if stockChart.LowerVal is less then priceData.Low', function () {
      var priceData = { Low: 1 };
      // const { LowerVal } = stockChart;
      stockChart.setLowerRange(priceData);
      (0, _chai.expect)(stockChart.LowerVal).to.equal(1);
      (0, _chai.expect)(window.LowerVal).to.equal(1);
    });
  });

  describe('The yPointPos method should return 50 if canvasHeight is set to 100', function () {
    before(function () {
      stockChart.canvasHeight = 100;
      stockChart.hGridLines = 10;
    });

    it('returns a position', function () {
      var pointVal = 5;
      var upperVal = 10;
      var lowerVal = 0;
      var yPos = stockChart.yPointPos(pointVal, upperVal, lowerVal);
      (0, _chai.expect)(yPos).to.equal(50);
    });
  });
});

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("chai");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsdom = __webpack_require__(5);

var _jsdom2 = _interopRequireDefault(_jsdom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = __webpack_require__(6);
var path = __webpack_require__(7);

var JSDOM = _jsdom2.default.JSDOM;

var html = null;
try {
  html = fs.readFileSync(path.relative(__dirname, '/src/stock-chart.html'), 'utf8');
} catch (e) {
  console.log('Error', e.stack);
}

var dom = new JSDOM(html);

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

Object.keys(window).forEach(function (key) {
  if (!(key in window)) {
    global[key] = window[key];
  }
});

exports.default = dom;
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("jsdom");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import moment from 'moment';


var _constants = __webpack_require__(9);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: Fix pan and zoom events so they release on document.mouseup and
// make sure your clearing all events

var StockChart = function () {
  function StockChart(DOM) {
    var _this = this;

    _classCallCheck(this, StockChart);

    this.windowOnResizeHandler = function () {
      _this.containerRect = _this.canvasContainer.getBoundingClientRect();
      _this.canvasWidth = _this.containerRect.width * 2;
      _this.canvasHeight = _this.containerRect.height * 2;

      _this.canvas.setAttribute('width', _this.canvasWidth);
      _this.canvas.setAttribute('height', _this.canvasHeight);

      _this.canvas.style.width = _this.canvasWidth * 0.5 + 'px';
      _this.canvas.style.height = _this.canvasHeight * 0.5 + 'px';
    };

    // set up canvas
    this.canvasContainer = DOM;
    this.containerRect = this.canvasContainer.getBoundingClientRect();
    this.canvas = DOM.children[0];
    this.context = this.canvas.getContext('2d');

    // *2 to scale up canvas for retna display
    this.canvasWidth = this.containerRect.width * 2;
    this.canvasHeight = this.containerRect.height * 2;

    this.canvas.setAttribute('width', this.canvasWidth);
    this.canvas.setAttribute('height', this.canvasHeight);

    this.canvas.style.width = this.canvasWidth * 0.5 + 'px';
    this.canvas.style.height = this.canvasHeight * 0.5 + 'px';

    // yaxis uses these values
    this.hGridLines = _constants.HORIZONTAL_GRID_LINES; // 18

    this.UpperVal = null;
    this.LowerVal = null;

    this.yPointPos = this.yPointPos.bind(this);
    this.valueRange = this.valueRange.bind(this);

    document.addEventListener('window:onresize', this.windowOnResizeHandler, false);
  }

  // yaxis, xaxis


  _createClass(StockChart, [{
    key: 'yPointPos',


    // roundOffVals(upperVal, lowerVal) {
    //   debugger;
    //   let range = Math.ceil(upperVal) - Math.floor(lowerVal);
    //   let lessThen = false;

    //   if (range < 17) { // 9
    //     lessThen = true;
    //     range *= 10;
    //   }

    //   for (let i = 1; i < 17; i += 1) { // 9
    //     if (range % 17 === 0) { // 9
    //       break;
    //     }
    //     range += 1;
    //   }

    //   if (lessThen) {
    //     range /= 10;
    //   }

    //   this.UpperVal = this.UpperVal + (range - (Math.ceil(upperVal) - Math.floor(lowerVal))) / 2;
    //   this.LowerVal = this.LowerVal - (range - (Math.ceil(upperVal) - Math.floor(lowerVal))) / 2;
    // }

    /**
     * Y POSITION - gets passed into barData via chartLoop
     * determines where to render elements based on a ratio
     * relative to the height of chart
     * @param {*} pointVal 
     * @param {*} upperVal 
     * @param {*} lowerVal 
     */
    value: function yPointPos(pointVal, upperVal, lowerVal) {
      // half the height of a grid space, accounts
      // for small buffer on top and bottom of chart
      var cHeight = this.canvasHeight * ((this.hGridLines - 1) / this.hGridLines); // (9/10) (17/18)
      // use lowerVal to account for canvas (0,0) being at the bottom right
      // ÷ by the difference of upperVal and lowerVal to find where the point is verticaly
      // based on percentage.
      var valRatio = (pointVal - lowerVal) / (upperVal - lowerVal);
      // 1 = 100% of chart hight ÷ number of horizontal grid lines ÷ in half for upper and lower
      // this equation adjusts the bar values up half the height of a grid space to account for
      // the value placment start in the middle of the chart and being placed up and down from
      // there. the grid also starts half a grid space away from the middle of the chat. this is
      // so there could be an even number of grid lines on the top and the bottom of the of the
      // chart at initail render time.
      var yPos = cHeight * valRatio + this.canvasHeight * (1 / this.hGridLines / 2);
      return yPos;
    }

    /**
     * Get the high and low values of the current visible price data
     * @param {*} priceData 
     * @param {*} UpperVal, LowerVal
     */

  }, {
    key: 'setUpperRange',
    value: function setUpperRange(priceData, UpperVal) {
      if (!this.UpperVal) {
        this.UpperVal = priceData.High;
        window.UpperVal = priceData.High;
      }
      if (priceData.High > this.UpperVal) {
        this.UpperVal = priceData.High;
        window.UpperVal = priceData.High;
      }
    }
  }, {
    key: 'setLowerRange',
    value: function setLowerRange(priceData, LowerVal) {
      if (!this.LowerVal) {
        this.LowerVal = priceData.Low;
        window.LowerVal = priceData.Low;
      }
      if (priceData.Low < this.LowerVal) {
        this.LowerVal = priceData.Low;
        window.LowerVal = priceData.Low;
      }
    }
  }, {
    key: 'valueRange',
    value: function valueRange(priceData, UpperVal, LowerVal) {
      this.setUpperRange(priceData, UpperVal);
      this.setLowerRange(priceData, LowerVal);
    }

    /**
     * Draw Bars into the Main Chart
     * @param {*} n 
     * @param {*} yPos 
     * @param {*} vRange 
     * @param {*} index 
     * @param {*} price 
     */

  }, {
    key: 'BarData',
    value: function BarData(n, yPos, vRange, index, price) {
      var i = index;
      var color = 'black';
      var width = 6;
      var buffer = 30;
      var offset = 40;

      if (i >= price.history.length) {
        i = 0;
        return;
      }
      if ((n + buffer) * window.horizontalZoom > this.canvasWidth + window.horizontalPan * window.horizontalZoom) {
        i = 0;
        // why? not sure I need to be rounding the values anymore...
        // this.roundOffVals(this.UpperVal, this.LowerVal);
        return;
      }

      /**
       * chart high and low values start here...
       */
      this.valueRange(price.history[i], this.UpperVal, this.LowerVal);

      var barHighPos = yPos(price.history[i].High, this.UpperVal, this.LowerVal);
      var barLowPos = yPos(price.history[i].Low, this.UpperVal, this.LowerVal);
      var barOpenPos = yPos(price.history[i].Open, this.UpperVal, this.LowerVal);
      var barClosePos = yPos(price.history[i].Close, this.UpperVal, this.LowerVal);
      // handle current price updates
      if (i === 0) {
        barClosePos = yPos(price.current, this.UpperVal, this.LowerVal);
        if (barHighPos < barClosePos) {
          barHighPos = yPos(price.current, this.UpperVal, this.LowerVal);
        }
        if (barLowPos > barClosePos) {
          barLowPos = yPos(price.current, this.UpperVal, this.LowerVal);
        }
      }

      this.context.save();
      this.context.beginPath();

      // TODO: use less transforms
      this.context.translate(0, -(this.canvasHeight * 0.5));
      this.context.scale(window.horizontalZoom, window.verticalZoom);
      this.context.translate(0, this.canvasHeight * 0.5);
      this.context.translate(-(n + buffer - window.horizontalPan), 0);
      this.context.scale(window.horizontalZoom, 1);
      this.context.translate(n + buffer - window.horizontalPan, 0);

      // bar
      this.context.fillStyle = color;
      this.context.fillRect(-(n + buffer + 6 * window.horizontalZoom * 0.5 - 0.5 - window.horizontalPan), -barHighPos + window.verticalPan, width * window.horizontalZoom, barHighPos - barLowPos);

      // draw open
      this.context.fillStyle = color;
      this.context.fillRect(-(n + buffer) + (6 * window.horizontalZoom * 0.5 + 0.5) + window.horizontalPan, -barOpenPos + window.verticalPan, -(10 * window.horizontalZoom + (6 * window.horizontalZoom * 0.5 + 0.5)), 5 * (window.horizontalZoom * window.horizontalZoom * window.horizontalZoom) / window.verticalZoom);

      // draw close
      this.context.fillStyle = color;
      this.context.fillRect(-(n + buffer) - (6 * window.horizontalZoom * 0.5 - 0.5) + window.horizontalPan, -barClosePos + window.verticalPan, 10 * window.horizontalZoom + (6 * window.horizontalZoom * 0.5 - 0.5), 5 * (window.horizontalZoom * window.horizontalZoom * window.horizontalZoom) / window.verticalZoom);

      this.context.restore();

      i += 1;
      this.BarData(n + offset, yPos, vRange, i, price);
    }
  }, {
    key: 'MonthYear',
    value: function MonthYear(n, date, index, price) {
      var i = index;
      var color = '#000';
      var buffer = 30;
      var offset = 40;

      if (i >= price.history.length - 1) {
        i = 0;
        return;
      }
      if ((n + buffer) * window.horizontalZoom > this.canvasWidth + window.horizontalPan * window.horizontalZoom) {
        i = 0;
        return;
      }

      if (price.history[i].Date.month !== price.history[i + 1].Date.month) {
        this.context.font = 'normal 20px Arial';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillStyle = color;
        this.context.fillText(price.history[i].Date.month, -((n + buffer) * window.horizontalZoom - window.horizontalPan * window.horizontalZoom), -20);
      }

      i += 1;
      this.MonthYear(n + offset, date, i, price);
    }

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // VERTICAL GRID LINES
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  }, {
    key: 'VerticalLines',
    value: function VerticalLines(n, date, index, price) {
      var i = index;
      var color = '#ccc';
      var y = 0;
      var width = 2;
      var height = -this.canvasHeight;
      var buffer = 30;
      var offset = 40;

      if (i >= price.history.length - 1) {
        i = 0;
        return;
      }
      if ((n + buffer) * window.horizontalZoom > this.canvasWidth + window.horizontalPan * window.horizontalZoom) {
        i = 0;
        return;
      }

      if (price.history[i].Date.week != price.history[i + 1].Date.week || i === 0) {
        this.context.save();
        this.context.beginPath();

        this.context.translate(window.horizontalPan, 0);
        this.context.translate(-window.horizontalPan, 0);
        this.context.scale(window.horizontalZoom, 1);
        this.context.translate(window.horizontalPan, 0);

        this.context.fillStyle = color;
        this.context.rect(-(n + buffer), y, width / window.horizontalZoom, height);
        this.context.fill();
        this.context.restore();
      }

      if (price.history[i].Date.month !== price.history[i + 1].Date.month) {
        this.context.save();
        this.context.beginPath();

        this.context.translate(window.horizontalPan, 0);
        this.context.translate(-window.horizontalPan, 0);
        this.context.scale(window.horizontalZoom, 1);
        this.context.translate(window.horizontalPan, 0);

        this.context.fillStyle = color;
        this.context.fillRect(
        // -((n + buffer) - window.horizontalPan),
        -(n + buffer), y, width / window.horizontalZoom, height);
        this.context.restore();
      }

      i += 1;
      this.VerticalLines(n + offset, date, i, price);
    }

    // ***********************************************
    // CURRENT PRICE PLACEMENT
    // ***********************************************

  }, {
    key: 'yAxisPoint',
    value: function yAxisPoint(pointVal, upperVal, lowerVal) {
      // console.log('yAxisPoint', pointVal, upperVal, lowerVal);
      var cHeight = this.canvasHeight * 0.9;
      var valRatio = (pointVal - lowerVal) / (upperVal - lowerVal);
      return cHeight * valRatio + this.canvasHeight * 0.05;
    }
    // ***********************************************
    // CURRENT PRICE LINE
    // ***********************************************  

  }, {
    key: 'CurrentPrice',
    value: function CurrentPrice(price) {
      // debugger;
      // if (this.currentPrice === null) return;
      var color = 'red';
      var x = 0;
      // *****************************************
      // const y = -(this.yAxisPoint(this.priceData[0].Close, this.UpperVal, this.LowerVal));
      // console.log('StockChart', this.currentPrice);
      // debugger;
      var y = -this.yAxisPoint(price.current, this.UpperVal, this.LowerVal);
      // *****************************************
      var width = -this.canvasWidth;
      var height = 2;

      this.context.save();
      this.context.beginPath();

      this.context.transform(1, 0, 0, window.verticalZoom, 0, -(this.canvasHeight * 0.5));
      this.context.transform(1, 0, 0, 1, 0, this.canvasHeight * 0.5 - window.verticalPan);

      this.context.beginPath();
      this.context.fillStyle = color;
      this.context.fillRect(x, y + (window.verticalPan + window.verticalPan), width, height / window.verticalZoom);

      this.context.restore();
    }
  }, {
    key: 'upperHorizontalLines',
    value: function upperHorizontalLines() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.canvasHeight / this.hGridLines / 2 / 1;

      var color = '#ccc';
      var x = 0;
      var width = -this.canvasWidth;
      var height = 2;
      var offset = this.canvasHeight / this.hGridLines;
      var offsetScale = 1;
      var midPoint = this.canvasHeight * 0.5;

      if (n * window.verticalZoom > this.canvasHeight * 0.5 + window.verticalPan * window.verticalZoom) {
        // console.log(window.verticalZoom);
        if (window.verticalZoom <= 0.5) {
          offsetScale = 0.5;
        }
        if (window.verticalZoom > 0.5) {
          offsetScale = 1;
        }
        return;
      }

      this.context.save();
      this.context.beginPath();

      this.context.transform(1, 0, 0, window.verticalZoom, 0, -(this.canvasHeight * 0.5));
      this.context.transform(1, 0, 0, 1, 0, this.canvasHeight * 0.5 - window.verticalPan);

      // context.translate(0, -(canvasHeight * .5));
      // context.scale(1, window.verticalZoom);
      // context.translate(0, canvasHeight * .5);

      this.context.fillStyle = color;
      this.context.fillRect(x, -(midPoint + n) + (window.verticalPan + window.verticalPan), width, height / window.verticalZoom);
      this.context.restore();

      this.upperHorizontalLines(n + offset / offsetScale);
    }
  }, {
    key: 'lowerHorizontalLines',
    value: function lowerHorizontalLines() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.canvasHeight / this.hGridLines / 2 / 1;

      var color = '#ccc';
      var x = 0;
      var width = -this.canvasWidth;
      var height = 2;
      var offset = this.canvasHeight / this.hGridLines;
      var offsetScale = 1;
      var midPoint = this.canvasHeight * 0.5;

      if (n * window.verticalZoom > this.canvasHeight * 0.5 - window.verticalPan * window.verticalZoom) {
        return;
      }

      this.context.save();
      this.context.beginPath();

      this.context.transform(1, 0, 0, window.verticalZoom, 0, -(this.canvasHeight * 0.5));
      this.context.transform(1, 0, 0, 1, 0, this.canvasHeight * 0.5 - window.verticalPan);

      // context.translate(0, -(canvasHeight * .5));
      // context.scale(1, window.window.verticalZoom);
      // context.translate(0, canvasHeight * .5);

      this.context.fillStyle = color;
      this.context.fillRect(x, -(midPoint - n) + (window.verticalPan + window.verticalPan), width, height / window.verticalZoom);
      this.context.restore();

      this.lowerHorizontalLines(n + offset / offsetScale);
    }

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // CHART border
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  }, {
    key: 'ChartBorder',
    value: function ChartBorder() {
      var color = 'black';
      this.context.beginPath();
      this.context.fillStyle = color;
      this.context.rect(-this.canvasWidth, -this.canvasHeight, this.canvasWidth, 2);
      this.context.fill();

      this.context.beginPath();
      this.context.fillStyle = color;
      this.context.rect(-2, -this.canvasHeight, 2, this.canvasHeight);
      this.context.fill();

      this.context.beginPath();
      this.context.fillStyle = color;
      this.context.rect(0, -2, -this.canvasWidth, 2);
      this.context.fill();

      this.context.beginPath();
      this.context.fillStyle = color;
      this.context.rect(-this.canvasWidth, 0, 2, -this.canvasHeight);
      this.context.fill();
    }

    // function VerticalMidPoint () {
    //   var self = this;
    //   self.color = '#aaaaaa';
    //   self.x = -(canvasWidth * .5);
    //   self.y = 0;
    //   self.width = 2;
    //   self.height = -(canvasHeight);
    //   self.draw = function () {
    //     context.beginPath();
    //     context.fillStyle = 'black';
    //     context.rect(
    //       self.x,
    //       self.y,
    //       self.width,
    //       self.height
    //     );
    //     context.fill();
    //   }
    // }
    // var vMidPoint = new VerticalMidPoint();

    // HorizontalMidPoint() {
    //   const color = 'lightblue';
    //   const x = 0;
    //   const y = -(this.canvasHeight * 0.5);
    //   const width = -(this.canvasWidth);
    //   const height = 2;

    //   this.context.beginPath();
    //   this.context.fillStyle = color;
    //   this.context.fillRect(
    //     x,
    //     y,
    //     width,
    //     height,
    //   );
    // }

  }]);

  return StockChart;
}();

exports.default = StockChart;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});


// PROVIDER_CURRENT_PRICE = 'coindesk' || 'coincap'
// export let PROVIDER_CURRENT_PRICE = 'coincap';
var PROVIDER_HISTORIC_PRICE = exports.PROVIDER_HISTORIC_PRICE = 'quandal';
var UPDATE_CURRENT_PRICE = exports.UPDATE_CURRENT_PRICE = 10; // seconds
var HORIZONTAL_GRID_LINES = exports.HORIZONTAL_GRID_LINES = 10;

// export function providerCurrentPrice(provider) {
//   PROVIDER_CURRENT_PRICE = provider;
// }

/***/ })
/******/ ]);