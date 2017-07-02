import ChartLoop from 'javascripts/chartLoop';
import StockChart from 'javascripts/StockChart';
import ChartYAxis from 'javascripts/ChartYAxis';
import ChartXAxis from 'javascripts/ChartXAxis';
import HorizontalZoom from 'javascripts/horizontalZoom';
import VerticalZoom from 'javascripts/verticalZoom';
import HorzVertPanning from 'javascripts/horzVertPanning';
import * as Price from 'javascripts/PriceData';

import 'stylesheets/style.scss';

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
  containerRect = canvasContainer.getBoundingClientRect();
  resizeContainer.style.width = `${containerRect.width}px`;
  resizeContainer.style.height = `${containerRect.height}px`;
}
document.addEventListener('window:onresize', windowOnResizeHandler, false);

// initialize the chart
HorizontalZoom();
VerticalZoom();
HorzVertPanning();

export const stockChart = new StockChart(stockChartDOM);
const chartYAxis = new ChartYAxis(yaxisDOM);
const chartXAxis = new ChartXAxis(xaxisDOM);
export const chartLoop = new ChartLoop(stockChart, chartYAxis, chartXAxis);

export function loadChart(options) {
  // get initial data
  Promise.all([
    Price.current(options),
    Price.history(options),
  ]).then((data) => {
    chartLoop.loop(null, { current: data[0], history: data[1] });
  });
}
