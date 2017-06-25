import { PROVIDER_CURRENT_PRICE } from './constants';

// coindesk: http://www.coindesk.com/api/
export function current(currency) {
  const protocol = window.location.protocol;

  switch (PROVIDER_CURRENT_PRICE) {
    case 'coindesk':
      return fetch(`${protocol}//api.coindesk.com/v1/bpi/currentprice/${currency}.json`, {
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
      return fetch('http://www.coincap.io/page/BTC', {
        method: 'GET',
      }).then((response) => {
        return response.json();
      }).then((data) => {
        return {
          USD: {
            rate_float: Number(data.btcPrice),
          },
        };
      });
    default:
      console.log('no current price provider');
      break;
  }

  return false;
}

export function historic(currency) {
  return fetch(`https://www.quandl.com/api/v3/datasets/BCHARTS/BITSTAMP${currency}.json?limit=100&end_date=&api_key=wHW3yQNffR6nKooC_ZhJ`, {
    method: 'GET',
  }).then(response => response.json())
    .then(json => json.dataset.data.map((d) => {
      return {
        Close: d[4],
        Date: d[0],
        High: d[2],
        Low: d[3],
        Open: d[1],
        Volume: d[5],
      };
    }));
}

// stock chat data
// fetch('https://www.quandl.com/api/v3/datasets/WIKI/aapl/data.json?limit=100&end_date=&api_key=wHW3yQNffR6nKooC_ZhJ', {

