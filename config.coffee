exports.config =
    paths:
        public: "dist"
    files:
        javascripts:
            joinTo:
                'react-tinymce.js': 'app/javascripts/**/*.js'
    plugins:
        babel:
            presets: ['es2015', 'react']
