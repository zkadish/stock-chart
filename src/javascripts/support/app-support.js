// console.log('appsupport laoded!');
import loadChart from 'javascripts/app';
import options from 'javascripts/chartOptions';

const currentPriceProvider = document.querySelector('.current-price-provider');
const coinSymbol = document.querySelector('.coin-type');

currentPriceProvider.onchange = (e) => {
  console.log(e.target.value);
  options.curPriProvider = e.target.value;
  loadChart(options);
};

coinSymbol.onchange = (e) => {
  console.log(e.target.value);
  options.coinSymbol = e.target.value;
  loadChart(options);
};
