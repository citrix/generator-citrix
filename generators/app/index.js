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
      type    : 'confirm',
      name    : 'nsCPX',
      message : function(answers){
        return 'Would you like to add Netscaler CPX to ' + answers.appName;
      }
    },
    {
      when    : function(response) {
        return response.nsCPX;
      },
      type    : 'input',
      name    : 'nsCPXHttpPort',
      message : 'Please enter the local HTTP port to map to the http port in the docker container',
      default : '32777'
    },   
    {
      when    : function(response) {
        return response.nsCPX;
      },
      type    : 'input',
      name    : 'nsCPXHttpsPort',
      message : 'Please enter the local HTTPS port to map to the https port in the docker container',
      default : '32778'
    }, 
    {
      when    : function(response) {
        return response.nsCPX;
      },
      type    : 'input',
      name    : 'nsCPXSSHPort',
      message : 'Please enter the local SSH port to map to the SSH port in the docker container',
      default : '32779'
    },    
    {
      when    : function(response) {
        return response.nsCPX;
      },
      type    : 'input',
      name    : 'nsCPXSNMPPort',
      message : 'Please enter the local SNMP port to map to the SNMP port in the docker container',
      default : '32780'
    },
    {
      type    : 'input',
      name    : 'nsAddress',
      message : 'Please enter your Citrix Netscaler IP Address',
      default : 'localhost'
    },
    {
      type    : 'input',
      name    : 'nsPort',
      message : 'Please enter your Citrix Netscaler Port',
      default : function (answers){
        return answers.nsCPXHttpPort;
      }
    },
    {
      type    : 'input',
      name    : 'nsUsername',
      message : 'Please enter your Citrix Netscaler username',
      default : 'nsroot'
    },
    {
      type    : 'input',
      name    : 'nsPassword',
      message : 'Please enter your Citrix Netscaler password',
      default : 'nsroot'
    }]).then(function (answers) {
      this.log('app name', answers.appName);
      this.log('ns username', answers.nsUsername);
      this.appName = answers.appName;
      this.config.set('appName',answers.appName);
      this.config.set('nsCPX',answers.nsCPX);
      this.config.set('nsUsername',answers.nsUsername);
      this.config.set('nsPassword',answers.nsPassword);
      this.config.set('nsPort',answers.nsPort);
      this.config.set('nsAddress',answers.nsAddress);
      this.config.set('nsCPXHttpPort',answers.nsCPXHttpPort);
      this.config.set('nsCPXHttpsPort',answers.nsCPXHttpsPort);
      this.config.set('nsCPXSSHPort',answers.nsCPXSSHPort);
      this.config.set('nsCPXSNMPPort',answers.nsCPXSNMPPort);
      this.config.save();
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
      this.templatePath('_NSAuthenticate.cs'),
      this.destinationPath('NSAuthenticate.cs'),{appName:this.config.get('appName')});
    this.fs.copyTpl(
      this.templatePath('_ReturnInfo.cs'),
      this.destinationPath('ReturnInfo.cs'),{appName:this.config.get('appName')});
    this.fs.copyTpl(
      this.templatePath('_Project.csproj'),
      this.destinationPath(this.config.get('appName') + '.csproj'));
  },
  install: function() 
  {
    if ( this.config.get('nsCPX'))
    {
      this.log(chalk.white('Adding the Citrix Netscaler CPX docker container to the current project.'));
      this.log(chalk.white('Pulling the Citrix Netscaler CPX docker container from the store.'));
  
      //pulling the netscaler cpx container from the store.
      this.spawnCommandSync('docker', ['pull','store/citrix/netscalercpx:12.0-41.16']);
      this.log('\n');
      this.log(chalk.white('Starting and configuring the container.'));

        //starting the netscaler CPX container
        this.spawnCommandSync('docker',['run','-e','EULA=yes','-dt','-p',this.config.get('nsCPXSSHPort') + ':22','-p',this.config.get('nsCPXHttpPort') + ':80','-p',this.config.get('nsCPXSNMPPort') + ':161/udp','--cap-add=NET_ADMIN','store/citrix/netscalercpx:12.0-41.16']);
    }
    //call the dotnet restore command.
    this.spawnCommand('dotnet',['restore']);

  }
});
