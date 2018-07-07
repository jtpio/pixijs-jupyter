define(function() {
    "use strict";

    window['requirejs'].config({
        map: {
            '*': {
                'jupyter-plot-utils': 'nbextensions/jupyter-plot-utils/index',
            },
        }
    });
    // Export the required load_ipython_extention
    return {
        load_ipython_extension : function() {}
    };
});
