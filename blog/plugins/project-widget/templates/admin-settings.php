<div class="wrap">
	<h2>Project Widget Settings</h2>
   	<form action="options.php" method="post">
    	<?php 
        	settings_fields( 'project_widget_settings_group' );
            do_settings_sections( 'project_widget_settings' );
            submit_button();
        ?>
	</form>
</div>