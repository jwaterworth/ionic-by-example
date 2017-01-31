// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('myreddit', ['ionic', 'angularMoment'])
  .controller('RedditCtrl', ['$scope', '$http', function ($scope, $http) {
    this.$scope = $scope;
    var self = this;
    this.stories = [];

    function loadStories(params, callback) {
      $http.get("https://www.reddit.com/r/funny/new.json", {
        params: params
      })
        .success(function (response) {
          var stories = [];
          angular.forEach(response.data.children, function (child) {
            stories.push(child.data);
          });
          callback(stories);
        });
    }

    this.loadOlderStories = function () {
      var params = {};
      if (self.stories.length) {
        params.after = self.stories[self.stories.length - 1].name;
      }
      loadStories(params, function (olderStories) {
        self.stories = self.stories.concat(olderStories);
        self.$scope.$broadcast('scroll.infiniteScrollComplete')
      })
    }

    this.loadNewStories = function () {
      var params = {
        before: self.stories[0].name
      };
      loadStories(params, function (newerStories) {
        self.stories = newerStories.concat(self.stories);
        self.$scope.$broadcast('scroll.refreshComplete');
      });
    }

    this.openLink = function (url) {
      window.open(url, '_blank');
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

      if (window.cordova && window.cordova.InAppBrowser) {
        window.open = window.cordova.InAppBrowser.open;
      }

      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
