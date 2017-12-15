// import moment from 'moment';
import * as C from './constants';

// TODO: Fix pan and zoom events so they release on document.mouseup and
// make sure your clearing all events

export default class StockChart {
  constructor(DOM) {
    // set up canvas
    this.DOM = DOM;
    this.containerRect = this.DOM.getBoundingClientRect();
    this.canvas = DOM.children[0];
    this.context = this.canvas.getContext('2d');

    // *2 to scale up canvas for retna display
    this.canvasWidth = this.containerRect.width * 2;
    this.canvasHeight = this.containerRect.height * 2;

    this.canvas.setAttribute('width', this.canvasWidth);
    this.canvas.setAttribute('height', this.canvasHeight);

    this.canvas.style.width = `${this.canvasWidth * 0.5}px`;
    this.canvas.style.height = `${this.canvasHeight * 0.5}px`;

    // this.hGridLines = C.HORIZONTAL_GRID_LINES;
    this.vLineBuffer = C.VERTICAL_LINE_BUFFER;
    this.vLineOffset = C.VERTICAL_LINE_OFFSET;

    document.addEventListener('window:onresize', this.windowOnResizeHandler, false);
  }

  UpperVal = null;
  LowerVal = null;
  numOfBars = null;

  // yaxis, xaxis
  windowOnResizeHandler = () => {
    this.containerRect = this.DOM.getBoundingClientRect();
    this.canvasWidth = this.containerRect.width * 2;
    this.canvasHeight = this.containerRect.height * 2;

    this.canvas.setAttribute('width', this.canvasWidth);
    this.canvas.setAttribute('height', this.canvasHeight);

    this.canvas.style.width = `${this.canvasWidth * 0.5}px`;
    this.canvas.style.height = `${this.canvasHeight * 0.5}px`;
  }

  /**
   * Get the number of visible bars on the chart
   * @param {*} n 
   * @param {*} index 
   */
  barCount(n, index) {
    let i = index;
    const buffer = this.vLineBuffer;
    const offset = this.vLineOffset;
    if ((n + buffer) > this.canvasWidth) {
      i = 0;
      return;
    }
    
    this.numOfBars = i;

    i += 1;
    this.barCount((n + offset), i);
  }

  // TODO: round off yAxis values...
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
  yPointPos = (pointVal, upperVal, lowerVal) => {
    // half the height of a grid space, accounts
    // for small buffer on top and bottom of chart
    const cHeight = this.canvasHeight * ((window.hGridLines - 1) / window.hGridLines); // (9/10) (17/18)
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
    const yPos = (cHeight * valRatio) + (this.canvasHeight * ((1 / window.hGridLines) / 2));
    return yPos;
  }

  // ***********************************************
  // CURRENT PRICE PLACEMENT
  // ***********************************************
  // yAxisPoint(pointVal, upperVal, lowerVal) {
    yAxisPoint(pointVal, upperVal, lowerVal) {
      // get 90% of the canvasHeight because there are 10 grid lines
      // the top and bottom grid lines start 5% of the canvas from the top and bottom
      const cHeight = this.canvasHeight * 0.9;
      const valRatio = (pointVal - lowerVal) / (upperVal - lowerVal);
      return (cHeight * valRatio) + (this.canvasHeight * 0.05);
    }

  /**
   * Get the high and low values of the current visible price data
   * @param {*} priceData 
   * @param {*} UpperVal, LowerVal
   */
  setUpperRange(priceData) {
    if (!this.UpperVal || priceData.High > this.UpperVal) {
      // this.UpperVal = Math.ceil(priceData.High);
      this.UpperVal = priceData.High;
      // window.UpperVal = Math.ceil(priceData.High);
      window.gridUpperVal = priceData.High;
      window.UpperVal = priceData.High;
      window.ConstUpperVal = priceData.High;
    }
  }

  setLowerRange(priceData) {
    if (!this.LowerVal || priceData.Low < this.LowerVal) {
      // this.LowerVal = Math.floor(priceData.Low);
      this.LowerVal = priceData.Low;
      // window.LowerVal = Math.floor(priceData.Low);
      window.gridLowerVal = priceData.Low;
      window.LowerVal = priceData.Low;
      window.ConstLowerVal = priceData.Low;      
    }
  }

  valueRangeLoop(index, price) {
    if (!price) return;

    let i = index;
    // if (i >= price.history.length) {
    if (i >= this.numOfBars) {
      i = 0;
      return;
    }

    this.setUpperRange(price.history[i]);
    this.setLowerRange(price.history[i]);

    i += 1;
    this.valueRangeLoop(i, price)
  }

  /**
   * Draw Bars into the Main Chart
   * @param {*} n 
   * @param {*} yPos 
   * @param {*} vRange 
   * @param {*} index 
   * @param {*} price 
   */
  BarData(n, yPos, vRange, index, price) {
    if (!price) return;
    let i = index;
    let color = 'red';
    const width = 6;
    const buffer = this.vLineBuffer;
    const offset = this.vLineOffset;

    if (i >= price.history.length) {
      i = 0;
      return;
    }
    if (((n + buffer) * window.horizontalZoom) > this.canvasWidth + (window.horizontalPan * window.horizontalZoom)) {
      i = 0;
      // why? not sure I need to be rounding the values anymore...
      // this.roundOffVals(this.UpperVal, this.LowerVal);
      return;
    }

    // get values for each bar
    const barOpenPos = yPos(price.history[i].Open, this.UpperVal, this.LowerVal);
    let barHighPos = yPos(price.history[i].High, this.UpperVal, this.LowerVal);
    let barLowPos = yPos(price.history[i].Low, this.UpperVal, this.LowerVal);
    let barClosePos = yPos(price.history[i].Close, this.UpperVal, this.LowerVal);

    // handle current price updates
    if (i === 0) {
      barClosePos = yPos(price.current, this.UpperVal, this.LowerVal);
      if (barHighPos < barClosePos) {
        barHighPos = yPos(price.current, this.UpperVal, this.LowerVal);        
      }
      if (barLowPos > barClosePos) {
        barLowPos = yPos(price.current, this.UpperVal, this.LowerVal);        
      }
      window.barClosePos = barClosePos;
      window.barOpenPos = barOpenPos;
      // console.log(barClosePos, barOpenPos)
    }

    if (barClosePos > barOpenPos) {
      color = 'green';
    }

    // create bar with canvas context
    this.context.save();
    this.context.beginPath();

    // TODO: use less transforms...
    this.context.translate(0, -(this.canvasHeight * 0.5));
    this.context.scale(window.horizontalZoom, window.verticalBarZoom);
    this.context.translate(0, this.canvasHeight * 0.5);
    this.context.translate(-((n + buffer) - (window.horizontalPan)), 0);
    this.context.scale(window.horizontalZoom, 1);
    this.context.translate(((n + buffer) - (window.horizontalPan)), 0);

    // draw open
    this.context.fillStyle = color;
    this.context.fillRect(
      -((n + buffer)) + (((6 * window.horizontalZoom) * 0.5) + 0.5) + ((window.horizontalPan)),
      -(barOpenPos) + (window.verticalPan),
      -((10 * window.horizontalZoom) + (((6 * window.horizontalZoom) * 0.5) + 0.5)),
      (5 * (window.horizontalZoom * window.horizontalZoom * window.horizontalZoom)) / window.verticalBarZoom,
    );

    // bar
    this.context.fillStyle = color;
    this.context.fillRect(
      -((n + buffer + ((6 * window.horizontalZoom) * 0.5) - 0.5) - ((window.horizontalPan))),
      -(barHighPos) + (window.verticalPan),
      width * window.horizontalZoom,
      (barHighPos - barLowPos),
    );

    // draw close
    this.context.fillStyle = color;
    this.context.fillRect(
      -((n + buffer)) - (((6 * window.horizontalZoom) * 0.5) - 0.5) + ((window.horizontalPan)),
      -(barClosePos) + (window.verticalPan),
      ((10 * window.horizontalZoom) + (((6 * window.horizontalZoom) * 0.5) - 0.5)),
      (5 * (window.horizontalZoom * window.horizontalZoom * window.horizontalZoom)) / window.verticalBarZoom,
    );

    this.context.restore();

    i += 1;
    this.BarData(n + offset, yPos, vRange, i, price);
  }

  MonthYear(n, date, index, price) {
    if (!price) return;
    let i = index;
    const color = '#000';
    const buffer = 30;
    const offset = 40;

    if (i >= price.history.length - 1) {
      i = 0;
      return;
    }
    if (((n + buffer) * window.horizontalZoom) > (this.canvasWidth) + (window.horizontalPan * window.horizontalZoom)) {
      i = 0;
      return;
    }

    if (price.history[i].Date.month !== price.history[i + 1].Date.month) {
      this.context.font = 'normal 20px Arial';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillStyle = color;
      this.context.fillText(
        price.history[i].Date.month,
        -(((n + buffer) * window.horizontalZoom) - (window.horizontalPan * window.horizontalZoom)),
        -20,
      );
    }

    i += 1;
    this.MonthYear((n + offset), date, i, price);
  }

  /**
   * VERTICAL GRID LINES
   * @param {*} n 
   * @param {*} date 
   * @param {*} index 
   * @param {*} price 
   */
  VerticalLines(n, date, index, price) {
    if (!price) return;
    let i = index;
    const color = '#ccc';
    const y = 0;
    const width = 2;
    const height = -(this.canvasHeight);
    const buffer = 30;
    const offset = 40;

    if (i >= price.history.length - 1) {
      i = 0;
      return;
    }
    if (((n + buffer) * window.horizontalZoom) > (this.canvasWidth) + (window.horizontalPan * window.horizontalZoom)) {
      i = 0;
      return;
    }

    if (price.history[i].Date.week != price.history[i + 1].Date.week || i === 0) {
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

    if (price.history[i].Date.month !== price.history[i + 1].Date.month) {
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
    this.VerticalLines((n + offset), date, i, price);
  }

  // ***********************************************
  // CURRENT PRICE LINE
  // ***********************************************  
  CurrentPrice(price) {
    if (!price) return;
    let color = 'red';
    const x = 0;
    
    const y = -(this.yAxisPoint(price.current, this.UpperVal, this.LowerVal));
    if ((y * -1) > window.barOpenPos) {
      color = 'green';
    }

    const width = -(this.canvasWidth);
    const height = 2;

    this.context.save();
    this.context.beginPath();

    this.context.transform(1, 0, 0, window.verticalBarZoom, 0, -(this.canvasHeight * 0.5));
    this.context.transform(1, 0, 0, 1, 0, (this.canvasHeight * 0.5) - (window.verticalPan));

    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.fillRect(
      x,
      y + (window.verticalPan + window.verticalPan),
      width,
      height / window.verticalBarZoom,
    );

    this.context.restore();
  }

  upperHorizontalLines(n = ((this.canvasHeight / window.hGridLines) / 2) / 1) {
    // TODO; move this logic to the scaleChart...
    // if (window.verticalZoom <= 0.8) this.hGridLines = 8;
    // if (window.verticalZoom > 0.8) this.hGridLines = 10;
    const color = '#ccc';
    const x = 0;
    const width = -(this.canvasWidth);
    const height = 2;
    const offset = this.canvasHeight / window.hGridLines;
    let offsetScale = 1;
    const midPoint = this.canvasHeight * 0.5;

    if (n * window.verticalZoom > (this.canvasHeight * 0.5) + (window.verticalPan * window.verticalZoom)) {
      // if (window.verticalZoom <= 0.5) {
      //   offsetScale = 0.5;
      // }
      // if (window.verticalZoom > 0.5) {
      //   offsetScale = 1;
      // }
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

  lowerHorizontalLines(n = ((this.canvasHeight / window.hGridLines) / 2) / 1) {
    const color = '#ccc';
    const x = 0;
    const width = -(this.canvasWidth);
    const height = 2;
    const offset = this.canvasHeight / window.hGridLines;
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
    // top edge
    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.rect(
      -(this.canvasWidth),
      -(this.canvasHeight),
      this.canvasWidth,
      2,
    );
    this.context.fill();

    // right edge
    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.rect(
      -2,
      -(this.canvasHeight),
      2,
      this.canvasHeight,
    );
    this.context.fill();

    // bottom edge
    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.rect(
      0,
      -2,
      -(this.canvasWidth),
      2,
    );
    this.context.fill();

    // left edge
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
