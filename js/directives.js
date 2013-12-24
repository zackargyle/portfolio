'use'
var onlineResume = angular.module('onlineResume.directives', ['ui.bootstrap']);

onlineResume.directive('snippet', function ($modal) {
 		return {
 			restrict: 'A',
    		link: function (scope, elem, attrs) {

      		elem.bind("click", function() {
      			var modalInstance = $modal.open({
				      templateUrl: "snippets/" + scope.snippet + '.html',
				    });
      		});

    		}
 		}
 	})