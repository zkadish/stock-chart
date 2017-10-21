window.verticalZoom = 1;

export default function verticalZoom() {
  const yAxisContainer = document.querySelector('.yaxis-canvas');
  let mousePos = null;

  function mousemoveHandler(e) {
    if (window.verticalZoom <= 0.05) {
      window.verticalZoom = 0.06;
      return;
    }

    if (mousePos.y > e.clientY) {
      window.verticalZoom += 0.04;
    }
    if (mousePos.y < e.clientY) {
      window.verticalZoom -= 0.04;
    }

    mousePos.y = e.clientY;
  }

  function mouseupHandler() {
    document.removeEventListener('mousemove', mousemoveHandler);
    document.removeEventListener('mouseup', mouseupHandler);
  }

  yAxisContainer.onmousedown = function mousedownHandler(e) {
    mousePos = {};
    mousePos.y = e.clientY;
    document.addEventListener('mousemove', mousemoveHandler, false);
    document.addEventListener('mouseup', mouseupHandler, false);
  };
}
