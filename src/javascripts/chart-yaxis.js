
export default function yAxisCanvas (priceData) {
  var canvasContainer = document.querySelector('.yaxis-container');
  var containerRect = canvasContainer.getBoundingClientRect();
  var canvas = document.querySelector('.yaxis-canvas');
  var context = canvas.getContext('2d');
  //LOOP
  var lastUpdate = null;

  // *2 to scale up canvas for retna display
  var canvasWidth = containerRect.width * 2;
  var canvasHeight = containerRect.height * 2;

  var upperRange = 0;
  var lowerRange = 0;
  var yVals = {
    highStart: 0,
    lowStart: 0,
    offset: 0
  }

  canvas.setAttribute('width', canvasWidth);
  canvas.setAttribute('height', canvasHeight);

  canvas.style.width = canvasWidth * .5 + 'px';
  canvas.style.height = canvasHeight * .5 + 'px';

  function pricevalueRangeHandler(e) {
    // console.log('pricevalueRangeHandler', e.detail);
    // upperRange = e.detail.chartUpperVal;
    // lowerRange = e.detail.chartLowerVal;
    yVals = new YaxisValues(e.detail.chartUpperVal, e.detail.chartLowerVal);
  }
  document.addEventListener('pricevalue:range', pricevalueRangeHandler);

  function windowOnResizeHandler () {
    containerRect = canvasContainer.getBoundingClientRect();
    canvasWidth = containerRect.width * 2;
    canvasHeight = containerRect.height * 2;

    canvas.style.width = canvasWidth * .5 + 'px';
    canvas.style.height = canvasHeight * .5 + 'px'

    context.translate(canvasWidth, canvasHeight);
  }
  document.addEventListener('window:onresize', windowOnResizeHandler, false);

  // CANVAS REFRESH LOOP
  var loopCount = 0;
  function loop () {
    //console.log('loop');
    // if (loopCount === 1000) {
    //   console.log('canvas loop stopped!');
    //   return;
    // }

    var now = window.Date.now();

    if (lastUpdate) {
      var elapsed = (now-lastUpdate) / 1000;
      lastUpdate = now;

      update(elapsed);
      render();
    } else {
      lastUpdate = now;
    }

    loopCount++;
    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);

  // CURRENT PRICE PLACEMENT
  var YaxisPoint = function (pointVal, upperVal, lowerVal) {
    //debugger;
    var cHeight = canvasHeight * .9;
    // var valRatio = (pointVal - lowerVal) / (upperVal - lowerVal);
    var valRatio = pointVal;
    this.pos = (cHeight * valRatio) + (canvasHeight * .05);

    //console.log(this.pos)
  }
  // var yPoint = new YaxisPoint(116.44, 130, 100);
  // the first argument looks like it should be the open of the
  // first bar's data, the second 2 arguments aren't doing anything
  // var yPoint = new YaxisPoint(116.44, 130, 100);
  var yPoint = new YaxisPoint(2201.7, 130, 100);

  // CURRENT PRICE DISPLAY
  function CurrentPrice () {
    var self = this;
    self.color = 'blue';
    self.x = 0;
    self.y = -(yPoint.pos);
    self.width = -(canvasWidth);
    self.height = 2;
    self.draw = function (price) {

      context.save();
      context.beginPath();

      context.transform(1, 0, 0, verticalZoom, 0, -(canvasHeight * .5));
      context.transform(1, 0, 0, 1, 0, (canvasHeight * .5) - (verticalPan));

      context.beginPath();
      context.fillStyle = self.color;
      context.fillRect(
        self.x,
        self.y + (verticalPan + verticalPan),
        self.width,
        self.height / verticalZoom
      );

      context.restore();
    }
  }
  var cPrice = new CurrentPrice();


  function HorizontalUpperRange () {
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
  var hUpperRange = new HorizontalUpperRange();

  function HorizontalMidPoint () {
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
  var hMidPoint = new HorizontalMidPoint();

  function HorizontalLowerRange () {
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
  var hLowerRange = new HorizontalLowerRange();

  //.log(priceData[0]);
  var i = 0;
  function getRange () {

    //priceData[i];

    i++
  }


  // DISPLAY VALUES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // these values relate to 18 and 10 grid lines respectivly
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  var YaxisValues = function (high, low) {
    this.range = high - low;
    //this.offset = this.range // 17; //9
    this.offset = this.range / 9; //9, //17
    if (verticalZoom <= .5) {
      this.highStart = (5 * this.offset) + (this.offset * .5) + low; //5 //9
      this.lowStart = (4 * this.offset) + low; //4 //8
    }
    if (verticalZoom > .5) {
      this.highStart = (5 * this.offset) + low; //5 //9
      this.lowStart = (4 * this.offset) + low; //4 //8
    }

    //console.log('midVal', +(this.highStart).toFixed(4), 'lowerStart', +(this.lowStart).toFixed(4), 'offset', +(this.offset).toFixed(4));
  }
  //TODO: add dynamic values
  // var yVals = new YaxisValues(138, 87); //133. 92
  // high range / low range
  // var yVals = new YaxisValues(2764.5, 1013.5); //133. 92
  // console.log(upperRange, lowerRange);
  // var yVals = new YaxisValues(upperRange, lowerRange); //133. 92

  function HorizontalLines () {
    var self = this;
    var i = 0;
    var yScale = 1;

    self.color = '#cccccc';
    self.x = -(canvasWidth);
    self.y = 0;
    self.width = 15;
    self.height = 2;
    self.buffer = 20;
    // self.offset = (canvasHeight * .5) / 9;
    self.offset = (canvasHeight * .5) / 5;
    self.offsetScale = 1;
    self.midPoint = canvasHeight * .5;
    self.highVal = yVals.highStart;
    self.lowerVal = yVals.lowStart;
    self.yValsScale = 1;

    self.drawUpper = function (n, color) {
      //console.log(direction);
      getRange();
      if (n * verticalZoom > (canvasHeight * .5) + (verticalPan * verticalZoom)) {
        //debugger;
        self.highVal = +(yVals.highStart);
        //console.log(i);
        //console.log(verticalZoom);
        if (verticalZoom <= .5) {
          self.offsetScale = .5;
          self.yValsScale = 2;
          self.highVal = self.highVal + (yVals.offset * .5);
        }
        if (verticalZoom > .5) {
          self.offsetScale = 1;
          self.yValsScale = 1;
          self.highVal = yVals.highStart;
        }

        i = 0;
        return;
      }

      context.save();
      context.beginPath();

      // vertical zoom
      context.transform(1, 0, 0, verticalZoom, 0, -(canvasHeight * .5));
      // vertical pan
      context.transform(1, 0, 0, 1, 0, (canvasHeight * .5) - (verticalPan));

      context.fillStyle = self.color;
      context.fillRect(
        self.x,
        -(self.midPoint + n) + (verticalPan + verticalPan),
        self.width,
        self.height / verticalZoom
      );

      context.restore();

      context.beginPath();
      context.font = 'normal ' + 20 + 'px Arial';
      context.textBaseline = 'middle';
      context.fillStyle = 'black';
      context.fillText(
        (self.highVal).toFixed(2),
        -(canvasWidth - 20),
        -((n * verticalZoom) + self.midPoint - (verticalPan * verticalZoom))
      );

      i++;
      self.highVal = (+(self.highVal) + +(yVals.offset * self.yValsScale));
      self.drawUpper(n + (self.offset / self.offsetScale), self.color);
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

    self.drawLower = function (n, color) {
      if(n * verticalZoom > (canvasHeight * .5) - (verticalPan * verticalZoom)) {
        self.lowerVal = +(yVals.lowStart);

        if (verticalZoom <= .5) {
          //self.offsetScale = .5;
          //self.yValsScale = 2;
          self.lowerVal = self.lowerVal - (yVals.offset * .5);
        }
        if (verticalZoom > .5) {
          //self.offsetScale = 1;
          //self.yValsScale = 1;
          self.lowerVal = yVals.lowStart;
        }

        return;
      }

      // console.log(verticalPan);

      context.save();
      context.beginPath();

      context.transform(1, 0, 0, verticalZoom, 0, -(canvasHeight * .5));
      context.transform(1, 0, 0, 1, 0, (canvasHeight * .5) - (verticalPan));
      // context.translate(0, -(canvasHeight * .5));
      // context.scale(1, verticalZoom);
      // context.translate(0, canvasHeight * .5);

      // console.log(verticalPan);

      context.fillStyle = color;
      context.fillRect(
        self.x,
        -(self.midPoint - n) + (verticalPan) + (verticalPan),
        self.width,
        self.height / verticalZoom
      );

      context.restore();

      context.beginPath();
      context.font = 'normal ' + 20 + 'px Arial';
      context.textBaseline = 'middle';
      context.fillStyle = 'black';
      context.fillText(
        (self.lowerVal).toFixed(2),
        -(canvasWidth - 20),
        ((n * verticalZoom) - self.midPoint + (verticalPan * verticalZoom))
      );

      self.lowerVal = (self.lowerVal -(yVals.offset * self.yValsScale));
      self.drawLower(n + (self.offset / self.offsetScale), self.color);
    }

  }
  var hLines = new HorizontalLines();

  function update (elapsed) {

  }

  function render () {
    context.clearRect(0, 0, -(canvasWidth), -(canvasHeight));

    //hLines.draw(0);
    //scale.draw();

    // hUpperRange.draw();
    // hMidPoint.draw();
    // hLowerRange.draw()

    hLines.drawUpper((hLines.offset / 2) / hLines.offsetScale, 'lightblue');
    hLines.drawLower((hLines.offset / 2) / hLines.offsetScale, 'lightblue');
    //cPrice.draw();

  }

  context.translate(canvasWidth, canvasHeight);

}
