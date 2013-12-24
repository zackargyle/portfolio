'use strict';

var onlineResume = angular.module('onlineResume', ['onlineResume.directives', 'ui.bootstrap']);

onlineResume.controller('mainCtrl', function($scope) {

	// For carousel
  $scope.slides = [
    {
      title: "Welcome! Click on the images to scroll to a section.",
      image: 'images/welcome.png'
    },
    {
      title: "Learn a little about me and what I do.",
      image: 'images/about.png'
    },
    {
      title: "Check out code in different languages and frameworks.",
      image: 'images/code.png'
    },
    {
      title: "Leave me a message on my firebase dashboard.",
      image: 'images/message.png'
    },
  	{
  		title: "Play a game, stay a while",
  		image: 'images/game.png'
  	},
  ];

  $scope.scrollTo = function(image) {
    var id = image.slice(7,image.length - 4);
  	document.getElementById(id).scrollIntoView();
    window.scrollBy(0,-50);
  };

});

// Firebase messaging Controller
onlineResume.controller('codeCtrl', function($scope, $modal) {
  $scope.snippets = ["Javascript", "C++", "Python", "Java", "Angular", "jQuery", "Django", "Android"];
});

// Firebase messaging Controller
onlineResume.controller('messageCtrl', function($scope) {
  $scope.messages = [];

  var firebase = new Firebase('https://zackargyle.firebaseIO.com/'), index = 0;

  firebase.on('child_added', function(snapshot) {
    var value = snapshot.val();
    var message = {id:index++, name: value.name, text: value.text};
    $scope.messages.push(message);
  });

  $scope.addMessage = function() {
    firebase.push({name: $scope.name, text: $scope.text});
  }

});

// Controller for game play
onlineResume.controller('gameCtrl', function($scope) {
  $scope.playing = false;

  var image_left = new Image();
  image_left.src = "images/dude-left.png";

  var image_right = new Image();
  image_right.src = "images/dude-right.png";

  var image_jumping = new Image();
  image_jumping.src = "images/dude-jumping.png";

  $scope.startGame = function() {
    $scope.playing = true;
    Platformer.setupSprite(20, 340, image_left, image_right, image_jumping);
    Platformer.setupCanvas('game-canvas', 'game');
    Platformer.start();
  }
});