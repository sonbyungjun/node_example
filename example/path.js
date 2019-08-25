const path = require('path');

console.log(path.dirname(__filename));
console.log(path.extname(__filename));
console.log(path.basename(__filename));

console.log(path.format({
  root: '/',
  dir: '/Users/byungjun/git/node_example',
  base: 'path.js',
  ext: '.js',
  name: 'path',
}));

console.log(path.normalize('c:\\users\\\zerocho\\\path.js'));

console.log(path.isAbsolute('/'));

console.log(path.relative('/Users/byungjun/git/node_example/path.js', '/Users'))

console.log(__dirname);
console.log(path.join(__dirname, '..', '..', '/git', '.', '/node_example'));

console.log(path.resolve(__dirname, '..', '..', '/git', '.', '/node_example'));