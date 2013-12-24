'use strict';

(function() {
  // Reveal navbar 
  window.onscroll = function() {
    var carousel = document.getElementById("carousel1");
    var doc = document.documentElement, body = document.body;

    var min_pos = carousel.offsetTop + carousel.offsetHeight - 50;
    var current_pos = (doc && doc.scrollTop  || body && body.scrollTop  || 0);

    if (current_pos >= min_pos) {
      document.getElementById("nav").className = "navbar navbar-inverse navbar-fixed-top show";
    } else {
      document.getElementById("nav").className = "navbar navbar-inverse navbar-fixed-top";
    }
  }

})();