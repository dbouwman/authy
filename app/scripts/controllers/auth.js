'use strict';

authyApp
  .controller('AuthController', 
    function ($scope, $stateParams, $location, $log) {
    
      $log.info('Params: ' + JSON.stringify( $stateParams ) );
      $log.info('location hash: ' + JSON.stringify( $location.hash() ) );

      $scope.token = $stateParams.access_token;
      $scope.username = $stateParams.username; 

    }
  );
