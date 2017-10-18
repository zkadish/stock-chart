import { expect } from 'chai';

import dom from './testHelper';

import StockChart from '../src/javascripts/StockChart.js';

const stockChartDOM = document.querySelector('.stockchart-container');
const stockChart = new StockChart(stockChartDOM);

describe('The StockChart Class', () => {

  describe('The setUpperRange method', () => {
    before(() => {
      stockChart.UpperVal = null;
    });
    it('will set this.UpperVal to priceData.High if stockChart.UpperVal is null', () => {
      const priceData = { High: 9 };
      // const { UpperVal } = stockChart;
      stockChart.setUpperRange(priceData);
      expect(stockChart.UpperVal).to.equal(9);
      expect(window.UpperVal).to.equal(9);
    });
  });

  describe('The setUpperRange method', () => {
    before(() => {
      stockChart.UpperVal = 8;
    });
    it('will set this.UpperVal to priceData.High if stockChart.UpperVal is less then priceData.High', () => {
      const priceData = { High: 9 };
      // const { UpperVal } = stockChart;
      stockChart.setUpperRange(priceData);
      expect(stockChart.UpperVal).to.equal(9);
      expect(window.UpperVal).to.equal(9);
    });
  });

  describe('The setLowerRange method', () => {
    before(() => {
      stockChart.LowerVal = null;
    });
    it('will set this.LowerVal to priceData.Low if stockChart.LowerVal is null', () => {
      const priceData = { Low: 1 };
      // const { LowerVal } = stockChart;
      stockChart.setLowerRange(priceData);
      expect(stockChart.LowerVal).to.equal(1);
      expect(window.LowerVal).to.equal(1);
    });
  });

  describe('The setLowerRange method', () => {
    before(() => {
      stockChart.LowerVal = 2;
    });
    it('will set this.LowerVal to priceData.Low if stockChart.LowerVal is less then priceData.Low', () => {
      const priceData = { Low: 1 };
      // const { LowerVal } = stockChart;
      stockChart.setLowerRange(priceData);
      expect(stockChart.LowerVal).to.equal(1);
      expect(window.LowerVal).to.equal(1);
    });
  });

  describe('The yPointPos method should return 50 if canvasHeight is set to 100', () => {
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

});
