window.verticalZoom = 1;
let scaleDirection = 'down';
let scaling = true;

export default function verticalZoom() {
  const yaxisContainer = document.querySelector('.yaxis-canvas');
  let mouseDown = false;
  let mousePos = null;

  yaxisContainer.onmousemove = (e) => {
    if (!mouseDown) return;
    if (window.verticalZoom <= 0.05) {
      window.verticalZoom = 0.06;
      return;
    }

    if (mousePos) {
      if (mousePos.y > e.clientY) {
        window.verticalZoom += 0.04;
        scaleDirection = 'up';
      }
      if (mousePos.y < e.clientY) {
        window.verticalZoom -= 0.04;
        scaleDirection = 'down';
      }
    }

    mousePos = {};
    mousePos.y = e.clientY;
  };

  yaxisContainer.onmousedown = () => {
    mouseDown = true;
    scaling = true;
  };

  yaxisContainer.onmouseup = () => {
    mouseDown = false;
    scaling = false;
  };
}
