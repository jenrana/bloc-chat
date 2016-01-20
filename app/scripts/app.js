var blocChat = angular.module('blocChat', ['ui.router', 'firebase']);

blocChat.config(function($stateProvider, $locationProvider) {
        $locationProvider
         .html5Mode({
             enabled: true,
             requireBase: false
         });
        $stateProvider
         .state('landing', {
             url: '/',
             templateUrl: '/templates/home.html'
         });
});

blocChat.factory('Room', ['$firebaseArray', function($firebaseArray) {
    var firebaseRef = new Firebase("https://brilliant-heat-7733.firebaseio.com/");
    var rooms = $firebaseArray(firebaseRef.child('rooms'));

    return {
        all: rooms
    }
}]);


blocChat.controller('RoomCtrl', function($scope, Room) {
    $scope.rooms = Room.all;
});