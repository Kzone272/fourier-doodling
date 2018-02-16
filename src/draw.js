import _ from 'lodash';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let circles;

/**
 * Circles
 */


function makeRandomCircles(n) {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push({
      radius: 10 * (Math.random() * 3 + 1),
      rotation: 0,
      period: Math.random() * n,
    });
  }
  return array;
}

function makeOrderedCircles(n) {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push({
      radius: 10 * (n + 2 - i),
      rotation: 0,
      period: i + 1,
    });
  }
  return array;
}

function generateCircles(n = 5, method = 'random') {
  let array = [];
  switch (method) {
    case 'random':
      array = makeRandomCircles(n);
      break;
    case 'ordered':
      array = makeOrderedCircles(n);
      break;
    default:
      array = [];
  }
  return _.sortBy(array, 'period');
}

function drawCircle({ x, y, anchorX, anchorY, radius }) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, false);
  context.closePath();
  context.strokeStyle = '#aaa';
  context.stroke();

  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(anchorX, anchorY);
  context.strokeStyle = '#a55';
  context.stroke();
}

let t = 0;
const speed = 0.015;
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

/**
 * Lines
 */

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


/**
 * Frame Handlers
 */

let animationHandle = null;

function clearFrame() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  // color in the background
  context.fillStyle = '#eee';
  context.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawFrame() {
  clearFrame();

  processCircles();
  circles.forEach((circle) => {
    drawCircle(circle);
  });

  processLine();
  drawLine();

  t++;

  animationHandle = window.requestAnimationFrame(drawFrame);
}

/**
 * Animation Controls
 */

circles = generateCircles();

const state = {
  playing: false,
};

const controls = {
  pause() {
    if (state.playing) {
      window.cancelAnimationFrame(animationHandle);
      state.playing = false;
    }
  },

  resume() {
    if (!state.playing) {
      drawFrame();
      state.playing = true;
    }
  },

  restart() {
    this.pause();

    t = 0;
    processCircles();
    line = [];

    this.resume();
  },

  randomize() {
    circles = generateCircles(5, 'random');
    this.restart();
  },
};

export default controls;
