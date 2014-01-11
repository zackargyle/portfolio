'use strict';

var onlineResume = angular.module('onlineResume.directives', ['ui.bootstrap']);

onlineResume.directive('scrollWatch', function ($window) {
 		return {
 			restrict: 'A',
    		link: function (scope, elem, attrs) {

    			var BASE_URL = "http://localhost:8000/";
    			//var BASE_URL = "http://zackargyle.com/"

	    		if (window.isMobile) {

	    			document.getElementById("about-header").style.display = "none";
	    			document.getElementById("code-header").style.display = "none";
	    			document.getElementById("message-header").style.display = "none";
	    			document.getElementById("game-header").style.display = "none";

	    		}
	    		else {

    				var src1 = "images/background/train.jpg",
	    					src2 = "images/background/seattle.jpg",
	    					src3 = "images/background/siblings.jpg",
	    					src4 = "images/background/goofy.jpg";

	    			document.body.style.backgroundImage = "url(" + src1 + ")";

	    			// Background image swap
	    			var about = document.getElementById("about").offsetTop + 400,
	    			    code = document.getElementById("code").offsetTop + 300,
	    			    message = document.getElementById("message").offsetTop + 1050,
	    			    game = document.getElementById("game").offsetTop + 450;

					  // Combine, so only one 'scroll' watch is required
	      		angular.element($window).bind("scroll", function() {

		          if (this.pageYOffset < about) {
		          	if (document.body.style.backgroundImage !== "url(" + BASE_URL + src1 + ")") {
		            	document.body.style.backgroundImage = "url(" + src1 + ")";
		            }
		          } else if (this.pageYOffset > about && this.pageYOffset < code) {
		          	if (document.body.style.backgroundImage !== "url(" + BASE_URL + src2 + ")") {
		           	  document.body.style.backgroundImage = "url(" + src2 + ")";
		          	}
		          } else if (this.pageYOffset > code && this.pageYOffset < message) {
		          	if (document.body.style.backgroundImage !== "url(" + BASE_URL + src3 + ")") {
		            	document.body.style.backgroundImage = "url(" + src3 + ")";
		            }
		          } else if (this.pageYOffset > message && this.pageYOffset < game) {
		          	if (document.body.style.backgroundImage !== "url(" + BASE_URL + src4 + ")") {
		            	document.body.style.backgroundImage = "url(" + src4 + ")";
		            }
		          } 

		        });

					}

					angular.element($window).bind("scroll", function() {
	  				// Nav fade in/out
	  				var carousel = document.getElementById("carousel1"),
				      	min_pos = carousel.offsetTop + carousel.offsetHeight - 50,
				  	  	nav = document.getElementById("nav");

	          if (this.pageYOffset >= min_pos) {
				      nav.className += " show";
				    } else {
				      nav.className = "navbar navbar-inverse navbar-fixed-top";
				    }
				  });
    	}
 		}
 	});