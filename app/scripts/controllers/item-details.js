'use strict';

angular.module('authyApp')
  .controller('ItemDetailController', 

    function ($scope, $stateParams, itemService, $log) {
      $log.info('ItemDetailController...');
      itemService.item($stateParams.id).then(
        function(data){
          $log.info('got data');
          $scope.item = data;
        },
        function(status){
          $scope.error = status;
        }
      );
     

    }
  );
