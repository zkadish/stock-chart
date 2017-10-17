import { expect } from 'chai';

import dom from './testHelper';

import StockChart from '../src/javascripts/StockChart.js';

const stockChartDOM = document.querySelector('.stockchart-container');
const stockChart = new StockChart(stockChartDOM);

describe('The yPointPos function', () => {
  before(() => {
    stockChart.canvasHeight = 100;
    stockChart.hGridLines = 10;
  });

  it('returns a position', () => {
    const pointVal = 5;
    const upperVal = 10;
    const lowerVal = 0;
    const yPos = stockChart.yPointPos(pointVal, upperVal, lowerVal);
    expect(yPos).to.equal(50);
  });
});
