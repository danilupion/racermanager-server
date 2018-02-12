const path = require('path');

const rootPath = './';
const nodeModulesPath = path.resolve(rootPath, 'node_modules');
const backendSrc = rootPath;
const frontedDest = path.resolve(backendSrc, 'public');

module.exports = {
  lint: {
    backend: {
      src: [
        path.join(backendSrc, '**', '*.js'),
        `!${path.join(frontedDest, 'js', '**', '*.js')}`,
        `!${nodeModulesPath}`,
      ],
      config: path.resolve(path.join(rootPath, '.eslintrc.js')),
    },
  },
  server: {
    path: path.join(backendSrc, 'server.js'),
    watch: [
      path.join(backendSrc, '**', '*.js'),
      `!${path.join(frontedDest, 'js', '**', '*.js')}`,
    ],
  },
};
