window.horizontalZoom = 1;
var isScaling = false;

export default function HorizontalZoom () {
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
        window.horizontalZoom = window.horizontalZoom + .01;
      }
      if (mousePos.x < e.clientX) {
        window.horizontalZoom = window.horizontalZoom - .01;
      }
    }

    mousePos = {};
    mousePos.x = e.clientX;
    console.log('mousemove')
  }

  xaxisContainer.onmousedown = function () {
    mouseDown = true;
    isScaling = true;
  }

  xaxisContainer.onmouseup = function () {
    mouseDown = false;
    isScaling = false;
  }
};