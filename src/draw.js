import _ from 'lodash';

const DoodleModel = class {
  constructor() {
    this.lineLength = 200;
    this.speed = 0.015;
    this.startX = 250;
    this.startY = 250;

    this.reset();
  }

  reset() {
    this.circles = [];
    this.line = [];
    this.t = 0;
  }

  tick() {
    this.processCircles();
    this.processLine();
    this.t++;
  }

  processCircles() {
    let x = this.startX;
    let y = this.startY;
    this.circles.forEach((circle) => {
      Object.assign(circle, { x, y });
      x += circle.radius * Math.cos(circle.rotation);
      y += circle.radius * Math.sin(circle.rotation);
      Object.assign(circle, { anchorX: x, anchorY: y });
      circle.rotation = this.t * circle.period * this.speed;
    });
  }

  processLine() {
    const { anchorX: x, anchorY: y } = this.circles[this.circles.length - 1];
    this.line.push({ x, y });
    this.line = this.line.slice(-this.lineLength);
  }
};

/**
 * Circle Makers
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

const CanvasRenderer = class {
  constructor(canvasId, doodleModel) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    this.doodleModel = doodleModel;

    this.t = 0;
  }

  drawLine() {
    this.context.moveTo(this.doodleModel.line[0].x, this.doodleModel.line[0].y);
    this.context.beginPath();
    for (let i = 1; i < this.doodleModel.line.length; i++) {
      const { x, y } = this.doodleModel.line[i];
      this.context.lineTo(x, y);
    }
    this.context.strokeStyle = 'green';
    this.context.stroke();
  }

  drawCircle({ x, y, anchorX, anchorY, radius }) {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2, false);
    this.context.closePath();
    this.context.strokeStyle = '#aaa';
    this.context.stroke();

    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.lineTo(anchorX, anchorY);
    this.context.strokeStyle = '#a55';
    this.context.stroke();
  }

  drawFrame() {
    this.clearFrame();

    this.doodleModel.circles.forEach((circle) => {
      this.drawCircle(circle);
    });

    this.drawLine();
  }

  clearFrame() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // color in the background
    this.context.fillStyle = '#eee';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

const doodleModel = new DoodleModel();
doodleModel.circles = generateCircles();
const canvasRenderer = new CanvasRenderer('canvas', doodleModel);

let animationHandle = null;

function requestFrame() {
  doodleModel.tick();
  canvasRenderer.drawFrame();

  animationHandle = window.requestAnimationFrame(requestFrame);
}

function cancelFrame() {
  window.cancelAnimationFrame(animationHandle);
}

/**
 * Animation Controls
 */

const Controls = class {
  constructor() {
    this.playing = false;
  }

  pause() {
    if (this.playing) {
      cancelFrame();
      this.playing = false;
    }
  }

  resume() {
    if (!this.playing) {
      requestFrame();
      this.playing = true;
    }
  }

  restart() {
    this.pause();

    doodleModel.reset();

    this.resume();
  }

  randomize() {
    doodleModel.circles = generateCircles(5, 'random');
    this.restart();
  }
};

export default Controls;
