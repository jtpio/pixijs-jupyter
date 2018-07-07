import {
  DOMWidgetModel, DOMWidgetView, ISerializers
} from '@jupyter-widgets/base';

import {
  EXTENSION_SPEC_VERSION
} from '../version';

import * as PIXI from 'pixi.js';


export
class SimpleShapeModel extends DOMWidgetModel {
  defaults() {
    return {...super.defaults(),
      _model_name: SimpleShapeModel.model_name,
      _model_module: SimpleShapeModel.model_module,
      _model_module_version: SimpleShapeModel.model_module_version,
      _view_name: SimpleShapeModel.view_name,
      _view_module: SimpleShapeModel.view_module,
      _view_module_version: SimpleShapeModel.view_module_version,
      rotate: false,
    };
  }

  static serializers: ISerializers = {
      ...DOMWidgetModel.serializers,
    }

  static model_name = 'SimpleShape';
  static model_module = 'jupyter-plot-utils';
  static model_module_version = EXTENSION_SPEC_VERSION;
  static view_name = 'SimpleShape';
  static view_module = 'jupyter-plot-utils';
  static view_module_version = EXTENSION_SPEC_VERSION;
}

export
class SimpleShapeView extends DOMWidgetView {

  app: PIXI.Application
  square: PIXI.Container

  render() {
    this.el.classList.add('jupyter-widgets');

    let app = new PIXI.Application(400, 400, { backgroundColor: 0x1099bb, antialias: true });
    this.setup(app);

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
    super.remove();
  }
    
  protected setup(app : PIXI.Application) {
    this.app = app;
    this.square = new PIXI.Container();
    app.stage.addChild(this.square);
    this.createShape(app);
  }
    
  protected createShape(app: PIXI.Application) {
    const {width, height} = this.app.renderer;
    const [centerX, centerY] = [width / 2, height / 2];

    let shape = new PIXI.Graphics();
    shape.lineStyle(2, 0, 1);
    shape.beginFill(PIXI.utils.rgb2hex([5, 100, 150]), 1);
    shape.drawRect(0, 0, 100, 100);
    shape.endFill();

    shape.position.set(centerX, centerY);
    shape.pivot.set(50, 50);

    this.square.addChild(shape);

    this.app.ticker.add(deltatime => {
      const t = this.app.ticker.lastTime;

      let rotate = this.model.get('rotate');

      if (rotate) {
        shape.rotation += 0.01 * deltatime;
      }
    });
  }
}


