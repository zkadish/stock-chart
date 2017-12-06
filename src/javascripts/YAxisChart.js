import StockChart from './StockChart';
import { vZoomReset } from './scaleChart';

export default class ChartYAxis extends StockChart {
  constructor(yAxisDOM) {
    super(yAxisDOM);
    this.high = null;
    this.low = null;
    this.range = null;
    this.offset = null;
    this.highStart = null;
    this.lowStart = null;
    // this.price = null;

    const valueRangeLoop = this.valueRangeLoop;

    this.DOM.ondblclick = function ondlclickHandler() {
      console.log(window.UpperVal, window.LowerVal);
      console.log('ondblclick', window.ConstUpperVal, window.ConstLowerVal);
      window.UpperVal = window.ConstUpperVal;
      window.LowerVal = window.ConstLowerVal;
      window.zoom = 100;
      window.verticalZoom = 1;
      window.verticalBarZoom = 1;
      window.verticalPan = 0;
      // window.horizontalPan = 0;
      vZoomReset();
    };
  }

  /**
   * RENDER CURRENT PRICE DISPLAY
   * @param {*} price 
   */
  CurrentPrice(price) {
    if (!price || !window.UpperVal || !window.LowerVal) return;
    let bgColor = 'red';
    // const bgColor = 'rgba(255, 0, 255, .5)';
    const fgColor = 'white';
    const x = 0;
    const y = -(this.yAxisPoint(price.current, window.gridUpperVal, window.gridLowerVal));
    const width = -(this.canvasWidth);
    const height = 32;  //40
    const midPoint = this.canvasHeight * 0.5;
    // this.price = price;
    // this.valueRangeLoop(0, price);

    if (price.current > window.barOpenPos) {
      bgColor = 'green';
    }

    this.context.save();
    this.context.beginPath();

    // this.context.transform(1, 0, 0, window.verticalZoom, 0, -(this.canvasHeight * 0.5));
    this.context.transform(1, 0, 0, window.verticalBarZoom, 0, -(this.canvasHeight * 0.5));
    this.context.transform(1, 0, 0, 1, 0, (this.canvasHeight * 0.5) - (window.verticalPan));

    this.context.beginPath();
    this.context.fillStyle = bgColor;

    // label background 
    this.context.fillRect(
      x,
      (y + (window.verticalPan * 2)) - ((16) / window.verticalZoom),
      width,
      height / (window.verticalZoom),
    );

    // move label background so values underneath can be seen
    // this.context.fillRect(
    //   this.canvasWidth / 2,
    //   (y + (window.verticalPan * 2)) - (20 / window.verticalBarZoom),
    //   width,
    //   height / (window.verticalBarZoom),
    // );

    // current price line
    // this.context.fillRect(
    //   x,
    //   y + (window.verticalPan + window.verticalPan),
    //   width,
    //   2 / (window.verticalBarZoom),
    // );

    this.context.restore();

    this.context.save();
    this.context.beginPath();
    this.context.translate(0, -(this.canvasHeight * 0.5));

    this.context.font = 'normal 20px Arial';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = fgColor;
    this.context.fillText(
      (price.current).toFixed(2),
      width + 20,
      ((y + window.verticalPan) * window.verticalZoom) + (midPoint * window.verticalZoom),
    );
    this.context.restore();

    // this.context.save();
    // this.context.beginPath();
    // this.context.translate(0, -(this.canvasHeight * 0.5));

    // this.context.font = 'normal 20px Arial';
    // this.context.textBaseline = 'middle';
    // this.context.fillStyle = fgColor;
    // this.context.fillText(
    //   (price.current).toFixed(2),
    //   -(this.canvasWidth / 2) + 20,
    //   ((y + window.verticalPan) * window.verticalBarZoom) + (midPoint * window.verticalBarZoom),
    // );
    // this.context.restore();
  }

  /**
   * these values relate to 18 and 10 grid lines respectively
   * @param {*} high 
   * @param {*} low 
   */
  high = null;
  low = null;
  rnage = null;
  offset = null;
  highStart = null;
  lowStart = null;
  yAxisValues = (upperVal, lowerVal) => {
    // if (window.vZoomFactor === 0) {
      this.high = upperVal;
      this.low = lowerVal;
      this.range = this.high - this.low;
      this.offset = this.range / 9;
      this.highStart = this.high - (4 * this.offset);
      this.lowStart = (4 * this.offset) + this.low;
    // }
    
    // if (window.vZoomFactor >= 1) {
    // if (window.verticalZoom <= 0.8) {
    //   this.high = this.high + this.offset;
    //   this.low = this.low - this.offset;
    //   this.range = this.high - this.low;
    //   this.offset = this.range / 9;
    //   this.highStart = (5 * (this.offset)) + this.low;
    //   this.lowStart = (4 * (this.offset)) + this.low;
    //   window.verticalZoom = 1;
    //   // debugger
    // }

    // if (window.verticalZoom <= 0.62) {
    //   // this.hGridLines = 6;
    //   high += offset;
    //   low -= offset;
    //   // console.log(high, low)
    //   range = high - low;
    //   offset = range / 9;
    //   highStart = (5 * offset) + low;
    //   lowStart = (4 * offset) + low;
    // }

    // if (window.verticalZoom <= 0.4) {
    //   // this.hGridLines = 4;
    //   high += offset;
    //   low -= offset;
    //   // console.log(high, low)
    //   range = high - low;
    //   offset = range / 9;
    //   highStart = (5 * offset) + low;
    //   lowStart = (4 * offset) + low;
    // }

    // if (window.verticalZoom <= 0.2) {
    //   // this.hGridLines = 6;
    //   high += offset;
    //   low -= offset;
    //   console.log(high, low)
    //   range = high - low;
    //   offset = range / 9;
    //   highStart = (5 * offset) + low;
    //   lowStart = (4 * offset) + low;
    // }

    const values = {
      offset: this.offset,
      highStart: this.highStart,
      lowStart: this.lowStart,
    };
    return values;
  }

  // upperHorizontalLines(n = ((this.canvasHeight / this.hGridLines) / 2) / 1, hVal = this.yAxisValues(window.UpperVal, window.LowerVal).highStart, i = 0) {
  upperValues(n = ((this.canvasHeight / window.hGridLines) / 2) / 1, hVal = this.yAxisValues(window.UpperVal, window.LowerVal).highStart) {
    if (!window.UpperVal || !window.LowerVal) return;
    const offset = this.canvasHeight / window.hGridLines;
    let offsetScale = 1;
    const midPoint = this.canvasHeight * 0.5;
    const yVals = this.yAxisValues(window.UpperVal, window.LowerVal);
    let highVal = hVal;
    // let yValsScale = 1;

    if (n * window.verticalZoom > (this.canvasHeight * 0.5) + (window.verticalPan * window.verticalZoom)) {
      highVal = +(yVals.highStart);
      // if (window.verticalZoom <= 0.5) {
      //   offsetScale = 0.5;
      //   yValsScale = 2;
      //   highVal += (yVals.offset * 0.5);
      // }
      // if (window.verticalZoom > 0.5) {
      //   offsetScale = 1;
      //   yValsScale = 1;
      //   highVal = yVals.highStart;
      // }
      return;
    }

    this.context.save();
    this.context.beginPath();
    this.context.font = 'normal 20px Arial';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = 'black';
    this.context.fillText(
      (highVal).toFixed(2),
      -(this.canvasWidth - 20),
      -((n * window.verticalZoom) + (midPoint - (window.verticalPan * window.verticalZoom))),
    );
    this.context.restore();

    // highVal += +(yVals.offset * yValsScale);
    highVal += yVals.offset;
    this.upperValues(n + (offset / offsetScale), highVal);
  }

  lowerValues(n = ((this.canvasHeight / window.hGridLines) / 2) / 1, lVal = this.yAxisValues(window.UpperVal, window.LowerVal).lowStart) {
    if (!window.UpperVal || !window.LowerVal) return;
    const offset = this.canvasHeight / window.hGridLines;
    let offsetScale = 1;
    const midPoint = this.canvasHeight * 0.5;
    const yVals = this.yAxisValues(window.UpperVal, window.LowerVal);
    let lowVal = lVal;
    // let yValsScale = 1;

    if (n * window.verticalZoom > (this.canvasHeight * 0.5) + (window.verticalPan * window.verticalZoom)) {
      lowVal = +(yVals.lowStart);
      // if (window.verticalZoom <= 0.5) {
      //   offsetScale = 0.5;
      //   yValsScale = 2;
      //   lowVal += (yVals.offset * 0.5);
      // }
      // if (window.verticalZoom > 0.5) {
      //   offsetScale = 1;
      //   yValsScale = 1;
      //   lowVal = yVals.lowStart;
      // }
      return;
    }

    this.context.save();
    this.context.beginPath();
    this.context.font = 'normal 20px Arial';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = 'black';
    this.context.fillText(
      (lowVal).toFixed(2),
      -(this.canvasWidth - 20),
      ((n * window.verticalZoom) - (midPoint + (-window.verticalPan * window.verticalZoom))),
    );
    this.context.restore();

    lowVal -= yVals.offset;
    this.lowerValues(n + (offset / offsetScale), lowVal);
  }

  upperHorizontalLines(n = ((this.canvasHeight / window.hGridLines) / 2) / 1) {
    if (!window.UpperVal || !window.LowerVal) return;
    const color = '#ccc';
    const x = -(this.canvasWidth);
    const width = 15;
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
    if (!window.UpperVal || !window.LowerVal) return;
    const color = '#ccc';
    const x = -(this.canvasWidth);
    const width = 15;
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

  // lowerHorizontalLines(n = ((this.canvasHeight / this.hGridLines) / 2) / 1, lVal = this.yAxisValues(window.UpperVal, window.LowerVal).lowStart) {
  //   if (!window.UpperVal || !window.LowerVal) return;
  //   const color = '#cccccc';
  //   const x = -(this.canvasWidth);
  //   const width = 15;
  //   const height = 2;
  //   const offset = (this.canvasHeight * 0.5) / 5;
  //   const offsetScale = 1;
  //   const midPoint = this.canvasHeight * 0.5;
  //   const yVals = this.yAxisValues(window.UpperVal, window.LowerVal);
  //   let lowerVal = lVal;
  //   const yValsScale = 1;

  //   if (n * window.verticalZoom > (this.canvasHeight * 0.5) - (window.verticalPan * window.verticalZoom)) {
  //     lowerVal = +(yVals.lowStart);

  //     if (window.verticalZoom <= 0.5) {
  //       lowerVal -= (yVals.offset * 0.5);
  //     }
  //     if (window.verticalZoom > 0.5) {
  //       self.lowerVal = yVals.lowStart;
  //     }
  //     return;
  //   }

  //   this.context.save();
  //   this.context.beginPath();

  //   this.context.transform(1, 0, 0, window.verticalZoom, 0, -(this.canvasHeight * 0.5));
  //   this.context.transform(1, 0, 0, 1, 0, (this.canvasHeight * 0.5) - (window.verticalPan));

  //   this.context.fillStyle = color;
  //   this.context.fillRect(
  //     x,
  //     -(midPoint - n) + (window.verticalPan) + (window.verticalPan),
  //     width,
  //     height / window.verticalZoom,
  //   );

  //   this.context.restore();

  //   this.context.beginPath();
  //   this.context.font = 'normal 20px Arial';
  //   this.context.textBaseline = 'middle';
  //   this.context.fillStyle = 'black';
  //   this.context.fillText(
  //     (lowerVal).toFixed(2),
  //     -(this.canvasWidth - 20),
  //     ((n * window.verticalZoom) - (midPoint + (-window.verticalPan * window.verticalZoom))),
  //   );

  //   lowerVal -= (yVals.offset * yValsScale);
  //   this.lowerHorizontalLines(n + (offset / offsetScale), lowerVal);
  // }

  // HorizontalUpperRange() {
  //   const color = 'lightblue';
  //   const x = 0;
  //   const y = -(this.canvasHeight * 0.95);
  //   const width = -(this.canvasWidth);
  //   const height = 1.5;

  //   this.context.beginPath();
  //   this.context.fillStyle = color;
  //   this.context.fillRect(
  //     x,
  //     y,
  //     width,
  //     height,
  //   );
  // }

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

  // HorizontalLowerRange() {
  //   const color = 'lightblue';
  //   const x = 0;
  //   const y = -(this.canvasHeight * 0.5);
  //   const width = -(this.canvasWidth);
  //   const height = 1.5;

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

// non split approach
    // self.draw = function (n) {
    //   if ((n * verticalZoom) > (canvasHeight * 10) + (verticalPan)) {
    //     self.val = 0;
    //     return;
    //   }
    //
    //   var factoredPan = (verticalPan / verticalZoom);
    //
    //   context.save();
    //   context.beginPath();
    //
    //   // context.transform(1, 0, 0, verticalZoom, 0, -(canvasHeight * .5));
    //   // context.transform(1, 0, 0, 1, 0, (canvasHeight * .5) + (verticalPan / verticalZoom));
    //
    //   //context.transform(1, 0, 0, verticalZoom, 0, (verticalPan));
    //
    //   context.transform(1, 0, 0, verticalZoom, 0, -((canvasHeight/2)) );
    //   context.transform(1, 0, 0, 1, 0, ((canvasHeight/2)) - (verticalPan));
    //
    //   // context.transform(1, 0, 0, 1, 0, (verticalPan));
    //   // context.transform(1, 0, 0, verticalZoom, 0, -(canvasHeight * .5));
    //   // context.transform(1, 0, 0, 1, 0, canvasHeight * .5);
    //
    //   //context.transform(1, 0, 0, 1, 0, (verticalPan * 2));
    //   //context.transform(1, 0, 0, verticalZoom, 0, -(canvasHeight * .5));
    //   //context.transform(1, 0, 0, 1, 0, (canvasHeight * .5) - (verticalPan / verticalZoom));
    //
    //   //context.transform(1, 0, 0, 1, 0, (canvasHeight * .5) + (verticalPan / verticalZoom));
    //
    //   context.fillStyle = 'red';
    //   context.fillRect(
    //     self.x,
    //     -(n) + (verticalPan * 2),
    //     self.width,
    //     self.height / verticalZoom
    //   );
    //
    //   context.restore();
    //
    //   // context.font = 'normal ' + 20 + 'px Arial';
    //   // context.textBaseline = 'middle';
    //   // context.fillText(
    //   //   self.val,
    //   //   -(canvasWidth - 20),
    //   //   -(n) - (verticalPan / verticalZoom)
    //   // );
    //
    //   self.val = self.val + 10;
    //   self.draw(n + (self.offset));
    // }

