import _ from 'lodash';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

function clearFrame() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  // color in the background
  context.fillStyle = '#EEEEEE';
  context.fillRect(0, 0, canvasWidth, canvasHeight);
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

const circles = _.sortBy(makeRandomCircles(5), 'period');

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

function drawFrame() {
  clearFrame();

  processCircles();

  circles.forEach((circle) => {
    drawCircle(circle);
  });

  processLine();
  drawLine();

  t++;

  window.requestAnimationFrame(drawFrame);
}

drawFrame();
