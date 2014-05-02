'use strict';

angular.module('authyApp')
  .controller('AuthNavController', 
    function ($scope, identityService, $log) {


      $scope.isLoggedIn = function(){
        return identityService.isLoggedIn();
      }


    }
  );
