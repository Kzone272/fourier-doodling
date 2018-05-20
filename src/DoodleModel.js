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
    this.processCircles();
  }

  setCircles(circles) {
    // We don't want to replace the arrays themselves
    // because that will break data binding
    this.circles.length = 0;
    this.circles.push(...circles);
  }

  tick() {
    this.processCircles();
    this.processLine();
    this.t++;
  }

  processCircles() {
    this.notch = [];
    let x = this.startX;
    let y = this.startY;
    this.circles.forEach((circle) => {
      Object.assign(circle, { x, y });
      this.notch.push([x, y]);
      x += circle.radius * Math.cos(circle.rotation);
      y += circle.radius * Math.sin(circle.rotation);
      this.notch.push([x, y]);
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

export default DoodleModel;
