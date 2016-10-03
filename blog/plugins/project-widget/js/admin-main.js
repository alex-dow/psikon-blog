var projectRowTpl = require('../templates/handlebars/admin-project-row.html');

function onLoad() {
    /*
    sonarQuery({
        api: 'api/events',
        params: {
            resource: 'icuify',
            categories: 'Version'
        }
    });
    */
    
    getProjects()
    .done(function(response) {
        console.log(typeof response);
        console.log(response.length);
       jQuery('#project-list').html('');
       for (var i = 0; i < response.length; i++) {
           addProjectRow({
               'project-id': response[i].projectId,
               'project-name': response[i].projectName
           });
           get_project_metadata(response[i].projectId);
       }
    });
    
    jQuery('#project-list').on('click', onTbodyClick);
    jQuery('#add-project').on('submit', onSubmit);
}

function onTbodyClick(e) {
    if (e.target.tagName != 'A') {
        return;
    }

    var id = e.target.id.replace('-delete','');

    jQuery.ajax({
        url: ajaxurl,
        data: {
            action: 'project_widget_delete_project',
            'project-id': id 
        },
        method: 'post'
    }).done(function() {
        jQuery('#' + id + '-row').fadeOut({
            duration: 500,
            complete: function() {
                jQuery('#' + id + '-row').remove();
            }
        });
    });
    
}

function jenkinsQuery(projectId) {
    
    var args = {
      'project-id': projectId,
      'action': 'project_widget_jenkins'
    };
    
    return jQuery.ajax({
        url: ajaxurl,
        data: args,
        method: 'post'
    });
    
}

function sonarQuery(args) {
    args['action'] = 'project_widget_sonar';

    return jQuery.ajax({
        url: ajaxurl,
        data: args,
        method: 'post'
    });
}

jQuery(document).ready(onLoad);

function getProjects() {
    return jQuery.ajax({
        url: ajaxurl,
        data: {
            'action': 'project_widget_get_projects'
        },
        method: 'post'
    });
}

function addProjectRow(project) {
    var row = projectRowTpl(project);
    jQuery('#project-list').append(row);
    
}

function onSubmit(e) {
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
        'project-github-url': jQuery('#project-github-url').val(),
        'action': 'project_widget_add_project'
    }
    
    jQuery.ajax({
      url: ajaxurl,
      data: project,
      method: 'post'
    }).done(function() {
      addProjectRow(project);
      jQuery('#add-project input').val('');
      get_project_metadata(project['project-id']);
    }).then(function() {
      jQuery('#add-project-submit-container').html(submitButton);
    });
    

    return false;
}

function get_project_metadata(project) {
    
    sonarQuery({
        api: '/api/events',
        params: {
            resource: project,
            categories: 'Version'
        }
    }).done(function(response) {
        console.log(response);
      jQuery('#' + project + '-sonar-metadata').html('Version: ' + response.response[0].n); 
    }).fail(function() {
      jQuery('#' + project + '-sonar-metadata').html('Unable to load Sonar data!');
    });
    
    jenkinsQuery(project)
    .done(function(response) {
        console.log(response);
        if (response.response.color == 'red') {
            jQuery('#' + project + '-jenkins-metadata').html('Builds are failing!');
        } else {
            jQuery('#' + project + '-jenkins-metadata').html('Builds are probably ok');
        }
    }).fail(function() {
        jQuery('#' + project + '-jenkins-metadata').html('Unable to load Jenkins data!');
    });
}