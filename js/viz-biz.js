(function () {
  'use strict';

  var VIS_EL = '#vis';
  var TITLE_ID = 'vis-name';
  var AVAIL_VIS = [spirograph, randomWalk];
  var HEIGHT = 128;
  var WIDTH = HEIGHT;
  var svg = d3.select(VIS_EL).append('svg')
    .attr({
      height: HEIGHT,
      width: WIDTH
    });
  var vis = svg.append('circle')
    .attr({
      // this -2 offset is necessary to avoid lopping off stroke
      r: (WIDTH - 2) / 2,
      transform: "translate(" + (WIDTH / 2) + "," + (HEIGHT / 2) + ")",
      fill: 'none',
      stroke: 'black',
      'stroke-width': 2
    });
  var inCircle = function (x, y) {
    var sq = function (x) { return Math.pow(x, 2); };
    var square_dist = sq((WIDTH / 2) - x) + sq((HEIGHT / 2) - y);
    return square_dist <= sq((WIDTH - 2) / 2);
  };
  // Inclusive ranges!
  var getRandomFloat = function (min, max) {
    return Math.random() * (max - min) + min;
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
    return generatePointInCircle(0, WIDTH, 0, HEIGHT);
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

  function spirograph () {
    document.getElementById(TITLE_ID).innerHTML = 'Spirograph';
    var TICK_IN_MS = 155;
    var MAX_T = 100;
    var RADIUS = (WIDTH - 2) / 2;
    var R = RADIUS;
    var l = getRandomFloat(0.1, 0.9);
    var k = getRandomFloat(0.1, 0.9);
    var t = 0;

    function parametric (t) {
      var x = R * ((1-k) * Math.cos(t) + l * k * Math.cos(t / k - t));
      var y = R * ((1-k) * Math.sin(t) - l * k * Math.sin(t / k - t));
      return [x, y];
    }

    console.log(['R = ' + R, 'l = ' + l, 'k = ' + k,].join('; '));

    var lastPoint = parametric(0);
    var interval = setInterval(function () {
      // R = getRandomInt(0, RADIUS);
      var coord = parametric(t);
      var line = svg.append('line')
        .attr({
          x1: lastPoint[0] + RADIUS,
          y1: lastPoint[1] + RADIUS,
          x2: lastPoint[0] + RADIUS,
          y2: lastPoint[1] + RADIUS,
          'stroke-width': 1,
          'stroke': 'black'
        })
      .transition()
      .ease('linear')
      .attr({
        x2: coord[0] + RADIUS,
        y2: coord[1] + RADIUS
      })
      .duration(TICK_IN_MS);
      lastPoint = coord;
      t++;

      if (t > MAX_T) {
        clearInterval(interval);
        console.debug('t = ' + MAX_T + '...stopping');
      }
    }, TICK_IN_MS);
  }

  AVAIL_VIS[getRandomInt(0, AVAIL_VIS.length-1)]();
})();
