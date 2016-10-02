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
					<tr>
						<td colspan="4">
							<img src="/wp-admin/images/spinner.gif">
						</td>
					</tr>
        		</tbody>
        	</table>	
        </div>
    </div>
</div>
</div>
