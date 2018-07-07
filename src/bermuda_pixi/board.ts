import * as PIXI from 'pixi.js';
import * as _ from 'lodash';

import { TweenMax, TimelineMax } from 'gsap';
import { DOMWidgetModel } from '@jupyter-widgets/base';
import { Triangle } from './triangle';
import { ANIM_W, ANIM_H, OFFSET_X, OFFSET_Y, R, COLORS, CR, N_TRIANGLES } from './settings';

interface Position {
  x: number,
  y: number,
  flip: number
}

const OUT = _.range(N_TRIANGLES).map(i => {
  return {
    x: ANIM_W * 0.4 + (i % 4) * 100,
    y: Math.floor(i / 4) * 100,
    r: 0,
    flip: 0,
  };
})

const ANIMATION_SPEED = 10;
const TWO_PI_OVER_THREE = 2 * Math.PI / 3;
const [START, END] = [_.cloneDeep(OUT), _.cloneDeep(OUT)];

export class Board extends PIXI.Application {

  model : DOMWidgetModel
  triangles : PIXI.Container
  edges : PIXI.Graphics
  border : PIXI.Graphics
  title: PIXI.Text
  timeline : TimelineMax

  private pos: Position[]

  constructor(element : HTMLElement, model : DOMWidgetModel) {
    super(1000, 600, {backgroundColor : 0xdddddd, antialias: true});
    element.appendChild(this.view);
    this.model = model;

    this.triangles = new PIXI.Container();
    this.edges = new PIXI.Graphics();
    this.border = new PIXI.Graphics();
    this.stage.addChild(this.triangles);
    this.stage.addChild(this.edges);
    this.stage.addChild(this.border);

    this.setup();
    this.setupListeners();
  }

  protected setup() {
    this.triangles.position.set(ANIM_W / 3, ANIM_H / 3);
    this.drawTriangles();

    const positions = this.model.get('positions');
    this.pos = positions.map((t : any) => {
      const flip = t.flip;
      const { x, y } = this.getTriangleCoordinates(flip, t.row, t.col);
      return { x, y, flip };
    });

    this.drawTitle();
    this.drawEdgeColors();
    this.drawBorder();
    this.buildTimeline();
  }

  protected setSpeed() {
    const speed = this.model.get('speed');
    this.timeline.timeScale(speed);
  }

  protected setTitle() {
    this.title.text = this.model.get('title');
    this.title.position.x = ANIM_W / 2;
    this.title.position.y = 30;
    this.title.anchor.set(0.5);
  }

  protected setupListeners() {
    this.model.on('change:frame', () => {
      const frame = this.model.get('frame');
      const states = this.model.get('states');
      const speed = this.model.get('speed');
      const progress = _.clamp(frame / (states.length - 1), 0, 1);
      this.timeline.pause();
      TweenMax.to(this.timeline, ANIMATION_SPEED / speed, {progress: progress});
    });

    this.model.on('change:running', () => {
      const running = this.model.get('running');
      this.setSpeed();
      if (running) {
        this.timeline.play();
      } else {
        this.timeline.pause();
      }
    });

    this.model.on('change:title', this.setTitle, this);
    this.model.on('change:speed', this.setSpeed, this);
    this.model.on('change:states', this.buildTimeline, this);
  }

  protected getTriangleCoordinates(flip : number, row : number, col : number) {
    const x = (col - row) * OFFSET_X;
    const y = row * OFFSET_Y + ((flip === 1) ? -R / 2 : 0);
    return { x, y };
  }

  protected findPos(triangleId : number, state : Array<[number, number]>) {
    return _.findIndex(state, e => (e && e[0] === triangleId));
  }

  protected buildTimeline() {
    const states : any[] = this.model.get('states');
    const nStates = states.length;

    // initialize the positions of the triangles
    _.range(N_TRIANGLES).forEach(i => {
      let triangle = this.triangles.getChildAt(i);
      const { x, y } = OUT[i];
      triangle.position.set(x, y);
      triangle.rotation = 0;
    });

    if (this.timeline) {
      this.timeline.kill();
    }

    this.timeline = new TimelineMax({
      autoRemoveChildren: false,
      smoothChildTiming: true,
      repeat: -1,
      paused: true
    });

    states.forEach((state, state_id) => {
      if (state_id >= nStates - 1) return;

      _.range(N_TRIANGLES).forEach(i => {

        let triangle = this.triangles.getChildAt(i);
        const [from, to] = [state, states[state_id + 1]];
        const [startPos, endPos] = [this.findPos(i, from), this.findPos(i, to)];

        let endPosition = {x: triangle.position.x, y: triangle.position.y, flip: 0};
        let endRotation = triangle.rotation;

        let doRotate = false;
        // on the board
        if (startPos > -1 && endPos > -1) {
          endPosition = this.pos[endPos];
          const [startRot, endRot] = [from[startPos][1], to[endPos][1]];
          if (startRot !== endRot || this.pos[startPos].flip !== this.pos[endPos].flip) {
            endRotation += -to[endPos][1] * TWO_PI_OVER_THREE;
            doRotate = true;
          }
        }
        // not in current state but in the next one
        else if (startPos < 0 && endPos > -1) {
          endPosition = this.pos[endPos];
          endRotation += -to[endPos][1] * TWO_PI_OVER_THREE;
          doRotate = true;
        }
        // in current state but not in the next one, bring back
        else if (startPos > -1 && endPos < 0) {
          endPosition = OUT[i];
          endRotation += OUT[i].r;
          doRotate = true;
        }

        endRotation += endPosition.flip * Math.PI;

        const time = state_id * ANIMATION_SPEED;

        if (doRotate) {
          let rotate = new TweenMax(triangle, ANIMATION_SPEED, { rotation: endRotation });
          this.timeline.add(rotate, time);
        }
        // skip if no movement
        if (startPos === endPos) return;

        let translate = new TweenMax(triangle.position, ANIMATION_SPEED, { x: endPosition.x, y: endPosition.y });
        this.timeline.add(translate, time);

      });
    });
  }

  protected drawTitle() {
    this.title = new PIXI.Text('', {align: 'center'});
    this.setTitle();
    this.stage.addChild(this.title);
  }

  protected drawTriangles() {
    const permutation = this.model.get('permutation');
    const positions = this.model.get('positions');
    const triangleList = this.model.get('TRIANGLES');
    for (let { id } of positions) {
      const colors = triangleList[permutation[id][0]];
      let triangle = new Triangle(colors);
      this.triangles.addChild(triangle);
    }
  }

  private drawEdgeColors() {
    this.edges.lineStyle(1, 0, 1);
    this.edges.position.set(ANIM_W / 3, ANIM_H / 3);
    const left = this.model.get('LEFT');
    const right = this.model.get('RIGHT')
    const bottom = this.model.get('BOTTOM')
    const positions = this.model.get('positions')
    for (let { flip, row, col, n_row } of positions) {
      const { x, y } = this.getTriangleCoordinates(flip, row, col);
      if (col === 0) {
        const colorLeft = COLORS[left[row]];
        const colorRight = COLORS[right[row]];
        this.edges.beginFill(colorLeft);
        this.edges.drawCircle(x - OFFSET_X, y - R / 2, CR / 2);
        this.edges.endFill();
        this.edges.beginFill(colorRight);
        this.edges.drawCircle(x + n_row * OFFSET_X, y - R / 2, CR / 2);
        this.edges.endFill();
      }

      if (row === 3 && col % 2 == 0) {
        this.edges.beginFill(COLORS[bottom[Math.floor(col / 2)]]);
        this.edges.drawCircle(x, 3.75 * OFFSET_Y, CR / 2);
        this.edges.endFill();
      }
    }
  }

  protected drawBorder() {
    this.border.lineStyle(2, 0, 1);

    const positions = this.model.get('positions');
    const { flip, row, col } = positions[6];
    const { y } = this.getTriangleCoordinates(flip, row, col);
    this.border.position.set(ANIM_W / 3, ANIM_H / 3 + y);
    let [x1, y1, x2, y2, x3, y3] : number[] = Triangle.getPoints(Math.PI / 6, 4 * R);
    this.border.moveTo(x1, y1);
    this.border.lineTo(x2, y2);
    this.border.lineTo(x3, y3);
    this.border.lineTo(x1, y1);
  }
}