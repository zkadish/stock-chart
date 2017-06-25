// console.log('appsupport laoded!');
import loadChart from 'javascripts/app';

const currentPriceProvider = document.querySelector('.current-price-provider');

const options = {
  curPriProvider: 'coincap',
  currencyPair: 'USD',
};

currentPriceProvider.onchange = (e) => {
  console.log(e.target.value);
  options.curPriProvider = e.target.value;
  loadChart(options);
};
