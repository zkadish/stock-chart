
export default class ChartYAxis {
  constructor(priceData) {
    this.priceData = priceData;
    this.canvasContainer = document.querySelector('.yaxis-container');
    this.containerRect = this.canvasContainer.getBoundingClientRect();
    this.canvas = document.querySelector('.yaxis-canvas');
    this.context = this.canvas.getContext('2d');

    this.lastUpdate = null;

    // *2 to scale up canvas for retna display
    this.canvasWidth = this.containerRect.width * 2;
    this.canvasHeight = this.containerRect.height * 2;

    this.hGridLines = 10;
    this.upperRange = 0;
    this.lowerRange = 0;
    this.yVals = {
      highStart: 0,
      lowStart: 0,
      offset: 0,
    };
    this.upperVal = 0;
    this.lowerVal = 0;

    this.canvas.setAttribute('width', this.canvasWidth);
    this.canvas.setAttribute('height', this.canvasHeight);

    this.canvas.style.width = `${this.canvasWidth * 0.5}px`;
    this.canvas.style.height = `${this.canvasHeight * 0.5}px`;

    this.pricevalueRangeHandler = this.pricevalueRangeHandler.bind(this);
    document.addEventListener('pricevalue:range', this.pricevalueRangeHandler);

    this.windowOnResizeHandler = this.windowOnResizeHandler.bind(this);
    document.addEventListener('window:onresize', this.windowOnResizeHandler, false);
  }

  pricevalueRangeHandler(e) {
    this.upperVal = e.detail.chartUpperVal;
    this.lowerVal = e.detail.chartLowerVal;
    this.yVals = this.yAxisValues(e.detail.chartUpperVal, e.detail.chartLowerVal);
  }

  windowOnResizeHandler() {
    this.containerRect = this.canvasContainer.getBoundingClientRect();
    this.canvasWidth = this.containerRect.width * 2;
    this.canvasHeight = this.containerRect.height * 2;

    this.canvas.setAttribute('width', this.canvasWidth);
    this.canvas.setAttribute('height', this.canvasHeight);

    this.canvas.style.width = this.canvasWidth * .5 + 'px';
    this.canvas.style.height = this.canvasHeight * .5 + 'px'

    // this.canvas.style.border = '1px solid red';
    // this.context.translate(this.canvasWidth, this.canvasHeight);
  }

  // // CANVAS REFRESH LOOP
  // var loopCount = 0;
  // function loop () {
  //   //console.log('loop');
  //   // if (loopCount === 1000) {
  //   //   console.log('canvas loop stopped!');
  //   //   return;
  //   // }

  //   var now = window.Date.now();

  //   if (lastUpdate) {
  //     var elapsed = (now-lastUpdate) / 1000;
  //     lastUpdate = now;

  //     update(elapsed);
  //     render();
  //   } else {
  //     lastUpdate = now;
  //   }

  //   loopCount++;
  //   window.requestAnimationFrame(loop);
  // }
  // window.requestAnimationFrame(loop);

  // CURRENT PRICE PLACEMENT
  YaxisPoint(pointVal, upperVal, lowerVal) {
    const cHeight = this.canvasHeight * 0.9; // 0.9
    const valRatio = (pointVal - lowerVal) / (upperVal - lowerVal);
    return (cHeight * valRatio) + (this.canvasHeight * 0.05);
  }
  // var yPoint = new YaxisPoint(116.44, 130, 100);
  // the first argument is the close of the first bar's
  // data, the second 2 arguments aren't doing anything
  // var yPoint = new YaxisPoint(116.44, 130, 100);
  // var yPoint = new YaxisPoint(2880.08, 2933, 1141);

  // CURRENT PRICE DISPLAY
  CurrentPrice(price) {
    // debugger;
    const color = 'red';
    const x = 0;
    // const y = -(this.YaxisPoint(2880.08, 2933, 1141));
    const y = -(this.YaxisPoint(this.priceData[0].Close, this.upperVal, this.lowerVal));
    const width = -(this.canvasWidth);
    const height = 40;

    this.context.save();
    this.context.beginPath();

    this.context.transform(1, 0, 0, window.verticalZoom, 0, -(this.canvasHeight * 0.5));
    this.context.transform(1, 0, 0, 1, 0, (this.canvasHeight * 0.5) - (window.verticalPan));

    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.fillRect(
      x,
      y + (window.verticalPan + window.verticalPan) - 20,
      width,
      height / window.verticalZoom,
    );

    this.context.beginPath();
    this.context.font = 'normal ' + 20 + 'px Arial';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = 'white';
    this.context.fillText(
      (this.priceData[0].Close).toFixed(2),
      width + 20,
      y + (window.verticalPan + window.verticalPan)
    );
    this.context.restore();
  }


  HorizontalUpperRange() {
    var self = this;
    self.color = '#aaaaaa';
    self.x = 0;
    self.y = -(canvasHeight * .95);
    self.width = -(canvasWidth);
    self.height = 1.5;
    self.draw = function () {
      context.beginPath();
      context.fillStyle = 'lightblue';
      context.fillRect(
        self.x,
        self.y,
        self.width,
        self.height
      );
    }
  }
  // var hUpperRange = new HorizontalUpperRange();

  HorizontalMidPoint () {
    var self = this;
    self.color = '#aaaaaa';
    self.x = 0;
    self.y = -(canvasHeight * .5);
    self.width = -(canvasWidth);
    self.height = 2;
    self.draw = function () {
      context.beginPath();
      context.fillStyle = 'lightblue';
      context.fillRect(
        self.x,
        self.y,
        self.width,
        self.height
      );
    }
  }
  // var hMidPoint = new HorizontalMidPoint();

  HorizontalLowerRange () {
    var self = this;
    self.color = '#aaaaaa';
    self.x = 0;
    self.y = -(canvasHeight * .05);
    self.width = -(canvasWidth);
    self.height = 1.5;
    self.draw = function () {
      context.beginPath();
      context.fillStyle = 'lightblue';
      context.fillRect(
        self.x,
        self.y,
        self.width,
        self.height
      );
    }
  }
  // var hLowerRange = new HorizontalLowerRange();

  //.log(priceData[0]);
  // var i = 0;
  // function getRange () {

  //   //priceData[i];

  //   i++
  // }


  // DISPLAY VALUES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // these values relate to 18 and 10 grid lines respectivly
  // TODO: use constant hGridLInes
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  yAxisValues(high, low) {
    const range = high - low;
    // this.offset = this.range // 17; // 9
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
  //TODO: add dynamic values
  // var yVals = new YaxisValues(138, 87); //133. 92
  // high range / low range
  // var yVals = new YaxisValues(2764.5, 1013.5); //133. 92
  // console.log(upperRange, lowerRange);
  // var yVals = new YaxisValues(upperRange, lowerRange); //133. 92

  upperHorizontalLines(n = ((this.canvasHeight / this.hGridLines) / 2) / 1, hVal = this.yVals.highStart) {
    const color = '#cccccc';
    const x = -(this.canvasWidth);
    const width = 15;
    const height = 2;
    const offset = this.canvasHeight / this.hGridLines;
    let offsetScale = 1;
    const midPoint = this.canvasHeight * .5;
    let highVal = hVal;
    let yValsScale = 1;

    // getRange();
    if (n * window.verticalZoom > (this.canvasHeight * 0.5) + (window.verticalPan * window.verticalZoom)) {
      highVal = +(this.yVals.highStart);
      if (window.verticalZoom <= 0.5) {
        offsetScale = 0.5;
        yValsScale = 2;
        highVal += (this.yVals.offset * 0.5);
      }
      if (window.verticalZoom > 0.5) {
        offsetScale = 1;
        yValsScale = 1;
        highVal = this.yVals.highStart;
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

    this.context.beginPath();
    this.context.font = 'normal ' + 20 + 'px Arial';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = 'black';
    this.context.fillText(
      (highVal).toFixed(2),
      -(this.canvasWidth - 20),
      -((n * window.verticalZoom) + midPoint - (window.verticalPan * window.verticalZoom))
    );

    highVal = (+(highVal) + +(this.yVals.offset * yValsScale));
    this.upperHorizontalLines(n + (offset / offsetScale), highVal);
  }

  lowerHorizontalLines(n = ((this.canvasHeight / this.hGridLines) / 2) / 1, lVal = this.yVals.lowStart) {
    const color = '#cccccc';
    const x = -(this.canvasWidth);
    const width = 15;
    const height = 2;
    const offset = (this.canvasHeight * 0.5) / 5;
    const offsetScale = 1;
    const midPoint = this.canvasHeight * 0.5;
    let lowerVal = lVal;
    const yValsScale = 1;

    if (n * window.verticalZoom > (this.canvasHeight * 0.5) - (window.verticalPan * window.verticalZoom)) {
      lowerVal = +(this.yVals.lowStart);

      if (window.verticalZoom <= 0.5) {
        //self.offsetScale = .5;
        //self.yValsScale = 2;
        lowerVal -= (this.yVals.offset * 0.5);
      }
      if (window.verticalZoom > 0.5) {
        //self.offsetScale = 1;
        //self.yValsScale = 1;
        self.lowerVal = this.yVals.lowStart;
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
    this.context.font = 'normal ' + 20 + 'px Arial';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = 'black';
    this.context.fillText(
      (lowerVal).toFixed(2),
      -(this.canvasWidth - 20),
      ((n * window.verticalZoom) - midPoint + (window.verticalPan * window.verticalZoom))
    );

    lowerVal -= (this.yVals.offset * yValsScale);
    this.lowerHorizontalLines(n + (offset / offsetScale), lowerVal);
  }

  // function update (elapsed) {

  // }

  // function render () {
  //   context.clearRect(0, 0, -(canvasWidth), -(canvasHeight));

  //   //hLines.draw(0);
  //   //scale.draw();

  //   // hUpperRange.draw();
  //   // hMidPoint.draw();
  //   // hLowerRange.draw()

  //   hLines.drawUpper((hLines.offset / 2) / hLines.offsetScale, 'lightblue');
  //   hLines.drawLower((hLines.offset / 2) / hLines.offsetScale, 'lightblue');
  //   cPrice.draw();

  // }

  // context.translate(canvasWidth, canvasHeight);

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

