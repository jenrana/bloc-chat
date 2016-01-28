var blocChat = angular.module('blocChat');

blocChat.filter('fromNow', function() {
  return function(date){
    return moment(date).fromNow();
  };
});