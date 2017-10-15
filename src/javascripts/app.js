import ChartLoop from 'src/javascripts/chartLoop';
import StockChart from 'src/javascripts/StockChart';
import ChartYAxis from 'src/javascripts/ChartYAxis';
import ChartXAxis from 'src/javascripts/ChartXAxis';
import Options from 'src/javascripts/chartOptions';
import HorizontalZoom from 'src/javascripts/horizontalZoom';
import VerticalZoom from 'src/javascripts/verticalZoom';
import HorzVertPanning from 'src/javascripts/horzVertPanning';
import * as request from 'src/javascripts/requests';

import 'src/stylesheets/style.scss';

class Chart {
  constructor() {
    // DOM set up
    // TODO: create all dom elements with js...
    this.stockChartDOM = document.querySelector('.stockchart-container');
    this.yaxisDOM = document.querySelector('.yaxis-container');
    this.xaxisDOM = document.querySelector('.xaxis-container');
    const canvasContainer = document.querySelector('.canvas-container');

    // const resizeContainer = document.querySelector('.resize-container');
    // const containerRect = canvasContainer.getBoundingClientRect();
    // resizeContainer.style.width = `${containerRect.width}px`;
    // resizeContainer.style.height = `${containerRect.height}px`;

    // set up on window resize event
    // function windowOnResizeHandler() {
    //   // containerRect = canvasContainer.getBoundingClientRect();
    //   // resizeContainer.style.width = `${containerRect.width}px`;
    //   // resizeContainer.style.height = `${containerRect.height}px`;
    // }
    // document.addEventListener('window:onresize', null, false);
    const windowOnResize = new CustomEvent('window:onresize');
    window.onresize = () => {
      document.dispatchEvent(windowOnResize);
    };

    // initialize chart mouse evetns
    HorizontalZoom();
    VerticalZoom();
    HorzVertPanning();

    this.options = Options;
    // this.stockChart = null;
    this.loop = null;
  }

  onStart(options) {
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

  onStop() {
    // cancel animation frame loop, clear current price
    // interval, reset upper and lower range values
    this.loop.stop();
  }

  update(options) {
    this.onStart(options);
    this.onStop();
  }

  init() {
    // this.options = options;
    const stockChart = new StockChart(this.stockChartDOM);
    const chartYAxis = new ChartYAxis(this.yaxisDOM);
    const chartXAxis = new ChartXAxis(this.xaxisDOM);
    this.loop = new ChartLoop(stockChart, chartYAxis, chartXAxis);
    this.onStart();
  }
}

export default Chart;
