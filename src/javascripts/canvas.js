import moment from 'moment';
// import yAxisCanvas from 'javascripts/chart-yaxis';

// LOOP FUNCTION


export default class chartCanvas {
  constructor(priceData) {
    // debugger;
    this.priceData = priceData;
    this.canvasContainer = document.querySelector('.chart-container');

    this.containerRect = this.canvasContainer.getBoundingClientRect();
    this.canvas = document.querySelector('.chart-canvas');
    this.context = this.canvas.getContext('2d');

    // constants
    this.loopCount = 0;
    this.hGridLines = 10; //18
    this.chartUpperVal = null;
    this.chartLowerVal = null;

    // *2 to scale up canvas for retna display
    this.canvasWidth = this.containerRect.width * 2;
    this.canvasHeight = this.containerRect.height * 2;

    this.canvas.setAttribute('width', this.canvasWidth);
    this.canvas.setAttribute('height', this.canvasHeight);

    this.canvas.style.width = this.canvasWidth * .5 + 'px';
    this.canvas.style.height = this.canvasHeight * .5 + 'px';

    this.yPointPos = this.yPointPos.bind(this);
    this.valueRange = this.valueRange.bind(this);

    document.addEventListener('window:onresize', this.windowOnResizeHandler, false);
  }

  windowOnResizeHandler () {
    this.containerRect = this.canvasContainer.getBoundingClientRect();
    this.canvasWidth = this.containerRect.width * 2;
    this.canvasHeight = this.containerRect.height * 2;

    this.canvas.style.width = this.canvasWidth * .5 + 'px';
    this.canvas.style.height = this.canvasHeight * .5 + 'px';

    this.context.translate(canvasWidth, canvasHeight);
  }

  roundOffVals (upperVal, lowerVal) {
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

    this.chartUpperVal = this.chartUpperVal + (range - (Math.ceil(upperVal) - Math.floor(lowerVal))) / 2;
    this.chartLowerVal = this.chartLowerVal - (range - (Math.ceil(upperVal) - Math.floor(lowerVal))) / 2;
    // console.log('range', this.chartUpperVal, this.chartLowerVal);
    // debugger;
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // Y POSITION - BAR DATA
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  yPointPos (pointVal, upperVal, lowerVal) {
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
    var yPos = (cHeight * valRatio) + (this.canvasHeight * ((1 / this.hGridLines) / 2));
    return yPos;
  }

  // ********************************************
  // Get the high and low values of the data set
  // ********************************************
  setRange(priceData, chartVal, upper) {
    let prop = null;
    let val = null;
    upper ? prop = 'chartUpperVal' : prop = 'chartLowerVal';
    if (!chartVal) {
      this[prop] = upper ? priceData.High : priceData.Low;
      return;
    }
    if (upper && priceData.High > this[prop]) {
      this[prop] = Math.ceil(priceData.High);
      return;
    }
    if (!upper && priceData.Low < this[prop]) {
      this[prop] = Math.ceil(priceData.Low);
    }
  };
  valueRange (priceData, chartUpperVal, chartLowerVal) {
    this.setRange(priceData, chartUpperVal, true);
    this.setRange(priceData, chartLowerVal, false);
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // BAR DISPLAY
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  BarData (n, yPos, vRange, i) {
    // var self = this;
    // var i = 0;

    const color = '#aaaaaa';
    const x = 0;
    const y = 0;
    const width = 6;
    const height = 40;
    const buffer = 30;
    const offset = 40;
    // self.draw = function (n, yPos, vRange) {
      if (i >= this.priceData.length) {
        i = 0;
        return;
      }
      if (((n + buffer) * window.horizontalZoom) > this.canvasWidth + (window.horizontalPan * window.horizontalZoom)) {
        i = 0;
        // console.log(chartUpperVal, chartLowerVal);
        var priceValueRange = new CustomEvent('pricevalue:range', {
          detail: {
            chartUpperVal: this.chartUpperVal,
            chartLowerVal: this.chartLowerVal
          }
        });
        document.dispatchEvent(priceValueRange);
        // why? not sure I need to be rounding the values anymore...
        // this.roundOffVals(this.chartUpperVal, this.chartLowerVal);
        return;
      }
      // debugger;
      vRange(this.priceData[i], this.chartUpperVal, this.chartLowerVal);
      // debugger;
      var barHighPos = yPos(this.priceData[i].High, this.chartUpperVal, this.chartLowerVal);
      var barLowPos = yPos(this.priceData[i].Low, this.chartUpperVal, this.chartLowerVal);
      var barOpenPos = yPos(this.priceData[i].Open, this.chartUpperVal, this.chartLowerVal);
      var barClosePos = yPos(this.priceData[i].Close, this.chartUpperVal, this.chartLowerVal);
      // console.log(barHighPos, this.priceData[i].High);
      // debugger;

      this.context.save();
      this.context.beginPath();
      this.context.translate(0,  -(this.canvasHeight * .5));
      this.context.scale(window.horizontalZoom, window.verticalZoom);
      this.context.translate(0, this.canvasHeight * .5);

      this.context.translate(-(n + buffer - (window.horizontalPan)), 0);
      this.context.scale(window.horizontalZoom, 1);

      this.context.translate((n + buffer - (window.horizontalPan)), 0);

      // draw bar
      // this.context.save();
      this.context.fillStyle = 'black';
      this.context.fillRect(
        -((n + buffer + ((6 * window.horizontalZoom) * .5) - .5) - ((window.horizontalPan))),
        -(barHighPos) + (window.verticalPan),
        width * window.horizontalZoom,
        (barHighPos - barLowPos)
      );
      // this.context.restore();
      // debugger;

      // draw open
      this.context.fillStyle = 'black';
      this.context.fillRect(
        -((n + buffer)) + (((6 * window.horizontalZoom) * .5) + .5) + ((window.horizontalPan)),
        -(barOpenPos) + (window.verticalPan),
        -((10 * window.horizontalZoom) + (((6 * window.horizontalZoom) * .5) + .5)),
        (5 * (window.horizontalZoom * window.horizontalZoom * window.horizontalZoom)) / window.verticalZoom
      );

      // draw close
      this.context.fillStyle = 'black';
      this.context.fillRect(
        -((n + buffer)) - (((6 * window.horizontalZoom) * .5) - .5) + ((window.horizontalPan)),
        -(barClosePos) + (window.verticalPan),
        ((10 * window.horizontalZoom) + (((6 * window.horizontalZoom) * .5) - .5)),
        (5 * (window.horizontalZoom * window.horizontalZoom * window.horizontalZoom)) / window.verticalZoom
      );

      this.context.restore();

      i++;
      this.BarData(n + offset, yPos, vRange, i)
    // }

  }
  // var barDisplay = new BarData();

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // process date info from bar data
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  processDate (date) {
    var dateArray = moment(date).format('YYYY-MMM-DD-ddd-ww').split('-');
    var dateObj = {};
    dateObj.year = dateArray[0];
    dateObj.month = dateArray[1];
    dateObj.day = dateArray[2].replace(/^0/, '');
    dateObj.weekDay = dateArray[3];
    dateObj.week = dateArray[4];
    return dateObj;
  }

  MonthYear (n, date, i) {
    // var self = this;
    // var i = 0;

    const color = '#000';
    // self.x = 0;
    // self.y = 0;
    const buffer = 30;
    const offset = 40;

    // self.draw = function (n, date) {
      if (i >= this.priceData.length - 1) {
        i = 0;
        return;
      }
      if (((n + buffer) * window.horizontalZoom) > (this.canvasWidth) + (window.horizontalPan * window.horizontalZoom)) {
        i = 0;
        return;
      }

      if (date(this.priceData[i].Date).month != date(this.priceData[i + 1].Date).month) {
        this.context.font = 'normal ' + 20 + 'px Arial';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillStyle = color;
        this.context.fillText(
          date(this.priceData[i].Date).month,
          -(((n + buffer) * window.horizontalZoom) - (window.horizontalPan * window.horizontalZoom)),
          -20
        );
      }

      i++;
      this.MonthYear((n + offset), date, i);
    // }
  }
  // var monthYear = new MonthYear();

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // VERTICAL GRID LINES
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  VerticalLines (n, date, i) {
    var color = '#ccc';
    // // self.x = 0;
    var y = 0;
    var width = 2;
    var height = -(this.canvasHeight);
    // var height = this.canvasHeight;
    var buffer = 30;
    var offset = 40;
    // self.draw = function (n, date) {
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
        this.context.translate(-(window.horizontalPan), 0)
        this.context.scale((window.horizontalZoom), 1);
        this.context.translate((window.horizontalPan), 0)
        
        this.context.fillStyle = color;
        this.context.rect(
          -((n + buffer)),
          y,
          width / window.horizontalZoom,
          height
        );
        this.context.fill();
        this.context.restore();
      }

      if (date(this.priceData[i].Date).month != date(this.priceData[i + 1].Date).month) {
        this.context.save();
        this.context.beginPath();

        this.context.translate(window.horizontalPan, 0);
        this.context.translate(-(window.horizontalPan), 0)
        this.context.scale((window.horizontalZoom), 1);
        this.context.translate((window.horizontalPan), 0)

        this.context.fillStyle = color;
        this.context.fillRect(
          // -((n + buffer) - window.horizontalPan),
          -((n + buffer)),
          y,
          width / window.horizontalZoom,
          height
        );
        this.context.restore();
      }

      i++;
      this.VerticalLines((n + offset), date, i);
      // self.draw((n + self.offset), date);
    // }
  }
  // var vLines = new VerticalLines();

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // CHART border
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  ChartBorder () {
    var color = 'black';
      // self.draw = function () {
      
      this.context.beginPath();
      this.context.fillStyle = color;
      this.context.rect(
        -(this.canvasWidth),
        -(this.canvasHeight),
        this.canvasWidth,
        2
      );
      this.context.fill();

      this.context.beginPath();
      this.context.fillStyle = color;
      this.context.rect(
        -2,
        -(this.canvasHeight),
        2,
        this.canvasHeight
      );
      this.context.fill();

      this.context.beginPath();
      this.context.fillStyle = color;
      this.context.rect(
        0,
        -2,
        -(this.canvasWidth),
        2
      );
      this.context.fill();

      this.context.beginPath();
      this.context.fillStyle = color;
      this.context.rect(-(this.canvasWidth), 0, 2, -(this.canvasHeight));
      this.context.fill();
    // }
  }
  // var chartBorder = new ChartBorder();

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
      )
    }
  }
  // var hMidPoint = new HorizontalMidPoint();

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
  YaxisPoint (pointVal, upperVal, lowerVal) {
    var cHeight = canvasHeight * .9;
    var valRatio = (pointVal - lowerVal) / (upperVal - lowerVal);
    this.pos = (cHeight * valRatio) + (canvasHeight * .05);
  }
  // var yPoint = new YaxisPoint(116.44, 130, 100);

  // CURRENT PRICE DISPLAY
  CurrentPrice () {
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
  // var cPrice = new CurrentPrice();

  upperHorizontalLines (n = ((this.canvasHeight/this.hGridLines)/2)/1) {
    // var self = this;
    const color = '#cccccc';
    const x = 0;
    // self.y = 0;
    const width = -(this.canvasWidth);
    const height = 2;
    // self.buffer = 20;
    const offset = this.canvasHeight / this.hGridLines;
    let offsetScale = 1;
    const midPoint = this.canvasHeight * .5;

    // self.drawUpper = function (n, color) {
      if(n * window.verticalZoom > (this.canvasHeight * .5) + (window.verticalPan * window.verticalZoom)) {

        if (window.verticalZoom <= .5) {
          offsetScale = .5;
        }
        if (window.verticalZoom > .5) {
          offsetScale = 1;
        }

        return;
      }

      this.context.save();
      this.context.beginPath();

      this.context.transform(1, 0, 0, window.verticalZoom, 0, -(this.canvasHeight * .5));
      this.context.transform(1, 0, 0, 1, 0, (this.canvasHeight * .5) - (window.verticalPan));

      // context.translate(0, -(canvasHeight * .5));
      // context.scale(1, window.verticalZoom);
      // context.translate(0, canvasHeight * .5);

      this.context.fillStyle = color;
      this.context.fillRect(
        x,
        -(midPoint + n) + (window.verticalPan + window.verticalPan),
        width,
        height / window.verticalZoom
      );

      this.context.restore();
      // console.log('n:', n, self.offset, canvasHeight)
      this.upperHorizontalLines(n + (offset / offsetScale));

    // }
  }

  lowerHorizontalLines (n = ((this.canvasHeight/this.hGridLines)/2)/1) {
    // var self = this;
    const color = '#cccccc';
    const x = 0;
    // self.y = 0;
    const width = -(this.canvasWidth);
    const height = 2;
    // self.buffer = 20;
    const offset = this.canvasHeight / this.hGridLines;
    let offsetScale = 1;
    const midPoint = this.canvasHeight * .5;

    // self.drawLower = function (n, color) {

      if (n * window.verticalZoom > (this.canvasHeight * .5) - (window.verticalPan * window.verticalZoom)) {
        return;
      }

      this.context.save();
      this.context.beginPath();

      this.context.transform(1, 0, 0, window.verticalZoom, 0, -(this.canvasHeight * .5));
      this.context.transform(1, 0, 0, 1, 0, (this.canvasHeight * .5) - (window.verticalPan));

      // context.translate(0, -(canvasHeight * .5));
      // context.scale(1, window.window.verticalZoom);
      // context.translate(0, canvasHeight * .5);

      this.context.fillStyle = color;
      this.context.fillRect(
        x,
        -(midPoint - n) + (window.verticalPan + window.verticalPan),
        width,
        height / window.verticalZoom
      );

      this.context.restore();

      this.lowerHorizontalLines(n + (offset / offsetScale));
    }
  // }
  // context.translate(canvasWidth, canvasHeight);
};
