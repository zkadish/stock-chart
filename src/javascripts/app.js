import chartLoop from 'javascripts/chartLoop';
import StockChart from 'javascripts/StockChart';
import ChartYAxis from 'javascripts/ChartYAxis';
// import yAxisCanvas from 'javascripts/chart-yaxis';
import ChartXAxis from 'javascripts/ChartXAxis';
// import xAxisCanvas from 'javascripts/chart-xaxis';
import HorizontalZoom from 'javascripts/horizontalZoom';
import VerticalZoom from 'javascripts/verticalZoom';
import HorzVertPanning from 'javascripts/horzVertPanning';

HorizontalZoom();
VerticalZoom();
HorzVertPanning();

// set up on window resize event
// TODO: this is way to much code for one event
const windowOnResize = new CustomEvent('window:onresize');

const canvasContainer = document.querySelector('.canvas-container');
const tableContainer = document.querySelector('.table-container');
let containerRect = canvasContainer.getBoundingClientRect();

tableContainer.style.width = `${containerRect.width}px`;
tableContainer.style.height = `${containerRect.height}px`;

window.onresize = () => {
  document.dispatchEvent(windowOnResize);
};

function windowOnResizeHandler() {
  containerRect = canvasContainer.getBoundingClientRect();
  tableContainer.style.width = `${containerRect.width}px`;
  tableContainer.style.height = `${containerRect.height}px`;
}

document.addEventListener('window:onresize', windowOnResizeHandler, false);

// fetch('https://www.quandl.com/api/v3/datasets/WIKI/aapl/data.json?limit=100&end_date=&api_key=wHW3yQNffR6nKooC_ZhJ', {

function currentPrice(currencies) {
  return fetch(`http://api.coindesk.com/v1/bpi/currentprice/${currencies}.json`, {
    method: 'GET',
  }).then(response => response.json()).then(json => json.bpi);
}

function loadChart() {
  fetch('https://www.quandl.com/api/v3/datasets/BCHARTS/BITSTAMPUSD.json?limit=100&end_date=&api_key=wHW3yQNffR6nKooC_ZhJ', {
    method: 'GET',
  }).then((response) => {
    return response.json();
  }).then((json) => {
    // console.log(json);
    // console.log(JSON.parse(data));
    const priceData = json.dataset.data.map((d) => {
      return {
        Close: d[4],
        Date: d[0],
        High: d[2],
        Low: d[3],
        Open: d[1],
        Volume: d[5],
      };
    });
    const stockChart = new StockChart(priceData, currentPrice);
    const chartYAxis = new ChartYAxis(priceData, currentPrice);
    const chartXAxis = new ChartXAxis(priceData);

    chartLoop(stockChart, chartYAxis, chartXAxis);
  });
}

export default loadChart;
