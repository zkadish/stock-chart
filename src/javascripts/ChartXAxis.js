import moment from 'moment';

export default class ChartXAxis {
  constructor(historicPrice, currency) {
    this.priceData = null;
    historicPrice(currency).then((data) => {
      this.priceData = data;
    });

    this.canvasContainer = document.querySelector('.xaxis-container');
    this.containerRect = this.canvasContainer.getBoundingClientRect();
    this.canvas = document.querySelector('.xaxis-canvas');
    this.context = this.canvas.getContext('2d');
    this.lastUpdate = null;

    // *2 to scale up canvas for retna display
    this.canvasWidth = this.containerRect.width * 2;
    this.canvasHeight = this.containerRect.height * 2;

    this.canvas.setAttribute('width', this.canvasWidth);
    this.canvas.setAttribute('height', this.canvasHeight);

    this.canvas.style.width = `${this.canvasWidth * 0.5}px`;
    this.canvas.style.height = `${this.canvasHeight * 0.5}px`;

    this.windowOnResizeHandler = this.windowOnResizeHandler.bind(this);
    document.addEventListener('window:onresize', this.windowOnResizeHandler, false);
  }

  windowOnResizeHandler() {
    this.containerRect = this.canvasContainer.getBoundingClientRect();
    this.canvasWidth = this.containerRect.width * 2;
    this.canvasHeight = this.containerRect.height * 2;

    this.canvas.setAttribute('width', this.canvasWidth);
    this.canvas.setAttribute('height', this.canvasHeight);

    this.canvas.style.width = `${this.canvasWidth * 0.5}px`;
    this.canvas.style.height = `${this.canvasHeight * 0.5}px`;
  }

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
