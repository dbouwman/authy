'use strict';

var authyApp = angular.module('authyApp', ['ngResource','ngSanitize','ui.router']);


authyApp.config(function ($stateProvider, $urlRouterProvider) {

  //handle the AGO redirects
  $urlRouterProvider.when(/access_token.*/, function($match){
    return '/auth?'+ $match;
  });
  $urlRouterProvider.when(/error.*/, function($match){
    return '/autherr?'+ $match;
  });

  $urlRouterProvider.otherwise('/home');

  $stateProvider
    //login
    .state('auth', {
      url: '/auth?access_token&expires_in&username',
      templateUrl: 'templates/auth.html',
      controller: 'AuthController'
    })

    .state('autherr', {
      url: '/autherr?error&error_description',
      templateUrl: 'templates/autherr.html',
      controller: 'AuthErrController'
    })

    //Home State and nested templates
    .state('items', {
      url: '/items',
      templateUrl: 'templates/items.html',
      controller: 'ItemsController'
    })

    .state('home',{
      url: '/home',
      templateUrl: 'templates/home.html'
    })

    ;// close things off

});
