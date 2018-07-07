import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { R, WOOD_COLOR, COLORS, CR } from './settings';

export class Triangle extends PIXI.Container {

  triangle : PIXI.Graphics
  circles : PIXI.Graphics
  colors : number[]

  constructor(colors : number[]) {
    super();
    this.colors = colors
    this.setup();
  }

  protected setup() {
    this.drawTriangle();
    this.drawCircles();
  }

  protected drawTriangle() {
    this.triangle = new PIXI.Graphics();
    this.triangle.lineStyle(1, 0, 1);
    this.triangle.beginFill(WOOD_COLOR);
    let [x1, y1, x2, y2, x3, y3] : number[] = Triangle.getPoints(Math.PI / 6, R);
    this.triangle.moveTo(x1, y1);
    this.triangle.lineTo(x2, y2);
    this.triangle.lineTo(x3, y3);
    this.triangle.lineTo(x1, y1);
    this.triangle.endFill();
    this.addChild(this.triangle);
  }

  protected drawCircles() {
    this.circles = new PIXI.Graphics();
    this.circles.lineStyle(1, 0, 1);
    let circles : number[] = Triangle.getPoints(Math.PI / 2, 1.25 * CR);
    for (let i = 0; i < 3; i++) {
      const xx = circles[2 * i];
      const yy = circles[2 * i + 1];
      const color = COLORS[this.colors[i]];
      this.circles.beginFill(color);
      this.circles.drawCircle(xx, yy, CR / 2);
      this.circles.endFill();
    }
    this.addChild(this.circles);
  }

  public static getPoints(startAngle : number, radius : number) : number[] {
    let points: number[] = [];
    let n = 3;
    const da = 2 * Math.PI / n;
    for (let i = 0; i < n; i++) {
      const angle = startAngle - i * da;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      points.push(x);
      points.push(y);
    }
    return points;
  }


}