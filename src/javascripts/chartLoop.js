
function startChart(chart, yaxis) {
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
    chart.ChartBorder();
    chart.VerticalLines(0, chart.processDate, 0);
    chart.MonthYear(0, chart.processDate, 0);
    chart.upperHorizontalLines();
    chart.lowerHorizontalLines();
    chart.CurrentPrice();
    chart.BarData(0, chart.yPointPos, chart.valueRange, 0);
    chart.context.restore();

    // yAxisChart
    yaxis.context.translate(yaxis.canvasWidth, yaxis.canvasHeight);
    yaxis.context.restore();
    yaxis.context.clearRect(0, 0, -(chart.canvasWidth), -(chart.canvasHeight));
    yaxis.context.save();

    yaxis.context.save();
    yaxis.upperHorizontalLines();
    yaxis.lowerHorizontalLines();
    yaxis.CurrentPrice();
    yaxis.context.restore();
  }

  // This fuction uses request animaiton frame to create a render loop
  // for all drawn elements in the canvas.
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  function update (elapsed) {
      // UPDATE VALUES
  }
  let loopCount = 0;
  let lastUpdate = null;

  function loop() {
    // debugger;
    // console.log('loop');
    // if (loopCount === 1000) {
    //   console.log('canvas loop stopped!');
    //   return;
    // }

    var now = window.Date.now();

    if (lastUpdate) {
      var elapsed = (now-lastUpdate) / 1000;
      lastUpdate = now;

      update(elapsed);
      render();
    } else {
      lastUpdate = now;
    }

    loopCount++;
    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);

}

export default startChart;
