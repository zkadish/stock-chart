window.horizontalZoom = 1;
// isScaling will be used for dynamicaly changing horizontal grid line chart
// values when the sapcing is to great or too small to displau values
// let isScaling = false;

export default function HorizontalZoom() {
  const xaxisContainer = document.querySelector('.xaxis-canvas');
  let mouseDown = false;
  let mousePos = null;

  xaxisContainer.onmousemove = function (e) {
    if (!mouseDown) {
      return;
    }

    if (mousePos) {
      if (mousePos.x > e.clientX) {
        window.horizontalZoom += 0.01;
      }
      if (mousePos.x < e.clientX) {
        window.horizontalZoom -= 0.01;
      }
    }

    mousePos = {};
    mousePos.x = e.clientX;
  };

  xaxisContainer.onmousedown = function () {
    mouseDown = true;
    // isScaling = true;
  };

  xaxisContainer.onmouseup = function () {
    mouseDown = false;
    // isScaling = false;
  };
}
