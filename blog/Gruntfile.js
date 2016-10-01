var config = {
  pluginDir: './wordpress/wp-content/plugins',
  themeDir: './wordpress/wp-content/themes',

  cssHeader: require('./cssHeader.js'),

  clean: {
    build: ['<%= themeDir %>/psikon/style.css','<%= themeDir %>/psikon/js/main.js', 'build'],
    composerInstaller: ['composer-setup.php'],
    php: ['vendor','wordpress','composer.phar','composer.lock']
  },
  
  curl: {
    wordpress: {
      src: 'https://downloads.wordpress.org/theme/fluida.0.9.9.3.zip',
      dest: 'build/downloads/fluida.zip'
    },
    composerInstaller: {
      src: 'https://getcomposer.org/installer',
      dest: 'composer-setup.php'
    }
  },

  copy: {
    pages: {
      files: [{
        expand: true,
        src: ['**/*.php'],
        dest: '<%= themeDir %>/psikon',
        cwd: './pages'
      }]
    },
    plugins: {
		files: [{
			expand: true,
			src: ['**/*'],
			dest: '<%= pluginDir %>',
			cwd: './plugins'
		}]
    }
  },

  sprite: {
    icons: {
      src: 'gfx/sprites/icon*.png',
      dest: '<%= themeDir %>/psikon/images/icon-sprites.png',
      destCss: './sass/_sprites.scss'
    }
  },

  watch: {  
    plugins: {
		  files: ['plugins/**/*'],
  		tasks: ['copy:plugins']
	  },
    pages: {
      files: ['pages/**/*.php'],
      tasks: ['copy:pages']
    },
    js: {
      files: ['js/**/*.js'],
      tasks: ['browserify:dist']
    },
    scss: {
      files: ['sass/**/*.scss'],
      tasks: ['sass:dist','header:dist']
    },
    dev: {
      files: ['sass/**/*.scss'],
      tasks: ['sass:dev']
    }
  },

  browserify: {
    dist: {
      files: {
        '<%= themeDir %>/js/main.js': [
          'js/**/*.js'
        ]
      }
    }
  },

  sass: {
    dist: {
      files: [{
    	  src: './sass/main.scss',
    	  dest: '<%= themeDir %>/psikon/style.css',
    	  expand: false
      }]
    },
    dev: {
      files: {
        './static/style.css': './sass/main.scss'
      }
    }
  },

  header: {
    dist: {
      options: {
        text: '<%= cssHeader %>'
      },
      files: [{
    	  src: '<%= themeDir %>/psikon/style.css',
    	  dest: '<%= themeDir %>/psikon/style.css',
    	  expand: false
      }]
    }
  },
  
  unzip: {
	  fluida: {
		  src: 'build/downloads/fluida.zip',
		  dest: '<%= themeDir %>'
	  }
  },

  exec: {
    installComposer: {
      command: 'php composer-setup.php',
      stdout: true,
      stderr: true
    },
    composer: {
      command: 'php composer.phar install',
      stdout: true,
      stderr: true
    }
  },
}




module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig(config);

  grunt.registerTask('init-composer', ['curl:composerInstaller', 'exec:installComposer', 'exec:composer','clean:composerInstaller']);

  grunt.registerTask('init', ['init-composer', 'curl:wordpress','unzip:fluida']);
  
  grunt.registerTask('build', ['clean:build','browserify:dist','sass:dist','header:dist','copy']);

  grunt.registerTask('default', ['build']);

}
