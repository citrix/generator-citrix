'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

module.exports = yeoman.Base.extend({
  constructor: function()
  {
    yeoman.Base.apply(this,arguments);
  },
  prompting: function() {
    return this.prompt([{
      type    : 'confirm',
      name    : 'nsCPX',
      message : 'Would you like to add Netscaler CPX to ' + this.config.get('appName')
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
      message : 'Please enter the local SNMP port to map to the SSH port in the docker container',
      default : '32780'
    }]).then(function (answers) {
      this.config.set('nsCPX',answers.nsCPX);
      this.config.set('nsCPXHttpPort',answers.nsCPXHttpPort);
      this.config.set('nsCPXSSHPort',answers.nsCPXSSHPort);
      this.config.set('nsCPXSNMPPort',answers.nsCPXSNMPPort);
      this.config.save();
    }.bind(this));
  },
  initializing: function()
  {
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
