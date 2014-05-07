'use strict';

angular.module('authyApp')
  .controller('AuthNavController', 
    function ($scope, identityService, $log) {

      $scope.isLoggedIn = function(){
        return identityService.loggedIn;
      };
      
      $scope.signInPopUp = function(){
        return identityService.startAGOOAuth();
      };

      $scope.signOut = function(){
        return identityService.signOut();
      };

    }
  );
