
var plugins = ['project-widget'];

var config = {
  pluginDir: './wordpress/wp-content/plugins',
  themeDir: './wordpress/wp-content/themes',

  cssHeader: require('./cssHeader.js'),

  clean: {
    build: ['<%= themeDir %>/psikon', 'build'],
    composerInstaller: ['composer-setup.php'],
    php: ['vendor','wordpress','composer.phar','composer.lock'],
  	parentTheme: ['<%= themeDir %>/fluida']
  },
  
  curl: {
    parentTheme: {
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


var plugins = ['project-widget'];

for (var i = 0; i < plugins.length; i++) {

  var name = plugins[i];

  config['browserify'][name + '-admin'] = {
    src: ['plugins/' + name + '/js/admin-main.js'],
    dest: '<%= pluginDir %>/' + name + '/js/admin-main.js',
    browserifyOptions: {
        debug: true
    },
    options: {
      transform: [
        'browserify-shim',
        [ 'hbsfy', { 'extensions': 'html' } ]
      ]
    }
  };
  
  config['browserify'][name + '-main'] = {
    src: ['plugins/' + name + '/js/main.js'],
    dest: '<%= pluginDir %>/' + name + '/js/main.js',
    browserifyOptions: {
        debug: true
    },    
    options: {
      transform: [
        'browserify-shim',
        [ 'hbsfy', { 'extensions': 'html' } ]
      ]
    }
  };

  config['copy'][name] = {
    files: [{
      expand: true,
      src: ['**/*.php'],
      dest: '<%= pluginDir %>/' + name,
      cwd: './plugins/' + name
    }]
  };

  config['clean'][name] = ['<%= pluginDir %>/' + name];

  config['watch'][name + '-php'] = {
    files: ['./plugins/' + name + '/**/*.php'],
    tasks: ['copy:' + name]
  };

  config['watch'][name + '-js'] = {
    files: ['./plugins/' + name + '/**/*.js', './plugins/' + name + '/templates/handlebars/**/*.html'],
    tasks: ['browserify:' + name + '-admin','browserify:' + name + '-main']
  };
};

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig(config);
  
  var buildpluginstask = [];

  for (var i = 0; i < plugins.length; i++) {
    var name = plugins[i];
    grunt.registerTask('build-plugin-' + name, [
      'clean:' + name, 
      'browserify:' + name + '-main', 
      'browserify:' + name + '-admin', 
      'copy:' + name
    ]);
    grunt.registerTask('watch-' + name, ['watch:' + name + '-php', 'watch: ' + name + '-js']);
    buildpluginstask.push('build-plugin-' + name);
  }
  
  grunt.registerTask('build-plugins', buildpluginstask);

  grunt.registerTask('init-composer', ['curl:composerInstaller', 'exec:installComposer', 'exec:composer','clean:composerInstaller']);

  grunt.registerTask('init-theme', ['curl:parentTheme','clean:parentTheme','unzip:fluida']);
  
  grunt.registerTask('init', ['init-composer', 'init-theme', 'build']);

  grunt.registerTask('build', ['build-plugins', 'clean:build','browserify:dist','sass:dist','header:dist','copy']);

  grunt.registerTask('default', ['build']);

}
