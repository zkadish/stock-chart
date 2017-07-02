
class startChart {
  constructor(chart, yaxis, xaxis) {
    this.chart = chart;
    this.yaxis = yaxis;
    this.xaxis = xaxis;
    this.price = null;

    this.lastUpdate = null;
    this.loop = this.loop.bind(this);
    this.rafId = null;
  }

  render(price) {
    this.chart.context.translate(this.chart.canvasWidth, this.chart.canvasHeight);
    this.chart.context.restore();
    this.chart.context.clearRect(0, 0, -(this.chart.canvasWidth), -(this.chart.canvasHeight));
    this.chart.context.save();

    // chart.context.strokeStyle = 'green';
    // chart.context.lineWidth = 15; //1 - non retana display
    // chart.context.strokeRect(0, 0, -(chart.canvasWidth), -(chart.canvasHeight));
    // chart.context.fill();

    this.chart.context.save();
    this.chart.VerticalLines(0, this.chart.processDate, 0, price);
    this.chart.upperHorizontalLines();
    this.chart.lowerHorizontalLines();
    this.chart.BarData(0, this.chart.yPointPos, this.chart.valueRange, 0, price);
    this.chart.CurrentPrice(price);
    this.chart.MonthYear(0, this.chart.processDate, 0, price);
    this.chart.ChartBorder();
    this.chart.context.restore();

    // yAxisChart
    this.yaxis.context.translate(this.yaxis.canvasWidth, this.yaxis.canvasHeight);
    this.yaxis.context.restore();
    this.yaxis.context.clearRect(0, 0, -(this.yaxis.canvasWidth), -(this.yaxis.canvasHeight));
    this.yaxis.context.save();

    this.yaxis.context.save();
    this.yaxis.upperHorizontalLines();
    this.yaxis.lowerHorizontalLines();
    this.yaxis.upperValues();
    this.yaxis.CurrentPrice(price);
    this.yaxis.context.restore();

    // xAxisChart
    this.xaxis.context.translate(this.xaxis.canvasWidth, this.xaxis.canvasHeight);
    this.xaxis.context.restore();
    this.xaxis.context.clearRect(0, 0, -(this.xaxis.canvasWidth), -(this.xaxis.canvasHeight));
    this.xaxis.context.save();

    this.xaxis.context.save();
    this.xaxis.verticalLines(0, this.xaxis.processDate, 0, price);
    this.xaxis.context.restore();
  }

  // This fuction uses request animaiton frame to create
  // a render loop for all drawn elements in the canvas.
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // function update(elapsed) {
  //     // UPDATE VALUES
  // }
  // let loopCount = 0;
  // let lastUpdate = null;

  stop() {
    window.cancelAnimationFrame(this.rafId);
    this.chart.chartUpperVal = null;
    this.chart.chartLowerVal = null;
    return true;
  }

  loop(timeStamp, price) {
    if (price) this.price = price;

    // console.log('loop');
    // if (loopCount === 1000) {
    //   console.log('canvas loop stopped!');
    //   return;
    // }

    const now = window.Date.now();

    if (this.lastUpdate) {
      // const elapsed = (now - this.lastUpdate) / 1000;
      this.lastUpdate = now;
      // update(elapsed);
      this.render(this.price);
    } else {
      this.lastUpdate = now;
    }

    // loopCount += 1;
    this.rafId = window.requestAnimationFrame(this.loop);
  }
}

export default startChart;
