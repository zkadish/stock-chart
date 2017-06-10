import moment from 'moment';
// import yAxisCanvas from 'javascripts/chart-yaxis';

// LOOP FUNCTION


export default function chartCanvas (priceData) {
  'use strict';
  //CANVAS
  var canvasContainer = document.querySelector('.chart-container');
  var containerRect = canvasContainer.getBoundingClientRect();
  var canvas = document.querySelector('.chart-canvas');
  var context = canvas.getContext('2d');

  // LOOP
  var loopCount = 0;
  var lastUpdate = null;

  var chartUpperVal = null;
  var chartLowerVal = null;

  // *2 to scale up canvas for retna display
  var canvasWidth = containerRect.width * 2;
  var canvasHeight = containerRect.height * 2;

  canvas.setAttribute('width', canvasWidth);
  canvas.setAttribute('height', canvasHeight);

  canvas.style.width = canvasWidth * .5 + 'px';
  canvas.style.height = canvasHeight * .5 + 'px';

  function windowOnResizeHandler () {
    containerRect = canvasContainer.getBoundingClientRect();
    canvasWidth = containerRect.width * 2;
    canvasHeight = containerRect.height * 2;

    canvas.style.width = canvasWidth * .5 + 'px';
    canvas.style.height = canvasHeight * .5 + 'px';

    context.translate(canvasWidth, canvasHeight);
  }
  document.addEventListener('window:onresize', windowOnResizeHandler, false);

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // LOOP FUNCTION
  // This fuction uses request animaiton frame to create a render loop
  // for all drawn elements in the canvas.
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  function loop () {
    // console.log('loop');
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

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // Y POSITION
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  function yPointPos (pointVal, upperVal, lowerVal) {
    // console.log('yPointPos', pointVal, upperVal, lowerVal);
    var cHeight = canvasHeight * (17/18); // (9/10)
    var valRatio = (pointVal - lowerVal) / (upperVal - lowerVal);
    var yPos = (cHeight * valRatio) + (canvasHeight * ((1/18)/2)); // (1/18)/2
    return yPos;
  }


  // ********************************************
  // Get the high and low values of the data set
  // ********************************************  
  function valueRange (priceData) {
    if (!chartUpperVal) {
      chartUpperVal = priceData.High;
    } else {
      if (priceData.High > chartUpperVal) {
        chartUpperVal = Math.ceil(priceData.High);
        // console.log(chartUpperVal);
      }
    }
    if (!chartLowerVal) {
      chartLowerVal = priceData.Low;
    } else {
      if (priceData.Low < chartLowerVal) {
        chartLowerVal = Math.floor(priceData.Low);
        // console.log(chartLowerVal);
      }
    }
    // var priceValueRange = new CustomEvent('pricevalue:range', {
    //   detail: {
    //     chartUpperVal,
    //     chartLowerVal
    //   }
    // });
    // document.dispatchEvent(priceValueRange);
  }
  //valueRange(priceData[0]);

  function roundOffVals (upperVal, lowerVal) {
    //debugger;
    //var startRange = Math.ceil(upperVal) - Math.floor(lowerVal);
    //console.log(startRange);

    var range = Math.ceil(upperVal) - Math.floor(lowerVal);
    //var rangeDif = null;
    //console.log(Math.ceil(upperVal), Math.floor(lowerVal));

    var lessThen = false;

    if (range < 17) { //9
      lessThen = true;
      range = range * 10;
    }

    for (var i = 1;i < 17;i++) { //9
      if (range % 17 === 0) { //9
        break;
      }
      range++;
    }

    if (lessThen) {
      range = range / 10;
    }

    //rangeDif = (range - (Math.ceil(upperVal) - Math.floor(lowerVal))) / 2;
    //console.log(range);

    chartUpperVal = chartUpperVal + (range - (Math.ceil(upperVal) - Math.floor(lowerVal))) / 2;
    chartLowerVal = chartLowerVal - (range - (Math.ceil(upperVal) - Math.floor(lowerVal))) / 2;
    //console.log(chartUpperVal, chartLowerVal);
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // BAR DISPLAY
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  function BarData () {
    var self = this;
    var i = 0;

    self.color = '#aaaaaa';
    self.x = 0;
    self.y = 0;
    self.width = 6;
    self.height = 40;
    self.buffer = 30;
    self.offset = 40;
    self.draw = function (n, yPos, vRange) {
      if (i >= priceData.length) {
        i = 0;
        return;
      }
      if (((n + self.buffer) * window.horizontalZoom) > canvasWidth + (window.horizontalPan * window.horizontalZoom)) {
        i = 0;
        // console.log(chartUpperVal, chartLowerVal);
        var priceValueRange = new CustomEvent('pricevalue:range', {
          detail: {
            chartUpperVal,
            chartLowerVal
          }
        });
        document.dispatchEvent(priceValueRange);
        roundOffVals(chartUpperVal, chartLowerVal);
        return;
      }

      vRange(priceData[i]);

      var barHighPos = yPos(priceData[i].High, chartUpperVal, chartLowerVal);
      var barLowPos = yPos(priceData[i].Low, chartUpperVal, chartLowerVal);
      var barOpenPos = yPos(priceData[i].Open, chartUpperVal, chartLowerVal);
      var barClosePos = yPos(priceData[i].Close, chartUpperVal, chartLowerVal);

      //console.log(chartUpperVal, chartLowerVal);


      context.save();
      context.beginPath();
      context.translate(0,  -(canvasHeight * .5));
      context.scale(window.horizontalZoom, window.verticalZoom);
      context.translate(0, canvasHeight * .5);

      context.translate(-(n + self.buffer - (window.horizontalPan)), 0);
      context.scale(window.horizontalZoom, 1);

      context.translate((n + self.buffer - (window.horizontalPan)), 0);

      // draw bar
      context.fillStyle = 'black';
      context.fillRect(
        -((n + self.buffer + ((6 * window.horizontalZoom) * .5) - .5) - ((window.horizontalPan))),
        -(barHighPos) + (window.verticalPan),
        self.width * window.horizontalZoom,
        (barHighPos - barLowPos)
      );

      // draw open
      context.fillStyle = 'black';
      context.fillRect(
        -((n + self.buffer)) + (((6 * window.horizontalZoom) * .5) + .5) + ((window.horizontalPan)),
        -(barOpenPos) + (window.verticalPan),
        -((10 * window.horizontalZoom) + (((6 * window.horizontalZoom) * .5) + .5)),
        (5 * (window.horizontalZoom * window.horizontalZoom * window.horizontalZoom)) / window.verticalZoom
      );

      // draw close
      context.fillStyle = 'black';
      context.fillRect(
        -((n + self.buffer)) - (((6 * window.horizontalZoom) * .5) - .5) + ((window.horizontalPan)),
        -(barClosePos) + (window.verticalPan),
        ((10 * window.horizontalZoom) + (((6 * window.horizontalZoom) * .5) - .5)),
        (5 * (window.horizontalZoom * window.horizontalZoom * window.horizontalZoom)) / window.verticalZoom
      );

      context.restore();

      i++;
      self.draw(n + (self.offset), yPointPos, vRange)
    }

  }
  var barDisplay = new BarData();

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // process date info from bar data
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  function processDate (date) {
    var dateArray = moment(date).format('YYYY-MMM-DD-ddd-ww').split('-');
    var dateObj = {};
    dateObj.year = dateArray[0];
    dateObj.month = dateArray[1];
    dateObj.day = dateArray[2].replace(/^0/, '');
    dateObj.weekDay = dateArray[3];
    dateObj.week = dateArray[4];
    return dateObj;
  }

  function MonthYear () {
    var self = this;
    var i = 0;

    self.color = '#000';
    self.x = 0;
    self.y = 0;
    self.buffer = 30;
    self.offset = 40;

    self.draw = function (n, date) {
      if (i >= priceData.length - 1) {
        i = 0;
        return;
      }
      if (((n + self.buffer) * window.horizontalZoom) > (canvasWidth) + (window.horizontalPan * window.horizontalZoom)) {
        i = 0;
        return;
      }

      if (date(priceData[i].Date).month != date(priceData[i + 1].Date).month) {

        context.font = 'normal ' + 20 + 'px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(
          date(priceData[i].Date).month,
          -(((n + self.buffer) * window.horizontalZoom) - (window.horizontalPan * window.horizontalZoom)),
          -20
        );

      }

      i++;
      self.draw((n + self.offset), date);

    }
  }
  var monthYear = new MonthYear();

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // VERTICAL GRID LINES
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  function VerticalLines () {
    var self = this;
    var i = 0;

    self.color = '#cccccc';
    self.x = 0;
    self.y = 0;
    self.width = 2;
    self.height = -(canvasHeight);
    self.buffer = 30;
    self.offset = 40;
    self.draw = function (n, date) {
      if (i >= priceData.length - 1) {
        i = 0;
        return;
      }
      if (((n + self.buffer) * window.horizontalZoom) > (canvasWidth) + (window.horizontalPan * window.horizontalZoom)) {
        i = 0;
        return;
      }

      if (date(priceData[i].Date).week != date(priceData[i + 1].Date).week) {
        context.save();
        context.beginPath();

        context.translate(window.horizontalPan, 0);
        context.translate(-(window.horizontalPan), 0)
        context.scale((window.horizontalZoom), 1);
        context.translate((window.horizontalPan), 0)

        context.fillStyle = self.color;
        context.fillRect(
          -((n + self.buffer)),
          self.y,
          self.width / window.horizontalZoom,
          self.height
        );

        context.restore();
      }

      if (date(priceData[i].Date).month != date(priceData[i + 1].Date).month) {

        context.save();
        context.beginPath();

        context.translate(window.horizontalPan, 0);
        context.translate(-(window.horizontalPan), 0)
        context.scale((window.horizontalZoom), 1);
        context.translate((window.horizontalPan), 0)

        context.fillStyle = 'red';
        context.fillRect(
          -((n + self.buffer)),
          self.y,
          self.width / window.horizontalZoom,
          self.height
        );

        context.restore();

      }


      i++;
      self.draw((n + self.offset), date);
    }
  }
  var vLines = new VerticalLines();



  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // CHART border
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  function ChartBorder () {
    var self = this;

    self.color = 'black';
    self.draw = function () {

      context.beginPath();
      context.fillStyle = 'black';
      context.rect(
        -(canvasWidth),
        -(canvasHeight),
        canvasWidth,
        2
      );
      context.fill();

      context.beginPath();
      context.fillStyle = 'black';
      context.rect(
        -2,
        -(canvasHeight),
        2,
        canvasHeight
      );
      context.fill();

      context.beginPath();
      context.fillStyle = 'black';
      context.rect(
        0,
        -2,
        -(canvasWidth),
        2
      );
      context.fill();

      context.beginPath();
      context.fillStyle = 'black';
      context.rect(
        -(canvasWidth),
        0,
        2,
        -(canvasHeight)
      );
      context.fill();

    }

  }
  var chartBorder = new ChartBorder();

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
      )
    }
  }
  var hMidPoint = new HorizontalMidPoint();

  // function HorizontalLines () {
  //   var self = this;
  //   self.color = '#aaaaaa';
  //   self.x = 0;
  //   self.y = 0;
  //   self.width = -(chartX);
  //   self.height = 2;
  //   self.buffer = 20;
  //   self.offset = 80;
  //
  //   self.draw = function (n) {
  //     if(-(n) < -(chartY)) {
  //       return;
  //     }
  //
  //     context.save();
  //     context.beginPath();
  //     context.translate(0, -(canvasHeight * .5));
  //     context.scale(1, window.verticalZoom);
  //     context.translate(0, canvasHeight * .5);
  //     context.fillStyle = 'red';
  //     context.fillRect(
  //       self.x,
  //       -(n) + window.verticalPan,
  //       self.width,
  //       self.height / window.verticalZoom
  //     );
  //     context.restore();
  //
  //     self.draw(n + (self.offset));
  //   }
  // }
  // var hLines = new HorizontalLines();

  // CURRENT PRICE PLACEMENT
  var YaxisPoint = function (pointVal, upperVal, lowerVal) {
    var cHeight = canvasHeight * .9;
    var valRatio = (pointVal - lowerVal) / (upperVal - lowerVal);
    this.pos = (cHeight * valRatio) + (canvasHeight * .05);
  }
  var yPoint = new YaxisPoint(116.44, 130, 100);

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

      context.transform(1, 0, 0, window.verticalZoom, 0, -(canvasHeight * .5));
      context.transform(1, 0, 0, 1, 0, (canvasHeight * .5) - (window.verticalPan));

      context.beginPath();
      context.fillStyle = self.color;
      context.fillRect(
        self.x,
        self.y + (window.verticalPan + window.verticalPan),
        self.width,
        self.height / window.verticalZoom
      );

      context.restore();
    }
  }
  var cPrice = new CurrentPrice();

  function HorizontalLines () {
    var self = this;
    self.color = '#cccccc';
    self.x = 0;
    self.y = 0;
    self.width = -(canvasWidth);
    self.height = 2;
    self.buffer = 20;
    self.offset = canvasHeight / 18;
    self.offsetScale = 1;
    self.midPoint = canvasHeight * .5;

    self.drawUpper = function (n, color) {
      if(n * window.verticalZoom > (canvasHeight * .5) + (window.verticalPan * window.verticalZoom)) {

        if (window.verticalZoom <= .5) {
          self.offsetScale = .5;
        }
        if (window.verticalZoom > .5) {
          self.offsetScale = 1;
        }

        return;
      }

      context.save();
      context.beginPath();

      context.transform(1, 0, 0, window.verticalZoom, 0, -(canvasHeight * .5));
      context.transform(1, 0, 0, 1, 0, (canvasHeight * .5) - (window.verticalPan));


      // context.translate(0, -(canvasHeight * .5));
      // context.scale(1, window.verticalZoom);
      // context.translate(0, canvasHeight * .5);

      context.fillStyle = color;
      context.fillRect(
        self.x,
        -(self.midPoint + n) + (window.verticalPan + window.verticalPan),
        self.width,
        self.height / window.verticalZoom
      );

      context.restore();
      // console.log('n:', n, self.offset, canvasHeight)
      self.drawUpper(n + (self.offset / self.offsetScale), self.color);

    }

    self.drawLower = function (n, color) {

      if (n * window.verticalZoom > (canvasHeight * .5) - (window.verticalPan * window.verticalZoom)) {
        return;
      }

      context.save();
      context.beginPath();

      context.transform(1, 0, 0, window.verticalZoom, 0, -(canvasHeight * .5));
      context.transform(1, 0, 0, 1, 0, (canvasHeight * .5) - (window.verticalPan));

      // context.translate(0, -(canvasHeight * .5));
      // context.scale(1, window.window.verticalZoom);
      // context.translate(0, canvasHeight * .5);

      context.fillStyle = color;
      context.fillRect(
        self.x,
        -(self.midPoint - n) + (window.verticalPan + window.verticalPan),
        self.width,
        self.height / window.verticalZoom
      );

      context.restore();

      self.drawLower(n + (self.offset / self.offsetScale), self.color);

    }
  }
  var hLines = new HorizontalLines();


  function update (elapsed) {
    // UPDATE VALUES
  }

  function render () {
    context.clearRect(0, 0, -(canvasWidth), -(canvasHeight));
    // context.strokeStyle = 'green';
    // context.lineWidth = 15; //1 - non retana display
    // context.strokeRect(0, 0, -(canvasWidth), -(canvasHeight));

    //hLines.draw(0);
    chartBorder.draw();
    //chartArea.draw();
    vLines.draw(0, processDate);
    monthYear.draw(0, processDate);

    hLines.drawUpper((hLines.offset / 2) / hLines.offsetScale, 'lightblue');
    //vMidPoint.draw();
    hLines.drawLower((hLines.offset / 2) / hLines.offsetScale, 'lightblue');
    // hMidPoint.draw();
    //cPrice.draw();
    barDisplay.draw(0, yPointPos, valueRange);
    //testSquare.draw();
  }

  context.translate(canvasWidth, canvasHeight);
};
