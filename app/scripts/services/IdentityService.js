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
      redirectUri: 'http://127.0.0.1:9000/post-signin.html',
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
         * Flag to track if a user is logged in
         * @type {Boolean}
         */
        loggedIn: false,
        
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

        /**
         * Check if the app's cookie is present, and if so, set the 
         * loggedIn flag to true;
         */
        checkCookie: function(){
          var oAuthData = $cookieStore.get('authy_auth');
          
          if( oAuthData && ( new Date(oAuthData.tokenExpiresAt) > new Date() ) ){
            console.log('We have a cookie...');
            //hold onto the auth data
            this.oAuthData = oAuthData;
            //unclear if we should use a separate flag, or just use the truthyness of
            //a defined object?
            this.loggedIn = true;
          }else{
            console.log('No cookie...');
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
          
          //attach a callback to window so the oAuth flow has something
          //to call when it's complete
          //need to bind scope on otherwise 'this' is window, which does not help much
          window.oauthCallback = angular.bind( this, this.finishAGOOAuth );

          //open the oauth window...
          window.open(url , "oauth-window", "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes");

        },

        /**
         * Hold onto the token that is passed in from the 
         * post-signin.html file
         */
        finishAGOOAuth: function(oAuthData){


          //log out what we got back
          $log.info('oAuth Data: ' + JSON.stringify(oAuthData));

          //hold onto the oAuth hash
          this.oAuthData = oAuthData;

          //update it with the actual time the token expires at
          //this will allow us to check if we are getting "close"
          //and request a new token (not implemented)
          this.oAuthData.tokenExpiresAt = new Date(new Date().getTime() + oAuthData.expires_in * 1000);
          
          //Stuff into a cookie so we don't have to login all the time
          $cookieStore.put('authy_auth',this.oAuthData);

          //set a flag so login status checks are cheap during the digest cycle
          this.loggedIn = true;

          //remove the callback we attached to window
          if(window.oauthCallback){
            delete window.oauthCallback;
          }

          //redirect to... this should be updated to re-direct to the location 
          //the user was trying to access, or make it something that can be passed in
          //for now, just go to items.
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


      };

    };
    

});

