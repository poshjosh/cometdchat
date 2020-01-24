var path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        index: './src/main/javascript/index.js'
    },    
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'src', 'main', 'resources', 'META-INF', 'resources'),
        libraryTarget: 'var',
        library: 'bcCometd'
    },
//    node: { fs: 'empty' },
    target: 'web',
    optimization: { minimize: true }
};
