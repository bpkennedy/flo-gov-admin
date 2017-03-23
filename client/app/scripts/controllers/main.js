'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($http) {
    var vm = this;
    vm.awesomeUsers = {};
    var req = $http.get('/api/users');

    // arrow functions would be nice here
    // but this tutorial is already really long
    // so let's not mess with modifying grunt linting
    req.then(function (res) {
      vm.awesomeUsers = res.data.users;
    });
    req.catch(function (err) {
      console.log(err);
    });
    vm.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
