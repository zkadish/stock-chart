
function startChart(chart, yaxis, xaxis, currency) {
  function render() {
    // StockChart
    chart.context.translate(chart.canvasWidth, chart.canvasHeight);
    chart.context.restore();
    chart.context.clearRect(0, 0, -(chart.canvasWidth), -(chart.canvasHeight));
    chart.context.save();

    // chart.context.strokeStyle = 'green';
    // chart.context.lineWidth = 15; //1 - non retana display
    // chart.context.strokeRect(0, 0, -(chart.canvasWidth), -(chart.canvasHeight));
    // chart.context.fill();

    chart.context.save();
    chart.VerticalLines(0, chart.processDate, 0);
    chart.upperHorizontalLines();
    chart.lowerHorizontalLines();
    chart.BarData(0, chart.yPointPos, chart.valueRange, 0, currency);
    chart.CurrentPrice(currency);
    chart.MonthYear(0, chart.processDate, 0);
    chart.ChartBorder();
    chart.context.restore();

    // yAxisChart
    yaxis.context.translate(yaxis.canvasWidth, yaxis.canvasHeight);
    yaxis.context.restore();
    yaxis.context.clearRect(0, 0, -(yaxis.canvasWidth), -(yaxis.canvasHeight));
    yaxis.context.save();

    yaxis.context.save();
    yaxis.upperHorizontalLines();
    yaxis.lowerHorizontalLines();
    yaxis.CurrentPrice(currency);
    yaxis.context.restore();

    // xAxisChart
    xaxis.context.translate(xaxis.canvasWidth, xaxis.canvasHeight);
    xaxis.context.restore();
    xaxis.context.clearRect(0, 0, -(xaxis.canvasWidth), -(xaxis.canvasHeight));
    xaxis.context.save();

    xaxis.context.save();
    xaxis.verticalLines(0, xaxis.processDate, 0);
    xaxis.context.restore();
  }

  // This fuction uses request animaiton frame to create a render loop
  // for all drawn elements in the canvas.
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  function update(elapsed) {
      // UPDATE VALUES
  }
  // let loopCount = 0;
  let lastUpdate = null;

  function loop() {
    // debugger;
    // console.log('loop');
    // if (loopCount === 1000) {
    //   console.log('canvas loop stopped!');
    //   return;
    // }

    const now = window.Date.now();

    if (lastUpdate) {
      const elapsed = (now - lastUpdate) / 1000;
      lastUpdate = now;
      update(elapsed);
      render();
    } else {
      lastUpdate = now;
    }

    // loopCount += 1;
    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);

}

export default startChart;
