'use strict';
var yeoman = require('yeoman-generator');

var storefrontAddress;
var storefrontUrl;

module.exports = class extends yeoman {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'sfAddress',
        message: 'Please enter the StoreFront IP Address',
        default: '10.10.10.10'
      },
      {
        type: 'input',
        name: 'sfWebURL',
        message: 'Please enter the StoreFront Web URL',
        default: '/Citrix/StoreWeb'
      }
    ]).then(function(answers) {
      storefrontUrl = answers.sfWebURL;
      storefrontAddress = answers.sfAddress;
    });
  }

  install() {
    // Run dotnet restore
    this.spawnCommand('dotnet', ['build']);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('_Program.cs'),
      this.destinationPath('Program.cs'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('_README.md'),
      this.destinationPath('README.md'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('_Startup.cs'),
      this.destinationPath('Startup.cs'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('_bower.json'),
      this.destinationPath('bower.json'),
      {}
    );
    this.fs.copyTpl(this.templatePath('_.bowerrc'), this.destinationPath('.bowerrc'), {});
    this.fs.copyTpl(
      this.templatePath('_storefront-sample-web.csproj'),
      this.destinationPath('storefront-sample-web.csproj'),
      {}
    );
    this.fs.copyTpl(this.templatePath('_Classes'), this.destinationPath('Classes'), {});
    this.fs.copyTpl(
      this.templatePath('_Controllers'),
      this.destinationPath('Controllers'),
      {}
    );
    this.fs.copyTpl(this.templatePath('_Models'), this.destinationPath('Models'), {});
    this.fs.copyTpl(
      this.templatePath('_TagHelpers'),
      this.destinationPath('TagHelpers'),
      {}
    );
    this.fs.copyTpl(this.templatePath('_Views'), this.destinationPath('Views'), {
      sfAddress: storefrontAddress,
      sfWebURL: storefrontUrl
    });

    this.fs.copyTpl(this.templatePath('_wwwroot'), this.destinationPath('wwwroot'), {});

    this.fs.copyTpl(this.templatePath('_.vscode'), this.destinationPath('.vscode'), {});
  }
};
