'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'algoliasearch'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('root', {
        url: '',
        abstract: true,
        resolve: {
        },
        views: {
            'titlebar@': {
                templateUrl: 'views/titlebar.html',
                controller: 'TitlebarCtrl',
                controllerAs: 'vm'
            },
            'footer@': {
                templateUrl: 'views/footer.html',
                controller: 'FooterCtrl',
                controllerAs: 'vm'
            }
        }
    });
    $stateProvider.state('root.dashboard', {
        url: '/',
        resolve: {
        },
        data: {
            pageName: 'MainCtrl',
            browserTitle: 'Main',
            description: 'An empty codewrangle template'
        },
        views: {
            'container@': {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'vm'
            }
        }
    });
    $stateProvider.state('root.about', {
        url: '/about',
        resolve: {
        },
        data: {
            pageName: 'AboutCtrl',
            browserTitle: 'About',
            description: 'template\'s about page.'
        },
        views: {
            'container@': {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'vm'
            }
        }
    });
  });
