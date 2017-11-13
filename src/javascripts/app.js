import ChartLoop from 'src/javascripts/ChartLoop';
import StockChart from 'src/javascripts/StockChart';
import YAxisChart from 'src/javascripts/YAxisChart';
import XAxisChart from 'src/javascripts/XAxisChart';
import Options from 'src/javascripts/chartOptions';
import panChart from 'src/javascripts/panChart';
import * as scaleChart from 'src/javascripts/scaleChart';
import * as request from 'src/javascripts/requests';

import 'src/stylesheets/style.scss';

// TODO: rename this file to Chart.js...
class Chart {
  constructor() {
    // DOM set up
    // TODO: create all dom elements with js...
    this.stockChartDOM = document.querySelector('.stockchart-container');
    this.yAxisDOM = document.querySelector('.yaxis-container');
    this.xAxisDOM = document.querySelector('.xaxis-container');

    // set up on window resize event
    const windowOnResize = new CustomEvent('window:onresize');
    window.onresize = () => {
      document.dispatchEvent(windowOnResize);
    };

    // initialize chart mouse events
    scaleChart.horizontalZoom();
    scaleChart.verticalZoom();
    panChart();

    this.options = Options;
    this.stockChart = null;
    this.yAxisChart = null;
    this.xAxisChart = null;
    this.chartLoop = null;
  }

  init() {
    // this.options = options;
    this.stockChart = new StockChart(this.stockChartDOM);
    this.yAxisChart = new YAxisChart(this.yAxisDOM);
    this.xAxisChart = new XAxisChart(this.xAxisDOM);
    this.chartLoop = new ChartLoop(this.stockChart, this.yAxisChart, this.xAxisChart);
    this.onStart();
  }

  // TODO: create a onLoad() data method and separate it from onState()
  onStart(options) {
    this.options = options || this.options;
    Promise.all([
      request.current(this.options),
      request.history(this.options),
    ]).then((data) => {
      this.chartLoop.currentPrice(this.options);
      this.chartLoop.loop(null, { current: data[0], history: data[1] });
    });
  }

  onStop() {
    this.stockChart.UpperVal = null;
    this.stockChart.LowerVal = null;
    // clear current frame interval and reset current price
    this.chartLoop.cancelCurPrice();
  }

  update(options) {
    this.onStop();
    this.onStart(options);
  }
}

export default Chart;
