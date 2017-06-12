import moment from 'moment';

export default function xAxisCanvas (priceData) {
  var canvasContainer = document.querySelector('.xaxis-container');
  var containerRect = canvasContainer.getBoundingClientRect();
  var canvas = document.querySelector('.xaxis-canvas');
  var context = canvas.getContext('2d');
  var lastUpdate = null;

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

    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);

    canvas.style.width = canvasWidth * .5 + 'px';
    canvas.style.height = canvasHeight * .5 + 'px';

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
      draw();
    } else {
      lastUpdate = now;
    }

    loopCount++;
    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);

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
    //console.log(day);
    return dateObj;
  }

  function VerticalLines () {
    var self = this;
    var i = 0;

    self.color = '#cccccc';
    self.x = 0;
    self.y = 0;
    self.width = 2;
    self.height = 15;
    self.buffer = 30;
    self.offset = 40;
    self.value = 0;
    self.draw = function (n, date) {
      if (i >= priceData.length - 1) {
        i = 0;
        return;
      }
      if (((n + self.buffer) * horizontalZoom) > canvasWidth + (horizontalPan * horizontalZoom)) {
        i = 0;
        self.value = 0;
        return;
      }

      context.save();

      context.beginPath();
      context.scale(horizontalZoom, 1);
      context.translate(horizontalPan, 0);

      context.fillStyle = self.color;
      context.fillRect(
        -(n + self.buffer),
        -(canvasHeight),
        self.width / horizontalZoom,
        self.height
      );

      context.restore();

      var week = date(priceData[i].Date).week;

      if (date(priceData[i].Date).week != date(priceData[i + 1].Date).week) {

        context.font = 'normal ' + 20 + 'px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(
          date(priceData[i].Date).day,
          -(((n + self.buffer) * horizontalZoom) - (horizontalPan * horizontalZoom)),
          -(canvasHeight - 30)
        );

      }

      i++;
      self.value++;
      self.draw(n + (self.offset), date);
    }
  }
  var vLines = new VerticalLines();


  function update () {
    // UPDATE VALUES
  }

  function draw () {
    context.clearRect(0, 0, -(canvasWidth), -(canvasHeight));
    vLines.draw(0, processDate);
  }

  context.translate(canvasWidth, canvasHeight);
};
