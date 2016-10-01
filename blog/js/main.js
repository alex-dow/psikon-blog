/*
 * Modified Fluida Theme Frontend JS
 * http://www.cryoutcreations.eu/
 *
 * Copyright 2015-16, Cryout Creations
 * Free to use and abuse under the GPL v3 license.
 */

jQuery(window).load(function() {
	if ( fluida_settings.fitvids == 1 ) jQuery(".entry-content").fitVids();
	if ( fluida_settings.articleanimation ) animateScroll();
	if ( ( fluida_settings.masonry == 1 ) && ( fluida_settings.magazine != 1 ) ) {
		jQuery('#content-masonry').masonry({
			itemSelector: 'article',
			columnWidth: 'article',
			percentPosition: true
		});
	}
});

jQuery(document).ready(function() {

	fluida_mobilemenu_init();

	/* Menu animation */
	jQuery("#access ul ul").css({display: "none"}); /* Opera Fix */
	jQuery("#access > .menu ul li > a:not(:only-child)").attr("aria-haspopup","true");/* IE10 mobile Fix */

	jQuery("#access li").hover(function(){
		jQuery(this).find('ul:first').stop();
		jQuery(this).find('ul:first').css({opacity: "0", marginTop:"-150px",}).css({visibility: "visible", display: "block", overflow:"visible"}).animate({"opacity":"1",marginTop:"+=150"},{queue:false});
	},function(){
		jQuery(this).find('ul:first').css({visibility: "visible",display: "block",overflow:"visible"}).animate({marginTop:"-=150"}, {queue:false}).fadeOut();
	});

	/* Back to top button animation */
	jQuery(window).scroll(function() {
		if (jQuery(this).scrollTop() > 500) {
			jQuery('#toTop').css({'bottom':'-2px','opacity':1});
		}
		else {
			jQuery('#toTop').css({'bottom':'100px','opacity':0});
		}

		if (jQuery(this).scrollTop() > 300) {
			jQuery('.fluida-fixed-menu #site-header-main').addClass('header-fixed');
		}
		else {
			jQuery('.fluida-fixed-menu #site-header-main').removeClass('header-fixed');
		}
	});

	jQuery(window).trigger('scroll');

    jQuery('#toTop').click(function(event) {
        event.preventDefault();
        jQuery('html, body').animate({scrollTop: 0}, 500);
        return false;
    });

	/* Social Icons titles */
	jQuery(".socials a").each(function() {
		jQuery(this).attr('title', jQuery(this).children().html());
		jQuery(this).html('');
	});

	/* Search form animation */
	var i=0;
	jQuery(".menu-search-animated i.search-icon").click(function(event){
		i++;
		jQuery(".menu-search-animated .searchform").slideToggle(100);
		jQuery(".menu-search-animated .s").focus();
		if(i==2) {
			jQuery(".menu-search-animated .searchsubmit").click();
		}
		event.stopPropagation();
	});
	jQuery(".menu-search-animated .searchform").click(function(event){
		event.stopPropagation();
	});
	jQuery('#access .menu-search-animated .s').blur(function() {
		i=0;
		jQuery("#access .menu-search-animated .searchform").fadeOut(100);
	});


	/* Detect and apply custom class for Safari */
	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
		jQuery('body').addClass('safari');
	}

	/* Add body class if masonry is used on page */
	if ( jQuery('#content-masonry').length > 0 ) {
		jQuery('body').addClass('with-masonry');
	}

});
/* end document.ready */


/* Mobile Menu */
function fluida_mobilemenu_init() {

	jQuery("#nav-toggle").click(function(){
		jQuery("#mobile-menu").show().animate({left: "0"}, 500);
		jQuery('body').addClass("noscroll");
	});

	jQuery("#nav-cancel").click(function(){
		jQuery("#mobile-menu").animate({left: "100%"},500,function(){jQuery(this).css("left","-100%").hide();});
		jQuery('body').removeClass("noscroll");
	});

	jQuery("#mobile-menu  li > a:not(:only-child)").after("<em class='mobile-arrow'></em>");
	jQuery(".mobile-arrow").click(function(){
		jQuery(this).toggle();
		jQuery(this).prev().addClass('mopen');
		jQuery(this).next().toggle();
	});

	jQuery("#mobile-menu > div").append(jQuery("#sheader").clone());
	jQuery("#mobile-menu #sheader").attr('id','smobile');
}

/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

;(function( $ ){

  'use strict';

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null,
      ignore: null
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement("div");
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        'iframe[src*="player.vimeo.com"]',
        'iframe[src*="youtube.com"]',
        'iframe[src*="youtube-nocookie.com"]',
        'iframe[src*="kickstarter.com"][src*="video.html"]',
        'object',
        'embed'
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var ignoreList = '.fitvidsignore';

      if(settings.ignore) {
        ignoreList = ignoreList + ', ' + settings.ignore;
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not('object object'); // SwfObj conflict patch
      $allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

      $allVideos.each(function(){
        var $this = $(this);
        if($this.parents(ignoreList).length > 0) {
          return; // Disable FitVids on this video.
        }
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        if ((!$this.css('height') && !$this.css('width')) && (isNaN($this.attr('height')) || isNaN($this.attr('width'))))
        {
          $this.attr('height', 9);
          $this.attr('width', 16);
        }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('name')){
          var videoName = 'fitvid' + $.fn.fitVids._count;
          $this.attr('name', videoName);
          $.fn.fitVids._count++;
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+'%');
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };

  // Internal counter for unique video names.
  $.fn.fitVids._count = 0;

// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );

(function($) {

  /**
   * Copyright 2012, Digital Fusion
   * Licensed under the MIT license.
   * http://teamdf.com/jquery-plugins/license/
   *
   * @author Sam Sehnert
   * @desc A small plugin that checks whether elements are within
   *     the user visible viewport of a web browser.
   *     only accounts for vertical position, not horizontal.
   */

  $.fn.visible = function(partial) {

      var $t            = $(this),
          $w            = $(window),
          viewTop       = $w.scrollTop(),
          viewBottom    = viewTop + $w.height(),
          _top          = $t.offset().top,
          _bottom       = _top + $t.height(),
          compareTop    = partial === true ? _bottom : _top,
          compareBottom = partial === true ? _top : _bottom;

    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

  };

})(jQuery);

function animateScroll() {

	var win = jQuery(window);
	var allMods = jQuery("#content-masonry > article");

	allMods.each(function(i, el) {
	  var el = jQuery(el);
	  if (el.visible(true)) {
	    el.addClass("already-visible");
	  }
	});

	win.scroll(function(event) {

		allMods.each(function(i, el) {
		    var el = jQuery(el);
		    if (el.visible(true)) {
		      el.addClass("animated-article");
			}
		});

	});
}

animateScroll();

/* Returns the version of Internet Explorer or a -1
  (indicating the use of another browser). */
function getInternetExplorerVersion()
{
  var rv = -1; /* assume not IE. */
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}
