// npm run push "d"
var shell = require('shelljs');

const msg = process.argv[2] || 'feat: update blogs';
const sh = `
cd public
git commit -am "${msg}"
git push
`;

shell.exec(sh);