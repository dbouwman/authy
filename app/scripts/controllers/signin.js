'use strict';

angular.module('authyApp')
  .controller('SignInController', 
    function ($scope, $stateParams, $state, identityService, $location, $log) {
  
      $scope.startAuth = function(){
        //attach the callback to window so it is exposed
        //to the callback js
        window.oauthCallback = angular.bind(identityService, identityService.finishAGOOAuth);
        
        var port = '';
        if($location.port() !== 80){
          port = ':' + $location.port();
        }
        identityService.setRedirectUri('http://' + $location.host() + port +'/post-signin.html');

        identityService.startAGOOAuth();   
      };

      $scope.checkAuth = function(targetState){
        if( identityService.loggedIn ){
          //go to the items page
          $state.go('items');
        }else{
          var port = '';
          if($location.port() !== 80){
            port = ':' + $location.port();
          }
          //set the redirect
          identityService.setRedirectUri('http://' + $location.host() + port +'/post-signin.html');
          //sign into AGO
          identityService.startAGOOAuth(targetState);
        }
       
      };


    }
  );
