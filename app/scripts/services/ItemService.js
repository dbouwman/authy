'use strict';

angular.module('authyApp')
  .factory('itemService', function($http, $q, identityService, transformRequestAsFormPost, $log){

    //TODO: not sure if best to require identity into
    //the service or use some httpInterceptor... starting simple tho
    
    return {
      
      contentUrl: 'http://www.arcgis.com/sharing/rest/content',
      /**
       * Get all the user's items
       */
      items: function(offset){

        if(identityService.loggedIn){

          var url = this.contentUrl + '/users/' + identityService.oAuthData.username + '?f=json&token=' + identityService.oAuthData.token;

          var deferred = $q.defer();
          
          //wrap things up in q
          $http({method:'GET', url: url})
            .success(function(data,status,headers){
              $log.info('itemService.items()', data,status, headers());
              deferred.resolve(data.items);
            })
            .error(function(data,status,headers){
              $log.error(data,status, headers());
              deferred.reject(status);
            });
          return deferred.promise;

        }else{

          //not logged in!
          console.log('user is not logged in');
        }
        
      },

      /**
       * Get an item by id
       */
      item: function(id){
        var deferred = $q.defer();

        var url = this.contentUrl + '/items/' + id + '?f=json&token=' + identityService.oAuthData.token;

        //check if it's in the cache, and resolve with that
        //or issue the xhr
        $http({method:'GET',url: url})
        .success(function(data,status,headers){
          $log.info(data,status, headers());
          deferred.resolve(data);

        })
        .error(function(data,status,headers){

          $log.error(data,status, headers());
          deferred.reject(status);

        });
        return deferred.promise;
      },

      /**
       * Update an item
       */
      updateItem: function(item){

        var deferred = $q.defer();

        var itemUpdateUrl = this.contentUrl + '/users/' + identityService.oAuthData.username + '/items/' + item.id + '/update?f=json&token=' + identityService.oAuthData.token;

        //remove this - otherwise Portal API pukes
        delete $http.defaults.headers.post['Content-Type'];

        //By default, $http serializes the data a json, and sends
        //content-type "application/json". However, the Portal API
        //requires that we FORM POST the data, so we use a transform
        //that converts the json hash into a key/value set, and 
        //sets the content-type to "application/x-www-form-urlencoded"
        var request = $http({
          method: "POST",
          url: itemUpdateUrl,
          transformRequest: transformRequestAsFormPost,
          data: item
        });

        request
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

