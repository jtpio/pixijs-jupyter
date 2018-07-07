import {
  DOMWidgetModel, DOMWidgetView, ISerializers
} from '@jupyter-widgets/base';

import {
  EXTENSION_SPEC_VERSION
} from '../version';

import * as PIXI from 'pixi.js';
import * as _ from 'lodash';



export
class ShapesModel extends DOMWidgetModel {
  defaults() {
    return {...super.defaults(),
      _model_name: ShapesModel.model_name,
      _model_module: ShapesModel.model_module,
      _model_module_version: ShapesModel.model_module_version,
      _view_name: ShapesModel.view_name,
      _view_module: ShapesModel.view_module,
      _view_module_version: ShapesModel.view_module_version,
      shape: 'circle',
      n_shapes: 1,
      rotate: false,
      wobble: false
    };
  }

  static serializers: ISerializers = {
      ...DOMWidgetModel.serializers,
    }

  static model_name = 'ShapesModel';
  static model_module = 'jupyter-plot-utils';
  static model_module_version = EXTENSION_SPEC_VERSION;
  static view_name = 'ShapesView';
  static view_module = 'jupyter-plot-utils';
  static view_module_version = EXTENSION_SPEC_VERSION;
}

export
class ShapesView extends DOMWidgetView {

  app: PIXI.Application
  squares: PIXI.Container
  circles: PIXI.Container

  render() {
    this.el.classList.add('jupyter-widgets');

    let app = new PIXI.Application(600, 600, { backgroundColor: 0x1099bb, antialias: true });
    this.setup(app);

    this.model.on('change:shape', () => {
      const shape = this.model.get('shape');
      this.squares.visible = shape === 'square';
      this.circles.visible = shape === 'circle';
    })

    setTimeout(() => {
      this.el.appendChild(app.view);
    }, 0);
  }
  
  remove() {
    this.app.stop();
    this.app.ticker.stop();
    this.app.ticker.destroy();
    this.app.stage.destroy({children: true});
    this.app.destroy(true);
  }
    
  protected setup(app : PIXI.Application) {
    this.app = app;
    this.squares = new PIXI.Container();
    this.circles = new PIXI.Container();
    app.stage.addChild(this.squares);
    app.stage.addChild(this.circles);
    this.createShapes(app);
  }
    
  protected createShapes(app: PIXI.Application) {

    const {width, height} = this.app.renderer;
    const [centerX, centerY] = [width / 2, height / 2];

    const n = this.model.get('n_shapes');
    _.range(n).forEach(i => {

      for (let container of [this.squares, this.circles]) {
        let shape = new PIXI.Graphics();
        shape.lineStyle(2, 0, 1);
        shape.beginFill(PIXI.utils.rgb2hex([i * 5, i * 100, i * 150]), 1);
        if (container == this.squares) {
          shape.drawRect(0, 0, 100, 100);
        } else {
          shape.drawCircle(0, 0, 100);
        }
        shape.endFill();

        let texture: PIXI.Texture = this.app.renderer.generateTexture(shape);
        let sprite: PIXI.Sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5);
        container.addChild(sprite);

        this.app.ticker.add(deltatime => {
          const t = this.app.ticker.lastTime;
          let R = 180;

          let wobble = this.model.get('wobble');
          let rotate = this.model.get('rotate');

          if (wobble) {
            R += 30 * Math.sin(t * 0.005 + i);
          }

          const x = R * Math.cos(i * 2 * Math.PI / n);
          const y = R * Math.sin(i * 2 * Math.PI / n);
          sprite.position.set(centerX + x, centerY + y);

          const shapeType = this.model.get('shape');

          if (rotate) {
            sprite.rotation += 0.01 * deltatime;
          }
        });
      }
    });

  }
}

