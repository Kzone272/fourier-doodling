import _ from 'lodash';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let animHandler;
let circles;

// ------------------------------------------------------------
//            Config
// ------------------------------------------------------------
const circleMethods = {
  ordered: {
    radius: (n, i) => 10 * (`${n}` - `${i}`),
    rotation: (n, i) => 0,
    period: (n, i) => i + 1,
  },
  random: {
    radius: (n, i) => 10 * (Math.random() * 3 + 1),
    rotation: (n, i) => 0,
    period: (n, i) => Math.random() * `${n}`,
  }
}

let options = {
  circle: {
    count: 5,
    type: 'period',
    method: circleMethods.random,
  },

  set: function(element, pair) {
    if (!pair.key || !pair.value) return;

    switch(element) {
      case 'circle':
        options.circle[pair.key] = pair.value;
      break;
    }
  },
}

// ------------------------------------------------------------
//            Circle Generation
// ------------------------------------------------------------
function generateCircles() {
  const array = [];
  let circleMethod = options.circle.method;
  let n = options.circle.count;
  for (let i = 0; i < n; i++) {
    array.push({
      radius: circleMethod.radius(n, i),
      rotation: circleMethod.rotation(n, i),
      period: circleMethod.period(n, i),
    });
  }
  return _.sortBy(array, options.circle.type);
}

// ------------------------------------------------------------
//            Circle Drawing
// ------------------------------------------------------------

function drawCircle({ x, y, anchorX, anchorY, radius }) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, false);
  context.closePath();
  context.strokeStyle = '#ccc';
  context.stroke();

  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(anchorX, anchorY);
  context.strokeStyle = 'red';
  context.stroke();
}

let t = 0;
const speed = 0.03;
const startX = 250;
const startY = 250;

function processCircles() {
  let x = startX;
  let y = startY;
  circles.forEach((circle) => {
    Object.assign(circle, { x, y });
    x += circle.radius * Math.cos(circle.rotation);
    y += circle.radius * Math.sin(circle.rotation);
    Object.assign(circle, { anchorX: x, anchorY: y });
    circle.rotation = t * circle.period * speed;
  });
}

let line = [];
const length = 200;

// ------------------------------------------------------------
//            Line Drawing
// ------------------------------------------------------------

function processLine() {
  const { anchorX: x, anchorY: y } = circles[circles.length - 1];
  line.push({ x, y });
  line = line.slice(-length);
}

function drawLine() {
  context.moveTo(line[0].x, line[0].y);
  context.beginPath();
  for (let i = 1; i < line.length; i++) {
    const { x, y } = line[i];
    context.lineTo(x, y);
  }
  context.strokeStyle = 'green';
  context.stroke();
}

// ------------------------------------------------------------
//            Frame Handlers
// ------------------------------------------------------------
function cancelAnimation(handler) {
  window.cancelAnimationFrame(handler);
  handler = null;
}

function requestAnimation(handler, anim) {
  cancelAnimation(handler);
  animHandler = window.requestAnimationFrame(anim);
}

function clearFrame() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  // color in the background
  context.fillStyle = '#REEEEE';
  context.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawFrame() {
  clearFrame();

  if (!circles) {
    circles = generateCircles();
  }
  processCircles();

  circles.forEach((circle) => {
    drawCircle(circle);
  });

  processLine();
  drawLine();

  t++;

  requestAnimation(animHandler, drawFrame);
}

// ------------------------------------------------------------
//            Animation Controls
// ------------------------------------------------------------
const controls = {
  pauseAnim: function() {
    cancelAnimation(animHandler);
  },

  resumeAnim: function() {
    requestAnimation(animHandler, drawFrame);
  },

  startAnim: function() {
    this.resumeAnim();
  },

  resetAnim: function() {
    this.pauseAnim();
    circles = null;

    requestAnimation(animHandler, drawFrame);
  },

  randomize: function() {
    options.set('circle', {
      key: 'method',
      value: _.sample(circleMethods),
    });
    options.set('circle', {
      key: 'count',
      value: Math.floor(Math.random() * 10) + 1,
    });
    this.resetAnim();
  },
}


export {canvas, context, controls}
