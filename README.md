
## Multiplexing

The multiplex plugin allows your audience to view the slides on their own phone, tablet or laptop. As the master navigates the slides, all clients will update in real time. See a demo at [http://revealjs.jit.su/](http://revealjs.jit.su).

Configuration is via the multiplex object in ```Reveal.initialize```. To generate unique secret and token values, visit [revealjs.jit.su/token](revealjs.jit.su/token). Below is an example configuration with the multiplex plugin enabled:

```javascript
Reveal.initialize({
	...

	// Generate a unique id and secret at revealjs.jit.su/token
	multiplex: {
		id: '',
		secret: '',
		url: 'revealjs.jit.su:80'
	},

	dependencies: [
		{ src: '//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.10/socket.io.min.js', async: true },
		{ src: 'plugin/multiplex/client.js', async: true },
		{ src: 'plugin/multiplex/master.js', async: true },
	]
});
```

```multiplex.secret``` should only be configured on those pages you wish to be able to control slide navigation for all clients. Multi-master configurations work, but if you don't wish your audience to be able to control your slides, set the secret to ``null``. In this master/slave setup, you should create a publicly accessible page with secret set to ``null``, and a protected page containing your secret.

You are very welcome to use the socketio server running at reveal.jit.su, however availability and stability are not guaranteed. For anything mission critical I recommend you run your own server. It is simple to deploy to nodejitsu or run on your own environment.

## Development Environment

reveal.js is built using the task-based command line build tool [grunt.js](http://gruntjs.com) ([installation instructions](http://gruntjs.com/getting-started#installing-the-cli)). With Node.js and grunt.js installed, you need to start by running ```npm install``` in the reveal.js root. When the dependencies have been installed you should run ```grunt watch``` to start monitoring files for changes.

If you want to customise reveal.js without running grunt.js you can alter the HTML to point to the uncompressed source files (css/reveal.css & js/reveal.js).

### Folder Structure
- **css/** Core styles without which the project does not function
- **js/** Like above but for JavaScript
- **plugin/** Components that have been developed as extensions to reveal.js
- **lib/** All other third party assets (JavaScript, CSS, fonts)

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

    rhc app create nodeapp nodejs --from-code=git://github.com/ryanj/nodejs-custom-version-openshift.git

The above example will output a folder named after your application which contains your local development source.  Make sure to run it from within a directory where you would like to store your development code.

That's it!  You should be able to access your application at:

    http://nodeapp-$yournamespace.rhcloud.com

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
