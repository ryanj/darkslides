#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var io = require('socket.io');
var crypto = require('crypto');

/**
 *  Define the sample application.
 */
var DarkSlides = function() {

    //  Scope.
    var self = this;

    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };

        // Allow these secrets to be loaded from the system environment
        // Secure tokens will survive app restarts if added to the environment
        if( process.env.OPENSHIFT_DARKSLIDE_SECRET && process.env.OPENSHIFT_DARKSLIDE_SOCKET ){
            self.keyPair = {
                secret: process.env.OPENSHIFT_DARKSLIDE_SECRET, 
                socketId: process.env.OPENSHIFT_DARKSLIDE_SOCKET
            };
            console.log("Reusing existing secret tokens: " + JSON.stringify(self.keyPair));
        }else{
            self.keyPair = self.createKeyPair();
            console.log('GENERATING NEW DARKSLIDES SECRET: '+ JSON.stringify(self.keyPair));
            console.log("New secret tokens will be generated on startup " );
        }
        console.log("Configure your browser for presentations by entering the following in your broswer's web console: localStorage['secret'] = '" + JSON.stringify(self.keyPair.secret) + "';" );
    };

    self.createHash = function(secret) {
        var cipher = crypto.createCipher('blowfish', secret);
        return(cipher.final('hex'));
    };

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/env'] = function(req, res) {
            var content = 'Version: ' + process.version + '\n<br/>\n' +
                          'Env: {<br/>\n<pre>';
            //  Add env entries.
            for (var k in process.env) {
               content += '   ' + k + ': ' + process.env[k] + '\n';
            }
            content += '}\n</pre><br/>\n'
            res.send(content);
            res.send('<html>\n' +
                     '  <head><title>Node.js Process Env</title></head>\n' +
                     '  <body>\n<br/>\n' + content + '</body>\n</html>');
        };
    };

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express.createServer();
        self.app.configure(function(){
            //self.app.use(express.cookieParser());
            //self.app.use.(express.session({secret:"secret",key:"express.sid"}));
            ['css', 'img', 'js', 'plugin', 'lib'].forEach(function (dir){
                self.app.use('/'+dir, express.static(__dirname+'/'+dir));
            });
            self.app.set('views', __dirname + '/views');
            self.app.set('view engine', 'ejs');
        });

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
        self.app.get('/', function(req, res){
            hostname = process.env.OPENSHIFT_APP_DNS || self.ipaddress + ":" + self.port;
            res.render('index', {
                layout: false, 
                socketId: self.keyPair.socketId,
                host  : hostname
            });
        });
    };

    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };

    self.createKeyPair = function(){
        var ts = new Date().getTime();
        var rand = Math.floor(Math.random()*9999999);
        var secret = ts.toString() + rand.toString();
        var keyPair = {secret: secret, socketId: self.createHash(secret)};
        return keyPair;
    };

    self.configureSocketHooks = function(){
        self.app.io.sockets.on('connection', function (socket) {
            console.log('sockets are go!');

            socket.on('slidechanged', function(slideData) {
                if (typeof slideData.secret == 'undefined' || slideData.secret == null || slideData.secret === '') return;
                if (self.createHash(slideData.secret) === slideData.socketId) {
                    slideData.secret = null;
                    socket.broadcast.emit(slideData.socketId, slideData);
                };
            });
            socket.on('navigation', function(data) {
                if (typeof data.secret == 'undefined' || data.secret == null || data.secret === '') return;
                if (self.createHash(data.secret) === data.socketId) {
                    data.secret = null;
                    socket.broadcast.emit(data.socketId, data);
                };
            });
        });
    };

    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
        self.app.io = io.listen(self.app);
        self.configureSocketHooks();
    };
};   /*  Sample Application.  */

/**
 *  main():  Main code.
 */
var slideshow = new DarkSlides();
slideshow.initialize();
slideshow.start();
