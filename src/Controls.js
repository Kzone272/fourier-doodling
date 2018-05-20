import DoodleModel from './DoodleModel';
import SvgRenderer from './SvgRenderer';
import makeCircles from './makeCircles';

const doodleModel = new DoodleModel();
doodleModel.setCircles(makeCircles('square', 50));

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
    doodleModel.setCircles(makeCircles('random', 5));
    this.restart();
  }

  square() {
    doodleModel.setCircles(makeCircles('square', 50));
    this.restart();
  }
};

export default Controls;
