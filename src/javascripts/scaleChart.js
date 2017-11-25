window.zoom = 100;
window.verticalZoom = 1;
window.verticalBarZoom = 1;
let scaling = '';

let lockOneUp = false;
let lockTwoUp = false;
let lockThreeUp = false;
let lockFourUp = false;
let lockFiveUp = false;
let lockSixUp = false;
let lockSevenUp = false;

let lockOneDown = false;
let lockTwoDown = false;
let lockThreeDown = false;
let lockFourDown = false;
let lockFiveDown = false;
let lockSixDown = false;
let lockSevenDown = false;
let lockEightDown = false;

const lock = {
  oneUp: false,
  twoUp: false,
  threeUp: false,
  fourUp: false,
  fiveUp: false,
  sixUp: false,
  sevenUp: false,
  oneDown: false,
  twoDown: false,
  threeDown: false,
  fourDown: false,
  fiveDown: false,
  sixDown: false,
  sevenDown: false,
  eightDown: false,
};

export function vZoomReset() {
  Object.keys(lock).forEach((prop) => {
    if (prop.includes('one')) {
      lock[prop] = true;
    } else {
      lock[prop] = false;
    }
  });

  lockOneUp = true;
  lockTwoUp = false;
  lockThreeUp = false;
  lockFourUp = false;
  lockFiveUp = false;
  lockSixUp = false;
  lockSevenUp = false;

  lockOneDown = true;
  lockTwoDown = false;
  lockThreeDown = false;
  lockFourDown = false;
  lockFiveDown = false;
  lockSixDown = false;
  lockSevenDown = false;
  lockEightDown = false;

  console.log('lockOneDown');
  // const high = window.UpperVal;
  // const low = window.LowerVal;
  // const range = high - low;
  // const offset = range / 9;
  // window.UpperVal += offset;
  // window.LowerVal -= offset;
  window.hGridLines = 10;
}

function vZoomUpOne() {
  Object.keys(lock).forEach((prop) => {
    if (prop.includes('one')) {
      lock[prop] = true;
    } else {
      lock[prop] = false;
    }
  });
  lockOneUp = true;
  lockTwoUp = false;
  lockThreeUp = false;
  lockFourUp = false;
  lockFiveUp = false;
  lockSixUp = false;
  lockSevenUp = false;

  lockOneDown = true;
  lockTwoDown = false;
  lockThreeDown = false;
  lockFourDown = false;
  lockFiveDown = false;
  lockSixDown = false;
  lockSevenDown = false;
  lockEightDown = false;
  
  console.log('lockOneUp');
  const high = window.UpperVal;
  const low = window.LowerVal;
  const range = high - low;
  const offset = range / 11;
  window.UpperVal -= offset;
  window.LowerVal += offset;
  window.hGridLines = 10;
}

function vZoomDownOne() {
  Object.keys(lock).forEach((prop) => {
    if (prop.includes('one')) {
      lock[prop] = true;
    } else {
      lock[prop] = false;
    }
  });
  lockOneUp = true;
  lockTwoUp = false;
  lockThreeUp = false;
  lockFourUp = false;
  lockFiveUp = false;
  lockSixUp = false;
  lockSevenUp = false;

  lockOneDown = true;
  lockTwoDown = false;
  lockThreeDown = false;
  lockFourDown = false;
  lockFiveDown = false;
  lockSixDown = false;
  lockSevenDown = false;
  lockEightDown = false;

  console.log('lockOneDown');
  const high = window.UpperVal;
  const low = window.LowerVal;
  const range = high - low;
  const offset = range / 7;
  window.UpperVal += offset;
  window.LowerVal -= offset;
  window.hGridLines = 10;
}

export function verticalZoom() {
  const yAxisContainer = document.querySelector('.yaxis-canvas');
  let mousePos = null;

  function mousemoveHandler(e) {
    // scale up
    if (mousePos.y > e.clientY) {
      scaling = 'up';
      window.zoom += 1;
      window.zoom = Number(window.zoom.toFixed(2));
      window.verticalZoom = window.zoom * 0.01;
      window.verticalBarZoom = window.zoom * 0.01;
      console.log(window.verticalZoom);
    }
    // scale down
    if (mousePos.y < e.clientY) {
      scaling = 'down';
      window.zoom -= 1;
      window.zoom = Number(window.zoom.toFixed(2));
      window.verticalZoom = window.zoom * 0.01;
      window.verticalBarZoom = window.zoom * 0.01;
      console.log(window.verticalZoom);
    }

    if (!lockFiveUp && scaling === 'up' && window.verticalZoom === 2.58) {
      lockFiveUp = true;
      lockFiveDown = true;
      lockFourDown = false;
      console.log('lockFiveUp');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 9;
      window.UpperVal -= offset;
      window.LowerVal += offset;
      window.hGridLines = 25.8;
    }

    if (!lockFourDown && scaling === 'down' && window.verticalZoom === 2.02) {
      lockFourDown = true;
      lockFourUp = true;
      lockFiveUp = false;
      console.log('lockFourDown');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 7;
      window.UpperVal += offset;
      window.LowerVal -= offset;
      window.hGridLines = 20.2;
    }

    if (!lockFourUp && scaling === 'up' && window.verticalZoom === 2.02) {
      lockFourUp = true;
      lockFourDown = true;
      lockThreeDown = false;
      console.log('lockFourUp');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 9;
      window.UpperVal -= offset;
      window.LowerVal += offset;
      window.hGridLines = 20.2;
    }

    if (!lockThreeDown && scaling === 'down' && window.verticalZoom === 1.6) {
      lockThreeDown = true;
      lockThreeUp = true;
      lockFourUp = false;
      console.log('lockThreeDown');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 7;
      window.UpperVal += offset;
      window.LowerVal -= offset;
      window.hGridLines = 16;
    }
    
    if (!lockThreeUp && scaling === 'up' && window.verticalZoom === 1.6) {
      lockThreeUp = true;
      lockThreeDown = true;
      lockTwoDown = false;
      console.log('lockThreeUp');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 9;
      window.UpperVal -= offset;
      window.LowerVal += offset;
      window.hGridLines = 16;
    }

    if (!lockTwoDown && scaling === 'down' && window.verticalZoom === 1.26) {
      lockTwoDown = true;
      lockTwoUp = true;
      lockThreeDown = false;
      console.log('lockTwoUp');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 7;
      window.UpperVal += offset;
      window.LowerVal -= offset;
      window.hGridLines = 12.6;
    }

    if (!lockTwoUp && scaling === 'up' && window.verticalZoom === 1.26) {
      lockTwoUp = true;
      lockTwoDown = true;
      lockOneDown = false;
      console.log('lockTwoUp');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 9;
      window.UpperVal -= offset;
      window.LowerVal += offset;
      window.hGridLines = 12.6;
    }

    /**
     * Scaling is 1
     */
    if (!lockOneUp && scaling === 'up' && window.verticalZoom === 1) {
      vZoomUpOne();
      // lockOneUp = true;
      // lockTwoUp = false;
      // lockThreeUp = false;
      // lockFourUp = false;
      // lockFiveUp = false;
      // lockSixUp = false;
      // lockSevenUp = false;

      // lockOneDown = true;
      // lockTwoDown = false;
      // lockThreeDown = false;
      // lockFourDown = false;
      // lockFiveDown = false;
      // lockSixDown = false;
      // lockSevenDown = false;
      // lockEightDown = false;
      
      // console.log('lockOneUp');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 11;
      // window.UpperVal -= offset;
      // window.LowerVal += offset;
      // window.hGridLines = 10;
    }

    if (!lockOneDown && scaling === 'down' && window.verticalZoom === 1) {
      vZoomDownOne();
      // lockOneUp = true;
      // lockTwoUp = false;
      // lockThreeUp = false;
      // lockFourUp = false;
      // lockFiveUp = false;
      // lockSixUp = false;
      // lockSevenUp = false;

      // lockOneDown = true;
      // lockTwoDown = false;
      // lockThreeDown = false;
      // lockFourDown = false;
      // lockFiveDown = false;
      // lockSixDown = false;
      // lockSevenDown = false;
      // lockEightDown = false;
      
      // console.log('lockOneDown');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 7;
      // window.UpperVal += offset;
      // window.LowerVal -= offset;
      // window.hGridLines = 10;
    }
    

    /**
     * Scaling less then 1
     */
    if (!lockTwoDown && scaling === 'down' && window.verticalZoom === 0.80) {
      lockTwoDown = true;
      lockTwoUp = true;
      lockOneUp = false;
      console.log('lockTwoDown');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 9;
      window.UpperVal += offset;
      window.LowerVal -= offset;
      window.hGridLines = 8;
    }

    if (!lockTwoUp && scaling === 'up' && window.verticalZoom === 0.80) {
      lockTwoUp = true;
      lockTwoDown = true;
      lockThreeDown = false;
      console.log('lockTwoUp');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 11;
      window.UpperVal -= offset;
      window.LowerVal += offset;
      window.hGridLines = 8;
    }

    if (!lockThreeDown && scaling === 'down' && window.verticalZoom === 0.64) {
      lockThreeDown = true;
      lockThreeUp = true;
      lockTwoUp = false;
      console.log('lockThreeDown');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 9;
      window.UpperVal += offset;
      window.LowerVal -= offset;
      window.hGridLines = 6.4;
    }

    if (!lockThreeUp && scaling === 'up' && window.verticalZoom === 0.64) {
      lockThreeUp = true;
      lockThreeDown = true;
      lockFourDown = false;
      console.log('lockThreeUp');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 11;
      window.UpperVal -= offset;
      window.LowerVal += offset;
      window.hGridLines = 6.4;
    }

    if (!lockFourDown && scaling === 'down' && window.verticalZoom === 0.52) {
      lockFourDown = true;
      lockFourUp = true;
      lockThreeUp = false;
      console.log('lockFourDown');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 9;
      window.UpperVal += offset;
      window.LowerVal -= offset;
      window.hGridLines = 5.2;
    }

    if (!lockFourUp && scaling === 'up' && window.verticalZoom === 0.52) {
      lockFourUp = true;
      lockFourDown = true;
      lockFiveDown = false;
      console.log('lockFourUp');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 11;
      window.UpperVal -= offset;
      window.LowerVal += offset;
      window.hGridLines = 5.2;
    }

    if (!lockFiveDown && scaling === 'down' && window.verticalZoom === 0.42) {
      lockFiveDown = true;
      lockFiveUp = true;
      lockFourUp = false;
      console.log('lockFiveDown');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 9;
      window.UpperVal += offset;
      window.LowerVal -= offset;
      window.hGridLines = 4.2;
    }

    if (!lockFiveUp && scaling === 'up' && window.verticalZoom === 0.42) {
      lockFiveUp = true;
      lockFiveDown = true;
      lockSixDown = false;
      console.log('lockFiveUp');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 11;
      window.UpperVal -= offset;
      window.LowerVal += offset;
      window.hGridLines = 4.2;
    }

    if (!lockSixDown && scaling === 'down' && window.verticalZoom === 0.36) {
      lockSixDown = true;
      lockSixUp = true;
      lockFiveUp = false;
      console.log('lockSixDown');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 9;
      window.UpperVal += offset;
      window.LowerVal -= offset;
      window.hGridLines = 3.6;
    }

    if (!lockSixUp && scaling === 'up' && window.verticalZoom === 0.36) {
      lockSixUp = true;
      lockSixDown = true;
      lockSevenDown = false;
      console.log('lockSixUp');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 11;
      window.UpperVal -= offset;
      window.LowerVal += offset;
      window.hGridLines = 3.6;
    }

    if (!lockSevenDown && scaling === 'down' && window.verticalZoom === 0.29) {
      lockSevenDown = true;
      lockSevenUp = true;
      lockSixUp = false;
      console.log('lockSevenDown');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 9;
      window.UpperVal += offset;
      window.LowerVal -= offset;
      window.hGridLines = 2.9;
    }

    if (!lockSevenUp && scaling === 'up' && window.verticalZoom === 0.29) {
      lockSevenUp = true;
      lockSevenDown = true;
      lockEightDown = false;
      console.log('lockSevenUp');
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 11;
      window.UpperVal -= offset;
      window.LowerVal += offset;
      window.hGridLines = 2.9;
    }

    if (scaling === 'down' && window.verticalZoom <= 0.23) {
      console.log('lockEightDown');
      if (lockEightDown) {
        zoom = 23;
        window.verticalZoom = 0.23;
        return;
      }
      lockEightDown = true;
      lockSevenUp = false;
      const high = window.UpperVal;
      const low = window.LowerVal;
      const range = high - low;
      const offset = range / 9;
      window.UpperVal += offset;
      window.LowerVal -= offset;
      window.hGridLines = 2.3;
    }

    // let lock = false;
    // if (window.verticalZoom > 0.8 && window.verticalZoom < 1.2) {
    //   console.log(window.verticalZoom)
    //   lock = false;
    // }
    // if (!lock && window.verticalZoom <= 0.8) {
    //  // window.vZoomFactor += 1;
    //   lock = true;
    // }

    // if (window.verticalZoom > 0.8) window.hGridLines = 10;
    // if (window.verticalZoom <= 0.8) {
    //   // window.hGridLines = 8;
    //   // console.log('grid lines 8')
    //   // window.verticalZoom = 1;
    // }
    // if (window.verticalZoom <= 0.62) {
    //   window.hGridLines = 6;
    //   console.log('grid lines 6')
    // }      
    // if (window.verticalZoom <= 0.4) {
    //   window.hGridLines = 4;
    //   console.log('grid lines 4')
    // }      
    // if (window.verticalZoom <= 0.2) window.hGridLines = 2;

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

window.horizontalZoom = 1;
// isScaling will be used for dynamicaly changing horizontal grid line chart
// values when the sapcing is to great or too small to displau values
// let isScaling = false;

export function horizontalZoom() {
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
