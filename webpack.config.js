var path = require('path');

var config = {
    mode: 'development',
    entry: {
        index: './src/main/javascript/index.js'
    },    
    output: {
        filename: 'main.js',
        libraryTarget: 'var',
        library: 'bcCometd'
    },
//    node: { fs: 'empty' },
    target: 'web',
    optimization: { minimize: true }
};

module.exports = function(env, argv) {

    var devPath = path.resolve(__dirname, 'dist');
    var prodPath = path.resolve(__dirname, 'src', 'main', 'resources', 'META-INF', 'resources');
            
    // Override with that specified from command line
    //
    if(env === 'dev') {
        config.mode = 'development';
    }
    if(env === 'prod') {
        config.mode = 'production';
    }
    
    config.output.path = config.mode === 'development' ? devPath : prodPath;

    return config;
};
