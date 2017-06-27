import moment from 'moment';
import StockChart from './StockChart';

export default class ChartXAxis extends StockChart {
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // process date info from bar data
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  processDate(date) {
    const dateArray = moment(date).format('YYYY-MMM-DD-ddd-ww').split('-');
    const dateObj = {
      year: dateArray[0],
      month: dateArray[1],
      day: dateArray[2].replace(/^0/, ''),
      weekDay: dateArray[3],
      week: dateArray[4],
    };
    return dateObj;
  }

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

    if (date(this.priceData[i].Date).week !== date(this.priceData[i + 1].Date).week) {
      this.context.font = 'normal 20px Arial';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillText(
        date(this.priceData[i].Date).day,
        -(((n + buffer) * window.horizontalZoom) - (window.horizontalPan * window.horizontalZoom)),
        -(this.canvasHeight - 30),
      );
    }

    i += 1;
    this.verticalLines(n + (offset), date, i);
  }
}
