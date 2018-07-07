// Copyright (c) Jeremy Tuloup.
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel, DOMWidgetView, ISerializers
} from '@jupyter-widgets/base';

import {
  EXTENSION_SPEC_VERSION
} from './version';

import { 
  Board
} from './bermuda_pixi/board';

export
class BermudaTriangleModel extends DOMWidgetModel {
  defaults() {
    return {...super.defaults(),
      _model_name: BermudaTriangleModel.model_name,
      _model_module: BermudaTriangleModel.model_module,
      _model_module_version: BermudaTriangleModel.model_module_version,
      _view_name: BermudaTriangleModel.view_name,
      _view_module: BermudaTriangleModel.view_module,
      _view_module_version: BermudaTriangleModel.view_module_version,
      running: false,
      speed: 1,
      frame: 0
    };
  }

  static serializers: ISerializers = {
      ...DOMWidgetModel.serializers,
      // Add any extra serializers here
    }

  static model_name = 'BermudaTriangleModel';
  static model_module = 'jupyter-plot-utils';
  static model_module_version = EXTENSION_SPEC_VERSION;
  static view_name = 'BermudaTriangleView';
  static view_module = 'jupyter-plot-utils';
  static view_module_version = EXTENSION_SPEC_VERSION;
}

export
class BermudaTriangleView extends DOMWidgetView {

  board : Board

  render() {
    this.el.classList.add('jupyter-widgets');
    setTimeout(() => {
      this.board = new Board(this.el, this.model);
    }, 0);
  }
  
  remove() {
    // TODO?
  }
}