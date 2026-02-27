module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'not dead',
        'not IE 11',
      ],
    },
    cssnano: {
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          minifyFontValues: true,
          minifyGradients: true,
        },
      ],
    },
  },
};
