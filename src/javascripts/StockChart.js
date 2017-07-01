import moment from 'moment';

import { UPDATE_CURRENT_PRICE, HORIZONTAL_GRID_LINES } from './constants';

// TODO: Fix pan and zoom events so they release on document.mouseup and
// make sure your clearing all events

export default class StockChart {
  constructor(DOM, historicPrice, currentPrice, options) {
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

    this.canvas.style.width = `${this.canvasWidth * 0.5}px`;
    this.canvas.style.height = `${this.canvasHeight * 0.5}px`;

    // set current price initial value
    this.currentPrice = null;
    this.currentPriceData(currentPrice, options);

    // set historical price data
    this.priceData = null;
    this.historicPriceData(historicPrice, options);

    // yaxis
    this.hGridLines = HORIZONTAL_GRID_LINES; // 18
    this.chartUpperVal = null;
    this.chartLowerVal = null;

    this.yPointPos = this.yPointPos.bind(this);
    this.valueRange = this.valueRange.bind(this);

    this.windowOnResizeHandler = this.windowOnResizeHandler.bind(this);
    document.addEventListener('window:onresize', this.windowOnResizeHandler, false);
  }

  // yaxis
  currentPriceData(currentPrice, options) {
    const loop = (delay) => {
      const interval = setInterval(() => {
        console.log('porvider:', options, 'price:', this.currentPrice);
        currentPrice(options).then((data) => {
          this.currentPrice = data;
        });
        clearInterval(interval);
        loop(UPDATE_CURRENT_PRICE * 1000);
      }, delay);
    };
    loop(0);
  }

  // xaxis
  historicPriceData(historicPrice, options) {
    historicPrice(options).then((data) => {
      // debugger;
      this.priceData = data;
    });
  }

  // yaxis, xaxis
  windowOnResizeHandler() {
    this.containerRect = this.canvasContainer.getBoundingClientRect();
    this.canvasWidth = this.containerRect.width * 2;
    this.canvasHeight = this.containerRect.height * 2;

    this.canvas.setAttribute('width', this.canvasWidth);
    this.canvas.setAttribute('height', this.canvasHeight);

    this.canvas.style.width = `${this.canvasWidth * 0.5}px`;
    this.canvas.style.height = `${this.canvasHeight * 0.5}px`;
  }

  roundOffVals(upperVal, lowerVal) {
    let range = Math.ceil(upperVal) - Math.floor(lowerVal);
    let lessThen = false;

    if (range < 17) { // 9
      lessThen = true;
      range *= 10;
    }

    for (let i = 1; i < 17; i += 1) { // 9
      if (range % 17 === 0) { // 9
        break;
      }
      range += 1;
    }

    if (lessThen) {
      range /= 10;
    }

    this.chartUpperVal = this.chartUpperVal + (range - (Math.ceil(upperVal) - Math.floor(lowerVal))) / 2;
    this.chartLowerVal = this.chartLowerVal - (range - (Math.ceil(upperVal) - Math.floor(lowerVal))) / 2;
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // Y POSITION - BAR DATA
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  yPointPos(pointVal, upperVal, lowerVal) {
    // half the height of a grid space, accounts
    // for small buffer on top and bottom of chart
    const cHeight = this.canvasHeight * ((this.hGridLines - 1) / this.hGridLines); // (9/10) (17/18)
    // use lowerVal to account for canvas (0,0) being at the bottom right
    // ÷ by the difference of upperVal and lowerVal to find where the point is verticaly
    // based on percentage.
    const valRatio = (pointVal - lowerVal) / (upperVal - lowerVal);
    // 1 = 100% of chart hight ÷ number of horizontal grid lines ÷ in half for upper and lower
    // this equation adjusts the bar values up half the height of a grid space to account for
    // the value placment start in the middle of the chart and being placed up and down from
    // there. the grid also starts half a grid space away from the middle of the chat. this is
    // so there could be an even number of grid lines on the top and the bottom of the of the
    // chart at initail render time.
    const yPos = (cHeight * valRatio) + (this.canvasHeight * ((1 / this.hGridLines) / 2));
    return yPos;
  }

  // ********************************************
  // Get the high and low values of the data set
  // ********************************************
  setRange(priceData, chartVal, upper) {
    // debugger;
    let prop = null;
    prop = upper ? 'chartUpperVal' : 'chartLowerVal';
    if (!chartVal) {
      this[prop] = upper ? priceData.High : priceData.Low;
      return;
    }
    if (upper && priceData.High > this[prop]) {
      this[prop] = Math.ceil(priceData.High);
      window[prop] = priceData.High;
      // console.log('upper', this.chartUpperVal);
      return;
    }
    if (!upper && priceData.Low < this[prop]) {
      this[prop] = Math.ceil(priceData.Low);
      window[prop] = priceData.Low;
      // console.log('lower', this.chartLowerVal);
    }
  }

  valueRange(priceData, chartUpperVal, chartLowerVal) {
    // debugger;
    this.setRange(priceData, chartUpperVal, true);
    this.setRange(priceData, chartLowerVal, false);
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // BAR DISPLAY
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  BarData(n, yPos, vRange, index) {
    // debugger;
    if (this.priceData === null || this.currentPrice === null) return;
    let i = index;
    const color = 'black';
    const width = 6;
    const buffer = 30;
    const offset = 40;

    if (i >= this.priceData.length) {
      i = 0;
      return;
    }
    if (((n + buffer) * window.horizontalZoom) > this.canvasWidth + (window.horizontalPan * window.horizontalZoom)) {
      i = 0;
      const priceValueRange = new CustomEvent('pricevalue:range', {
        detail: {
          chartUpperVal: this.chartUpperVal,
          chartLowerVal: this.chartLowerVal,
        },
      });
      document.dispatchEvent(priceValueRange);
      // why? not sure I need to be rounding the values anymore...
      // this.roundOffVals(this.chartUpperVal, this.chartLowerVal);
      return;
    }

    // vRange(this.priceData[i], this.chartUpperVal, this.chartLowerVal);
    this.valueRange(this.priceData[i], this.chartUpperVal, this.chartLowerVal);

    let barHighPos = yPos(this.priceData[i].High, this.chartUpperVal, this.chartLowerVal);
    let barLowPos = yPos(this.priceData[i].Low, this.chartUpperVal, this.chartLowerVal);
    const barOpenPos = yPos(this.priceData[i].Open, this.chartUpperVal, this.chartLowerVal);
    let barClosePos = yPos(this.priceData[i].Close, this.chartUpperVal, this.chartLowerVal);
    if (i === 0) {
      barClosePos = yPos(this.currentPrice, this.chartUpperVal, this.chartLowerVal);
      if (barHighPos < barClosePos) {
        barHighPos = yPos(this.currentPrice, this.chartUpperVal, this.chartLowerVal);        
      }
      if (barLowPos > barClosePos) {
        barLowPos = yPos(this.currentPrice, this.chartUpperVal, this.chartLowerVal);        
      }
    }

    this.context.save();
    this.context.beginPath();

    // TODO: use less transforms
    this.context.translate(0, -(this.canvasHeight * 0.5));
    this.context.scale(window.horizontalZoom, window.verticalZoom);
    this.context.translate(0, this.canvasHeight * 0.5);
    this.context.translate(-((n + buffer) - (window.horizontalPan)), 0);
    this.context.scale(window.horizontalZoom, 1);
    this.context.translate(((n + buffer) - (window.horizontalPan)), 0);

    this.context.fillStyle = color;
    this.context.fillRect(
      -((n + buffer + ((6 * window.horizontalZoom) * 0.5) - 0.5) - ((window.horizontalPan))),
      -(barHighPos) + (window.verticalPan),
      width * window.horizontalZoom,
      (barHighPos - barLowPos),
    );

    // draw open
    this.context.fillStyle = color;
    this.context.fillRect(
      -((n + buffer)) + (((6 * window.horizontalZoom) * 0.5) + 0.5) + ((window.horizontalPan)),
      -(barOpenPos) + (window.verticalPan),
      -((10 * window.horizontalZoom) + (((6 * window.horizontalZoom) * 0.5) + 0.5)),
      (5 * (window.horizontalZoom * window.horizontalZoom * window.horizontalZoom)) / window.verticalZoom,
    );

    // draw close
    this.context.fillStyle = color;
    this.context.fillRect(
      -((n + buffer)) - (((6 * window.horizontalZoom) * 0.5) - 0.5) + ((window.horizontalPan)),
      -(barClosePos) + (window.verticalPan),
      ((10 * window.horizontalZoom) + (((6 * window.horizontalZoom) * 0.5) - 0.5)),
      (5 * (window.horizontalZoom * window.horizontalZoom * window.horizontalZoom)) / window.verticalZoom,
    );

    this.context.restore();

    i += 1;
    this.BarData(n + offset, yPos, vRange, i);
  }

  MonthYear(n, date, index) {
    if (this.priceData === null) return;
    let i = index;
    const color = '#000';
    const buffer = 30;
    const offset = 40;

    if (i >= this.priceData.length - 1) {
      i = 0;
      return;
    }
    if (((n + buffer) * window.horizontalZoom) > (this.canvasWidth) + (window.horizontalPan * window.horizontalZoom)) {
      i = 0;
      return;
    }

    if (this.priceData[i].Date.month !== this.priceData[i + 1].Date.month) {
      this.context.font = 'normal 20px Arial';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillStyle = color;
      this.context.fillText(
        this.priceData[i].Date.month,
        -(((n + buffer) * window.horizontalZoom) - (window.horizontalPan * window.horizontalZoom)),
        -20,
      );
    }

    i += 1;
    this.MonthYear((n + offset), date, i);
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // VERTICAL GRID LINES
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  VerticalLines(n, date, index) {
    if (this.priceData === null) return;
    let i = index;
    const color = '#ccc';
    const y = 0;
    const width = 2;
    const height = -(this.canvasHeight);
    const buffer = 30;
    const offset = 40;

    if (i >= this.priceData.length - 1) {
      i = 0;
      return;
    }
    if (((n + buffer) * window.horizontalZoom) > (this.canvasWidth) + (window.horizontalPan * window.horizontalZoom)) {
      i = 0;
      return;
    }

    if (this.priceData[i].Date.week != this.priceData[i + 1].Date.week || i === 0) {
      this.context.save();
      this.context.beginPath();

      this.context.translate(window.horizontalPan, 0);
      this.context.translate(-(window.horizontalPan), 0);
      this.context.scale((window.horizontalZoom), 1);
      this.context.translate((window.horizontalPan), 0);

      this.context.fillStyle = color;
      this.context.rect(
        -((n + buffer)),
        y,
        width / window.horizontalZoom,
        height,
      );
      this.context.fill();
      this.context.restore();
    }

    if (this.priceData[i].Date.month !== this.priceData[i + 1].Date.month) {
      this.context.save();
      this.context.beginPath();

      this.context.translate(window.horizontalPan, 0);
      this.context.translate(-(window.horizontalPan), 0);
      this.context.scale((window.horizontalZoom), 1);
      this.context.translate((window.horizontalPan), 0);

      this.context.fillStyle = color;
      this.context.fillRect(
        // -((n + buffer) - window.horizontalPan),
        -((n + buffer)),
        y,
        width / window.horizontalZoom,
        height,
      );
      this.context.restore();
    }

    i += 1;
    this.VerticalLines((n + offset), date, i);
  }

  // ***********************************************
  // CURRENT PRICE LINE
  // ***********************************************  
  CurrentPrice() {
    if (this.currentPrice === null) return;
    const color = 'red';
    const x = 0;
    // *****************************************
    // const y = -(this.yAxisPoint(this.priceData[0].Close, this.chartUpperVal, this.chartLowerVal));
    const y = -(this.yAxisPoint(this.currentPrice, this.chartUpperVal, this.chartLowerVal));
    // *****************************************
    const width = -(this.canvasWidth);
    const height = 2;

    this.context.save();
    this.context.beginPath();

    this.context.transform(1, 0, 0, window.verticalZoom, 0, -(this.canvasHeight * 0.5));
    this.context.transform(1, 0, 0, 1, 0, (this.canvasHeight * 0.5) - (window.verticalPan));

    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.fillRect(
      x,
      y + (window.verticalPan + window.verticalPan),
      width,
      height / window.verticalZoom,
    );

    this.context.restore();
  }

  upperHorizontalLines(n = ((this.canvasHeight / this.hGridLines) / 2) / 1) {
    const color = '#ccc';
    const x = 0;
    const width = -(this.canvasWidth);
    const height = 2;
    const offset = this.canvasHeight / this.hGridLines;
    let offsetScale = 1;
    const midPoint = this.canvasHeight * 0.5;

    if (n * window.verticalZoom > (this.canvasHeight * 0.5) + (window.verticalPan * window.verticalZoom)) {
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
    this.context.transform(1, 0, 0, 1, 0, (this.canvasHeight * 0.5) - (window.verticalPan));

    // context.translate(0, -(canvasHeight * .5));
    // context.scale(1, window.verticalZoom);
    // context.translate(0, canvasHeight * .5);

    this.context.fillStyle = color;
    this.context.fillRect(
      x,
      -(midPoint + n) + (window.verticalPan + window.verticalPan),
      width,
      height / window.verticalZoom,
    );
    this.context.restore();

    this.upperHorizontalLines(n + (offset / offsetScale));
  }

  lowerHorizontalLines(n = ((this.canvasHeight / this.hGridLines) / 2) / 1) {
    const color = '#ccc';
    const x = 0;
    const width = -(this.canvasWidth);
    const height = 2;
    const offset = this.canvasHeight / this.hGridLines;
    const offsetScale = 1;
    const midPoint = this.canvasHeight * 0.5;

    if (n * window.verticalZoom > (this.canvasHeight * 0.5) - (window.verticalPan * window.verticalZoom)) {
      return;
    }

    this.context.save();
    this.context.beginPath();

    this.context.transform(1, 0, 0, window.verticalZoom, 0, -(this.canvasHeight * 0.5));
    this.context.transform(1, 0, 0, 1, 0, (this.canvasHeight * 0.5) - (window.verticalPan));

    // context.translate(0, -(canvasHeight * .5));
    // context.scale(1, window.window.verticalZoom);
    // context.translate(0, canvasHeight * .5);

    this.context.fillStyle = color;
    this.context.fillRect(
      x,
      -(midPoint - n) + (window.verticalPan + window.verticalPan),
      width,
      height / window.verticalZoom,
    );
    this.context.restore();

    this.lowerHorizontalLines(n + (offset / offsetScale));
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // CHART border
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  ChartBorder() {
    const color = 'black';
    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.rect(
      -(this.canvasWidth),
      -(this.canvasHeight),
      this.canvasWidth,
      2,
    );
    this.context.fill();

    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.rect(
      -2,
      -(this.canvasHeight),
      2,
      this.canvasHeight,
    );
    this.context.fill();

    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.rect(
      0,
      -2,
      -(this.canvasWidth),
      2,
    );
    this.context.fill();

    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.rect(-(this.canvasWidth), 0, 2, -(this.canvasHeight));
    this.context.fill();
  }

  // CURRENT PRICE PLACEMENT
  yAxisPoint(pointVal, upperVal, lowerVal) {
    const cHeight = this.canvasHeight * 0.9;
    const valRatio = (pointVal - lowerVal) / (upperVal - lowerVal);
    return (cHeight * valRatio) + (this.canvasHeight * 0.05);
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
}
