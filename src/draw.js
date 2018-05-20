import _ from 'lodash';
import * as d3 from 'd3';

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
      x: 0,
      y: 0,
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
      x: 0,
      y: 0,
    });
  }
  return array;
}

function makeSquareCircles(n) {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push({
      radius: 50 / (2 * i + 1),
      rotation: 0,
      period: 2 * i + 1,
      x: 0,
      y: 0,
    });
  }
  return array;
}

function generateCircles(n = 50, method = 'square') {
  let array = [];
  switch (method) {
    case 'random':
      array = makeRandomCircles(n);
      break;
    case 'ordered':
      array = makeOrderedCircles(n);
      break;
    case 'square':
      array = makeSquareCircles(n);
      break;
    default:
      array = [];
  }
  return _.sortBy(array, 'period');
}

const DoodleModel = class {
  constructor() {
    this.maxLineLength = 200;
    this.speed = 0.015;
    this.startX = 250;
    this.startY = 250;
    this.line = [];
    this.circles = [];

    this.reset();
  }

  reset() {
    this.t = 0;
    this.line = [];
    this.randomizeCircles();
  }

  randomizeCircles() {
    // We don't want to replace the arrays themselves
    // because that will break data binding
    this.circles.length = 0;
    this.circles.push(...generateCircles());
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
    if (!this.circles.length) {
      return;
    }
    const { anchorX: x, anchorY: y } = this.circles[this.circles.length - 1];
    this.line.push([x, y]);
    if (this.line.length > this.maxLineLength) {
      this.line.shift();
    }
  }
};

const CanvasRenderer = class {
  constructor(canvasId, doodleModel) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    this.doodleModel = doodleModel;

    this.t = 0;
  }

  drawLine() {
    if (!this.doodleModel.line.length) {
      return;
    }
    this.context.moveTo(...this.doodleModel.line[0]);
    this.context.beginPath();
    for (let i = 1; i < this.doodleModel.line.length; i++) {
      const [x, y] = this.doodleModel.line[i];
      this.context.lineTo(x, y);
    }
    this.context.lineWidth = 2;
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

const SvgRenderer = class {
  constructor(svgId, doodleModel) {
    this.doodleModel = doodleModel;
    this.svgContainer = d3.select(svgId);
    this.totalLength = 0;

    this.lineFunction = d3.line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveCatmullRom.alpha(0.5));

    this.linePath = this.svgContainer
      .append('path')
      .classed('line', true);

    this.reset();
  }

  reset() {
    this.linePath
      .datum(this.doodleModel.line);

    this.circles = this.svgContainer.selectAll('circle')
      .data(this.doodleModel.circles);

    this.circles = this.circles.enter()
      .append('circle')
      .classed('circle', true)
      .merge(this.circles);

    this.circles.exit()
      .remove();
  }

  drawFrame() {
    this.drawCircles();
    this.drawLine();
  }

  drawCircles() {
    this.circles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.radius);
  }

  drawLine() {
    this.linePath
      .attr('d', this.lineFunction);
  }
};

const doodleModel = new DoodleModel();
const canvasRenderer = new CanvasRenderer('canvas', doodleModel);
const svgRenderer = new SvgRenderer('svg', doodleModel);

let animationHandle = null;

function requestFrame() {
  doodleModel.tick();

  canvasRenderer.drawFrame();
  svgRenderer.drawFrame();

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
    svgRenderer.reset();

    this.resume();
  }

  randomize() {
    doodleModel.randomizeCircles();
    this.restart();
  }
};

export default Controls;
