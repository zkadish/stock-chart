import StockChart from './StockChart';

export default class ChartXAxis extends StockChart {
  // *****************************************************
  // render vertical lines and first day of week
  // TODO make vLines and day into seperate methods
  // *****************************************************
  verticalLines(n, date, index) {
    if (this.priceData === null) return;
    let i = index;
    const color = '#ccc';
    const width = 2;
    const height = 15;
    const buffer = 30;
    const offset = 40;
    if (i >= this.priceData.length - 1) {
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

    if (this.priceData[i].Date.week !== this.priceData[i + 1].Date.week) {
      this.context.font = 'normal 20px Arial';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillText(
        this.priceData[i].Date.day,
        -(((n + buffer) * window.horizontalZoom) - (window.horizontalPan * window.horizontalZoom)),
        -(this.canvasHeight - 30),
      );
    }

    i += 1;
    this.verticalLines(n + (offset), date, i);
  }
}
