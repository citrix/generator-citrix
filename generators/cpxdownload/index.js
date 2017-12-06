'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

module.exports = class extends yeoman {
  prompting() {
    return this.prompt([
      {
        type: 'confirm',
        name: 'nsCPX',
        message: 'Would you like to download Netscaler CPX?'
      }
    ]).then(answers => {
      this.config.set('nsCPX', answers.nsCPX);
      this.config.save();
    });
  }

  install() {
    if (this.config.get('nsCPX')) {
      this.log(
        chalk.white(
          'Pulling the Citrix Netscaler CPX docker container from the Docker store.'
        )
      );

      // Pulling the netscaler cpx container from the store.
      this.spawnCommandSync('docker', ['pull', 'store/citrix/netscalercpx:12.0-41.16']);
      this.log('\n');
    }
  }
};
