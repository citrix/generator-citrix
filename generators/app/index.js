'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

module.exports = class extends yeoman {
  initializing() {
    this.log(
      yosay(
        "Welcome to the Citrix project generator. We'll walk you through some prompts to help you get started with building an Citrix enabled application."
      )
    );
  }

  prompting() {
    return this.prompt([
      {
        type: 'list',
        name: 'projectType',
        message: 'What type of Citrix SDK project would you like to create?',
        choices: [
          {
            name: 'Storefront Sample (.NET Core Console)',
            value: 'sampleStorefrontConsole'
          },
          {
            name: 'Storefront Sample (.NET Web)',
            value: 'sampleStorefrontWeb'
          },
          {
            name: 'Web application with Citrix load balancing',
            value: 'sampleWebLB'
          },
          {
            name: 'Download Netscaler CPX',
            value: 'downloadCPX'
          },
          {
            name: 'Start Netscaler CPX',
            value: 'startCPX'
          },
          {
            name: 'Netscaler NITRO API sample',
            value: 'sampleNITRO'
          },
          {
            name: 'Exit',
            value: 'exit'
          }
        ]
      }
    ]).then(
      function(answers) {
        switch (answers.projectType) {
          case 'sampleStorefrontConsole':
            this.log('This sample is not implemented yet.');
            break;
          case 'sampleStorefrontWeb':
            // Sample web application that interacts with the
            // storefront API.
            this.composeWith(require.resolve('../samplesfweb'));
            break;
          case 'sampleWebLB':
            // General website built with .NET core front ended with
            // netscaler CPX. This sample is more a demonstration that
            // you can front-end a website with netscaler CPX.
            this.composeWith(require.resolve('../webapplb'));
            break;
          case 'downloadCPX':
            // Download the netscaler CPX container. Needs to have docker
            // installed
            this.composeWith(require.resolve('../cpxdownload'));
            break;
          case 'startCPX':
            this.composeWith(require.resolve('../cpxstart'));
            break;
          case 'sampleNITRO':
            this.composeWith(require.resolve('../netscaler'));
            break;
          default:
            break;
        }
      }.bind(this)
    );
  }

  writing() {}

  install() {}
};
