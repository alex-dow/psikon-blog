<?php

function project_widget_ajax_get_projects() {
    $projects = project_widget_get_projects();
    header('Content-type: application/json', true);
    echo json_encode($projects);
    wp_die();
}
if (is_admin()) {
    add_action('wp_ajax_project_widget_get_projects', 'project_widget_ajax_get_projects');
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
            'jenkinsId' => $_POST['project-jenkins-id'],
            'githubUrl' => $_POST['project-github-url']
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

function project_widget_admin_ajax_delete_project() {
    global $wpdb;
    
    $table_name = $wpdb->prefix .'psikon_project_widget_projects';
    $wpdb->delete($table_name, array('projectId' => $_POST['project-id']));
    echo json_encode(array('ok' => true));
    wp_die();
}
if (is_admin()) {
    add_action('wp_ajax_project_widget_delete_project', 'project_widget_admin_ajax_delete_project');
}