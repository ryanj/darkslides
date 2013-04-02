# Welcome to the DarkSlide

[![Build Status](https://travis-ci.org/ryanj/darkslides.png?branch=master)](https://travis-ci.org/ryanj/darkslides)
[![HTMLlint](http://badges.brihten.com/lint/badge-medium.png)](http://lint.brihten.com/html/report?u=http%3A//darkslides-rjdemo.rhcloud.com&s=0000000)

Node.js on OpenShift
====================================================================
This package includes a dynamic Node.js build stage that will provide your application with a customized Node.js runtime.
The version of Node that is available will depend on the requirements listed in your application's `package.json` file.

See: `.openshift/action_hooks/` for more informaiton on how the OpenShift build process works.

Basic Setup
-----------

If this is your first time using OpenShift Online or Node.js, you'll have some quick prep-work to do:

1. [Create an OpenShift Online account](http://openshift.redhat.com/app/account/new)
2. If you don't already have the rhc (Red Hat Cloud) command-line tools, run: `sudo gem install rhc`
3. Run `rhc setup` to link your OpenShift Online account with your local development environment, and to select an application namespace
4. [Download and install Node.js](http://nodejs.org) for use in your local development environment: http://nodejs.org

If you need any additional help getting started, these links may come in handy:

 * https://openshift.redhat.com/community/get-started#cli
 * https://openshift.redhat.com/community/developers/rhc-client-tools-install

Host your Node.js applications on OpenShift
-------------------------------------------

Create a Node.js application.  This example will produce an application named **nodeapp**:

    rhc app create darkslides nodejs --from-code=git://github.com/ryanj/darkslides.git

The above example will output a folder named after your application which contains your local development source.  Make sure to run it from within a directory where you would like to store your development code.

That's it!  You should be able to access your application at:

    http://darkslides-$yournamespace.rhcloud.com

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
