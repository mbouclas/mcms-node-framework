module.exports = function() {
    var client = './public/';
    var clientApp = client + 'app/';
    var assetsDir = client + 'assets/';
    var report = './report/';
    var root = './';
    var server = './src/server/';
    var specRunnerFile = 'specs.html';
    var temp = './.tmp/';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({devDependencies: true})['js'];
    var viewsDir = './App/views/';
    var templateName = 'layout.template.html';

    var config = {
        clientApp : clientApp,
        alljs: [
            './app/**/*.js',
            './*.js'
        ],
        plainCssDir : [client + 'stylesheets/**/*.css'],
        build: './public/build/',
        client: client,
        viewsDir : viewsDir,
        assetsDir : assetsDir,
        css: temp + '**/*.css',
        fonts: [
            './public/assets/bower_components/font-awesome/fonts/**/*.*',
            './public/assets/bower_components/bootstrap/fonts/**/*.*',
            './public/assets/fonts/fonts/**/*.*'
        ],
        less :{
            src : './public/assets/bower_components/bootstrap/less/',
            srcFile : './public/assets/bower_components/bootstrap/less/bootstrap.less',
            dest : './public/assets/bower_components/bootstrap/dist/css/'
        },
        megaNavBar :{
            src : './public/assets/MegaNavBar/less/',
            srcFile : './public/assets/MegaNavBar/less/MegaNavBar.less',
            dest : './public/assets/MegaNavBar/dist/'
        },
        html: clientApp + '**/*.html',
        htmltemplates: clientApp + '**/*.html',
        images: assetsDir + 'img/**/*.*',
        templateName : templateName,
        index: viewsDir + 'layout.html',
        indexTemplate: viewsDir + templateName,
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        plainCss : [
            assetsDir + 'css/main.css',
            assetsDir + 'css/main-responsive.css'
        ],
        report: report,
        root: root,
        server: server,
        temp: temp,

        /**
         * optimized files
         */
        optimized: {
            app: 'scripts.js',
            lib: 'lib.js'
        },

        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'mcms',
                standAlone: false,
                root: '/app/'
            }
        },

        /**
         * browser sync
         */
        browserReloadDelay: 1000,

        /**
         * Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: './public/assets/bower_components/',
            ignorePath: '..'
        },
        packages : [
            './package.json',
            './bower.json'
        ]
    };

    config.getWiredepDefaultOptions = function() {
        return options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
    };


    return config;
};