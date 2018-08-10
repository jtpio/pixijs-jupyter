# pixijs-jupyter

Materials and examples originally presented at [PyData Berlin 2018](https://pydata.org/berlin2018/schedule/presentation/32/).

This repository was generated using the [Widget TypeScript Cookiecutter](https://github.com/jupyter-widgets/widget-ts-cookiecutter).

This is for demo purposes and is not meant to be installed from [pypi](https://pypi.org) and [npm](https://npmjs.org).

![demo](./examples/img/pixijs-jupyterlab.gif)

## Run on Binder

The presentation from PyData Berlin 2018 is directly available on Binder, which means you can try it right away in your web browser!

[![Binder](https://img.shields.io/badge/launch-binder-brightgreen.svg)](https://mybinder.org/v2/gh/jtpio/pixijs-jupyter/pydata-berlin?urlpath=lab/tree/examples/presentation.ipynb)

Click on `presentation.ipynb` to view the notebook, or browse the files to look at the source code for the widgets.

![binder](./examples/img/binder.png)

## Run locally

The other option is to install all the dependencies and run it locally:

Using conda, create a new environment:

```bash
conda env create -f ./binder/environment.yml
```

Then:

```bash
# Install the Python package
pip install -e .

# JupyterLab Manager is required for widgets
jupyter labextension install @jupyter-widgets/jupyterlab-manager@0.36.2

# Link the extension
# This will fetch all the dependencies from pypi and npm, and might take a while to finish.
jupyter labextension link .

# start JupyterLab
jupyter lab
```
