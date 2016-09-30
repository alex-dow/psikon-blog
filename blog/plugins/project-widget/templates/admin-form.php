<div class="wrap">

<h1>Psikon Project Widget</h1>

<div id="col-container" class="wp-clearfix">
	<div id="col-left">
		<div class="col-wrap">
			<div class="form-wrap">
				<h2>Add Project</h2>
				<form id="add-project" class="validate">
					<div class="form-field form-required">
						<label for="project-name">Project Name</label>
						<input type="text" name="project-name" id="project-name" size="40" aria-required="true">
						<p>The name of the project</p>
					</div>
					<div class="form-field form-required">
						<label for="project-id">Project ID</label>
						<input type="text" name="project-id" id="project-id" size="40" aria-required="true">
						<p>Unique project identifier</p>
					</div>
					<div class="form-field">
						<label for="project-sonar-id">Custom Sonar ID</label>
						<input type="text" name="project-sonar-id" id="project-sonar-id" size="40" aria-required="true">
						<p>Change this if the ID of your project in Sonar is different</p>
					</div>
					<div class="form-field">
						<label for="project-jenkins-id">Custom Jenkins ID</label>
						<input type="text" name="project-jenkins-id" id="project-jenkins-id" size="40" aria-required="true">
						<p>Change this if the ID of your project in Jenkins is different</p>
					</div>
					<div class="form-field" id="add-project-submit-container">
						<button class="button" type="submit">Add Project</button>
					</div>					
				</form>
			</div>
		</div>
	</div>
	<div id="col-right">
    	<div class="col-wrap">
        	<table class="wp-list-table widefat fixed striped posts">
        		<thead>
        			<tr>
        				<th scope="col" class="class="manage-column column-title column-primary sortable desc">
        					<a href="#">
        						<span>Project Name</span>
        					</a>
        				</th>
        				<th scope="col" class="class="manage-column column-title column-primary">
        					<a href="#">
        						<span>Sonar Metadata</span>
        					</a>
        				</th>
        				<th scope="col" class="class="manage-column column-title column-primary">
        					<a href="#">
        						<span>Jenkins Metadata</span>
        					</a>
        				</th>
        				<th scope="col" class="class="manage-column column-title column-primary">
        					<a href="#">
        						<span>Actions</span>
        					</a>
        				</th>
        			</tr>
        		</thead>
        		<tbody id="project-list">

        		</tbody>
        	</table>	
        </div>
    </div>
</div>
</div>

<script type="text/javascript">

function add_project_row(project) {
		var row = '<tr>' +
		'<td class="title-column-title column-primary">' +
		'<strong>' + project['project-name'] + '</strong>' +
		'</td>' + 
		'<td class="title column-title column-primary" id="' + project['project-id'] + '-sonar-metadata">' + 
		'<img src="/wp-admin/images/spinner.gif" id="' + project['project-id'] + '-sonar-spinner">' + 
		'</td>' +
		'<td class="title column-title column-primary" id="' + project['project-id'] + '-jenkins-metadata">' + 
		'<img src="/wp-admin/images/spinner.gif" id="' + project['project-id'] + '-jenkins-spinner">' + 
		'</td>' +
		'<td class="title column-title column-primary" id="' + project['project-id'] + '-actions">' + 
		'<a href="#">Delete</a>' +  
		'</td>' +
		'</tr>';
		jQuery('#project-list').append(row);
		jQuery('#add-project input').val('');
		get_project_metadata(project['project-id']);
}

jQuery('#add-project').on('submit', function(e) {
	e.preventDefault();
	
	var submitButton = jQuery('#add-project-submit-container').html();	

	jQuery('#add-project-submit-container').html(
		'<img src="/wp-admin/images/spinner.gif">'
	);

	var project = {
		'project-name': jQuery('#project-name').val(),
		'project-id': jQuery('#project-id').val(),
		'project-sonar-id': jQuery('#project-sonar-id').val(),
		'project-jeknins-id': jQuery('#project-jenkins-id').val(),
		'action': 'project_widget_add_project'
	}
	
	jQuery.ajax({
		url: ajaxurl,
		data: project,
		method: 'post'
  }).done(function() {
    add_project_row(project);
	}).then(function() {
		jQuery('#add-project-submit-container').html(submitButton);
	});
	

	return false;
});

function get_project_metadata(project) {
    jQuery.ajax({
    	url: '/sonar/api/events?resource=' + project + '&categories=Version',
    }).done(function(response) {
    	jQuery('#' + project + '-sonar-metadata').html('Version: ' + response[0].n); 
    }).fail(function() {
      jQuery('#' + project + '-sonar-metadata').html('Unable to load Sonar data!');
    });

    jQuery.ajax({
        url: '/jenkins/jenkins/job/' + project + '/api/json'
    }).done(function(response) {
        jQuery('#' + project + '-jenkins-metadata').html('Build Color: ' + response.color);
    }).fail(function() {
        jQuery('#' + project + '-jenkins-metadata').html('Unable to load Jenkins data!');
    });
}

<?php
$projects = project_widget_get_projects();

foreach ($projects as $project) {
?>

  add_project_row({
    'project-name': '<?php echo $project['projectName']; ?>',
    'project-id': '<?php echo $project['projectId']; ?>',
    'project-sonar-id': '<?php echo $project['sonarId']; ?>',
    'project-jenkins-id': '<?php echo $project['jenkinsId']; ?>'
});

<?php
}
?>
</script>
