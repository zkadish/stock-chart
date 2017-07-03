import options from 'javascripts/chartOptions';
import Chart from '../../webpack-dev-entry';

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
  Chart.loop.stop();
  Chart.loadChart(options);
};

coin.onchange = (e) => {
  options.coin = e.target.value;
  Chart.loop.stop();
  Chart.loadChart(options);
};

currency.onchange = (e) => {
  options.currency = e.target.value;
  Chart.loop.stop();
  Chart.loadChart(options);
};

