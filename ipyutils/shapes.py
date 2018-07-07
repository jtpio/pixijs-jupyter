from ipywidgets import DOMWidget
from traitlets import Unicode, Int, Bool
from ._version import EXTENSION_SPEC_VERSION

module_name = "jupyter-plot-utils"


class Shapes(DOMWidget):
    _model_name = Unicode('ShapesModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)
    _view_name = Unicode('ShapesView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)

    n_shapes = Int(1).tag(sync=True)
    shape = Unicode('circle').tag(sync=True)
    rotate = Bool(False).tag(sync=True)
    wobble = Bool(False).tag(sync=True)

    def __init__(self, n_shapes, **kwargs):
        if n_shapes is not None:
            kwargs['n_shapes'] = n_shapes
        super().__init__(**kwargs)
        
