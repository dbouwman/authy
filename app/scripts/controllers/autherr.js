'use strict';

authyApp
  .controller('AuthErrController', 
    function ($scope, $stateParams, $location, $log) {
    
      $log.info('AuthErr: ' + JSON.stringify( $stateParams ) );
      
      //send along the error
      $scope.error = {
        error: $stateParams.error,
        description: $stateParams.error_description
      };

    }
  );
