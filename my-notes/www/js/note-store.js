angular.module('mynotes.notestore', [])
    .factory('noteStore', ["$http", function ($http) {

        var apiUrl = 'http://localhost:8200';

        var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0ODYzMjU2MzgsInN1YiI6ImFsaWNlIn0.Dif2nT5OfMVuZHfk3yx07YC-puZIrkFzNpmxPgyTp0M';

        $http.defaults.headers.common.Authorization = 'Bearer ' + token;

        return {
            list: function () {
                return $http.get(apiUrl + '/notes/')
                    .then(function (response) {
                        return response.data;
                    });
            },
            get: function (noteId) {
                return $http.get(apiUrl + '/notes/' + noteId)
                    .then(function (response) {
                        return response.data;
                    });
            },
            create: function (note) {
                return $http.post(apiUrl + '/notes/', note);
            },
            update: function (note) {
                return $http.put(apiUrl + '/notes/' + note.id, note);
            },
            remove: function (noteId) {
                return $http.delete(apiUrl + '/notes/' + noteId);
            },
            move: function (note, fromIndex, toIndex) {
                // TODO
            }
        }
    }]);