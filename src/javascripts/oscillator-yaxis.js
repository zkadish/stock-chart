var verticalZoom = 1;
var scaleDirection = 'down';
var scaling = true;

(function () {
  'use strict';

  var yaxisContainer = document.querySelector('.yaxis-canvas');
  var mouseDown = false;
  var mousePos = null;

  yaxisContainer.onmousemove = function (e) {
    if (!mouseDown) {
      return;
    }

    if (mousePos) {
      if (mousePos.y > e.clientY) {
        verticalZoom = verticalZoom + .04;
        scaleDirection = 'up';
      }
      if (mousePos.y < e.clientY) {
        verticalZoom = verticalZoom - .04;
        scaleDirection = 'down';
      }
    }

    mousePos = {};
    mousePos.y = e.clientY;
  }

  yaxisContainer.onmousedown = function () {
    mouseDown = true;
    scaling = true;
  }
  yaxisContainer.onmouseup = function () {
    mouseDown = false;
    scaling = false;
  }

}());

(function () {
  'use strict';

  window.addEventListener('load', eventWindowLoaded, false);
  function eventWindowLoaded () {
    yaxisApp();
  }

  function yaxisApp () {
    var canvasContainer = document.querySelector('.yaxis-container');
    var containerRect = canvasContainer.getBoundingClientRect();
    var canvas = document.querySelector('.yaxis-canvas');
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

    // function HorizontalLines () {
    //   var self = this;
    //   self.color = '#aaaaaa';
    //   self.x = 0;
    //   self.y = 0;
    //   self.width = -(canvasWidth);
    //   self.height = 2;
    //   self.buffer = 20;
    //   self.offset = 80;
    //   self.vScale = verticalZoom;
    //
    //   self.draw = function (n) {
    //     if(-(n) < -(canvasHeight)) {
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
    //     context.save();
    //     context.translate(0, -(canvasHeight * .5));
    //     context.translate(0, canvasHeight * .5);
    //     context.font = 'normal ' + 20 + 'px Arial';
    //     context.textBaseline = 'middle';
    //     context.fillText('10', -(canvasWidth - 20), -(n * verticalZoom))
    //
    //     context.restore();
    //
    //
    //     self.draw(n + (self.offset));
    //   }
    // }
    // var hLines = new HorizontalLines();

    function HorizontalUpperRange () {
      var self = this;
      self.color = '#aaaaaa';
      self.x = 0;
      self.y = -(canvasHeight * .95);
      self.width = -(canvasWidth);
      self.height = 1.5;
      self.draw = function () {
        context.beginPath();
        context.fillStyle = 'black';
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
        context.fillStyle = 'black';
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
        context.fillStyle = 'black';
        context.fillRect(
          self.x,
          self.y,
          self.width,
          self.height
        );
      }
    }
    var hLowerRange = new HorizontalLowerRange();

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
      self.upperVal = 50;
      self.lowerVal = 40;

      self.drawUpper = function (n, color) {
        //console.log(direction);
        if (n * verticalZoom > (canvasHeight * .5) + (verticalPan)) {
          self.upperVal = 50;
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

        context.font = 'normal ' + 20 + 'px Arial';
        context.textBaseline = 'middle';
        context.fillText(
          self.upperVal,
          -(canvasWidth - 20),
          -((n * verticalZoom) + self.midPoint - (verticalPan))
        );

        self.upperVal = self.upperVal + 10;
        self.drawUpper(n + (self.offset), 'green');

      }

      self.drawLower = function (n, color) {
        if(n * verticalZoom > (canvasHeight * .5) - (verticalPan)) {
          self.lowerVal = 40;
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

        context.font = 'normal ' + 20 + 'px Arial';
        context.textBaseline = 'middle';
        context.fillText(
          self.lowerVal,
          -(canvasWidth - 20),
          ((n * verticalZoom) - self.midPoint + (verticalPan))
        );

        self.lowerVal = self.lowerVal - 10;
        self.drawLower(n + (self.offset), 'green');
      }

    }
    var hLines = new HorizontalLines();



    function update (elapsed) {

      //chartArea.width = canvasWidth;
      //chartArea.height = canvasHeight;

      //vLines.x = 0;
      //vLines.y = canvasHeight;
      //vLines.height = -(canvasHeight);
      //vLines.offset = vLines.offset + 1;

      //hLines.x = canvasWidth;
      //hLines.y = canvasHeight;
      //hLines.width = -(canvasWidth);

      //context.scale(1.005, 1);
      //context.translate(100, 100);

    }

    function draw () {
      context.clearRect(0, 0, -(canvasWidth), -(canvasHeight));

      //chartArea.draw();
      //vLines.draw(0);
      hUpperRange.draw();
      hLines.drawUpper(hLines.offset * .5, 'red');
      hMidPoint.draw();
      hLines.drawLower(hLines.offset * .5, 'red');
      hLowerRange.draw();
      //hLines.draw(0);

    }

    context.translate(canvasWidth, canvasHeight);

  }

}());
