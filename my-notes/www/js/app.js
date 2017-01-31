// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('mynotes', ['ionic', 'mynotes.notestore'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('list', {
        url: '/list',
        templateUrl: 'templates/list.html'
      })
      .state('edit', {
        url: '/edit/:noteId',
        controller: "EditCtrl as $ctrl",
        templateUrl: 'templates/edit.html',
      })
      .state('add', {
        url: '/add',
        controller: "AddCtrl as $ctrl",
        templateUrl: 'templates/edit.html',
      });

    $urlRouterProvider.otherwise('/list');
  })
  .controller('ListCtrl', ['noteStore', function (noteStore) {
    this.reordering = false;
    this.notes = noteStore.list();

    this.remove = function (noteId) {
      noteStore.remove(noteId);
    }

    this.toggleReordering = function() {
      this.reordering = !this.reordering;
    }

    this.move = noteStore.move;
  }])
  .controller('EditCtrl', ['$state', 'noteStore', function ($state, noteStore) {
    this.note = angular.copy(noteStore.get($state.params.noteId));

    this.save = function () {
      noteStore.update(this.note);
      $state.go('list');
    }
  }])
  .controller('AddCtrl', ['$state', 'noteStore', function ($state, noteStore) {
    this.note = {
      id: new Date().getTime().toString(), // CHEATING
      title: '',
      description: ''
    };

    this.save = function () {
      noteStore.create(this.note);
      $state.go('list');
    }
  }])
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
