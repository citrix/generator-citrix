'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  initializing: function()
  {
    this.log(yosay('Welcome to the Citrix Netscaler project generator. We\'ll walk you through some prompts to help you get started with building an ASP.Net core application that targets Citrix Netscaler CPX.'));
  },
  prompting: function() {
    return this.prompt([{
      type    : 'input',
      name    : 'appName',
      message : 'Please enter your project name',
      default : this.appname // Default to current folder name
    },
    {
      type    : 'input',
      name    : 'nsAddress',
      message : 'Please enter you Citrix Netscaler IP Address',
      default : 'localhost'
    },
    {
      type    : 'input',
      name    : 'nsPort',
      message : 'Please enter you Citrix Netscaler Port',
      default : '32768'
    },
    {
      type    : 'input',
      name    : 'nsUsername',
      message : 'Please enter you Citrix Netscaler username',
      default : 'nsroot'
    },
    {
      type    : 'input',
      name    : 'nsPassword',
      message : 'Please enter you Citrix Netscaler password',
      default : 'nsroot'
    }]).then(function (answers) {
      this.log('app name', answers.appName);
      this.log('ns username', answers.nsUsername);
      this.appName = answers.appName;
      this.config.set('appName',answers.appName);
      this.config.set('nsUsername',answers.nsUsername);
      this.config.set('nsPassword',answers.nsPassword);
      this.config.set('nsPort',answers.nsPort);
      this.config.set('nsAddress',answers.nsAddress);
      this.config.save();

//      this.nsUsername = answers.nsUsername;
//      this.nsPassword = answers.nsPassword;
//      this.nsPort = answers.nsPort;
//      this.nsAddress = answers.nsAddress;
    }.bind(this));
  },
  writing: function(){
    //write the file to the directory
    this.fs.copyTpl(
      this.templatePath('_Program.cs'),
      this.destinationPath('Program.cs'),
        {appName:this.config.get('appName'),
          nsUsername:this.config.get('nsUsername'),
          nsPassword:this.config.get('nsPassword'),
          nsAddress:this.config.get('nsAddress'),
          nsPort:this.config.get('nsPort')});
    this.fs.copyTpl(
      this.templatePath('_project.json'),
      this.destinationPath('project.json'),{appName:this.config.get('appName')});  
    this.fs.copyTpl(
      this.templatePath('_NSAuthenticate.cs'),
      this.destinationPath('NSAuthenticate.cs'),{appName:this.config.get('appName')});
    this.fs.copyTpl(
      this.templatePath('_ReturnInfo.cs'),
      this.destinationPath('ReturnInfo.cs'),{appName:this.config.get('appName')});
    this.fs.copyTpl(
      this.templatePath('_Project.csproj'),
      this.destinationPath(this.config.get('appName') + '.csproj'));
  },
  install: function() {
    this.spawnCommand('dotnet',['restore']);
  }
});
