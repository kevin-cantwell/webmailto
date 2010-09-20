/*
 * Webmail Mailto jQuery Plugin
 * http://www.example.com/
 *
 * Copyright (c) 2010 Kevin Cantwell
 * License? Meh. (Just don't sell it, ok?)
 *
 * This plugin adds a context menu containing a list of webmail 
 * options when the user hovers over a mailto link. The original 
 * link remains unchanged (ie: It will still open the default 
 * mail client).
 */
 
 
(function($) {
  $.fn.webmailto = function( opts ) {
    
    
    var config = {
      /* 
       * Specify the style here or simply define
       * the webmailto class in your style sheet.
       */
      css      : {
        ul : { },
        li : { },
        a  : { }
      },
      // Calla back yo!
      callback : function(newWindow) {}
    };
    
      
    // Obligitory extending of configs;
    var options = $.extend(config, opts);
    
    
    // Filter off non-mailto links.    
    this.filter('a[href^=mailto:]').each( function() {
      
        
      var $contextMenu = $('<ul/>', {
                           'class' : 'webmailto'
                         }).mouseleave(function() {
                           $(this).detach();
                         });
                         

      var $mailTo      = $(this)
                           .unbind('mouseenter.webmailto')
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
          'Gmail'     : 'https://mail.google.com/mail/?view=cm&fs=1&tf=1&shva=1' + 
                        '&to='      + params.to +
                        '&cc='      + params.cc +
                        '&bcc='     + params.bcc +         
                        '&su='      + params.subject +
                        '&body='    + params.body,
          'Yahoo'     : 'https://compose.mail.yahoo.com?' +
                        'To='       + params.to +
                        '&Cc='      + params.cc +
                        '&Bcc='     + params.bcc +
                        '&Subject=' + params.subject +
                        '&Body='    + params.body,
          'Hotmail'   : 'https://hotmail.com'
        }

        var windowOpenFunc = function( url ) {
        
          return function() {
          
            $(this).parent().parent().detach(); // this(a) -> parent(li) -> parent(ul)
            
            var newWindow = window.open(url, '_blank', 'location=0,statusbar=0,menubar=0,width=600,height=600');
            
            // Provide a handle to the new window.
            options.callback(newWindow);
            
            return false;
          };
          
        };   
        
        for( i in urls ) {
          
          var $li   = $('<li/>')
                      .appendTo( $contextMenu );
          var $link = $('<a/>', {
                        'href'  : urls[i],
                        'title' : 'Compose in ' + i,
                        'text'  : i,
                        'click' : windowOpenFunc(urls[i])
                      }).appendTo( $li );
        }
        
      };
      
      initContextMenu();
      
    
    });
    
    // Make sure to return everything, even the elements we filtered off.
    return this;
  };
  
})(jQuery);