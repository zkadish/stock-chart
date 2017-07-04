import ChartLoop from 'javascripts/chartLoop';
import StockChart from 'javascripts/StockChart';
import ChartYAxis from 'javascripts/ChartYAxis';
import ChartXAxis from 'javascripts/ChartXAxis';
import Options from 'javascripts/chartOptions';
import HorizontalZoom from 'javascripts/horizontalZoom';
import VerticalZoom from 'javascripts/verticalZoom';
import HorzVertPanning from 'javascripts/horzVertPanning';
import * as request from 'javascripts/requests';

import 'stylesheets/style.scss';

class Chart {
  constructor() {
    // DOM set up
    this.stockChartDOM = document.querySelector('.stockchart-container');
    this.yaxisDOM = document.querySelector('.yaxis-container');
    this.xaxisDOM = document.querySelector('.xaxis-container');

    const canvasContainer = document.querySelector('.canvas-container');
    const resizeContainer = document.querySelector('.resize-container');
    let containerRect = canvasContainer.getBoundingClientRect();

    resizeContainer.style.width = `${containerRect.width}px`;
    resizeContainer.style.height = `${containerRect.height}px`;

    // set up on window resize event
    const windowOnResize = new CustomEvent('window:onresize');
    window.onresize = () => {
      document.dispatchEvent(windowOnResize);
    };
    function windowOnResizeHandler() {
      containerRect = canvasContainer.getBoundingClientRect();
      resizeContainer.style.width = `${containerRect.width}px`;
      resizeContainer.style.height = `${containerRect.height}px`;
    }
    document.addEventListener('window:onresize', windowOnResizeHandler, false);

    // initialize chart mouse evetns
    HorizontalZoom();
    VerticalZoom();
    HorzVertPanning();

    this.options = Options;
    this.stockChart = null;
    this.chartLoop = null;
  }

  init() {
    // this.options = options;
    this.stockChart = new StockChart(this.stockChartDOM);
    const chartYAxis = new ChartYAxis(this.yaxisDOM);
    const chartXAxis = new ChartXAxis(this.xaxisDOM);
    this.loop = new ChartLoop(this.stockChart, chartYAxis, chartXAxis);
    this.start();
  }

  start(options) {
    this.options = options || this.options;
    Promise.all([
      request.current(this.options),
      request.history(this.options),
    ]).then((data) => {
      this.loop.start();
      this.loop.currentPrice(this.options);
      this.loop.loop(null, { current: data[0], history: data[1] });
    });
  }

  stop() {
    // cancel animation frame loop, clear current price
    // interval, reset upper and lower range values
    this.loop.stop();
  }

  update(options) {
    this.start(options);
    this.stop();
  }
}

export default Chart;
