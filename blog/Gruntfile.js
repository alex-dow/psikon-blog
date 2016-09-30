var config = {
  pluginDir: './wordpress/wp-content/plugins',
  themeDir: './wordpress/wp-content/themes',

  cssHeader: require('./cssHeader.js'),

  clean: {
    build: ['<%= themeDir %>/style.css','<%= themeDir %>/js/main.js']
  },
  
  downloadFile: {
	  wordpress: {
		  files: [{
			  url: 'https://downloads.wordpress.org/theme/fluida.0.9.9.3.zip',
			  dest: 'build/downloads',
			  name: 'fluida.zip'
		  }]
	  }
  },

  copy: {
    pages: {
      files: [{
        expand: true,
        src: ['**/*.php'],
        dest: '<%= themeDir %>',
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
    	  dest: '<%= themeDir %>/style.css',
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
    	  src: '<%= themeDir %>/style.css',
    	  dest: '<%= themeDir %>/style.css',
    	  expand: false
      }]
    }
  }
}




module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig(config);

  grunt.registerTask('init', ['downloadFile:wordpress']);
  
  grunt.registerTask('build', ['browserify:dist','sass:dist','header:dist','copy']);

  grunt.registerTask('default', ['build']);

}
