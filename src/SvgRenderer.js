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

    this.xNotch = this.svgContainer
      .append('path')
      .classed('notch', true)
      .classed('x-notch', true);
    this.yNotch = this.svgContainer
      .append('path')
      .classed('notch', true)
      .classed('y-notch', true);

    this.reset();
  }

  reset() {
    this.xCircles = this.svgContainer.selectAll('.x-circle')
      .data(this.doodleModel.x.circles);
    this.yCircles = this.svgContainer.selectAll('.y-circle')
      .data(this.doodleModel.y.circles);

    this.xCircles.exit()
      .remove();
    this.yCircles.exit()
      .remove();

    this.xCircles = this.xCircles.enter()
      .append('circle')
      .classed('circle', true)
      .classed('x-circle', true)
      .merge(this.xCircles);
    this.yCircles = this.yCircles.enter()
      .append('circle')
      .classed('circle', true)
      .classed('y-circle', true)
      .merge(this.yCircles);
  }

  drawFrame() {
    this.drawCircles();
    this.drawLine();
    this.drawNotches();
  }

  drawCircles() {
    this.xCircles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.radius);
    this.yCircles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.radius);
  }

  drawNotches() {
    this.xNotch
      .attr('d', this.notchFunction(this.doodleModel.x.notch));
    this.yNotch
      .attr('d', this.notchFunction(this.doodleModel.y.notch));
  }

  drawLine() {
    this.linePath
      .attr('d', this.lineFunction(this.doodleModel.line));
  }
};

export default SvgRenderer;
