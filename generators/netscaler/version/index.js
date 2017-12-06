'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

module.exports = class extends yeoman {
  writing() {
    // Write the file to the directory
    this.fs.copyTpl(
      this.templatePath('_NSVersion.cs'),
      this.destinationPath('NSVersion.cs'),
      {
        appName: this.config.get('appName'),
        nsUsername: this.config.get('nsUsername'),
        nsPassword: this.config.get('nsPassword'),
        nsAddress: this.config.get('nsAddress'),
        nsPort: this.config.get('nsPort')
      }
    );
    this.log('\n');
    this.log(
      chalk.white('Added the Netscaler version API helper class to the current project.')
    );
    this.log(
      chalk.white(
        'To use the newly added code, you can added the following call in your code where needed.'
      )
    );
    this.log('\n');
    this.log(chalk.bold.cyan('await ListVersion();'));
    this.log('\n');
  }
};
