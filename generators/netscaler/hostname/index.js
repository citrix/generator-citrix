'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

module.exports = class extends yeoman {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'nsHostname',
        message: 'Please enter the value for the netscaler hostname',
        default: 'newHostName'
      }
    ]).then(
      function(answers) {
        this.config.set('nsHostname', answers.nsHostname);
        this.config.save();
      }.bind(this)
    );
  }

  writing() {
    // Write the file to the directory
    this.fs.copyTpl(
      this.templatePath('_NSHostname.cs'),
      this.destinationPath('NSHostname.cs'),
      {
        appName: this.config.get('appName'),
        nsHostname: this.config.get('nsHostname')
      }
    );
    this.log('\n');
    this.log(
      chalk.white('Added the Netscaler Hostname API helper class to the current project.')
    );
    this.log(
      chalk.white(
        'To use the newly added code, you can added the following call in your code where needed.'
      )
    );
    this.log('\n');
    this.log(chalk.bold.cyan('await ListHostname();'));
    this.log(
      'If you need to set the hostname of the netscaler add the following command to your code.'
    );
    this.log(
      chalk.bold.cyan('await SetHostname("' + this.config.get('nsHostname') + '");')
    );
    this.log('\n');
  }
};
