// <div scroll-to="section1">Section 1</div>

.directive("scrollTo", ["$window", function($window){
    return {
      restrict : "AC",
      compile : function(){

        var document = $window.document;
        
        function scrollInto(idOrName) {//find element with the give id of name and scroll to the first element it finds
          if(!idOrName)
            $window.scrollTo(0, 0);

          var elem = document.getElementById(idOrName) || document.getElementsByName(idOrName);

          if(elem && elem.length)
            elem[0].scrollIntoView();

        }

        return function(scope, element, attr) {
          element.bind("click", function(event){
            scrollInto(attr.scrollTo);
          });
        };
      }
    };
}]);

// .directive("scrollTo", ["$window", function($window){
//     return {
//       restrict : "AC",
//       compile : function(){

//         var document = $window.document;
        
//         function scrollInto(idOrName) {//find element with the give id of name and scroll to the first element it finds
//           if(!idOrName)
//             $window.scrollTo(0, 0);
//           //check if an element can be found with id attribute
//           var el = document.getElementById(idOrName);
//           if(!el) {//check if an element can be found with name attribute if there is no such id
//             el = document.getElementsByName(idOrName);

//             if(el && el.length)
//               el = el[0];
//             else
//               el = null;
//           }

//           if(el) //if an element is found, scroll to the element
//             el.scrollIntoView();
//           //otherwise, ignore
//         }

//         return function(scope, element, attr) {
//           element.bind("click", function(event){
//             scrollInto(attr.scrollTo);
//           });
//         };
//       }
//     };
// }]);