import 'stylesheets/page.scss';
import 'stylesheets/style.scss';

// import options from 'javascripts/chartOptions';
import Chart from 'javascripts/app';
import 'javascripts/support/app-support';

const chart = new Chart();
chart.initChart();

export default chart;
