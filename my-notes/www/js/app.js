// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('mynotes', ['ionic', 'mynotes.notestore', 'mynotes.user'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        controller: 'LoginCtrl as $ctrl',
        templateUrl: 'templates/login.html'
      })
      .state('list', {
        url: '/',
        templateUrl: 'templates/list.html',
        cache: false
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

    $urlRouterProvider.otherwise('/');
  })
  .controller('LoginCtrl', ['$state', '$ionicHistory', 'User', function ($state, $ionicHistory, user) {
    var that = this;

    this.credentials = {
      user: '',
      password: ''
    }

    this.login = function () {
      user.login(that.credentials)
        .then(function () {
          $ionicHistory.nextViewOptions({ historyRoot: true });
          $state.go('list');
        });
    }

  }])
  .controller('ListCtrl', ['$scope', 'noteStore', function ($scope, noteStore) {
    var that = this;
    this.reordering = false;

    function refreshNotes() {
      noteStore.list()
        .then(function (notes) {
          that.notes = notes;
        });
    }

    refreshNotes();

    this.remove = function (noteId) {
      noteStore.remove(noteId)
        .then(function () {
          refreshNotes();
        });;
    }

    this.toggleReordering = function () {
      this.reordering = !this.reordering;
    }

    this.move = noteStore.move;
  }])
  .controller('EditCtrl', ['$state', 'noteStore', function ($state, noteStore) {
    var that = this;

    noteStore.get($state.params.noteId)
      .then(function (note) {
        that.note = note;
      });

    this.save = function () {
      noteStore.update(this.note)
        .then(function () {
          $state.go('list');
        });
    }
  }])
  .controller('AddCtrl', ['$state', 'noteStore', function ($state, noteStore) {
    this.note = {
      title: '',
      description: ''
    };

    this.save = function () {
      noteStore.create(this.note)
        .then(function () {
          $state.go('list');
        });
    }
  }])
  .run(function ($rootScope, $state, $ionicPlatform, User) {
    $rootScope.$on('$stateChangeStart', function (event, toState) {
      if (toState.name !== 'login' && !User.isLoggedIn()) {
        event.preventDefault();
        $state.go('login');
      }
    });

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
