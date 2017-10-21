window.horizontalZoom = 1;
// isScaling will be used for dynamicaly changing horizontal grid line chart
// values when the sapcing is to great or too small to displau values
// let isScaling = false;

export default function HorizontalZoom() {
  const xAxisContainer = document.querySelector('.xaxis-canvas');
  let mousePos = null;

  function mousemoveHandler(e) {
    if (mousePos) {
      if (mousePos.x > e.clientX) {
        window.horizontalZoom += 0.01;
      }
      if (mousePos.x < e.clientX) {
        window.horizontalZoom -= 0.01;
      }
    }

    mousePos.x = e.clientX;
  }

  function mouseupHandler() {
    document.removeEventListener('mousemove', mousemoveHandler);
    document.removeEventListener('mouseup', mouseupHandler);
  }

  xAxisContainer.onmousedown = function mousedownHandler(e) {
    mousePos = {};
    mousePos.x = e.clientX;
    document.addEventListener('mousemove', mousemoveHandler, false);
    document.addEventListener('mouseup', mouseupHandler, false);
  };
}
