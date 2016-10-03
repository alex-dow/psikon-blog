var plugins = ['project-widget'];

var vendor_plugins = [
    ['wp-mail-smtp','0.9.6'],
    ['crayon-syntax-highlighter',null],
    ['wp-recaptcha-integration', '1.1.10'],
    ['all-in-one-wp-migration', '5.52'],
    ['google-analytics-for-wordpress', '5.5.2']
];

var vendor_themes = [
    ['fluida', '0.9.9.4']
];



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

function install_vendor(name, version, type) {
    var downloadUrl;
    var dest;
    
    if (type == 'plugins') {
        downloadUrl = 'https://downloads.wordpress.org/plugin/' + name;
        dest = '<%=pluginDir%>';
    } else {
        downloadUrl = 'https://downloads.wordpress.org/theme/' + name;
        dest = '<%=themeDir%>';
    }

    if (version != null) {
      downloadUrl += '.' + version;
    }

    downloadUrl += '.zip';
    
    config['curl'][name] = {
        src: downloadUrl,
        dest: 'build/downloads/' + type + '/' + name + '.zip'
    };
    
    config['unzip'][name] = {
        src: 'build/downloads/' + type + '/' + name + '.zip',
        dest: dest
    };
    
    config['clean'][name] = {
        src: dest + '/' + name
    };
}

for (var i = 0; i < vendor_plugins.length; i++) {
    install_vendor(vendor_plugins[i][0],vendor_plugins[i][1],'plugins');
}

for (var i = 0; i < vendor_themes.length; i++) {
    install_vendor(vendor_themes[i][0],vendor_themes[i][1],'themes');
}

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
  
  var vendorplugintask = [];
  for (var i = 0; i < vendor_plugins.length; i++) {
      var name = vendor_plugins[i][0];
      grunt.registerTask('install-vendor-plugin-' + name, [
          'clean:' + name,
          'curl:' + name,
          'unzip:' + name
      ]);
      vendorplugintask.push('install-vendor-plugin-' + name);
  }
  
  var vendorthemestask = [];
  for (var i = 0; i < vendor_themes.length; i++) {
      var name = vendor_themes[i][0];
      grunt.registerTask('install-vendor-theme-' + name, [
          'clean:' + name,
          'curl:' + name,
          'unzip:' + name
      ]);
      vendorthemestask.push('install-vendor-theme-' + name);
  }  
  
  grunt.registerTask('vendor-plugins', vendorplugintask);
  grunt.registerTask('vendor-themes', vendorthemestask);
  
  grunt.registerTask('build-plugins', buildpluginstask);

  grunt.registerTask('init-composer', ['curl:composerInstaller', 'exec:installComposer', 'exec:composer','clean:composerInstaller']);

  grunt.registerTask('init', ['init-composer', 'vendor-themes', 'vendor-plugins', 'build']);

  grunt.registerTask('build', ['build-plugins', 'clean:build','browserify:dist','sass:dist','header:dist','copy']);

  grunt.registerTask('default', ['build']);

}
