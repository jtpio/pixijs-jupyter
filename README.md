# pixijs-jupyter

This widget was generated using the [Widget TypeScript Cookiecutter](https://github.com/jupyter-widgets/widget-ts-cookiecutter).

This is for demo purposes and is not meant to be installed from [pypi](https://pypi.org) and [npm](https://npmjs.org).

## Run on Binder

Try out right away on [Binder](https://mybinder.org/v2/gh/jtpio/pixijs-jupyter)!

## Run locally

```bash
# Install the Python package
pip install -e .

# JupyterLab Manager is required for widgets
jupyter labextension install @jupyter-widgets/jupyterlab-manager

# Link the extension
# This will fetch all the dependencies from pypi and npm, and might take a while to finish.
jupyter labextension link .

# start JupyterLab
jupyter lab
```

For the classic Jupyter Notebook:

```bash
jupyter nbextension enable --py --sys-prefix ipyutils
jupyter notebook
```
