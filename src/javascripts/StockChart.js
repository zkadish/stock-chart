import moment from 'moment';

// TODO: create a StockChart class and extend all other classes from it!
// ie: the x and y axis charts should be extended from StockCart
// figure out what the classes have in common pull that out into a base class
// and extend the rest

export default class StockChart {
  constructor(priceData, currentPrice) {
    // set current price initial value
    this.currentPrice = { USD: { rate_float: 0 } };
    currentPrice('USD').then((data) => {
      // console.log('initial data', data);
      this.currentPrice = data;
    });

    // update current value every 30 secons
    setInterval(() => {
      // console.log('get current price', this);
      currentPrice('USD').then((data) => {
        this.currentPrice = data;
      });
      // console.log(this.currentPrice);
    }, 30000);

    this.priceData = priceData;
    this.canvasContainer = document.querySelector('.chart-container');

    this.containerRect = this.canvasContainer.getBoundingClientRect();
    this.canvas = document.querySelector('.chart-canvas');
    this.context = this.canvas.getContext('2d');

    this.hGridLines = 10; // 18
    this.chartUpperVal = null;
    this.chartLowerVal = null;

    // *2 to scale up canvas for retna display
    this.canvasWidth = this.containerRect.width * 2;
    this.canvasHeight = this.containerRect.height * 2;

    this.canvas.setAttribute('width', this.canvasWidth);
    this.canvas.setAttribute('height', this.canvasHeight);

    this.canvas.style.width = `${this.canvasWidth * 0.5}px`;
    this.canvas.style.height = `${this.canvasHeight * 0.5}px`;

    this.yPointPos = this.yPointPos.bind(this);
    this.valueRange = this.valueRange.bind(this);

    this.windowOnResizeHandler = this.windowOnResizeHandler.bind(this);
    document.addEventListener('window:onresize', this.windowOnResizeHandler, false);
  }

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
    // var startRange = Math.ceil(upperVal) - Math.floor(lowerVal);

    let range = Math.ceil(upperVal) - Math.floor(lowerVal);
    // var rangeDif = null;

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

    // rangeDif = (range - (Math.ceil(upperVal) - Math.floor(lowerVal))) / 2;

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
    let prop = null;
    prop = upper ? 'chartUpperVal' : 'chartLowerVal';
    if (!chartVal) {
      this[prop] = upper ? priceData.High : priceData.Low;
      return;
    }
    if (upper && priceData.High > this[prop]) {
      this[prop] = Math.ceil(priceData.High);
      // console.log('upper', this.chartUpperVal);
      return;
    }
    if (!upper && priceData.Low < this[prop]) {
      this[prop] = Math.ceil(priceData.Low);
      // console.log('lower', this.chartLowerVal);  
    }
  }

  valueRange(priceData, chartUpperVal, chartLowerVal) {
    this.setRange(priceData, chartUpperVal, true);
    this.setRange(priceData, chartLowerVal, false);
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // BAR DISPLAY
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  BarData(n, yPos, vRange, index) {
    let i = index;
    const color = 'black';
    // const x = 0;
    // const y = 0;
    const width = 6;
    // const height = 40;
    const buffer = 30;
    const offset = 40;

    if (i >= this.priceData.length) {
      i = 0;
      return;
    }
    if (((n + buffer) * window.horizontalZoom) > this.canvasWidth + (window.horizontalPan * window.horizontalZoom)) {
      i = 0;
      // console.log(chartUpperVal, chartLowerVal);
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

    vRange(this.priceData[i], this.chartUpperVal, this.chartLowerVal);

    const barHighPos = yPos(this.priceData[i].High, this.chartUpperVal, this.chartLowerVal);
    const barLowPos = yPos(this.priceData[i].Low, this.chartUpperVal, this.chartLowerVal);
    const barOpenPos = yPos(this.priceData[i].Open, this.chartUpperVal, this.chartLowerVal);
    let barClosePos = yPos(this.priceData[i].Close, this.chartUpperVal, this.chartLowerVal);
    if (i === 0) {
      barClosePos = yPos(this.currentPrice.USD.rate_float, this.chartUpperVal, this.chartLowerVal);      
    }

    this.context.save();
    this.context.beginPath();

    // why so many transforms?
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

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // process date info from bar data
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  processDate(date) {
    const dateArray = moment(date).format('YYYY-MMM-DD-ddd-ww').split('-');
    const dateObj = {
      year: dateArray[0],
      month: dateArray[1],
      day: dateArray[2].replace(/^0/, ''),
      weekDay: dateArray[3],
      week: dateArray[4],
    };
    return dateObj;
  }

  MonthYear(n, date, index) {
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

    if (date(this.priceData[i].Date).month !== date(this.priceData[i + 1].Date).month) {
      this.context.font = 'normal 20px Arial';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillStyle = color;
      this.context.fillText(
        date(this.priceData[i].Date).month,
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

    if (date(this.priceData[i].Date).week != date(this.priceData[i + 1].Date).week || i === 0) {
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

    if (date(this.priceData[i].Date).month !== date(this.priceData[i + 1].Date).month) {
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

  HorizontalMidPoint() {
    const color = 'lightblue';
    const x = 0;
    const y = -(this.canvasHeight * 0.5);
    const width = -(this.canvasWidth);
    const height = 2;

    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.fillRect(
      x,
      y,
      width,
      height,
    );
  }


  // CURRENT PRICE PLACEMENT
  yAxisPoint(pointVal, upperVal, lowerVal) {
    const cHeight = this.canvasHeight * 0.9;
    const valRatio = (pointVal - lowerVal) / (upperVal - lowerVal);
    return (cHeight * valRatio) + (this.canvasHeight * 0.05);
  }

  // CURRENT PRICE DISPLAY
  CurrentPrice() {
    const color = 'red';
    const x = 0;
    // const y = -(this.yAxisPoint(this.priceData[0].Close, this.chartUpperVal, this.chartLowerVal));
    const y = -(this.yAxisPoint(this.currentPrice.USD.rate_float, this.chartUpperVal, this.chartLowerVal));
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
}
