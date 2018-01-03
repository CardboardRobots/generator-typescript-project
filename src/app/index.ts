import Generator from 'yeoman-generator';

import * as fs from 'fs';

export default class TypeScriptGenerator extends Generator {
    prompts: any;

    constructor(args, opts) {
        super(args, opts);
        this.option('browser', {});
        this.option('node', {});
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
            name: 'description',
            message: 'Your project description'
        }, {
            type: 'confirm',
            name: 'browser',
            message: 'Run in a browser?'
        }]).then((prompts) => {
            this.prompts.projectName = prompts.projectName;
            this.prompts.packageName = prompts.projectName.replace(/\s/g, '-').toLowerCase();
            this.prompts.repository = prompts.repository || ('https://github.com/[user-name]/' + this.prompts.packageName);
            this.prompts.description = prompts.description;
            this.prompts.browser = prompts.browser;
            this.log('browser:', this.prompts.browser);
            return prompts;
        });
    }

    async module() {
        this.log('Installing');
        await this.npmInstall([
            "@types/chai@4.0.10",
            "@types/mocha@2.2.44",
            "chai@4.1.2",
            "jsdom@11.5.1",
            "mocha@4.0.1",
            "nodemon@1.14.7",
            "rimraf@2.6.2",
            "ts-loader@3.2.0",
            "typescript@2.6.2",
            "webpack@3.10.0"
        ], {});
        this.log('Creating Module');

        this._template('docs/index.md', 'docs/index.md', this.prompts);

        this._template('src/html/index.html', 'src/html/index.html', this.prompts);

        this._copy('src/mocha/BrowserRunner.ts', 'src/mocha/BrowserRunner.ts');
        this._copy('src/mocha/DomIntegration.js', 'src/mocha/DomIntegration.js');
        this._copy('src/mocha/index.html', 'src/mocha/index.html');
        this._template('src/mocha/NodeRunner.js', 'src/mocha/NodeRunner.js', this.prompts);

        this._copy('src/scripts/main.ts', 'src/scripts/main.ts');

        this._copy('src/tests/test.ts', 'src/tests/test.ts');

        this._copy('gitignore', '.gitignore');
        this._copy('npmignore', '.gitignore');
        this._copy('.travis.yml', '.travis.yml');
        this._copy('LICENSE', 'LICENSE');
        this._copy('mkdocs.yml', 'mkdocs.yml');
        this._copy('nodemon.json', 'nodemon.json');
        this._template('package.json', 'package.json', this.prompts);
        this._template('README.md', 'README.md', this.prompts);
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