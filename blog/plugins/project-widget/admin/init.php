<?php
function project_widget_projects_page() {
    include(__DIR__.'/../templates/admin-projects.php');
}

function project_widget_create_menu() {

    //create new top-level menu
    
    add_menu_page('Psikon - Project Widget', 'PW Projects', 'administrator', __FILE__, 'project_widget_projects_page' , plugins_url('/images/icon-small.png', __FILE__) );

    //call register settings function
    // add_action( 'admin_init', 'register_my_cool_plugin_settings' );
}
add_action('admin_menu', 'project_widget_create_menu');

function project_widget_admin_scripts($hook) {
    if ($hook == 'toplevel_page_project-widget/admin/init') {
        wp_register_script('project_widget_admin_main', plugins_url('/project-widget/js/admin-main.js'));
        wp_enqueue_script('project_widget_admin_main');
    }
}

if (is_admin()) {
    add_action('admin_enqueue_scripts', 'project_widget_admin_scripts');
    require_once('options_page.php');
    require_once('ajax_actions.php');
}