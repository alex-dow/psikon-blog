var hb = require('../templates/handlebars/admin-project-row.html');
var Sparkline = require('./sparkline.js');
var $ = jQuery;
var tplProjectBuildStatus = require('../templates/handlebars/project-build-status.html');
var tplProjectStatistics = require('../templates/handlebars/project-statistics.html');

var ajaxurl = ajax_object.ajax_url;

function secondsToHms(d) {
    d = parseInt(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d - (h * 3600)) / 60);
    var s = d - (h * 3600) - (m * 60);
    
    var str = "";
    if (h > 0) {
        str += h.toString() + 'h:';
    }
    
    if (m < 10) {
        str += '0';
    }
    str += m.toString() + 'm:';
    
    if (s < 10) {
        str += '0';
    }
    str += s.toString() + 's';
    
    return str;
}

function initProjectBuild(projectId) {
    
    var data = {
      'project-id': projectId
    };
    
    getProjectJobData(projectId)
    .then(function(response) {
        if (response.response.color == 'red') {
            data['status'] = 'fail';
            data['text'] = 'Build Failing';
        } else {
            data['status'] = 'ok';
            data['text'] = 'Build OK';
        }
        return getProjectBuildData(projectId, response.response.builds[0].number);
    })
    .then(function(response) {
        data['build-time'] = secondsToHms(response.response.duration);
        
        var status = '';
        var text = '';
        
        if (data.color == 'red') {
            status = 'fail';
            text = 'Build Failing';
        } else {
            status = 'ok';
            text = 'Build OK';
        }

        $('#' + projectId + '-build-status').html(tplProjectBuildStatus(data));
        $('#' + projectId + '-build-status-bar').animate({
            width: '100%'
        },500);        
        
    })
    .then(function() {
        return getProjectStatistics(projectId);
    })
    .then(function(response) {
        var values = response.response[0].cells;
        
        var cov = [];
        var ncloc = [];
        
        for (var i = 0; i < values.length; i++) {
            
            var nclocValue = values[i].v[0];
            var covValue = values[i].v[1];
            
            ncloc.push((nclocValue == null) ? 0 : nclocValue);
            cov.push((covValue == null) ? 0 : covValue);
        }
        
        var covStr = (cov.length > 1) ? cov.join(', ') : cov.toString + ', ';
        var nclocStr = (ncloc.length > 1) ? ncloc.join(', ') : ncloc.toString + ', ';
        
        lastCov = cov[cov.length-1];
        lastNcloc = ncloc[ncloc.length-1];
        
        $('#' + projectId + '-statistics').html(tplProjectStatistics({
            'project-id': projectId,
            'loc': lastNcloc,
            'cov': lastCov,
            'cov-graph': covStr,
            'loc-graph': nclocStr
        }));
        
        Sparkline(jQuery('#' + projectId + '-stats-loc-graph'));
        Sparkline(jQuery('#' + projectId + '-stats-cov-graph'));
    });
}

function getProjectStatistics(projectId) {
    return jQuery.ajax({
        url: ajaxurl,
        data: {
            'action': 'project_widget_sonar',
            'params': {
                'resource': projectId,
                'metrics': 'ncloc,coverage'
            },
            'api': '/api/timemachine/index' 
        },
        method: 'post'
    });
}

function getProjectBuildData(projectId, build) {
    return jQuery.ajax({
        url: ajaxurl,
        data: {
            'action': 'project_widget_jenkins',
            'project-id': projectId,
            'build': build
        },
        method: 'post'
    })
}

function getProjectJobData(projectId) {
    
    return jQuery.ajax({
        url: ajaxurl,
        data: {
            'action': 'project_widget_jenkins',
            'project-id': projectId
        },
        method: 'post'
    });
    
}


jQuery(document).ready(function() {
    jQuery('#pw-table-body tr').each(function(idx, el) {
        var projectId = el.id.replace('-project','');
        initProjectBuild(projectId);
    });
});
