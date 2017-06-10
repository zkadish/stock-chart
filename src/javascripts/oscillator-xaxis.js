var horizontalZoom = 1;

(function () {
  'use strict';

  var xaxisContainer = document.querySelector('.xaxis-canvas');
  var mouseDown = false;
  var mousePos = null;

  xaxisContainer.onmousemove = function (e) {
    if (!mouseDown) {
      return;
    }

    if (mousePos) {
      if (mousePos.x > e.clientX) {
        horizontalZoom = horizontalZoom + .01;
      }
      if (mousePos.x < e.clientX) {
        horizontalZoom = horizontalZoom - .01;
      }
    }

    mousePos = {};
    mousePos.x = e.clientX;
  }

  xaxisContainer.onmousedown = function () {
    mouseDown = true;
  }
  xaxisContainer.onmouseup = function () {
    mouseDown = false;
  }

}());

(function () {
  'use strict';

  window.addEventListener('load', eventWindowLoaded, false);
  function eventWindowLoaded () {
    xaxisApp();
  }

  function xaxisApp () {
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



    function VerticalLines () {
      var self = this;
      self.color = '#aaaaaa';
      self.x = 0;
      self.y = 0;
      self.width = 2;
      self.height = -(canvasHeight);
      self.buffer = 20;
      self.offset = 80;
      self.value = 0;
      self.draw = function (n) {
        if (((n * horizontalZoom) + self.buffer) > canvasWidth + (horizontalPan)) {
          self.value = 0;
          return;
        }

        context.save();
        context.beginPath();
        context.translate(0, 0);
        context.scale(horizontalZoom, 1);
        context.translate(0, 0);

        context.fillStyle = 'red';
        context.fillRect(
          -(n + self.buffer - horizontalPan / horizontalZoom),
          self.y,
          self.width / horizontalZoom,
          self.height
        );

        context.restore();

        context.font = 'normal ' + 20 + 'px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(
          self.value,
          -(((n + self.buffer) * horizontalZoom) - (horizontalPan)),
          -(canvasHeight - 20)
        );

        self.value++;
        //self.draw(n + (self.offset + (self.offset * horizontalZoom.toFixed(2))));
        self.draw(n + (self.offset));

      }
    }
    var vLines = new VerticalLines();


    function update (elapsed) {

      //chartArea.width = canvasWidth;
      //chartArea.height = canvasHeight;

      vLines.x = 0;
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
      vLines.draw(0);
      //hLines.draw(0);

    }

    context.translate(canvasWidth, canvasHeight);

  }

}());
