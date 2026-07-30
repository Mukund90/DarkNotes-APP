const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    globals: true,
    setupFiles: ['./tests/vitest.setup.js'],
  },
});
