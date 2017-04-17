// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var activeCache = false;
var appName = "clickeur";



var app = angular.module('starter', ['ionic', 'starter.controllers', 'ionic-letter-avatar', 'LocalStorageModule'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      cache: activeCache,
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    cache: activeCache,
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
    cache: activeCache,
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.ues', {
      cache: activeCache,
      url: '/ues',
      views: {
        'menuContent': {
          templateUrl: 'templates/ues.html',
          controller: 'UesCtrl'
        }
      }
    })
    .state('app.ue', {
      cache: true,
      url: '/ues/:ueId',
      views: {
        'menuContent': {
          templateUrl: 'templates/ue.html',
          controller: 'UeCtrl'
        }
      }
    })

    .state('app.seance', {
      cache: true,
      url: '/seances/:seanceId',
      views: {
        'menuContent': {
          templateUrl: 'templates/seance.html',
          controller: 'SeanceCtrl'
        }
      }
    })

  .state('app.question', {
    cache: activeCache,
    url: '/questions/:questionId',
    views: {
      'menuContent': {
        templateUrl: 'templates/question.html',
        controller: 'QuestionCtrl'
      }
    }
  })
    .state('app.resultats',{
    cache:activeCache,
    url: '/resultats/:questionsId',
    views: {
      'menuContent' : {
        templateUrl : 'templates/resultats.html',
        controller: 'ResultatCtrl'
      }
    }
  })
    .state('app.login', {
      cache: activeCache,
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        }
      }
    })

    .state('app.logout', {
      cache: activeCache,
      url: '/logout',
      views: {
        'menuContent': {
          controller: 'LogoutCtrl'
        }
      }
    })
    .state('app.stats', {
      cache: activeCache,
      url: '/stats/:questionId',
      views: {
        'menuContent': {
          templateUrl: 'templates/stats.html',
          controller: 'StatsCtrl'
        }
      }
    });
  $urlRouterProvider.otherwise('/app/login');
});
