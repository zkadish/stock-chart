window.horizontalPan = 0;
window.verticalPan = 0;
// TODO: check to see if window.panning is being used
window.panning = false;

let panLeft = 0;
let panRight = 0;
let panUp = 0;
let panDown = 0;

export default function panChart() {
  const chartCanvas = document.querySelector('.chart-canvas');
  let mousePos = null;

  // Account for canvas dimensions being multiplied by 2
  function mousemoveHandler(e) {
    window.panning = true;
    if (mousePos.x > e.clientX) {
      panLeft = ((mousePos.x - e.clientX) * 2) / window.horizontalZoom;
      window.horizontalPan -= panLeft;
    }

    if (mousePos.x < e.clientX) {
      panRight = ((mousePos.x - e.clientX) * -2) / window.horizontalZoom;
      window.horizontalPan += panRight;
    }

    if (mousePos.y > e.clientY) {
      panUp = ((mousePos.y - e.clientY) * 2) / window.verticalZoom;
      window.verticalPan -= panUp;
    }

    if (mousePos.y < e.clientY) {
      panDown = ((mousePos.y - e.clientY) * -2) / window.verticalZoom;
      window.verticalPan += panDown;
    }

    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  }

  function mouseupHandler() {
    document.removeEventListener('mousemove', mousemoveHandler);
    document.removeEventListener('mouseup', mouseupHandler);
    window.panning = false;
    mousePos = null;
  }

  chartCanvas.onmousedown = function onmousedownHandler(e) {
    mousePos = {};
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    document.addEventListener('mousemove', mousemoveHandler, false);
    document.addEventListener('mouseup', mouseupHandler, false);
  };
}
