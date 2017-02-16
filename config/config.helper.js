var path = require('path');
const EVENT = process.env.npm_lifecycle_event || '';
var ROOT = path.resolve(__dirname, '..');

//Helper function

function hasProcessFlag(flag) {
    return process.argv.join('').indexOf(flag) > -1;
}

function hasNpmFlag(flag) {
    return EVENT.includes(flag);
}

function isWebpackDevserver() {
    return process.argv[0] && !!(/webpack-dev-server/.exec(process.argv[1]));
}

var root = path.join.bind(path, ROOT);

exports.hasProcessFlag = hasProcessFlag;
exports.hasNpmFlag = hasNpmFlag;
exports.isWebpackDevserver = isWebpackDevserver;
exports.root = root;


