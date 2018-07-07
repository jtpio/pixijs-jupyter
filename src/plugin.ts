// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  Application, IPlugin
} from '@phosphor/application';

import {
  Widget
} from '@phosphor/widgets';

import {
  IJupyterWidgetRegistry
 } from '@jupyter-widgets/base';

import {
  BermudaTriangleModel, BermudaTriangleView,
} from './widget';

import {
  ShapesModel, ShapesView
} from './shapes/widget';

import {
  EXTENSION_SPEC_VERSION
} from './version';
import { SimpleShapeModel, SimpleShapeView } from './simple_shapes/widget';

const EXTENSION_ID = 'jupyter.plot.utils';

const examplePlugin: IPlugin<Application<Widget>, void> = {
  id: EXTENSION_ID,
  requires: [IJupyterWidgetRegistry],
  activate: activateWidgetExtension,
  autoStart: true
};

export default examplePlugin;


/**
 * Activate the widget extension.
 */
function activateWidgetExtension(app: Application<Widget>, registry: IJupyterWidgetRegistry): void {
  registry.registerWidget({
    name: 'jupyter-plot-utils',
    version: EXTENSION_SPEC_VERSION,

    // Expose all the widgets
    exports: {
      BermudaTriangleModel: BermudaTriangleModel,
      BermudaTriangleView: BermudaTriangleView,
      SimpleShapeModel: SimpleShapeModel,
      SimpleShapeView: SimpleShapeView,
      ShapesModel: ShapesModel,
      ShapesView: ShapesView,
    }
  });
}
