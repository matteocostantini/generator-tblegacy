const Generator = require('yeoman-generator');
var optionOrPrompt = require('yeoman-option-or-prompt');
const chalk = require('chalk');
const _ = require('lodash');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);

        this.argument('tableName', { type: String, required: false });

        this.optionOrPrompt = optionOrPrompt;
        
    }

    initializing() {
        // var currFolder = this.destinationRoot();
        var currFolder = this.contextRoot;
        var folders = _.split(currFolder,'\\');
        if (folders.length < 3) {
            this.env.error("Current folder must be a module of a TaskBuilder Application  (<your instance>\\Standard\\Applications\\<your app>\\<your module>).");
        }
        var appPath = currFolder.substring(0, currFolder.length - folders[folders.length - 1].length - folders[folders.length - 2].length - 2);
        if (!_.toLower(appPath).endsWith('\\standard\\applications')) {
            this.env.error("Current folder must be a module of a TaskBuilder Application  (<your instance>\\Standard\\Applications\\<your app>\\<your module>).");
        }

        this.options['appName'] = folders[folders.length - 2];
        this.options['moduleName'] = folders[folders.length - 1];
    }

    prompting() {
        this.log('Welcome to the ' + chalk.red('TBLegacy Table') + ' generator!');
        this.log('You are about to add a table to the ' + chalk.bold(this.options.moduleName) + ' module of the ' + chalk.bold(this.options.appName) + ' application.' )
        const prompts = [ {
            name: 'tableName',
            message: 'What is your table name ?',
            default: this.options.tableName
        }];

        return this.optionOrPrompt(prompts).then(properties => {
            this.properties = properties;

        });
    }    

    writing() {
        this.destinationRoot(this.contextRoot);
        this.fs.copyTpl(
            this.templatePath('_table.sql'),
            this.destinationPath('DatabaseScript\\Create\\All\\' + this.properties.tableName + '.sql'),
            this.properties
        );
    }    
}