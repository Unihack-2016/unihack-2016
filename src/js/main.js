// http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
// Modified to only fire on body class (not body class + ID, working off strictly WordPress body_class)

window.routes = window.routes || {};

(function() {

  'use strict';

  var list;

  function loadRoutes() {

    var routeList = {
      // all pages
      common: {
        init: function(){
          $('.focus-first').focus();
          // $('a').click(function() {
          //   alert('Hello world!');
          // });

        },
        finalize: function(){ }
      },
      // Home page
      home: {
        init: function(){

          // $('a').click(function() {
          //   alert('Hello world!');
          // })

        }
      },
      login : routes.login,
      pages : routes.pages,
      subpage : routes.page,

      types : routes.types
    };

    return routeList;
  }

  var router = {
    fire : function(func,funcname, args){
      var namespace = list;  // indicate your obj literal namespace here
      funcname = (funcname === undefined) ? 'init' : funcname;
      if (func !== '' && namespace[func] && typeof namespace[func][funcname] == 'function'){
        namespace[func][funcname](args);
      }
    },
    loadEvents : function(){

      // hit up common first.
      router.fire('common');

      // do all the classes too.
      $.each(document.body.className.split(/\s+/),function(i,classname) {
        classname = classname.replace(/[_-]/g, "_");
        router.fire(classname);
      });

      router.fire('common','finalize');
    }
  };

  // kick it all off here
  $(document).ready(function() {
    list = loadRoutes();
    router.loadEvents();
  });

})(window, document);