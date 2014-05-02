'use strict';

angular.module('authyApp')
  .controller('ItemEditController', 

    function ($scope, $stateParams, $state, itemService, $log) {
      $log.info('ItemEditController...');
      itemService.item($stateParams.id).then(
        function(data){
          $log.info('got data');
          $scope.item = data;
        },

        function(status){
          $scope.error = status;
        }
      );

      $scope.update = function(item){
        itemService.updateItem(item).then(
          function(data){
            if(data.success){
              $scope.success = true;
              $log.info('update succeeded');
              $state.go('items');
            }else{
              $log.error('Update Failed: ' + JSON.stringify(data));
            }
            
          }
        );
      };
     

    }
  );
