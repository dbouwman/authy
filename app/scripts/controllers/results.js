'use strict';


angular.module('authyApp')
  .controller('ResultsController', 

    function ($scope, $stateParams, $log, searchService) {
      $log.info($stateParams.q);
      //call the serice, which will return a deferred
      //todo: move callbacks into local private methods
      //
      var params = {q:'*'};
      //default to *
      if($stateParams.q){
        params.q = $stateParams.q;
      }
      
      $scope.query = params.q;
      $scope.openDataBaseUrl = 'http://openepa.dcdev.opendata.arcgis.com';
      
      searchService.getDatasets(params).then(
          function(jsonData){
             $scope.results = jsonData.data;
          },
          function(status){
              $scope.error = status;
          }
        );
     


  });
