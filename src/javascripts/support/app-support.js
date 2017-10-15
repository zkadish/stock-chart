import 'src/stylesheets/page.scss';

import Chart from 'src/javascripts/app';

const provider = document.querySelector('.current-price-provider');
const coin = document.querySelector('.coin-type');
const currency = document.querySelector('.currency-type');

// console.log(Chart);
// const interval = setInterval(() => {
//   console.log(Chart);
//   if (Chart) {
//     clearInterval(interval);
//   }
// }, 100);

// debugger;

const chart = new Chart();
chart.init();
// get a copy of the options for passing into loadChart()
const options = { ...chart.options };


chart.options.list.coins.forEach((c) => {
  const optElement = document.createElement('option');
  optElement.setAttribute('value', c);
  optElement.innerText = c;
  if (c === chart.options.coin) optElement.setAttribute('selected', '');
  coin.appendChild(optElement);
});

chart.options.list.currencies.forEach((c) => {
  const optElement = document.createElement('option');
  optElement.setAttribute('value', c);
  optElement.innerText = c;
  if (c === chart.options.currency) optElement.setAttribute('selected', '');
  currency.appendChild(optElement);
});

provider.onchange = (e) => {
  options.provider = e.target.value;
  chart.update(options);
};

coin.onchange = (e) => {
  options.coin = e.target.value;
  chart.update(options);
};

currency.onchange = (e) => {
  options.currency = e.target.value;
  chart.update(options);
};

