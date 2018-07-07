var loaders = [
  { test: /\.ts$/, loader: 'ts-loader' },
  { test: /\.json$/, loader: 'json-loader' },
  { test: /\.js$/, loader: "source-map-loader" },
];

module.exports = [
  {
    // Notebook extension
    entry: './src/index.ts',
    output: {
      filename: 'index.js',
      path: __dirname + '/ipyutils/nbextension/static',
      libraryTarget: 'amd'
    },
    module: {
      loaders: loaders
    },
    devtool: 'source-map',
    externals: ['@jupyter-widgets/base'],
    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".webpack.js", ".web.js", ".ts", ".js"]
    }
  },

  {
    // embeddable bundle (e.g. for docs)
    entry: './src/index.ts',
    output: {
        filename: 'embed-bundle.js',
        path: __dirname + '/docs/source/_static',
        library: "jupyter-plot-utils",
        libraryTarget: 'amd'
    },
    module: {
      loaders: loaders
    },
    devtool: 'source-map',
    externals: ['@jupyter-widgets/base'],
    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".webpack.js", ".web.js", ".ts", ".js"]
    },

  },
];
