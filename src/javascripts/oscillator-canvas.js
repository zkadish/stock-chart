var horizontalPan = 0;
var verticalPan = 0;
var panning = false;

var distLeft = 0;
var distRight = 0;
var distUp = 0;
var distDown = 0;

(function () {
  'use strict';

  var canvasContainer = document.querySelector('.chart-canvas');
  var mouseDown = false;
  var mousePos = null;

  canvasContainer.onmousemove = function (e) {
    if (!mouseDown) {
      return;
    }

    if (mousePos) {
      if (mousePos.x > e.clientX) {
        distLeft = (mousePos.x - e.clientX) * 2;

        horizontalPan = horizontalPan - distLeft;
        //horizontalPan = horizontalPan - 16;
      }

      if (mousePos.x < e.clientX) {
        distRight = (mousePos.x - e.clientX) * -2;

        horizontalPan = horizontalPan + distRight;
        //horizontalPan = horizontalPan - 16;
      }

      if (mousePos.y > e.clientY) {
        distUp = (mousePos.y - e.clientY) * 2;

        verticalPan = verticalPan - distUp;
        //verticalPan = verticalPan - 8;
      }

      if (mousePos.y < e.clientY) {
        distDown = (mousePos.y - e.clientY) * -2;

        verticalPan = verticalPan + distDown;
        //verticalPan = verticalPan + 8;
      }
    }

    mousePos = {};
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  };

  canvasContainer.onmousedown = function () {
    mouseDown = true;
    panning = true;
  };
  canvasContainer.onmouseup = function () {
    mousePos = null;

    mouseDown = false;
    panning = false;
  };

}());

(function () {
  'use strict';

  window.addEventListener('load', eventWindowLoaded, false);
  function eventWindowLoaded () {
    canvasApp();
  }

  function canvasApp () {
    var canvasContainer = document.querySelector('.chart-container');
    var containerRect = canvasContainer.getBoundingClientRect();
    var canvas = document.querySelector('.chart-canvas');
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
      //debugger;
      containerRect = canvasContainer.getBoundingClientRect();
      canvasWidth = containerRect.width * 2;
      canvasHeight = containerRect.height * 2;

      canvas.setAttribute('width', canvasWidth);
      canvas.setAttribute('height', canvasHeight);

      canvas.style.width = canvasWidth * .5 + 'px';
      canvas.style.height = canvasHeight * .5 + 'px';

      context.translate(canvasWidth, canvasHeight);

      // loopCount = 0;
      // loop();
    }
    document.addEventListener('window:onresize:event', windowOnResizeHandler, false);

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

    function ChartArea () {
      var self = this;
      self.color = '#aaaaaa';
      self.x = 0;
      self.y = 0;
      self.width = -(canvasWidth);
      self.height = -(canvasHeight);
      self.draw = function () {
        context.beginPath();
        //context.scale(1, 1);
        context.strokeStyle = 'red';
        context.lineWidth = 1.5; //1 - non retana display
        context.strokeRect(
          self.x,
          self.y,
          self.width,
          self.height
        );
      }
    }
    var chartArea = new ChartArea();

    function VerticalLines () {
      var self = this;
      self.color = '#aaaaaa';
      self.x = 0;
      self.y = 0;
      self.width = 2;
      self.height = -(canvasHeight);
      self.buffer = 20;
      self.offset = 80;
      self.draw = function (n) {
        if (((n * horizontalZoom) + self.buffer) > canvasWidth + (horizontalPan)) {
          return;
        }

        context.save();
        context.beginPath();
        context.translate(0, 0);
        context.scale(horizontalZoom, 1);
        context.translate(0, 0);

        context.fillStyle = 'red';
        context.fillRect(
          -(n + self.buffer - (horizontalPan / horizontalZoom)),
          self.y,
          self.width / horizontalZoom,
          self.height
        );

        context.restore();

        //self.draw(n + (self.offset + (self.offset * horizontalZoom.toFixed(2))));
        self.draw(n + (self.offset));

      }
    }
    var vLines = new VerticalLines();

    // function TestSquare () {
    //   var self = this;
    //   self.color = 'blue';
    //   self.x = canvasWidth;
    //   self.y = canvasHeight;
    //   self.width = 50;
    //   self.height = 50;
    //   self.draw = function () {
    //     context.save();
    //     context.beginPath();
    //     context.translate(-(self.x * .5), -(self.y * .5));
    //     context.scale(3, 3);
    //     context.translate(self.x * .5, self.y * .5);
    //     context.fillStyle = self.color;
    //     context.fillRect(
    //       -((self.x * .5) + (self.width * .5)),
    //       -((self.y * .5) + (self.height * .5)),
    //       self.width,
    //       self.height
    //     );
    //     context.restore();
    //   }
    // }
    // var testSquare = new TestSquare();

    function VerticalMidPoint () {
      var self = this;
      self.color = '#aaaaaa';
      self.x = -(canvasWidth * .5);
      self.y = 0;
      self.width = 2;
      self.height = -(canvasHeight);
      self.draw = function () {
        context.beginPath();
        context.fillStyle = 'black';
        context.rect(
          self.x,
          self.y,
          self.width,
          self.height
        );
        context.fill();
      }
    }
    var vMidPoint = new VerticalMidPoint();

    function HorizontalMidPoint () {
      var self = this;
      self.color = '#aaaaaa';
      self.x = 0;
      self.y = -(canvasHeight * .5);
      self.width = -(canvasWidth);
      self.height = 2;
      self.draw = function () {
        context.beginPath();
        context.fillStyle = 'black';
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
    //     context.scale(1, verticalZoom);
    //     context.translate(0, canvasHeight * .5);
    //     context.fillStyle = 'red';
    //     context.fillRect(
    //       self.x,
    //       -(n) + verticalPan,
    //       self.width,
    //       self.height / verticalZoom
    //     );
    //     context.restore();
    //
    //     self.draw(n + (self.offset));
    //   }
    // }
    // var hLines = new HorizontalLines();

    function HorizontalLines () {
      var self = this;
      self.color = '#aaaaaa';
      self.x = 0;
      self.y = 0;
      self.width = -(canvasWidth);
      self.height = 2;
      self.buffer = 20;
      self.offset = 80;
      self.midPoint = canvasHeight * .5;

      self.drawUpper = function (n, color) {
        if(n * verticalZoom > (canvasHeight * .5) + (verticalPan)) {
          return;
        }

        context.save();
        context.beginPath();
        context.translate(0, -(canvasHeight * .5));
        context.scale(1, verticalZoom);
        context.translate(0, canvasHeight * .5);

        context.fillStyle = color;
        context.fillRect(
          self.x,
          -(self.midPoint + n) + (verticalPan / verticalZoom),
          self.width,
          self.height / verticalZoom
        );

        context.restore();

        self.drawUpper(n + (self.offset), 'green');

      }

      self.drawLower = function (n, color) {

        if (n * verticalZoom > (canvasHeight * .5) - (verticalPan)) {
          return;
        }

        context.save();
        context.beginPath();
        context.translate(0, -(canvasHeight * .5));
        context.scale(1, verticalZoom);
        context.translate(0, canvasHeight * .5);

        context.fillStyle = color;
        context.fillRect(
          self.x,
          -(self.midPoint - n) + (verticalPan / verticalZoom),
          self.width,
          self.height / verticalZoom
        );

        context.restore();

        self.drawLower(n + (self.offset), 'green');

      }
    }
    var hLines = new HorizontalLines();


    //context.scale(1, 1);
    // UPDATE VALUES
    function update (elapsed) {

    }

    function draw () {
      context.clearRect(0, 0, -(canvasWidth), -(canvasHeight));
      // context.strokeStyle = 'green';
      // context.lineWidth = 15; //1 - non retana display
      // context.strokeRect(0, 0, -(canvasWidth), -(canvasHeight));

      chartArea.draw();
      vLines.draw(0);

      hLines.drawUpper(hLines.offset * .5, 'red');
      vMidPoint.draw();
      hLines.drawLower(hLines.offset * .5, 'red');

      //hLines.draw(0);
      hMidPoint.draw();

      //testSquare.draw();
    }

    context.translate(canvasWidth, canvasHeight);

  }

}());
