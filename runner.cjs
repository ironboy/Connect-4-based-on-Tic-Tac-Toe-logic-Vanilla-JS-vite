// no need to use during development! 
// - for publishing on NodeHills live server
const { execSync } = require('child_process');
execSync('/root/.nvm/versions/node/v20.11.1/bin/node backend/index.js');