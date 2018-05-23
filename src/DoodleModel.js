const DoodleModel = class {
  constructor() {
    this.speed = 0.015;
    this.startX = 250;
    this.startY = 250;
    this.line = [];
    this.maxLineLength = 400;
    this.x = {
      circles: [],
      startX: 250,
      startY: 50,
    };
    this.y = {
      circles: [],
      startX: 50,
      startY: 250,
    };

    this.reset();
  }

  reset() {
    this.t = 0;
    this.line = [];
    this.processCircleSet();
  }

  setCircleSet(circles) {
    // We don't want to replace the arrays themselves
    // because that will break data binding
    this.x.circles.length = 0;
    this.y.circles.length = 0;
    this.x.circles.push(...circles.x);
    this.y.circles.push(...circles.y);
  }

  tick() {
    this.processCircleSet();
    this.processLine();
    this.t++;
  }

  processCircleSet() {
    this.processCircles(this.x);
    this.processCircles(this.y);
  }

  processCircles(circleInfo) {
    circleInfo.notch = [];
    let x = circleInfo.startX;
    let y = circleInfo.startY;

    circleInfo.circles.forEach((circle) => {
      Object.assign(circle, { x, y });
      circleInfo.notch.push([x, y]);
      circle.rotation = (this.t * this.speed + circle.offset) * circle.frequency + circle.offset;
      x += circle.radius * Math.cos(circle.rotation);
      y += circle.radius * Math.sin(circle.rotation);
      circleInfo.notch.push([x, y]);
      Object.assign(circle, { anchorX: x, anchorY: y });
    });
  }

  getTip() {
    const { anchorX: x } = this.x.circles[this.x.circles.length - 1];
    const { anchorY: y } = this.y.circles[this.y.circles.length - 1];
    return [x, y];
  }

  processLine() {
    if (!this.x.circles.length || !this.y.circles.length) {
      return;
    }
    const tip = this.getTip();
    this.line.push(tip);
    this.x.notch.push(tip);
    this.y.notch.push(tip);
    if (this.line.length > this.maxLineLength) {
      this.line.shift();
    }
  }
};

export default DoodleModel;
