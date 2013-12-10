# Welcome to the DarkSlides
Broadcast your [reveal.js](http://lab.hakim.se/reveal-js/) slide presentation (emit page-change events to connected browsers) by setting your broadcast secret in the presenter's browser.

[![Build Status](https://travis-ci.org/ryanj/darkslides.png?branch=master)](https://travis-ci.org/ryanj/darkslides)
[![HTMLlint](http://badges.brihten.com/lint/badge-medium.png)](http://lint.brihten.com/html/report?u=http%3A//darkslides-rjdemo.rhcloud.com&s=1111110)

### Find your broadcast secrets
Your broadcast secret and socket channel identifier will be written to your application's log file during it's startup phase.  Tail your logs during a deploy (`rhc tail APP_NAME`), or use `rhc ssh APP_NAME` to connect to your application and review it's log output.

    GENERATING A NEW DARKSLIDE SECRET: { secret: '1365092520963708958', socketId: '65f796f6fec6e9a7' }

### Configure a browser for broadcasting
Set your broadcaster token by adding your own broadcast secret (shown in the server init output), to the following URL:

    http://YOUR_APPLICATION_URL/#setToken:1365092520963708958

Presenter tokens are only parsed during initial page load, so you may need to reload the page url in order to persist the token to your browser's `localStorage` area.

### Recycling your secret tokens
A new `secret` and `socketId` pair will be generated each time your application starts.  To reuse an existing pair of broadcaster credentials on OpenShift, run the following two commands:

    rhc env set OPENSHIFT_DARKSLIDE_SECRET='1365092520963708958'
    rhc env set OPENSHIFT_DARKSLIDE_SOCKET='65f796f6fec6e9a7'

### Export to PDF
To convert your slides to a PDF, just print to a file with your page layout configured for landscape mode.

### Steal this presentation
You can host your own clone of these slides by entering the following on your command prompt:

    rhc app create darkslides nodejs --from-code=https://github.com/ryanj/darkslides.git

# Node.js on OpenShift
This package includes a dynamic Node.js build stage that will provide your application with a customized Node.js runtime.
The version of Node that is available will depend on the requirements listed in your application's `package.json` file.

See: `.openshift/action_hooks/` for more informaiton on how the OpenShift build process works.

## Basic Setup
If this is your first time using OpenShift Online or Node.js, you'll have some quick prep-work to do:

1. [Create an OpenShift Online account](http://openshift.redhat.com/app/account/new)
2. If you don't already have the rhc (Red Hat Cloud) command-line tools, run: `sudo gem install rhc`
3. Run `rhc setup` to link your OpenShift Online account with your local development environment, and to select an application namespace
4. [Download and install Node.js](http://nodejs.org) for use in your local development environment: http://nodejs.org

If you need any additional help getting started, these links may come in handy:

 * https://openshift.redhat.com/community/get-started#cli
 * https://openshift.redhat.com/community/developers/rhc-client-tools-install

## Selecting your version of Node.js
If your app requires a specific version of Node.js, just update the 'engines' section of your app's `package.json` file to specify your runtime requirements:

    "engines": {
        "node": ">= 0.10.0",
        "npm": ">= 1.0.0"
     },

Commit your changes locally:

    git add package.json
    git commit -m 'updating package.json to select Node.js version 0.8.21'

Then push your updates to OpenShift

    git push

Additional updates can be made via the same `git add`, `git commit`, and `git push` workflow.
