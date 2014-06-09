(function () {
  'use strict';

  var VIS_EL = '#vis';
  var TITLE_ID = 'vis-name';
  var AVAIL_VIS = {
    'random walk': randomWalk
  };
  var height = 128;
  var width = height;
  var svg = d3.select(VIS_EL).append('svg')
    .attr({
      height: height,
      width: width
    });
  var vis = svg.append('circle')
    .attr({
      // this -2 offset is necessary to avoid lopping off stroke
      r: (width - 2) / 2,
      transform: "translate(" + (width / 2) + "," + (height / 2) + ")",
      fill: 'none',
      stroke: 'black',
      'stroke-width': 2
    });
  var inCircle = function (x, y) {
    var sq = function (x) { return Math.pow(x, 2); };
    var square_dist = sq((width / 2) - x) + sq((height / 2) - y);
    return square_dist <= sq((width - 2) / 2);
  };
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  var generatePointInCircle = function (xMin, xMax, yMin, yMax) {
    while (true) {
      var x = getRandomInt(xMin, xMax);
      var y = getRandomInt(yMin, yMax);
      if (inCircle(x, y)) return [x, y];
    }
  };
  var generateInitialPoint = function () {
    return generatePointInCircle(0, width, 0, height);
  };
  var generateAdjacentPoint = function (x, y, fudge) {
    // not strictly adjacent points, but points with +- fudge factor
    // in the random walk, makes us have **large strides**
    fudge = fudge || 20;
    return generatePointInCircle(x - fudge, x + fudge, y - fudge, y + fudge);
  };

  function randomWalk () {
    document.getElementById(TITLE_ID).innerHTML = 'A Random Walk';
    var lastPoint = generateInitialPoint();
    // warn: every tick we create another svg line element
    // put a hard limit on the number we can have
    var TICK_IN_MS = 100;
    var MAX_TICKS = 1000;
    console.debug('walk will run for ' + (MAX_TICKS / (1000 / TICK_IN_MS) / 60) + ' minutes');
    var ticks = 0;
    var interval = setInterval(function () {
      var coord = generateAdjacentPoint(lastPoint[0], lastPoint[1]);
      var line = svg.append('line')
        .attr({
          x1: lastPoint[0],
          y1: lastPoint[1],
          x2: lastPoint[0],
          y2: lastPoint[1],
          'stroke-width': 1,
          'stroke': 'black'
        })
      .transition()
      .attr({
        x2: coord[0],
        y2: coord[1]
      })
      .duration(100);
      lastPoint = coord;
      ticks++;
      if (ticks >= MAX_TICKS) {
        clearInterval(interval);
        console.debug('hit max ticks...stopping');
      }
    }, TICK_IN_MS);
  }

  // run the vis
  _.sample(AVAIL_VIS)();
})();
