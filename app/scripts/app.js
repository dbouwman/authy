'use strict';

var authyApp = angular.module('authyApp', ['ngResource','ngSanitize','ngCookies','ui.router','ngTagsInput']);


authyApp
.config(function ($stateProvider, $urlRouterProvider) {
   // You can only inject Providers (not instances)


  $urlRouterProvider.otherwise('/home');

  $stateProvider


    //Home State and nested templates
    .state('items', {
      url: '/items',
      templateUrl: 'templates/items.html',
      controller: 'ItemsController'
    })

    .state('details', {
      url: '/items/:id',
      templateUrl: 'templates/item-details.html',
      controller: 'ItemDetailController'
    })

    .state('edit', {
      url: '/items/edit/:id',
      templateUrl: 'templates/item-edit.html',
      controller: 'ItemEditController'
    })

    .state('home',{
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'HomeController'
    })

    .state('results',{
      url: '/search?q',
      templateUrl: 'templates/results.html',
      controller: 'ResultsController'
    })

    ;// close things off

}).
run(function(identityService){
   // You can only inject instances (not Providers)
   
   //ask the identityService to check the cookie
   identityService.checkCookie();
   
});
