import chartLoop from './chartLoop';
import StockChart from 'javascripts/canvas';
import yAxisCanvas from 'javascripts/chart-yaxis';
import xAxisCanvas from 'javascripts/chart-xaxis';
import HorizontalZoom from 'javascripts/horizontalZoom';
import VerticalZoom from 'javascripts/verticalZoom';
import HorzVertPanning from 'javascripts/horzVertPanning';

HorizontalZoom();
VerticalZoom();
HorzVertPanning();

// set up on window resize event
// TODO: this is way to much code for one event
var windowOnResize = new CustomEvent('window:onresize');

var canvasContainer = document.querySelector('.canvas-container');
var tableContainer = document.querySelector('.table-container');
var containerRect = canvasContainer.getBoundingClientRect();

tableContainer.style.width = containerRect.width + 'px';
tableContainer.style.height = containerRect.height + 'px';

window.onresize = function () {
  document.dispatchEvent(windowOnResize);
}

function windowOnResizeHandler () {
  containerRect = canvasContainer.getBoundingClientRect();
  tableContainer.style.width = containerRect.width + 'px';
  tableContainer.style.height = containerRect.height + 'px';
}

document.addEventListener('window:onresize', windowOnResizeHandler, false);

// fetch('https://www.quandl.com/api/v3/datasets/WIKI/aapl/data.json?limit=100&end_date=&api_key=wHW3yQNffR6nKooC_ZhJ', {

fetch('https://www.quandl.com/api/v3/datasets/BCHARTS/BITSTAMPUSD.json?limit=100&end_date=&api_key=wHW3yQNffR6nKooC_ZhJ', {
  method: 'GET',
}).then(function (response) {
  return response.json();
}).then(function(json){
  console.log(json); 
  // console.log(JSON.parse(data));
  const priceData = json.dataset.data.map(function(d) {
    return {
      Close: d[4],
      Date: d[0],
      High: d[2],
      Low: d[3],
      Open: d[1],
      Volume: d[5]
    }
  });
  const stockChart = new StockChart(priceData);
  // console.log('app');
  chartLoop(stockChart);
  yAxisCanvas(priceData);
  xAxisCanvas(priceData);
});
