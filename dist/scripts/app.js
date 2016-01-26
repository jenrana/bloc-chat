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
    var messages = $firebaseArray(firebaseRef.child('messages'));
    
    return {
        all: rooms,
        create: function(room){
            return rooms.$add({
                name: room
            });
            
        },
        messages: function(roomId, callback){
            firebaseRef.child("messages").orderByChild("roomId").equalTo(roomId).on("value", callback);
        }
    };
}]);

blocChat.controller('RoomCtrl', function($scope, Room, $uibModal) {
    $scope.rooms = Room.all;
    $scope.animationsEnabled = true;
    $scope.currentRoomName = "Choose a room to start chatting";
    
    $scope.messages = null;
    
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
        // Room.sendMessage(roomId, message);
        // Room.messages($scope.currentRoom.$id, function () {
        //  messages.$add({ ... })
        // });
    $scope.setCurrentRoom = function(room){
        $scope.currentRoom = room;
        $scope.currentRoomName = room.name;
        Room.messages(room.$id, function (messages) {
            var value = messages.val(),
                results = [];
            
            for (var i = 0; i < value.length; i++) {
                if (value[i] !== undefined) { 
                    results.push(value[i]);
                }
            }
            
            $scope.messages = results;
        });
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
