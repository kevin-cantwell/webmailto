/*
 * Webmail Mailto jQuery Plugin
 * http://kevin-cantwell.github.com/webmailto/
 *
 * Copyright (c) 2010 Kevin Cantwell
 * License: Meh. Just don't sell it, ok?
 *
 * This plugin adds a context menu containing a list of webmail options when the 
 * user hovers over a mailto link. They are given the option to compose an email 
 * in one of three popular webmail services, Gmail, Yahoo, or Hotmail, instead of 
 * in their boring old default mail client. 
 */
 
 
(function($) {
  $.fn.webmailto = function( opts ) {
    
    
    var config = {
      /*
       * Calla back yo!
       */
      callback : function(newWindow) {},
      /* 
       * Specify the style here or simply define
       * the 'webmailto' class in your style sheet.
       */
      className : ''
    };
    
      
    // Obligitory extending of configs;
    var options = $.extend(true, config, opts);
    
    $(document)
      .unbind('click.webmailto')
      .bind('click.webmailto', function() { 
        $('.webmailto').detach(); 
      });
    
    // Filter off non-mailto links.    
    this.filter('a[href^=mailto:]').each( function() {
      
      
      var $contextMenu = $('<ul/>', { 'class' : 'webmailto ' + options.className });

      var $mailTo      = $(this)
                           .unbind('mouseenter.webmailto') // To prevent memory leaks
                           .bind('mouseenter.webmailto', function() {
                             $('.webmailto').detach();
                             var pos = $(this).offset();
                             $(this).after($contextMenu.css( 
                               { 
                                 'position' : 'absolute',
                                 'top'      : pos.top + $(this).height(), 
                                 'left'     : pos.left
                               } 
                             ));
                           });
      
      var initContextMenu = function() {
     

        var mailtoParams = function() {
                
          var params = {
            to      : '',
            cc      : '',
            bcc     : '',
            subject : '',
            body    : ''
          };
          
          var escape = function( str ) {
            if( str === undefined )
              return '';
            /*
             * TODO: implement me
             */
            return str;
          };
          
          var href = $mailTo.attr('href');
          
          var split = href.substring(7).split('?', 2);
          params.to = split[0];
          
          var keyValuePairs = escape(split[1]).split('&');
          
          // Override the defaults
          for(var i=0;i<keyValuePairs.length;i++) {
            var keyValue = keyValuePairs[i].split('=');
            params[keyValue[0]] = keyValue[1];
          }
          
          return params;
          
        };
        
        // Init email params
        var params = mailtoParams();
        
        // Init direct urls to popular webmail services
        var urls = {
          'gmail'   : 'https://mail.google.com/mail/?view=cm&fs=1&tf=1&shva=1' + 
                      '&to='      + params.to +
                      '&cc='      + params.cc +
                      '&bcc='     + params.bcc +         
                      '&su='      + params.subject +
                      '&body='    + params.body,
          'yahoo'   : 'http://compose.mail.yahoo.com/?' +
                      'to='       + params.to +
                      '&cc='      + params.cc +
                      '&bcc='     + params.bcc +
                      '&subj='    + params.subject +
                      '&body='    + params.body,
          'hotmail' : 'http://mail.live.com/mail/EditMessageLight.aspx?n=' +
                      '&to='      + params.to +
                      '&cc='      + params.cc +
                      '&bcc='     + params.bcc +
                      '&subject=' + params.subject +
                      '&body='    + params.body
        }

        var openWebmail = function( url ) {
        
          return function() {
             
            $('.webmailto').detach(); 
            
            var newWindow = window.open(url, '_blank', 'location=0,statusbar=0,menubar=0,width=600,height=600');
            
            // Provide a handle to the new window.
            options.callback(newWindow);
            
            return false;
          };
          
        };   
        
        for( svc in urls ) {
          
          var $li   = $('<li/>')
                        .appendTo( $contextMenu );
          var $link = $('<a/>', {
                        'href'  : urls[svc],
                        'class' : svc,
                        'title' : 'Compose in ' + svc,
                        'text'  : svc,
                        'click' : openWebmail(urls[svc])
                      }).appendTo( $li );
        }
        
      };
      
      initContextMenu();
      
    
    });
    
    // Make sure to return everything, even the elements we filtered off.
    return this;
  };
  
})(jQuery);