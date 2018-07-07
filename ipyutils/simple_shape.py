from ipywidgets import DOMWidget
from traitlets import Unicode, Int, Bool
from ._version import EXTENSION_SPEC_VERSION

module_name = "jupyter-plot-utils"


class SimpleShape(DOMWidget):
    _model_name = Unicode('SimpleShapeModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)
    _view_name = Unicode('SimpleShapeView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)

    rotate = Bool(False).tag(sync=True)
