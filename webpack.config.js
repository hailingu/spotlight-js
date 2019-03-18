const path = require('path');
const outputDir = path.resolve(__dirname, 'dist');
module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: outputDir,
        filename: 'spotlight.js'
    }
};
