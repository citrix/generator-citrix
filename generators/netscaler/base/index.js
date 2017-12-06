'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var thisGenerator = null;

module.exports = class extends yeoman {
  initializing() {
    thisGenerator = this;
  }

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'appName',
        message: 'Please enter your project name',
        default: this.appname // Default to current folder name
      },
      {
        type: 'input',
        name: 'nsAddress',
        message: 'Please enter your Citrix Netscaler IP Address',
        default: 'localhost'
      },
      {
        type: 'input',
        name: 'nsPort',
        message: 'Please enter your Citrix Netscaler Port',
        default: function(answers) {
          return answers.nsCPXHttpPort;
        }
      },
      {
        type: 'input',
        name: 'nsUsername',
        message: 'Please enter your Citrix Netscaler username',
        default: 'nsroot'
      },
      {
        type: 'input',
        name: 'nsPassword',
        message: 'Please enter your Citrix Netscaler password',
        default: 'nsroot'
      }
    ]).then(function(answers) {
      thisGenerator.config.set('appName', answers.appName);
      thisGenerator.config.set('nsUsername', answers.nsUsername);
      thisGenerator.config.set('nsPassword', answers.nsPassword);
      thisGenerator.config.set('baseAppInstalled', true);
      thisGenerator.config.save();
    });
  }

  writing() {
    // Write the file to the directory
    this.fs.copyTpl(
      this.templatePath('_Program.cs'),
      this.destinationPath('Program.cs'),
      {
        appName: this.config.get('appName'),
        nsUsername: this.config.get('nsUsername'),
        nsPassword: this.config.get('nsPassword'),
        nsAddress: this.config.get('nsAddress'),
        nsPort: this.config.get('nsPort')
      }
    );
    this.fs.copyTpl(
      this.templatePath('_NSAuthenticate.cs'),
      this.destinationPath('NSAuthenticate.cs'),
      { appName: this.config.get('appName') }
    );
    this.fs.copyTpl(
      this.templatePath('_ReturnInfo.cs'),
      this.destinationPath('ReturnInfo.cs'),
      { appName: this.config.get('appName') }
    );
    this.fs.copyTpl(
      this.templatePath('_Project.csproj'),
      this.destinationPath(this.config.get('appName') + '.csproj')
    );

    this.log('\n');
    this.log(
      chalk.white('Created the base NetScaler application with authentication project.')
    );
    this.log(
      chalk.white(
        "To use the sample, you can execute 'dotnet run ' or open the sample in a text editor."
      )
    );
    this.log('\n');
  }

  install() {
    // Call the dotnet restore command.
    this.spawnCommand('dotnet', ['restore']);
  }
};
