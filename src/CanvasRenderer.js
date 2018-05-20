
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

export default CanvasRenderer;
