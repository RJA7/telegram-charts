const path = require('path');

const config = {
  context: path.resolve(__dirname, 'src', 'js', 'app'),

  entry: {
    main: ['./app.js'],
  },

  output: {
    path: path.resolve(__dirname, 'www'),
    filename: '[name].js',
  },

  mode: 'production',
};

module.exports = config;
