// import { PROVIDER_CURRENT_PRICE } from './constants';
import moment from 'moment';

function processDate(isoDate) {
  const date = moment(isoDate).format('YYYY-MMM-DD-ddd-ww').split('-');
  return {
    year: date[0],
    month: date[1],
    day: date[2].replace(/^0/, ''),
    weekDay: date[3],
    week: date[4],
  };
}

// coindesk: http://www.coindesk.com/api/
export function current(options) {
  // debugger;
  const protocol = window.location.protocol;

  switch (options.provider) {
    case 'coindesk':
      return fetch(`${protocol}//api.coindesk.com/v1/bpi/currentprice/${options.currency}.json`, {
        method: 'GET',
      }).then(response => response.json()).then(json => json.bpi);
      // json.bpi = {
      //   USD: {
      //     code: "USD",
      //       rate: "2,636.0838",
      //       description: "United States Dollar",
      //       rate_float: 2636.0838 - chart uses this prop only...
      //   }
      // }
    case 'coincap':
      // coincap can't change currency pair
      return fetch(`http://www.coincap.io/page/${options.coin}`, {
        method: 'GET',
      }).then(response => response.json())
        .then((data) => {
          return Number(data.btcPrice);
        });
    case 'cryptocompare':
      return fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${options.coin}&tsyms=${options.currency}`, {
        method: 'GET',
      }).then((response) => {
        return response.json();
      }).then((data) => {
        return data.RAW[options.coin][options.currency].PRICE;
      });
    default:
      console.log('Error: priceData.js "no current price provider"');
      break;
  }
  return false;
}

export function historic(options) {
  switch (options.provider) {
    case 'coindesk' || 'coincap':
      return fetch(`https://www.quandl.com/api/v3/datasets/BCHARTS/BITSTAMP${options.currency}.json?limit=100&end_date=&api_key=wHW3yQNffR6nKooC_ZhJ`, {
        method: 'GET',
      }).then(response => response.json())
        .then(json => json.dataset.data.map((d) => {
          return {
            Close: d[4],
            Date: processDate(d[0]),
            High: d[2],
            Low: d[3],
            Open: d[1],
            Volume: d[5],
          };
        }));
    case 'cryptocompare':
      return fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=${options.coin}&tsym=${options.currency}&limit=99&aggregate=1&e=CCCAGG`, {
        method: 'GET',
      }).then((response) => {
        return response.json();
      }).then((json) => {
        // TODO: figure out why volume is a "from/to" formate
        // translate to someting you can use on the chart
        const ohlc = json.Data.map((d) => {
          const time = (new Date(Number(`${d.time}000`))).toISOString();
          // debugger;
          // const year = moment(time).year();
          // const month = moment(time).month() + 1 < 10 ? `0${moment(time).month() + 1}` : moment(time).month() + 1;
          // const date = moment(time).date() < 10 ? `0${moment(time).date()}` : moment(time).date();
          return {
            Close: d.close,
            Date: processDate(time),
            High: d.high,
            Low: d.low,
            Open: d.open,
            time: d.time,
            // Volume: d[5],
          };
        }).reverse();
        return ohlc;
      });
    default:
      console.log('Error: historicData.js "no historic price proider"');
  }
  return false;
}

// stock chat data
// fetch('https://www.quandl.com/api/v3/datasets/WIKI/aapl/data.json?limit=100&end_date=&api_key=wHW3yQNffR6nKooC_ZhJ', {

