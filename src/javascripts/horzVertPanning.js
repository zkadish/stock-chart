window.horizontalPan = 0;
window.verticalPan = 0;
window.panning = false;

var distLeft = 0;
var distRight = 0;
var distUp = 0;
var distDown = 0;

function mouseCordinates (e) {
  'use strict';

  var canvasContainer = document.querySelector('.chart-canvas');
  var containerRect = canvasContainer.getBoundingClientRect();
  var offsetLeft = 0;
  var offsetTop = 0;
  var mx = 0;
  var my = 0;

  function offset (canvasContainer) {
    if (!canvasContainer.parentNode) {
      return;
    }

    offsetLeft = offsetLeft + canvasContainer.offsetLeft;
    offsetTop = offsetTop + canvasContainer.offsetTop;

    offset(canvasContainer = canvasContainer.parentNode);
  }
  offset(canvasContainer);

  mx = (containerRect.width - 1) - (e.clientX - offsetLeft);
  my = (containerRect.height - 1) - (e.clientY - offsetTop);
};

export default function () {
  'use strict';

  var canvasContainer = document.querySelector('.chart-canvas');
  var mouseDown = false;
  var mousePos = null;

  canvasContainer.onmousemove = function (e) {

    mouseCordinates(e);

    if (!mouseDown) {
      return;
    }

    if (mousePos) {
      if (mousePos.x > e.clientX) {
        distLeft = ((mousePos.x - e.clientX) * 2) / window.horizontalZoom;

        window.horizontalPan = window.horizontalPan - distLeft;
        //horizontalPan = horizontalPan - 16;
      }

      if (mousePos.x < e.clientX) {
        distRight = ((mousePos.x - e.clientX) * -2) / window.horizontalZoom;

        window.horizontalPan = window.horizontalPan + distRight;
        //horizontalPan = horizontalPan - 16;
      }

      if (mousePos.y > e.clientY) {
        distUp = ((mousePos.y - e.clientY) * 2) / window.verticalZoom;

        window.verticalPan = window.verticalPan - distUp;
        //verticalPan = verticalPan - 8;
      }

      if (mousePos.y < e.clientY) {
        distDown = ((mousePos.y - e.clientY) * -2) / window.verticalZoom;

        window.verticalPan = window.verticalPan + distDown;
        //verticalPan = verticalPan + 8;
      }
    }

    mousePos = {};
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  };

  canvasContainer.onmousedown = function () {
    mouseDown = true;
    window.panning = true;
  };

  canvasContainer.onmouseup = function () {
    mousePos = null;

    mouseDown = false;
    window.panning = false;
  };
}