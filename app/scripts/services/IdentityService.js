'use strict';

/**
 * Identity.js
 * Identity Service that can be injected into any controller.
 */


angular.module('authyApp')
  .provider('identityService', function(){

    /**
     * Defaults that can be configured
     */
    var config = {
      clientId: 'hhtN8jFtnA0mYWSb', //authy
      redirectUri: 'http://localhost:9000/post-signin.html',
      baseUrl: 'http://www.arcgis.com/sharing/rest'
    };
    

    /**
     * This is the factory itself
     */
    this.$get = function($q, $http, $state, $cookieStore, $log){

      /**
       * Return the Service
       */
      return {
        /**
         * Allow consumer to set the redirect uri.
         * However, this must be registed with the oAuth provide
         */
        setRedirectUri: function(uri){
          config.redirectUri = uri;
        },

        /**
         * return the token
         */
        getToken: function(){
          if(this.token){ 
            return this.token;
          }else{
            return false;
          }
        },

        isLoggedIn: function(){
          if(this.oAuthData){
            return true;
          }else{
            return false;
          }
        },

        checkCookie: function(){
          var oAuthData = $cookieStore.get('authy_auth');
          window.oAuthData = oAuthData;
          if( oAuthData && ( new Date(oAuthData.tokenExpiresAt) > new Date() ) ){
            //hold onto the auth data
            this.oAuthData = oAuthData;
          }
        },


        /**
         * Start the ArcGIS online oAuth process
         */
        startAGOOAuth: function(){

          //remove cookies and anyother cruft
          this.signOut();
          //start the oAuth dance
          var  url = "https://www.arcgis.com/sharing/oauth2/authorize?client_id="+config.clientId+"&response_type=token&expiration=20160&redirect_uri=" + config.redirectUri;
          $log.info('Opening oAuth url: ' + url);

          window.open(url , "oauth-window", "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes");

        },

        /**
         * Hold onto the token that is passed in from the 
         * callback.html file
         */
        finishAGOOAuth: function(oAuthData){

          $log.info('oAuth Data: ' + JSON.stringify(oAuthData));

          this.oAuthData = oAuthData;
          this.oAuthData.tokenExpiresAt = new Date(new Date().getTime() + oAuthData.expires_in * 1000);
          this.loggedIn = true;

          $cookieStore.put('authy_auth',this.oAuthData);

          if(window.oauthCallback){
            delete window.oauthCallback;
          }

          $state.go('items');
          
        },

        /**
         * Sign out by destroying the token, profile and resetting the flag
         */
        signOut: function(){
          delete this.profile;
          delete this.token;
          this.loggedIn = false;
          //remove the cookie
          $cookieStore.remove('authy_auth');

          //route to home state
          $state.go('home');
        },

        /**
         * Get all the user's items
         */
        getProfile: function(){

          if(this.loggedIn){
            var deferred = $q.defer();

            if(this.profile){
              //resolve with the profile we already have
              deferred.resolve(this.profile);
            
            }else{
            
              //build the url w. the token
              var profileUrl = config.baseUrl + '/community/self?f=json&token=' + this.oAuthData.token;

              //do the search - we can do this b/c opendata supports CORS
              $http({method:'GET',url: profileUrl})
              .success(function(data,status,headers,config){
                
                $log.info(data,status, headers());
                deferred.resolve(data);
              })
              .error(function(data,status,headers,config){
                $log.error(data,status, headers());
                deferred.reject(status);
              });
              
            }
            return deferred.promise;
          }else{
            this.startAGOOAuth();
          }
        }

        //TODO: Add methods here that can be called in app.config


      };

    };
    

});

