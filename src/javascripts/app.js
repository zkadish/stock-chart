import chartLoop from 'javascripts/chartLoop';
import StockChart from 'javascripts/StockChart';
import ChartYAxis from 'javascripts/ChartYAxis';
import ChartXAxis from 'javascripts/ChartXAxis';
import HorizontalZoom from 'javascripts/horizontalZoom';
import VerticalZoom from 'javascripts/verticalZoom';
import HorzVertPanning from 'javascripts/horzVertPanning';
import * as Price from 'javascripts/PriceData';

import 'stylesheets/style.scss';

function loadChart(options) {
  // DOM set up
  const stockChartDOM = document.querySelector('.stockchart-container');
  const yaxisDOM = document.querySelector('.yaxis-container');
  const xaxisDOM = document.querySelector('.xaxis-container');

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
    console.log('app resize');
    containerRect = canvasContainer.getBoundingClientRect();
    resizeContainer.style.width = `${containerRect.width}px`;
    resizeContainer.style.height = `${containerRect.height}px`;
  }

  document.addEventListener('window:onresize', windowOnResizeHandler, false);

  // initialize the chart
  HorizontalZoom();
  VerticalZoom();
  HorzVertPanning();
  const stockChart = new StockChart(stockChartDOM, Price.historic, Price.current, options);
  const chartYAxis = new ChartYAxis(yaxisDOM, Price.historic, Price.current, options);
  const chartXAxis = new ChartXAxis(xaxisDOM, Price.historic, Price.current, options);
  chartLoop(stockChart, chartYAxis, chartXAxis);
}

export default loadChart;
