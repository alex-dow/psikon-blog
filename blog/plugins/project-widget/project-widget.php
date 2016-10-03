<?php
/*
Plugin Name: Psikon - Project Widget
Plugin URI:  https://psikon.com
Description: Psikon - Project Widget
Version:     1.0.0
Author:      Alex Dow
Author URI:  https://psikon.com
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: psikon-widget
Domain Path: /languages
*/

class ProjectWidget extends WP_Widget {
    
    public function __construct() {
        
        $widget_opts = array(
            'classname' => 'projectwidget',
            'description' => 'Psikon Project Widget'
            
        );
        
        parent::__construct('projectwidget', 'Psikon Project Widget', $widget_opts);
        
    }
    
    public function widget($args, $instance) {
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'psikon_project_widget_projects';
        $results = $wpdb->get_results('SELECT * FROM '.$table_name.' ORDER BY projectName ASC', ARRAY_A);
        
        include('templates/widget.php');
    }
    
    public function update($new_instance, $old_instance) {
        return $new_instance;
    }
}

add_action('widgets_init', function() {
    register_widget('ProjectWidget');
    

});

function project_widget_init() {
    if (is_active_widget('','','projectwidget')) {
        wp_register_script('project_widget_main', plugins_url('/project-widget/js/main.js'), ['jquery']);
        wp_enqueue_script('project_widget_main');
        wp_localize_script('project_widget_main', 'ajax_object', array('ajax_url' => admin_url('admin-ajax.php')));
    }
}
add_action('init', 'project_widget_init');

function project_widget_get_projects() {
  global $wpdb;

  $table_name = $wpdb->prefix . 'psikon_project_widget_projects';


  $query = 'SELECT * FROM '.$table_name;

  $results = $wpdb->get_results($query, ARRAY_A);

  return $results;
}

function project_widget_install() {
    global $wpdb;
    
    $table_name = $wpdb->prefix . "psikon_project_widget_projects";
    $collate = $wpdb->get_charset_collate();
    
    $sql = 'CREATE TABLE '.$table_name.' (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        projectName varchar(255) NOT NULL,
        projectId varchar(255) NOT NULL,
        sonarId  varchar(255) DEFAULT NULL,
        jenkinsId varchar(255) DEFAULT NULL,
        githubUrl varchar(255) DEFAULT NULL,
        PRIMARY KEY  (id)
    ) '.$collate.';';
    
    require_once(ABSPATH.'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

register_activation_hook(__FILE__, 'project_widget_install');

require_once('ajax-actions.php');
require_once('admin/init.php');
?>