import 'stylesheets/page.scss';
import 'stylesheets/style.scss';

import options from 'javascripts/chartOptions';
import loadChart from 'javascripts/app';
import 'javascripts/support/app-support';

loadChart(options);

export default loadChart;
