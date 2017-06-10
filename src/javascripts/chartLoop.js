function startChart (chart) {

  function render () {
    // console.log('render');
    chart.context.translate(chart.canvasWidth, chart.canvasHeight);
    chart.context.restore();
    chart.context.clearRect(0, 0, -(chart.canvasWidth), -(chart.canvasHeight));
    chart.context.save();

    // chart.context.strokeStyle = 'green';
    // chart.context.lineWidth = 15; //1 - non retana display
    // chart.context.strokeRect(0, 0, -(chart.canvasWidth), -(chart.canvasHeight));
    // chart.context.fill();

    //hLines.draw(0);
    chart.context.save(); 
    chart.ChartBorder();
    //chartArea.draw();
    chart.VerticalLines(0, chart.processDate, 0);
    chart.MonthYear(0, chart.processDate, 0);

    // chart.upperHorizontalLines((hLines.offset / 2) / hLines.offsetScale, 'lightblue');
    chart.upperHorizontalLines();
    //vMidPoint.draw();
    chart.lowerHorizontalLines();
    // hMidPoint.draw();
    //cPrice.draw();
    chart.BarData(0, chart.yPointPos, chart.valueRange, 0);
    //testSquare.draw();
    chart.context.restore();
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
