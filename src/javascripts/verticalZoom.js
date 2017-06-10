window.verticalZoom = 1;
var scaleDirection = 'down';
var scaling = true;

export default function verticalZoom () {
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
        window.verticalZoom = window.verticalZoom + .04;
        scaleDirection = 'up';
      }
      if (mousePos.y < e.clientY) {
        window.verticalZoom = window.verticalZoom - .04;
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
}