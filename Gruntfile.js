/* global module:false */
module.exports = function(grunt) {

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner:
				'/*!\n' +
				' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
				' * http://lab.hakim.se/reveal-js\n' +
				' * MIT licensed\n' +
				' *\n' +
				' * Copyright (C) 2013 Hakim El Hattab, http://hakim.se\n' +
				' */'
		},
		// Tests will be added soon
		qunit: {
			files: [ 'test/**/*.html' ]
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>\n'
			},
			build: {
				src: 'js/reveal.js',
				dest: 'js/reveal.min.js'
			}
		},

		cssmin: {
			compress: {
				files: {
					'css/reveal.min.css': [ 'css/reveal.css' ]
				}
			}
		},

		sass: {
			main: {
				files: {
					'css/theme/default.css': 'css/theme/source/default.scss',
					'css/theme/beige.css': 'css/theme/source/beige.scss',
					'css/theme/night.css': 'css/theme/source/night.scss',
					'css/theme/serif.css': 'css/theme/source/serif.scss',
					'css/theme/simple.css': 'css/theme/source/simple.scss',
					'css/theme/sky.css': 'css/theme/source/sky.scss',
					'css/theme/moon.css': 'css/theme/source/moon.scss',
					'css/theme/solarized.css': 'css/theme/source/solarized.scss'
				}
			}
		},
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }   
    },  
    clean: {
      dist: ['.tmp', '<%= yeoman.dist %>/*'],
      server: '.tmp'
    },
    connect: {
      options: {
        port: 8080,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      //livereload: {
      //  options: {
      //    middleware: function (connect) {
      //      return [
      //        lrSnippet,
      //        mountFolder(connect, '.tmp'),
      //        mountFolder(connect, 'app')
      //      ];
      //    }
      //  }
      //},  
      test: {
        options: {
          //middleware: function (connect) {
          //  return [
          //    mountFolder(connect, '.tmp'),
          //    mountFolder(connect, 'test')
          //  ];  
          //}   
        }   
      },  
      dist: {
        options: {
          middleware: function (connect) {
            //return [
            //  mountFolder(connect, 'dist')
            //];  
          }   
        }   
      }   
    }, 
		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				expr: true,
				globals: {
					head: false,
					module: false,
					console: false
				}
			},
			files: [ 'Gruntfile.js', 'js/reveal.js' ]
		},
		watch: {
			main: {
				files: [ 'Gruntfile.js', 'js/reveal.js', 'css/reveal.css', 'views/index.ejs' ],
				tasks: 'default'
			//},
			//theme: {
			//	files: [ 'css/theme/source/*.scss', 'css/theme/template/*.scss' ],
			//	tasks: 'themes'
			//},

      
      }
		}
	});

	// Dependencies
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-sass' );

	// Default task
	//grunt.registerTask( 'test', [ 'clean:server', 'connect:test' ] );
	grunt.registerTask( 'default', [ 'jshint' ] );
	grunt.registerTask( 'build', [ 'clean:dist','htmlmin','concat','cssmin','uglify' ] );
  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist', 'keepalive']);
    }

    grunt.task.run([
      //'clean:server',
      //'compass:server',
      //'livereload-start',
      //'connect:livereload',
      'open',
      'watch'
    ]);
  });

	// Theme task
	grunt.registerTask( 'themes', [ 'sass' ] );
};
