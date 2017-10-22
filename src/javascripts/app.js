import ChartLoop from 'src/javascripts/chartLoop';
import StockChart from 'src/javascripts/StockChart';
import ChartYAxis from 'src/javascripts/ChartYAxis';
import ChartXAxis from 'src/javascripts/ChartXAxis';
import Options from 'src/javascripts/chartOptions';
import panChart from 'src/javascripts/panChart';
import * as scaleChart from 'src/javascripts/scaleChart';
import * as request from 'src/javascripts/requests';

import 'src/stylesheets/style.scss';

class Chart {
  constructor() {
    // DOM set up
    // TODO: create all dom elements with js...
    this.stockChartDOM = document.querySelector('.stockchart-container');
    this.yaxisDOM = document.querySelector('.yaxis-container');
    this.xaxisDOM = document.querySelector('.xaxis-container');

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
