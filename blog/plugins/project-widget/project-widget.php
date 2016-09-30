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
        echo 'hi';
    }
    
    public function update($new_instance, $old_instance) {
        return $new_instance;
    }
}

add_action('widgets_init', function() {
    register_widget('ProjectWidget');
});

function project_widget_settings_page() {
    include('templates/admin-form.php');
}

add_action('admin_menu', 'project_widget_create_menu');

function project_widget_create_menu() {

    //create new top-level menu
    add_menu_page('Psikon - Project Widget', 'Settings', 'administrator', __FILE__, 'project_widget_settings_page' , plugins_url('/images/icon-small.png', __FILE__) );

    //call register settings function
    // add_action( 'admin_init', 'register_my_cool_plugin_settings' );
}

function project_widget_ajax_add_project() {
    
    global $wpdb;
    
    $table_name = $wpdb->prefix .'psikon_project_widget_projects';
    
    header('Content-type', 'application/json');
    
    try {
        
        $wpdb->insert($table_name, array(
            'projectName' => $_POST['project-name'],
            'projectId' => $_POST['project-id'],
            'sonarId' => $_POST['project-sonar-id'],
            'jenkinsId' => $_POST['project-jenkins-id']
        ));
        
        echo json_encode(array('ok' => true));
        
    } catch (Exception $e) {
        echo json_encode(array('ok' => false)); 
    }
    
    wp_die();
}

if (is_admin()) {
    add_action('wp_ajax_project_widget_add_project', 'project_widget_ajax_add_project');
}

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
        PRIMARY KEY  (id)
    ) '.$collate.';';
    
    require_once(ABSPATH.'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

register_activation_hook(__FILE__, 'project_widget_install');

?>
