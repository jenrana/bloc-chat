var blocChat = angular.module('blocChat', ['ui.router', 'firebase', 'ui.bootstrap','ngCookies']);

blocChat.run(['$cookies', '$uibModal', function($cookies, $uibModal) {

    if (!$cookies.blocChatCurrentUser || $cookies.blocChatCurrentUser === '' ) {
        $uibModal.open({
            templateUrl: '/templates/username.html',
            controller: 'UsernameCtrl'
            });

    }
}]);

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

blocChat.factory('Message', ['$firebaseArray', '$cookieStore', function($firebaseArray, $cookieStore) {

  var firebaseRef = new Firebase("https://brilliant-heat-7733.firebaseio.com/");
  var messages = $firebaseArray(firebaseRef.child('messages'));

  return {
    send: function(newMessage, roomId) {
        return messages.$add({
            content: newMessage,
            username: $cookieStore.get("blocChatCurrentUser"),
            sentAt: Firebase.ServerValue.TIMESTAMP,
            roomId: roomId
        });
    }
  }
}]);



blocChat.controller('RoomCtrl', function($scope, Room, $uibModal, Message, $firebaseArray) {
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
    
    
    $scope.setCurrentRoom = function(room){
        $scope.currentRoom = room;
        $scope.currentRoomName = room.name;
        
        var messages = Room.messages(room.$id, function (messages) {
            $scope.messages = messages.val();
        });
    };
    
    
    // Room.sendMessage(roomId, message);
    // Room.messages($scope.currentRoom.$id, function () {
    //  messages.$add({ ... })
    // });

    $scope.sendMessage = function(room){
        Message.send($scope.newMessage, $scope.currentRoom.$id);
        $scope.newMessage = "";
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


blocChat.controller('UsernameCtrl', function ($scope, $uibModalInstance, $cookieStore) {
    $scope.addUsername= function () {
        if ($scope.newUsername == null){
               $scope.error = "Please enter a username";
        }
        else{
            $cookieStore.put("blocChatCurrentUser", $scope.newUsername);
            $uibModalInstance.close(); 
        //console.log($cookieStore.get('Name'));
        }
    };
});
