import moment from 'moment';

// const { location } = window;
const {
  host,
  origin,
  protocol,
} = window.location;
// debugger;

let serverRequest = origin;
if (host.startsWith('localhost')) {
  serverRequest = 'http://localhost:3000';
}

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

export function current(options) {

  switch (options.provider) {
    // case 'coindesk':
    //   // coindesk api only returns BTC/USD - http://www.coindesk.com/api/
    //   return fetch(`${protocol}//api.coindesk.com/v1/bpi/currentprice/USD.json`, {
    //     method: 'GET',
    //   }).then(response => response.json())
    //     .then(json => json.bpi.USD.rate_float);
    // case 'coincap':
    //   // coincap's api only returns BTC/USD
    //   return fetch('http://www.coincap.io/page/BTC', {
    //     method: 'GET',
    //   }).then(response => response.json())
    //     .then(data => Number(data.btcPrice));
    case 'cryptocompare':
      return fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${options.coin}&tsyms=${options.currency}`, {
        method: 'GET',
      }).then((response) => {
        return response.json();
      }).then((data) => {
        return data.RAW[options.coin][options.currency].PRICE;
      }).catch((err) => {
        console.log('ERROR: fetch current price cryptocompare - ', err);
      });
    default:
      console.log('Error: priceData.js "no current price provider"');
      break;
  }
  return false;
}

export function history(options) {
  switch (options.provider) {
    // case 'coincap':
    // case 'coindesk':
    //   return fetch(`https://www.quandl.com/api/v3/datasets/BCHARTS/BITSTAMP${options.currency}.json?limit=100&end_date=&api_key=wHW3yQNffR6nKooC_ZhJ`, {
    //     method: 'GET',
    //   }).then(response => response.json())
    //     .then(json => json.dataset.data.map((d) => {
    //       return {
    //         Close: d[4],
    //         Date: processDate(d[0]),
    //         High: d[2],
    //         Low: d[3],
    //         Open: d[1],
    //         Volume: d[5],
    //       };
    //     }));
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
      }).catch((err) => {
        console.log('ERROR: fetch historic price cryptocompare - ', err);
      });
    default:
      console.log('Error: historicData.js "no historic price proider"');
  }
  return false;
}

export function coins() {
  return fetch(`${serverRequest}/api/coins`, {
  // return fetch('http://localhost:3000/api/coins', {
    method: 'GET',
  }).then((response) => {
    return response.json();
  }).then((data) => {
    // console.log(data);
    // debugger;
    return data;
  });
}

// stock chat data
// fetch('https://www.quandl.com/api/v3/datasets/WIKI/aapl/data.json?limit=100&end_date=&api_key=wHW3yQNffR6nKooC_ZhJ', {

