import 'stylesheets/page.scss';
import 'stylesheets/style.scss';

import loadChart from 'javascripts/app';
import 'javascripts/support/app-support';

const options = {
  curPriProvider: 'coincap',
  currencyPair: 'USD',
};

loadChart(options);

export default loadChart;
