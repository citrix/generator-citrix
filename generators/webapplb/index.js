'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var sleep = require('sleep');
var request = require('request');
var network = require('address');
const findPortSync = require('find-port-sync');
var thisGenerator = null;

module.exports = class extends yeoman {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'appName',
        message: 'Please enter your project name',
        default: this.appname // Default to current folder name
      } /* ,
    {
      type    : 'input',
      name    : 'nsWebAppPort',
      message : 'Please enter the http port to host the web application',
      default : '8081'
    } */,
      {
        type: 'input',
        name: 'nsCPXHttpPort',
        message: 'Please enter the local management HTTP port for the load balancer',
        default: '32777'
      },
      {
        type: 'input',
        name: 'nsCPXHttpsPort',
        message: 'Please enter the local management HTTPS port for the load balancer',
        default: '32778'
      },
      {
        type: 'input',
        name: 'nsCPXSSHPort',
        message: 'Please enter the local management SSH port for the load balancer',
        default: '32779'
      },
      {
        type: 'input',
        name: 'nsCPXSNMPPort',
        message: 'Please enter the local management SNMP port for the load balancer',
        default: '32780'
      },
      {
        type: 'input',
        name: 'nsCPXUsername',
        message: 'Please enter the Netscaler Username',
        default: 'nsroot'
      },
      {
        type: 'input',
        name: 'nsCPXPassword',
        message: 'Please enter the Netscaler Password',
        default: 'nsroot'
      }
    ]).then(
      function(answers) {
        this.appName = answers.appName;
        this.config.set('appName', answers.appName);
        this.config.set('nsCPX', answers.nsCPX);
        this.config.set('nsCPXHttpPort', answers.nsCPXHttpPort);
        this.config.set('nsCPXSSHPort', answers.nsCPXSSHPort);
        this.config.set('nsCPXSNMPPort', answers.nsCPXSNMPPort);
        this.config.set('nsCPXUsername', answers.nsCPXUsername);
        this.config.set('nsCPXPassword', answers.nsCPXPassword);
        // This.config.set('nsWebAppPort',answers.nsWebAppPort);
        this.config.save();
      }.bind(this)
    );
  }

  initializing() {
    thisGenerator = this;
  }

  install() {
    var nsUsername = this.config.get('nsCPXUsername');
    var nsPassword = this.config.get('nsCPXPassword');
    var nsHttpPort = this.config.get('nsCPXHttpPort');
    // Var nsWebPort = this.config.get('nsWebAppPort');

    // install http-server. requirement for this feature of
    // the generator.
    this.spawnCommandSync('npm', ['install', 'http-server']);

    var availableLocalHTTPPort = '';
    var availableLBHTTPPort = 11000;

    availableLocalHTTPPort = findPortSync();
    var availableDockerPortMapping = findPortSync();

    var nsLBServerName = 'test-app-lb';
    var nsServiceName = 'app-test-service';
    var ipAddress = '0.0.0.0';

    ipAddress = network.ip();

    this.spawnCommand('dotnet', ['new', 'mvc']);

    // Build the base URL for the netscaler container.
    var baseURL = 'http://localhost:' + nsHttpPort;
    // Console.log(baseURL);

    this.log(chalk.yellow('Adding load balancer support (Citrix Netscaler)'));

    // Pulling the netscaler cpx container from the store.
    this.log(
      chalk.yellow(
        'Pulling the Citrix Netscaler from the Docker Store (store.docker.com)'
      )
    );
    this.spawnCommandSync('docker', ['pull', 'store/citrix/netscalercpx:12.0-41.16']);

    this.log(chalk.yellow('Starting the container.'));
    var containerID = this.spawnCommandSync('docker', [
      'run',
      '-e',
      'EULA=yes',
      '-dt',
      '-p',
      availableDockerPortMapping + ':' + availableLBHTTPPort,
      '-p',
      this.config.get('nsCPXSSHPort') + ':22',
      '-p',
      this.config.get('nsCPXHttpPort') + ':80',
      '-p',
      this.config.get('nsCPXSNMPPort') + ':161/udp',
      '--cap-add=NET_ADMIN',
      'store/citrix/netscalercpx:12.0-41.16'
    ]);
    // Console.log("container id: " + containerID);
    this.log(chalk.green('Load balancing container started...'));
    // Sleep
    sleep.sleep(5);

    var lbData = {
      lbvserver: {
        name: nsLBServerName,
        servicetype: 'http',
        port: availableLBHTTPPort,
        ipv46: '127.0.0.1'
      }
    };

    var options = {
      headers: {
        'Content-Type': 'application/json',
        'X-NITRO-USER': nsUsername,
        'X-NITRO-PASS': nsPassword
      },
      body: lbData,
      json: true
    };

    // Create the vserver
    this.log(
      chalk.yellow('Creating the LB Server listening on port ' + availableLBHTTPPort)
    );

    request.post(baseURL + '/nitro/v1/config/lbvserver', options, function(
      error,
      response,
      body
    ) {
      // 201 means request was sucessfull
      if (response) {
        if (response.statusCode == 201) {
          console.log(
            chalk.green(
              'Created the load balancing server listening on port ' + availableLBHTTPPort
            )
          );
          console.log(chalk.yellow('Enabling the virtual Load balancing server...'));
          // Enable the vserver (200 means request was sucessfull)
          var lbData = { lbvserver: { name: nsLBServerName } };
          var options = {
            headers: {
              'Content-Type': 'application/json',
              'X-NITRO-USER': nsUsername,
              'X-NITRO-PASS': nsPassword
            },
            body: lbData,
            json: true
          };

          request.post(
            baseURL + '/nitro/v1/config/lbvserver?action=enable',
            options,
            function(error, response, body) {
              if (response) {
                if (response.statusCode === 200) {
                  console.log(chalk.green('Vserver has been enabled...'));
                  // 200 means request was sucessfull
                  console.log(
                    chalk.yellow('Creating the service on the load balancer...')
                  );
                  // Configure the service to point to the web app
                  var lbData = {
                    service: {
                      port: availableLocalHTTPPort,
                      cip: 'DISABLED',
                      name: nsServiceName,
                      ip: ipAddress,
                      servicetype: 'HTTP'
                    }
                  };
                  var options = {
                    headers: {
                      'Content-Type': 'application/json',
                      'X-NITRO-USER': nsUsername,
                      'X-NITRO-PASS': nsPassword
                    },
                    body: lbData,
                    json: true
                  };

                  request.post(baseURL + '/nitro/v1/config/service', options, function(
                    error,
                    response,
                    body
                  ) {
                    // 201 means request was sucessfull
                    console.log(chalk.green('Created the LB service'));
                    console.log(
                      chalk.green(
                        'Service created for IP: ' +
                          ipAddress +
                          ' and PORT: ' +
                          availableLocalHTTPPort
                      )
                    );
                    // Binding the service to the LB
                    console.log(
                      chalk.yellow('Creating the binding for service to LB...')
                    );

                    var lbData = {
                      lbvserver_service_binding: {
                        name: nsLBServerName,
                        servicename: nsServiceName,
                        weight: 1
                      }
                    };
                    var options = {
                      headers: {
                        'Content-Type': 'application/json',
                        'X-NITRO-USER': nsUsername,
                        'X-NITRO-PASS': nsPassword
                      },
                      body: lbData,
                      json: true
                    };
                    request.put(
                      baseURL + '/nitro/v1/config/lbvserver_service_binding',
                      options,
                      function(error, response, body) {
                        if (response) {
                          if (response.statusCode === 200) {
                            console.log(
                              chalk.green(
                                'Binding created for service to LB ' + nsLBServerName
                              )
                            );
                            // Console.log(chalk.yellow("Binding created on address " + ipAddress + " for port" + availableHTTPPort + " ..."));
                            console.log(chalk.yellow('browse to http://localhost:'));

                            // Start http server
                            console.log(
                              chalk.yellow(
                                'Starting local http server listing on PORT ' +
                                  availableLocalHTTPPort
                              )
                            );
                            thisGenerator.spawnCommand(
                              './node_modules/.bin/http-server',
                              ['-s', '-p', availableLocalHTTPPort]
                            );
                            console.log(
                              chalk.green(
                                'The sample appears to be configured and ready to roll!!! Here is what was configured...'
                              )
                            );
                            console.log(
                              chalk.green('\n1. Citrix Netscaler CPX (Docker container)')
                            );
                            console.log(
                              chalk.green(
                                '\ta.Service and load balancer configure to point to local http server'
                              )
                            );
                            console.log(chalk.green('2. .NET MVC web default app'));
                            console.log(
                              chalk.green(
                                '3. Local http server to run the app. This is what the netscaler LB points to.'
                              )
                            );

                            console.log(
                              '\nTo access the sample, connect to the Netscaler Load balancer at \n http://localhost:' +
                                availableDockerPortMapping
                            );
                            // Console.log(Generator);
                          } else {
                            // A different status code came back from the API
                            console.log(
                              chalk.red(
                                'Unexpected HTTP return code was received from the NITRO API'
                              )
                            );
                            console.log(chalk.blue(response.statusCode));
                          }
                        }
                      }
                    );
                  });
                } else {
                  console.log(
                    chalk.red('Unexpected error returned ' + response.statusCode)
                  );
                  // Different status code came back
                }
              } else {
              }
            }
          );
        } else if (response.statusCode == 401) {
          console.log(chalk.red('Unexpected error code returned ' + response.statusCode));
        } else {
          console.log(chalk.red(response.statusCode));
        }
      } else {
        console.log(chalk.red('An error occurred when trying to create the VServer'));
        if (error != null) {
          console.log(chalk.yellow('Printing our error trace...'));
          console.log(chalk.red(error));
        }
      }
    });
  }
};
