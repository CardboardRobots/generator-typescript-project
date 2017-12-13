const Generator = require('yeoman-generator');

const fs = require('fs');

module.exports = class TypeScriptGenerator extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.option('browser');
        this.option('node');
    }

    promting() {
        this.prompts = {};

        return this.prompt([{
            type: 'input',
            name: 'projectName',
            message: 'Your project name',
            default: this.appname
        }, {
            type: 'input',
            name: 'version',
            message: 'Your project version',
            default: '0.0.0'
        }, {
            type: 'input',
            name: 'repository',
            message: 'Your project repository'
        }]).then((prompts) => {
            this.prompts.projectName = prompts.projectName;
            this.prompts.packageName = prompts.projectName.replace(/\s/g, '-').toLowerCase();
            this.prompts.repository = prompts.repository || ('https://github.com/[user-name]/' + this.packageName);
            return prompts;
        });
    }

    module() {
        this.log('Creating Module');

        this._template('docs/index.md', 'docs/index.md', this.prompts);

        this._template('src/html/index.html', 'src/html/index.html', this.prompts);

        this._copy('src/mocha/BrowserRunner.ts', 'src/mocha/BrowserRunner.ts');
        this._copy('src/mocha/DomIntegration.js', 'src/mocha/DomIntegration.js');
        this._copy('src/mocha/index.html', 'src/mocha/index.html');
        this._copy('src/mocha/NodeRunner.js', 'src/mocha/NodeRunner.js');

        this._copy('src/scripts/main.ts', 'src/scripts/main.ts');

        this._copy('src/tests/test.ts', 'src/tests/test.ts');

        this._copy('gitignore', '.gitignore');
        this._copy('npmignore', '.gitignore');
        this._copy('.travis.yml', '.travis.yml');
        this._copy('LICENSE', 'LICENSE');
        this._copy('mkdocs.yml', 'mkdocs.yml');
        this._copy('nodemon.json', 'nodemon.json');
        this._template('package.json', 'package.json', this.prompts);
        this._copy('README.md', 'README.md');
        this._copy('tsconfig.json', 'tsconfig.json');
        this._copy('webpack.config.js', 'webpack.config.js');
        this._copy('webpack.dev.config.js', 'webpack.dev.config.js');
    }

    _copy(source, destination) {
        this.fs.copy(
            this.templatePath(source),
            this.destinationPath(destination)
        );
    }

    _template(source, destination, data) {
        this.fs.copyTpl(
            this.templatePath(source),
            this.destinationPath(destination),
            data);
    }
};