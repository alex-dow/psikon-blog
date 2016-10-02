<?php
class ProjectWidget_Options_Page
{
    /**
     * Holds the values to be used in the fields callbacks
     */
    private $options;

    /**
     * Start up
     */
    public function __construct()
    {
        add_action( 'admin_menu', array( $this, 'add_plugin_page' ) );
        add_action( 'admin_init', array( $this, 'page_init' ) );
    }

    /**
     * Add options page
     */
    public function add_plugin_page()
    {
        // This page will be under "Settings"
        add_options_page(
            'PW Settings',
            'PW Settings',
            'manage_options',
            'project_widget_settings',
            array( $this, 'create_admin_page' )
        );
    }

    /**
     * Options page callback
     */
    public function create_admin_page()
    {
        $this->options = get_option( 'project_widget_settings' );
        include(__DIR__.'/../templates/admin-settings.php');
    }

    /**
     * Register and add settings
     */
    public function page_init()
    {        
        register_setting(
            'project_widget_settings_group', // Option group
            'project_widget_settings', // Option name
            array( $this, 'sanitize' ) // Sanitize
        );

        add_settings_section(
            'setting_section_id', // ID
            'My Custom Settings', // Title
            array( $this, 'print_section_info' ), // Callback
            'project_widget_settings' // Page
        );  

        add_settings_field(
            'sonar_url', // ID
            'Sonar URL', // Title 
            array( $this, 'sonar_url_callback' ), // Callback
            'project_widget_settings', // Page
            'setting_section_id' // Section           
        );      

        add_settings_field(
            'jenkins_url', 
            'Jenkins URL', 
            array( $this, 'jenkins_url_callback' ), 
            'project_widget_settings', 
            'setting_section_id'
        );      
    }

    /**
     * Sanitize each setting field as needed
     *
     * @param array $input Contains all settings fields as array keys
     */
    public function sanitize( $input )
    {
        $new_input = [
            'jenkins_url' => sanitize_text_field($input['jenkins_url']),
            'sonar_url' => sanitize_text_field($input['sonar_url'])
        ];
        
        return $new_input;
    }

    /** 
     * Print the Section text
     */
    public function print_section_info()
    {
        print 'Enter in the URL of the services you wish to use:';
    }

    private function text_callback($args) {
        ?>
        <input type="text" 
        	   id="<?php echo $args['id']; ?>" 
        	   name="<?php echo $args['group']; ?>[<?php echo $args['id']; ?>]" 
        	   value="<?php echo esc_attr($this->options[$args['id']]); ?>">
        <?php
    }
    
    public function jenkins_url_callback() {
        $this->text_callback([
            'id' => 'jenkins_url',
            'group' => 'project_widget_settings'
        ]);
    }
    
    public function sonar_url_callback() {
        $this->text_callback([
            'id' => 'sonar_url',
            'group' => 'project_widget_settings'
        ]);
    }
}

if (is_admin()) {
    $settings = new ProjectWidget_Options_Page();
}