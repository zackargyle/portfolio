'use strict';

var onlineResume = angular.module('onlineResume', ['onlineResume.directives', 'ui.bootstrap']);

onlineResume.controller('mainCtrl', function($scope, $http) {
  $scope.gitStars = 0;
  $scope.stackRep = 0;
  $scope.ready = true;

	// For carousel
  $scope.slides = [
    { title: "Welcome! Scroll down, or click an image to scroll to a section.",
      image: 'welcome' },
    { title: "Learn a little about me and what it is that I love to do.",
      image: 'about' },
    { title: "See code samples of different projects I've worked on.",
      image: 'code' },
    { title: "Leave a message for all to see on my firebase dashboard.",
      image: 'message' }
  ];

  if (!window.isMobile) {
    $scope.slides.push({ title: "Try out a platformer style game I'm building from scratch.", image: 'game' });
  }

  // Scroll to section
  var offset = document.getElementById("nav").offsetHeight;
  $scope.scrollTo = function(id) {
  	document.getElementById(id + "-container").scrollIntoView();
    window.scrollBy(0,-offset);
  };

  var urls = ["https://api.github.com/repos/zackargyle/angularjs-django-rest-framework-seed",
              "https://api.github.com/repos/zackargyle/django-rest-framework-seed"];

  for (var i = 0; i < urls.length; i++) {
    $http({method: "GET", url: urls[i]})
      .success(function(repo) {
        $scope.gitStars += repo.stargazers_count;
    });
  }

  window.stackResponse = function(obj) {
    $scope.stackRep = obj.users[0].reputation;
  };
  getStackRep();

  $scope.graduation = getGradDate();

});

/* 
  Firebase messaging Controller
*/
onlineResume.controller('codeCtrl', function($scope, $modal) {
  $scope.snippets = ["Javascript", "C++", "Python", "Java", "Angular", "jQuery", "Django", "Android"];

  $scope.openModal = function(snippet) {
    $scope.snippet = snippet;
    var modalInstance = $modal.open({
      templateUrl: "snippets/samples/" + snippet + ".html",
      scope: $scope
    });
  };

});

/*
  Firebase messaging Controller
*/
onlineResume.controller('messageCtrl', function($scope) {
  $scope.messages = [];

  var firebase = new Firebase('https://zackargyle.firebaseIO.com/'), index = 0;
  var snapshots = [];

  firebase.on('child_added', function(snap) {
    snapshots.push(snap);
    var value = snap.val();
    // add id for ng-repeat reverse ordering
    var message = {id: index++, name: value.name, text: value.text};
    $scope.messages.push(message);

  });

  $scope.addMessage = function() {
    firebase.push({name: $scope.name, text: $scope.text});
  }

});

/* 
  Controller for game play 
*/
onlineResume.controller('gameCtrl', function($scope, $timeout) {
  $scope.button = "Start";

  $scope.startGame = function() {

    var character = "lion", height = 62, width = 72;
    //var character = "rayman", height = 68, width = 38;

    Platformer.setupSprite(10, 338, height, width, {
        left: ["images/" + character + "/left1.png", "images/" + character + "/left2.png",
               "images/" + character + "/left3.png", "images/" + character + "/left4.png"],
        right: ["images/" + character + "/right1.png", "images/" + character + "/right2.png",
                "images/" + character + "/right3.png", "images/" + character + "/right4.png"],
        jump_left: "images/" + character + "/left1.png",
        jump_right: "images/" + character + "/right1.png"
    });
    
    Platformer.setupCanvas('game-canvas', 'collision-class');
    Platformer.start();
  }

  window.addEventListener("gameOver", function() {
    $scope.$apply($scope.button = "VICTORY!!!");
    $timeout(function(){
      $scope.button = "Try Again";
    }, 2000);
  }, false );

});

var getStackRep = function() {
  // Use script to avoid cross domain crap
  var script = document.createElement('script');
  script.src = 'http://api.stackoverflow.com/1.0/users/2642809/?jsonp=stackResponse';
  document.getElementsByTagName('head')[0].appendChild(script);
}

var getGradDate = function() {
  var oneDay = 24*60*60*1000;
  var gradDate = new Date(new Date().getFullYear(),3,25);
  var today = new Date();

  return Math.round(Math.abs((today.getTime() - gradDate.getTime())/(oneDay)));
}
