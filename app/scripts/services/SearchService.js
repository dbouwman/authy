'use strict';

angular.module('authyApp')
  .factory('searchService', function($http, $q, $log){
    return {
    
      /**
       * Get search results
       */
      getDatasets: function(params){

        $log.info('searchService.getDatasets params: ' + JSON.stringify(params));

        var deferred = $q.defer();
        //do the search - we can do this b/c opendata supports CORS
        $http({
          method:'GET',
          url: 'http://openepa.dcdev.opendata.arcgis.com/datasets.json?q=' + params.q
        })
        .success(function(data,status,headers,config){
          //take apart the response and cache the datasets by id
          //and the search by url, with refs to the cache'd datasets
          $log.info(data,status, headers());
          deferred.resolve(data);

        })
        .error(function(data,status,headers,config){

          $log.error(data,status, headers());
          deferred.reject(status);

        });
        return deferred.promise;
      },

      /**
       * Fetch a dataset
       */
      getDataset: function(id){
        var deferred = $q.defer();
        //check if it's in the cache, and resolve with that
        //or issue the xhr
        $http({
          method:'GET',
          url: 'http://openepa.dcdev.opendata.arcgis.com/datasets/' + id + '.json'
        })
        .success(function(data,status,headers,config){
          $log.info(data,status, headers());
          deferred.resolve(data);

        })
        .error(function(data,status,headers,config){

          $log.error(data,status, headers());
          deferred.reject(status);

        });
        return deferred.promise;
      }

    };

});

