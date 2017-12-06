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
  const high = window.UpperVal;
  const low = window.LowerVal;
  const range = high - low;
  const offset = range / 7;
  window.UpperVal += offset;
  window.LowerVal -= offset;
  window.hGridLines = 10;
}

function vZoomDown(step, previous) {
  lock[`${step}Down`] = true;
  lock[`${step}Up`] = true;
  lock[`${previous}`] = false;
  // console.log('lockTwoDown');
  return function update(direction, divisions, lines) {
    const high = window.UpperVal;
    const low = window.LowerVal;
    const range = high - low;
    const offset = range / divisions;
    window.hGridLines = lines;
    if (direction === 'down') {
      window.UpperVal += offset;
      window.LowerVal -= offset;
    } else {
      window.UpperVal -= offset;
      window.LowerVal += offset;
    }
  }
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

    if (!lock.fiveUp && scaling === 'up' && window.verticalZoom === 2.58) {
      vZoomDown('five', 'fourDown')('up', 9, 25.8);
      // lockFiveUp = true;
      // lockFiveDown = true;
      // lockFourDown = false;
      // console.log('lockFiveUp');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 9;
      // window.UpperVal -= offset;
      // window.LowerVal += offset;
      // window.hGridLines = 25.8;
    }

    if (!lock.fourDown && scaling === 'down' && window.verticalZoom === 2.02) {
      vZoomDown('four', 'fiveUp')('down', 7, 20.2);
      // lockFourDown = true;
      // lockFourUp = true;
      // lockFiveUp = false;
      // console.log('lockFourDown');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 7;
      // window.UpperVal += offset;
      // window.LowerVal -= offset;
      // window.hGridLines = 20.2;
    }

    if (!lock.fourUp && scaling === 'up' && window.verticalZoom === 2.02) {
      vZoomDown('four', 'threeDown')('up', 9, 20.2);
      // lockFourUp = true;
      // lockFourDown = true;
      // lockThreeDown = false;
      // console.log('lockFourUp');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 9;
      // window.UpperVal -= offset;
      // window.LowerVal += offset;
      // window.hGridLines = 20.2;
    }

    if (!lock.threeDown && scaling === 'down' && window.verticalZoom === 1.6) {
      vZoomDown('three', 'fourUp')('down', 7, 16);
      // lockThreeDown = true;
      // lockThreeUp = true;
      // lockFourUp = false;
      // console.log('lockThreeDown');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 7;
      // window.UpperVal += offset;
      // window.LowerVal -= offset;
      // window.hGridLines = 16;
    }
    
    if (!lock.threeUp && scaling === 'up' && window.verticalZoom === 1.6) {
      vZoomDown('three', 'twoDown')('up', 9, 16);
      // lockThreeUp = true;
      // lockThreeDown = true;
      // lockTwoDown = false;
      // console.log('lockThreeUp');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 9;
      // window.UpperVal -= offset;
      // window.LowerVal += offset;
      // window.hGridLines = 16;
    }

    if (!lock.twoDown && scaling === 'down' && window.verticalZoom === 1.26) {
      vZoomDown('two', 'threeUp')('down', 7, 12.6);
      // lockTwoDown = true;
      // lockTwoUp = true;
      // lockThreeDown = false;
      // console.log('lockTwoUp');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 7;
      // window.UpperVal += offset;
      // window.LowerVal -= offset;
      // window.hGridLines = 12.6;
    }

    if (!lock.twoUp && scaling === 'up' && window.verticalZoom === 1.26) {
      vZoomDown('two', 'oneDown')('up', 9, 12.6);
      // lockTwoUp = true;
      // lockTwoDown = true;
      // lockOneDown = false;
      // console.log('lockTwoUp');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 9;
      // window.UpperVal -= offset;
      // window.LowerVal += offset;
      // window.hGridLines = 12.6;
    }

    /**
     * Scaling is 1
     */
    if (!lock.oneUp && scaling === 'up' && window.verticalZoom === 1) {
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

    if (!lock.oneDown && scaling === 'down' && window.verticalZoom === 1) {
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
    if (!lock.twoDown && scaling === 'down' && window.verticalZoom === 0.80) {
      vZoomDown('two', 'oneUp')('down', 9, 8);
      // lockTwoDown = true;
      // lockTwoUp = true;
      // lockOneUp = false;
      // console.log('lockTwoDown');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 9;
      // window.UpperVal += offset;
      // window.LowerVal -= offset;
      // window.hGridLines = 8;
    }

    if (!lock.twoUp && scaling === 'up' && window.verticalZoom === 0.80) {
      vZoomDown('two', 'threeDown')('up', 11, 8);
      // lockTwoUp = true;
      // lockTwoDown = true;
      // lockThreeDown = false;
      // console.log('lockTwoUp');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 11;
      // window.UpperVal -= offset;
      // window.LowerVal += offset;
      // window.hGridLines = 8;
    }

    if (!lock.threeDown && scaling === 'down' && window.verticalZoom === 0.64) {
      vZoomDown('three', 'twoUp')('down', 9, 6.4);
      // lockThreeDown = true;
      // lockThreeUp = true;
      // lockTwoUp = false;
      // console.log('lockThreeDown');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 9;
      // window.UpperVal += offset;
      // window.LowerVal -= offset;
      // window.hGridLines = 6.4;
    }

    if (!lock.threeUp && scaling === 'up' && window.verticalZoom === 0.64) {
      vZoomDown('three', 'fourDown')('up', 11, 6.4);
      // lockThreeUp = true;
      // lockThreeDown = true;
      // lockFourDown = false;
      // console.log('lockThreeUp');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 11;
      // window.UpperVal -= offset;
      // window.LowerVal += offset;
      // window.hGridLines = 6.4;
    }

    if (!lock.fourDown && scaling === 'down' && window.verticalZoom === 0.52) {
      vZoomDown('four', 'threeUp')('down', 9, 5.2);
      // lockFourDown = true;
      // lockFourUp = true;
      // lockThreeUp = false;
      // console.log('lockFourDown');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 9;
      // window.UpperVal += offset;
      // window.LowerVal -= offset;
      // window.hGridLines = 5.2;
    }

    if (!lock.fourUp && scaling === 'up' && window.verticalZoom === 0.52) {
      vZoomDown('four', 'fiveDown')('up', 11, 5.2);
      // lockFourUp = true;
      // lockFourDown = true;
      // lockFiveDown = false;
      // console.log('lockFourUp');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 11;
      // window.UpperVal -= offset;
      // window.LowerVal += offset;
      // window.hGridLines = 5.2;
    }

    if (!lock.fiveDown && scaling === 'down' && window.verticalZoom === 0.42) {
      vZoomDown('five', 'fourUp')('down', 9, 4.2);
      // lockFiveDown = true;
      // lockFiveUp = true;
      // lockFourUp = false;
      // console.log('lockFiveDown');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 9;
      // window.UpperVal += offset;
      // window.LowerVal -= offset;
      // window.hGridLines = 4.2;
    }

    if (!lock.fiveUp && scaling === 'up' && window.verticalZoom === 0.42) {
      vZoomDown('five', 'sixDown')('up', 11, 4.2);
      // lockFiveUp = true;
      // lockFiveDown = true;
      // lockSixDown = false;
      // console.log('lockFiveUp');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 11;
      // window.UpperVal -= offset;
      // window.LowerVal += offset;
      // window.hGridLines = 4.2;
    }

    if (!lock.sixDown && scaling === 'down' && window.verticalZoom === 0.36) {
      vZoomDown('six', 'fiveUp')('down', 9, 3.6);
      // lockSixDown = true;
      // lockSixUp = true;
      // lockFiveUp = false;
      // console.log('lockSixDown');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 9;
      // window.UpperVal += offset;
      // window.LowerVal -= offset;
      // window.hGridLines = 3.6;
    }

    if (!lock.sixUp && scaling === 'up' && window.verticalZoom === 0.36) {
      vZoomDown('six', 'sevenDown')('up', 11, 3.6);
      // lockSixUp = true;
      // lockSixDown = true;
      // lockSevenDown = false;
      // console.log('lockSixUp');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 11;
      // window.UpperVal -= offset;
      // window.LowerVal += offset;
      // window.hGridLines = 3.6;
    }

    if (!lock.sevenDown && scaling === 'down' && window.verticalZoom === 0.29) {
      vZoomDown('seven', 'sixUp')('down', 9, 2.9);
      // lockSevenDown = true;
      // lockSevenUp = true;
      // lockSixUp = false;
      // console.log('lockSevenDown');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 9;
      // window.UpperVal += offset;
      // window.LowerVal -= offset;
      // window.hGridLines = 2.9;
    }

    if (!lock.sevenUp && scaling === 'up' && window.verticalZoom === 0.29) {
      vZoomDown('seven', 'eightDown')('up', 11, 2.9);
      // lockSevenUp = true;
      // lockSevenDown = true;
      // lockEightDown = false;
      // console.log('lockSevenUp');
      // const high = window.UpperVal;
      // const low = window.LowerVal;
      // const range = high - low;
      // const offset = range / 11;
      // window.UpperVal -= offset;
      // window.LowerVal += offset;
      // window.hGridLines = 2.9;
    }

    if (scaling === 'down' && window.verticalZoom <= 0.23) {
      console.log('lock.eightDown');
      if (lock.eightDown) {
        window.zoom = 23;
        window.verticalZoom = 0.23;
        return;
      }
      lock.eightDown = true;
      lock.sevenUp = false;
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
