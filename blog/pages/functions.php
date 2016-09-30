<?php

function psikon_enqueue_styles() {


    
    $parent_style = 'fluida-style';
    
    wp_enqueue_style($parent_style, get_template_directory_uri() .'/style.css');
    wp_enqueue_style('psikon-style',
        get_stylesheet_directory_uri().'/style.css',
        array($parent_style),
        wp_get_theme()->get('Version')
    );

    // fluida_enqueue_styles();


}
add_action( 'wp_enqueue_scripts', 'psikon_enqueue_styles');

function psikon_enqueue_scripts() {
    wp_register_script('psikon-frontend', get_template_directory_uri() + '/js/main.js', _CRYOUT_THEME_VERSION);
    wp_enqueue_script('psikon-frontend');
}
// add_action('wp_enqueue_scripts', 'psikon_enqueue_scripts');

function psikon_footer_scripts() {
    $js_options = array(
        'masonry' => cryout_get_option('fluida_masonry'),
        'magazine' => cryout_get_option('fluida_magazinelayout'),
        'fitvids' => cryout_get_option('fluida_fitvids'),
        'articleanimation' => cryout_get_option('fluida_articleanimation'),
    );
    
    psikon_enqueue_scripts();
  //  psikon_reset_fluida_scripts();

    if ($js_options['masonry']) wp_enqueue_script( 'jquery-masonry' );
    
    if ( is_singular() && get_option( 'thread_comments' ) ) wp_enqueue_script( 'comment-reply' );
}

function psikon_reset_fluida_scripts() {
    wp_dequeue_script('fluida-frontend');
    wp_deregister_script('fluida-frontend');
}

add_action('after_setup_theme', function() {
  remove_action('wp_footer', 'fluida_scripts_method');
  psikon_reset_fluida_scripts();
});

// add_action('wp_footer', 'psikon_reset_fluida_scripts',20);
// add_action('wp_enqueue_scripts', 'psikon_reset_fluida_scripts',20);
add_action( 'wp_footer', 'psikon_footer_scripts',20);




