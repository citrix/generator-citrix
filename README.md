# generator-citrix-netscaler [![NPM version][npm-image]][npm-url] 
> A Yeoman generator that scaffolds a .NET Core sample project 
that show how to interact with the Citrix Netscaler CPX docker container
via the NITRO REST API

## Required Software
This generator works with the Citrix Netscaler product but the quickest
way to get started with Citrix Netscaler is to download the **free** Netscaler CPX Express
docker image from [here](www.microloadbalancer.com). 

This generator builds a .NET Core application, so you will also
need the .NET Core SDK and runtime from Microsoft. You can find
the the .NET Core download [here](https://www.microsoft.com/net/core) for the different platforms.

## Installation
First, install [Yeoman](http://yeoman.io) and generator-citrix-netscaler using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-citrix-netscaler
```

Then generate your new project:

```bash
yo citrix-netscaler
```

This will prompt you for you Netscaler information and generate a starter project that shows how to authenticate to the 
Citrix Netscaler CPX container

## Sub-Generators
There are also several sub generators that will add additional functionality to the sample
app based on what NITRO API you would like to interact with.
    
* [citrix-netscaler:features](#features)
* [citrix-netscaler:ip](#ip)
* [citrix-netscaler:hostname](#hostname)
* [citrix-netscaler:listvservers](#listvservers)

### Features
Generates a partial class that contains the API calls to list features
on the Netscaler CPX container.

Example:
```bash
yo citrix-netscaler:features
```
Produces NSListFeatures.cs in the project directory. In order to use the new methods
you should add the following method call to your main calling method.
```csharp
await ListFeatures();
```

### IP
Generates a partial class that contains the API calls to list IP addresses
used on the Netscaler CPX container.

Example:
```bash
yo citrix-netscaler:ip
```
Produces NSIP.cs in the project directory. In order to use the new methods
you should add the following method call to your main calling method.
```csharp
await Listips();
```

### HOSTNAME
Generates a partial class that contains the API calls to get and set the
hostname of the Netscaler CPX.

Example:
```bash
yo citrix-netscaler:hostname
```
Produces NSHostname.cs in the project directory. In order to use the new methods
you should add the following method call to your main calling method.
```csharp
await ListHostname();
```

### listvservers
Generates a partial class that contains the API calls to list
all of the VServers configured on the the Netscaler CPX.

Example:
```bash
yo citrix-netscaler:listvservers
```
Produces NSListServers.cs in the project directory. In order to use the new methods
you should add the following method call to your main calling method.
```csharp
await ListVirtualServers();
```

## Contribution
We love open source and contributors! Get started by cloning This
repo and start building additional features. Whether it source code,
documentation, issue or wiki entries. We love any kinda of contribution!

*At Citrix, we’re committed to building a world-class ecosystem 
through open platforms. Our offerings power mission-critical business 
operations for users, IT and partners, and we provide a number of APIs, 
SDKs and tools to help you extend and integrate with our services. We’re excited to work
 with you to make Citrix your platform of choice.*

[npm-image]: https://badge.fury.io/js/generator-citrix-netscaler.svg
[npm-url]: https://npmjs.org/package/generator-citrix-netscaler


