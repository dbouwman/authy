'use strict';

angular.module('authyApp')
  .controller('ItemsController', 

    function ($scope, identityService, itemService, $log) {
      $log.info('ItemsController');

      itemService.items().then(
        function(data){
          $scope.items = data;
        },
        function(status){
          $scope.error = status;
        }
      );
     

    }
  );
