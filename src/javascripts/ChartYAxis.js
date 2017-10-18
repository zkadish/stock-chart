import StockChart from './StockChart';

export default class ChartYAxis extends StockChart {
  /**
   * RENDER CURRENT PRICE DISPLAY
   * @param {*} price 
   */
  CurrentPrice(price) {    
    if (!window.UpperVal || !window.LowerVal) return;
    const bgColor = 'red';
    const fgColor = 'white';
    const x = 0;
    const y = -(this.yAxisPoint(price.current, window.UpperVal, window.LowerVal));
    const width = -(this.canvasWidth);
    const height = 40;
    const midPoint = this.canvasHeight * 0.5;

    this.context.save();
    this.context.beginPath();

    this.context.transform(1, 0, 0, window.verticalZoom, 0, -(this.canvasHeight * 0.5));
    this.context.transform(1, 0, 0, 1, 0, (this.canvasHeight * 0.5) - (window.verticalPan));

    this.context.beginPath();
    this.context.fillStyle = bgColor;
    this.context.fillRect(
      x,
      (y + (window.verticalPan * 2)) - (20 / window.verticalZoom),
      width,
      height / (window.verticalZoom),
    );
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
  }

  /**
   * these values relate to 18 and 10 grid lines respectively
   * @param {*} high 
   * @param {*} low 
   */
  yAxisValues = (high, low) => {
    // console.log('yAxisValues', high, low)
    const range = high - low;
    const offset = range / 9; // 9, // 17
    let highStart = 0;
    let lowStart = 0;
    if (window.verticalZoom <= 0.5) {
      highStart = (5 * offset) + (offset * 0.5) + low; // 5 // 9
      lowStart = (4 * offset) + low; // 4 // 8
    }
    if (window.verticalZoom > 0.5) {
      highStart = (5 * offset) + low; // 5 // 9
      lowStart = (4 * offset) + low; // 4 // 8
    }
    return {
      highStart,
      lowStart,
      offset,
    };
  }

  upperHorizontalLines(n = ((this.canvasHeight / this.hGridLines) / 2) / 1) {
    if (!window.UpperVal || !window.LowerVal) return;
    const color = '#ccc';
    const x = -(this.canvasWidth);
    const width = 15;
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

  // upperHorizontalLines(n = ((this.canvasHeight / this.hGridLines) / 2) / 1, hVal = this.yAxisValues(window.UpperVal, window.LowerVal).highStart, i = 0) {
  upperValues(n = ((this.canvasHeight / this.hGridLines) / 2) / 1, hVal = this.yAxisValues(window.UpperVal, window.LowerVal).highStart) {
    if (!window.UpperVal || !window.LowerVal) return;
    // debugger
    // const color = '#cccccc';
    // const x = -(this.canvasWidth);
    // const width = 15;
    // const height = 2;
    const offset = this.canvasHeight / this.hGridLines;
    let offsetScale = 1;
    const midPoint = this.canvasHeight * 0.5;
    const yVals = this.yAxisValues(window.UpperVal, window.LowerVal);
    let highVal = hVal;
    let yValsScale = 1;

    if (n * window.verticalZoom > (this.canvasHeight * 0.5) + (window.verticalPan * window.verticalZoom)) {
      highVal = +(yVals.highStart);
      if (window.verticalZoom <= 0.5) {
        offsetScale = 0.5;
        yValsScale = 2;
        highVal += (yVals.offset * 0.5);
      }
      if (window.verticalZoom > 0.5) {
        offsetScale = 1;
        yValsScale = 1;
        highVal = yVals.highStart;
      }
      return;
    }

    // this.context.save();
    // this.context.beginPath();
    // this.context.transform(1, 0, 0, window.verticalZoom, 0, -(this.canvasHeight * 0.5));
    // this.context.transform(1, 0, 0, 1, 0, (this.canvasHeight * 0.5) - (window.verticalPan));

    // // this.context.fillStyle = color;
    // // this.context.fillRect(
    // //   x,
    // //   -(midPoint + n) + (window.verticalPan + window.verticalPan),
    // //   width,
    // //   height / window.verticalZoom,
    // // );
    // this.context.restore();

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

    highVal += +(yVals.offset * yValsScale);
    this.upperValues(n + (offset / offsetScale), highVal);
  }

  lowerHorizontalLines(n = ((this.canvasHeight / this.hGridLines) / 2) / 1, lVal = this.yAxisValues(window.UpperVal, window.LowerVal).lowStart) {
    if (!window.UpperVal || !window.LowerVal) return;
    const color = '#cccccc';
    const x = -(this.canvasWidth);
    const width = 15;
    const height = 2;
    const offset = (this.canvasHeight * 0.5) / 5;
    const offsetScale = 1;
    const midPoint = this.canvasHeight * 0.5;
    const yVals = this.yAxisValues(window.UpperVal, window.LowerVal);
    let lowerVal = lVal;
    const yValsScale = 1;

    if (n * window.verticalZoom > (this.canvasHeight * 0.5) - (window.verticalPan * window.verticalZoom)) {
      lowerVal = +(yVals.lowStart);

      if (window.verticalZoom <= 0.5) {
        lowerVal -= (yVals.offset * 0.5);
      }
      if (window.verticalZoom > 0.5) {
        self.lowerVal = yVals.lowStart;
      }
      return;
    }

    this.context.save();
    this.context.beginPath();

    this.context.transform(1, 0, 0, window.verticalZoom, 0, -(this.canvasHeight * 0.5));
    this.context.transform(1, 0, 0, 1, 0, (this.canvasHeight * 0.5) - (window.verticalPan));

    this.context.fillStyle = color;
    this.context.fillRect(
      x,
      -(midPoint - n) + (window.verticalPan) + (window.verticalPan),
      width,
      height / window.verticalZoom,
    );

    this.context.restore();

    this.context.beginPath();
    this.context.font = 'normal 20px Arial';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = 'black';
    this.context.fillText(
      (lowerVal).toFixed(2),
      -(this.canvasWidth - 20),
      ((n * window.verticalZoom) - (midPoint + (-window.verticalPan * window.verticalZoom))),
    );

    lowerVal -= (yVals.offset * yValsScale);
    this.lowerHorizontalLines(n + (offset / offsetScale), lowerVal);
  }

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

