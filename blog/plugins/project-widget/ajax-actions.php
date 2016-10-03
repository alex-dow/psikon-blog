<?php
function project_widget_ajax_jenkins() {
    $project = $_POST['project-id'];
    
    if (isset($_POST['build'])) {
        $build = $_POST['build'];
    } else {
        $build = false;
    }
    
    $jenkins_url = get_option('project_widget_settings')['jenkins_url'];

    $url = $jenkins_url.'/job/'.$project;
    
    if ($build) {
        $url .= '/'.$build;
    }
    
    $url .= '/api/json';
    $jenkins_response = file_get_contents($url);

    header('Content-type: application/json');
    echo json_encode([
        'target_url' => $url,
        'response' => json_decode($jenkins_response)
    ]);
    wp_die();
}

add_action('wp_ajax_project_widget_jenkins', 'project_widget_ajax_jenkins');
add_action('wp_ajax_nopriv_project_widget_jenkins', 'project_widget_ajax_jenkins');


function project_widget_ajax_sonar() {

    $args = $_POST['params'];
    $api  = $_POST['api'];

    $sonar_url = get_option('project_widget_settings')['sonar_url'];

    $url = $sonar_url . '/' . $api . '?' . http_build_query($args);

    $response = [
        'target_url' => $url
    ];

    $sonar_response = file_get_contents($url);
    $response['response'] = json_decode($sonar_response);

    header('Content-type: application/json');
    echo json_encode($response);
    wp_die();
}
if (is_admin()) {
    add_action('wp_ajax_project_widget_admin_sonar','project_widget_ajax_sonar');
}
add_action('wp_ajax_project_widget_sonar','project_widget_ajax_sonar');