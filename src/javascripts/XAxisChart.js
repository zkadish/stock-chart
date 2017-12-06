import StockChart from './StockChart';

export default class ChartXAxis extends StockChart {
  constructor(xAxisDOM) {
    super(xAxisDOM);

    this.DOM.ondblclick = function ondlclickHandler() {
      console.log('xAxisChart');
      window.horizontalZoom = 1;
      window.horizontalPan = 0;
      // console.log(window.UpperVal, window.LowerVal);
      // console.log('ondblclick', window.ConstUpperVal, window.ConstLowerVal);
      // window.UpperVal = window.ConstUpperVal;
      // window.LowerVal = window.ConstLowerVal;
      // window.zoom = 100;
      // window.verticalZoom = 1;
      // window.verticalBarZoom = 1;
      // window.horizontalPan = 0;
      // window.verticalPan = 0;
      // vZoomReset();
    };
  }
  // *****************************************************
  // render vertical lines and first day of week
  // TODO make vLines and day into seperate methods
  // *****************************************************
  verticalLines(n, date, index, price) {
    if (!price) return;
    let i = index;
    const color = '#ccc';
    const width = 2;
    const height = 15;
    const buffer = 30;
    const offset = 40;
    if (i >= price.history.length - 1) {
      i = 0;
      return;
    }
    if (((n + buffer) * window.horizontalZoom) > this.canvasWidth + (window.horizontalPan * window.horizontalZoom)) {
      i = 0;
      return;
    }

    this.context.save();
    this.context.beginPath();
    this.context.scale(window.horizontalZoom, 1);
    this.context.translate(window.horizontalPan, 0);

    this.context.fillStyle = color;
    this.context.fillRect(
      -(n + buffer),
      -(this.canvasHeight),
      width / window.horizontalZoom,
      height,
    );

    this.context.restore();

    if (price.history[i].Date.week !== price.history[i + 1].Date.week) {
      this.context.font = 'normal 20px Arial';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillText(
        price.history[i].Date.day,
        -(((n + buffer) * window.horizontalZoom) - (window.horizontalPan * window.horizontalZoom)),
        -(this.canvasHeight - 30),
      );
    }

    i += 1;
    this.verticalLines(n + (offset), date, i, price);
  }
}
