
//Désactiver le cache
var activeCache = false;

//Nom de l'app
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


  //Définition des routes
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    //Menu latéral
    .state('app', {
      cache: activeCache,
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

    //Route pour l'affichage des UE's
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

    //affichage des séances d'une UE
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

    //affichage des questions d'une séances
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

    //affichage des proposition de la question
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

    //Page de connexion
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

    //Déconnexion
    .state('app.logout', {
      cache: activeCache,
      url: '/logout',
      views: {
        'menuContent': {
          controller: 'LogoutCtrl'
        }
      }
    })

    //Affichage des statistiques
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

  //Si aucune route on redirige vers la page de connexion
  $urlRouterProvider.otherwise('/app/login');
});
