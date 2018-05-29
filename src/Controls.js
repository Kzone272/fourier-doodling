import * as fourier from 'fft-js';
import DoodleModel from './DoodleModel';
import SvgRenderer from './SvgRenderer';
import makeCircles from './makeCircles';

window.f = fourier;

const doodleModel = new DoodleModel();
// doodleModel.setCircleSet({
//   x: makeCircles('squareX', 5),
//   y: makeCircles('square', 5),
// });

function getPointsFromSvg(pathId, numPoints = 8192) {
  const path = document.getElementById(pathId);
  const pathLength = path.getTotalLength();
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const { x, y } = path.getPointAtLength(i * pathLength / (numPoints - 1));
    points.push([x, y]);
  }

  return points;
}

function makeFourierCircles(points, offset = 0, cutoff = 0.01) {
  const n = points.length;
  const phasors = fourier.fft(points);
  const magnitudes = fourier.util.fftMag(phasors, n).map(mag => mag / n * 2);

  const array = [];
  for (let i = 1; i < magnitudes.length; i++) {
    const mag = magnitudes[i];
    if (mag < cutoff) {
      continue;
    }
    const angle = Math.atan2(phasors[i][1], phasors[i][0]);

    array.push({
      radius: mag,
      rotation: angle + offset,
      offset: angle + offset,
      frequency: i,
      x: 0,
      y: 0,
    });
  }
  console.log(array.length);
  return array;
}

const sigPoints = getPointsFromSvg('signature');
const sigX = sigPoints.map(p => p[0]);
const sigY = sigPoints.map(p => p[1]);
doodleModel.setCircleSet({
  x: makeFourierCircles(sigX, Math.PI / 2),
  y: makeFourierCircles(sigY, Math.PI / 2),
});

doodleModel.sigPoints = sigPoints;

const svgRenderer = new SvgRenderer('svg', doodleModel);

let animationHandle = null;

function requestFrame() {
  doodleModel.tick();

  svgRenderer.drawFrame();

  animationHandle = window.requestAnimationFrame(requestFrame);
}

function cancelFrame() {
  window.cancelAnimationFrame(animationHandle);
}

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
    doodleModel.setCircleSet({
      x: makeCircles('random', 5),
      y: makeCircles('random', 5),
    });
    this.restart();
  }

  square() {
    doodleModel.setCircleSet({
      x: makeCircles('squareX', 50),
      y: makeCircles('square', 50),
    });
    this.restart();
  }
};

export default Controls;
