# generator-citrix [![NPM version][npm-image]][npm-url] 
> A Yeoman generator that provides sample applications and NetScaler CPX (Docker) tooling to help developer get starting writing Citrix enabled applications. In this release there are the following generators.
- NetScaler CPX download and start
- NetScaler NITRO API Samples.
- StoreFront .NET Core sample
- Sample application routed through a NetScaler CPX load balancer.

## Required Software
This generator works with several of the Citrix APIs and will require some of the products. Please check out our developer portal at [http://developer.citrix.com](http://developer.citrix.com) form more information and the quickest way to get started.

If you are interested in the **free** Citrix Netscaler CPX Express
docker image from [here](http://www.microloadbalancer.com). 

This generator builds .NET Core applications, so you will also
need the .NET Core SDK and runtime from Microsoft. You can find
the the .NET Core download [here](https://www.microsoft.com/net/download/core) for the different platforms.

While not required for these samples, it is always good to have a source code editor.[Visual Studio Code](https://code.visualstudio.com/) is a good one since it knows how to handle .NET core projects but feel free to an editor that makes you happy. [Sublime Text](https://www.sublimetext.com/) or [Brackets](http://brackets.io/) are also good editors.

### Getting started with Netscaler CPX and Docker videos
<table>
<tr>
<td>
<a href="https://www.youtube.com/watch?v=nq77i4h1VAo" target="_new">
<img src="https://img.youtube.com/vi/nq77i4h1VAo/0.jpg" width="250">
</a>
</td>
<td>
<a href="https://www.youtube.com/watch?v=FPlCoUeF4VE" target="_new">
<img src="https://img.youtube.com/vi/FPlCoUeF4VE/0.jpg" width="250">
</a>
</td>
</tr>
</table>

## Installation
First, install [Yeoman](http://yeoman.io) and generator-citrix using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
sudo npm install -g yo
sudo npm install -g generator-citrix
```

Then to generate your new project run the following and select from the list:

```bash
yo citrix
```

This will prompt you to select what type of citrix application you would like to create.

## Contribution
We love open source and contributors! Get started by cloning This
repo and start building additional features. Whether it source code,
documentation, issue or wiki entries. We love any kinda of contribution!

> *At Citrix, we’re committed to building a world-class ecosystem 
through open platforms. Our offerings power mission-critical business 
operations for users, IT and partners, and we provide a number of APIs, 
SDKs and tools to help you extend and integrate with our services. We’re excited to work
 with you to make Citrix your platform of choice.*

[npm-image]: https://badge.fury.io/js/generator-citrix-netscaler.svg
[npm-url]: https://npmjs.org/package/generator-citrix-netscaler


