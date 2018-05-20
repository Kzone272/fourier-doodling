import * as d3 from 'd3';

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

    this.notchFunction = d3.line()
      .x(d => d[0])
      .y(d => d[1]);

    this.notchPath = this.svgContainer
      .append('path')
      .classed('notch', true);

    this.reset();
  }

  reset() {
    this.circles = this.svgContainer.selectAll('circle')
      .data(this.doodleModel.circles);

    this.circles.exit()
      .remove();

    this.circles = this.circles.enter()
      .append('circle')
      .classed('circle', true)
      .merge(this.circles);
  }

  drawFrame() {
    this.drawCircles();
    this.drawLine();
    this.drawNotches();
  }

  drawCircles() {
    this.circles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.radius);
  }

  drawNotches() {
    this.notchPath
      .attr('d', this.notchFunction(this.doodleModel.notch));
  }

  drawLine() {
    this.linePath
      .attr('d', this.lineFunction(this.doodleModel.line));
  }
};

export default SvgRenderer;
