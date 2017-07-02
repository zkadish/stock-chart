// console.log('appsupport laoded!');
import loadChart from 'javascripts/app';
import options from 'javascripts/chartOptions';

const provider = document.querySelector('.current-price-provider');
const coin = document.querySelector('.coin-type');
const currency = document.querySelector('.currency-type');

options.list.coins.forEach((c) => {
  const optElement = document.createElement('option');
  optElement.setAttribute('value', c);
  optElement.innerText = c;
  if (c === options.coin) optElement.setAttribute('selected', '');
  coin.appendChild(optElement);
});

options.list.currencies.forEach((c) => {
  const optElement = document.createElement('option');
  optElement.setAttribute('value', c);
  optElement.innerText = c;
  if (c === options.currency) optElement.setAttribute('selected', '');
  currency.appendChild(optElement);
});

provider.onchange = (e) => {
  options.provider = e.target.value;
  loadChart(options);
};

coin.onchange = (e) => {
  window.chartUpperVal = null;
  window.chartLowerVal = null;
  options.coin = e.target.value;
  loadChart(options);
};

currency.onchange = (e) => {
  window.chartUpperVal = null;
  window.chartLowerVal = null;
  options.currency = e.target.value;
  loadChart(options);
};

