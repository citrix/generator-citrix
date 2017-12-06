'use strict';
var yeoman = require('yeoman-generator');
var thisGenerator = null;

module.exports = class extends yeoman {
  initializing() {
    thisGenerator = this;
  }

  prompting() {
    return this.prompt([
      {
        type: 'list',
        name: 'projectType',
        message:
          "What Netscaler module would you like to add to project '" +
          this.config.get('appName') +
          "'?",
        choices: [
          {
            name: 'Base application with authentication',
            value: 'baseNSProject'
          },
          {
            name: 'Add IP module to project ' + this.config.get('appName'),
            value: 'ipmodule'
          },
          {
            name: 'Add features module to project ' + this.config.get('appName'),
            value: 'featuremodule'
          },
          {
            name: 'Add hostname module to project ' + this.config.get('appName'),
            value: 'hostnamemodule'
          },
          {
            name: 'Add list VServers module to project ' + this.config.get('appName'),
            value: 'vserversmodule'
          },
          {
            name: 'Add version module to project ' + this.config.get('appName'),
            value: 'versionmodule'
          },
          {
            name: 'Exit',
            value: 'exit'
          }
        ]
      }
    ]).then(function(answers) {
      switch (answers.projectType) {
        case 'baseNSProject':
          thisGenerator.composeWith(require.resolve('./base'));
          break;
        case 'ipmodule':
          thisGenerator.composeWith(require.resolve('./ip'));
          break;
        case 'featuremodule':
          thisGenerator.composeWith(require.resolve('./features'));
          break;
        case 'hostnamemodule':
          thisGenerator.composeWith(require.resolve('./hostname'));
          break;
        case 'vserversmodule':
          thisGenerator.composeWith(require.resolve('./listvservers'));
          break;
        case 'versionmodule':
          thisGenerator.composeWith(require.resolve('./version'));
          break;
        case 'exit':
          break;
        default:
          break;
      }
    });
  }
};
