import ChartLoop from 'src/javascripts/chartLoop';
import StockChart from 'src/javascripts/StockChart';
import ChartYAxis from 'src/javascripts/ChartYAxis';
import ChartXAxis from 'src/javascripts/ChartXAxis';
import Options from 'src/javascripts/chartOptions';
import HorizontalZoom from 'src/javascripts/horizontalZoom';
import VerticalZoom from 'src/javascripts/verticalZoom';
import panChart from 'src/javascripts/panChart';
import * as request from 'src/javascripts/requests';

import 'src/stylesheets/style.scss';

class Chart {
  constructor() {
    // DOM set up
    // TODO: create all dom elements with js...
    this.stockChartDOM = document.querySelector('.stockchart-container');
    this.yaxisDOM = document.querySelector('.yaxis-container');
    this.xaxisDOM = document.querySelector('.xaxis-container');
    // const canvasContainer = document.querySelector('.canvas-container');

    // const resizeContainer = document.querySelector('.resize-container');
    // const containerRect = canvasContainer.getBoundingClientRect();
    // resizeContainer.style.width = `${containerRect.width}px`;
    // resizeContainer.style.height = `${containerRect.height}px`;

    // set up on window resize event
    const windowOnResize = new CustomEvent('window:onresize');
    window.onresize = () => {
      document.dispatchEvent(windowOnResize);
    };

    // initialize chart mouse events
    // TODO: add document mouse up to remove mouse events...
    HorizontalZoom();
    VerticalZoom();
    panChart();

    this.options = Options;
    // this.stockChart = null;
    this.stockChart = null;
    this.chartYAxis = null;
    this.chartXAxis = null;
    this.chartLoop = null;
  }

  init() {
    // this.options = options;
    this.stockChart = new StockChart(this.stockChartDOM);
    this.chartYAxis = new ChartYAxis(this.yaxisDOM);
    this.chartXAxis = new ChartXAxis(this.xaxisDOM);
    this.chartLoop = new ChartLoop(this.stockChart, this.chartYAxis, this.chartXAxis);
    this.onStart();
  }

  // TODO: create a onLoad() data method and separate it from onState()
  onStart(options) {
    this.options = options || this.options;
    Promise.all([
      request.current(this.options),
      request.history(this.options),
    ]).then((data) => {
      // setTimeout(() => {
        // this.chartLoop.start();
        this.chartLoop.currentPrice(this.options);
        this.chartLoop.loop(null, { current: data[0], history: data[1] });
      // }, 0);
    });
  }

  onStop() {
    this.stockChart.UpperVal = null;
    this.stockChart.LowerVal = null;
    // cancel animation frame loop, clear current price
    // interval, reset upper and lower range values
    this.chartLoop.cancelCurPrice();
  }

  update(options) {
    this.onStop();
    // setTimeout(() => {
      this.onStart(options);
    // }, 0);
  }
}

export default Chart;
