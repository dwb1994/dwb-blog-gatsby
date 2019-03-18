var shell = require('shelljs');

console.log('eee\n');
console.log(process.argv[2]);
const msg = process.argv[2];
const sh = `
cd public
git commit -am "${msg}"
git push
`;

shell.exec(sh);