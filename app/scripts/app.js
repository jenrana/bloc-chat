var blocChat = angular.module('blocChat', ['ui.router', 'firebase', 'ui.bootstrap']);

blocChat.config(function($stateProvider, $locationProvider) {
        $locationProvider
         .html5Mode({
             enabled: true,
             requireBase: false
         });
        $stateProvider
         .state('landing', {
             url: '/',
             templateUrl: '/templates/home.html',
            controller: 'RoomCtrl'
         });
});

blocChat.factory('Room', ['$firebaseArray', function($firebaseArray) {
    var firebaseRef = new Firebase("https://brilliant-heat-7733.firebaseio.com/");
    var rooms = $firebaseArray(firebaseRef.child('rooms'));
    return {
        all: rooms,
        create: function(room){
            return rooms.$add(room)
        }
    };
}]);

blocChat.controller('RoomCtrl', function($scope, Room, $uibModal) {
    $scope.rooms = Room.all;
    $scope.animationsEnabled = true;
    $scope.open = function () {
    var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/templates/newroom.html',
        controller: 'ModalCtrl'
    });
  };

  $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
  };
    
});
 

blocChat.controller('ModalCtrl', function ($scope, $uibModalInstance, Room) {
    $scope.addRoom = function () {     
        $uibModalInstance.close(); 
         Room.create($scope.newRoom); 
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
});
