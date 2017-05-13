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
    }]).then(function (answers) {
      this.config.set('nsCPX',answers.nsCPX);
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
        this.spawnCommandSync('docker',['run','-dt','-e','EULA=yes','-dt','-p','22','-p','80','-p','161/udp','--cap-add=NET_ADMIN','store/citrix/netscalercpx:11.53-11']);
    }
    //call the dotnet restore command.
    this.spawnCommand('dotnet',['restore']);
  }
});
