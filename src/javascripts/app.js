import chartLoop from 'javascripts/chartLoop';
import StockChart from 'javascripts/StockChart';
import ChartYAxis from 'javascripts/ChartYAxis';
import ChartXAxis from 'javascripts/ChartXAxis';
import HorizontalZoom from 'javascripts/horizontalZoom';
import VerticalZoom from 'javascripts/verticalZoom';
import HorzVertPanning from 'javascripts/horzVertPanning';
import * as Price from 'javascripts/PriceData';

import 'stylesheets/style.scss';

function loadChart(currencyPair) {
  // set up on window resize event
  const windowOnResize = new CustomEvent('window:onresize');

  const canvasContainer = document.querySelector('.canvas-container');
  const resizeContainer = document.querySelector('.resize-container');
  let containerRect = canvasContainer.getBoundingClientRect();

  resizeContainer.style.width = `${containerRect.width}px`;
  resizeContainer.style.height = `${containerRect.height}px`;

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

  HorizontalZoom();
  VerticalZoom();
  HorzVertPanning();

  const stockChart = new StockChart(Price.historic, Price.current, currencyPair);
  const chartYAxis = new ChartYAxis(Price.current, currencyPair);
  const chartXAxis = new ChartXAxis(Price.historic, currencyPair);
  chartLoop(stockChart, chartYAxis, chartXAxis, currencyPair);
}

export default loadChart;
