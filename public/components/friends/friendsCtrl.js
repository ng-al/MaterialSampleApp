// Copyright (c) Alvin Pivowar 2016

(function() {
    "use strict";

    angular
        .module("MaterialSampleApp")
        .controller("friendsCtrl",
        ["$scope", "$mdDialog", "friendsService", "Lamb", "mastheadService", "tabsService",
        function($scope, $mdDialog, friendsService, Lamb, mastheadService, tabsService) {
            var bus = new Lamb("friends", $scope);

            var vm = this;
            vm.dragId = null;
            vm.dropStyle = null;
            vm.friends = [];
            vm.friendsCount = null;
            vm.page = null;
            vm.pageSize = null;

            vm.addFriend = addFriend;
            vm.nextPage = nextPage;
            vm.onDragStart = onDragStart;
            vm.onDrop = onDrop;

            init();

            function addFriend(event) {
                $mdDialog.show({
                    controller: AddFriendDialog,
                    locals: { friendsService: friendsService},
                    targetEvent: event,
                    templateUrl: "/friends/addFriend.html"
                });
            }

            function init() {
                mastheadService.settings({
                    hasSearch: true,
                    title: "Friends"
                });

                tabsService.clear();

                friendsService.getFriendsCount().then(function(count) {
                    vm.dragId = null;
                    vm.dropStyle = {};
                    vm.friendsCount = count;
                    vm.page = 1;
                    vm.pageSize = 4;

                    friendsService.getFriends(vm.page, vm.pageSize).then(function(friends) {
                        vm.friends = friends
                    });
                });

                bus.subscribe("friends.*", function() {
                    init();
                });

                bus.subscribe("masthead.filter", function(filter) {
                    friendsService.setSearchFilter(filter);
                });
            }

            function nextPage() {
                ++vm.page;
                friendsService.getFriends(vm.page, vm.pageSize).then(function(friends) {
                    if (friends && friends.length > 0) {
                        vm.friends = friends;
                        return;
                    }

                    vm.page = 1;
                    friendsService.getFriends(vm.page, vm.pageSize).then(function(friends) {
                        vm.friends = friends
                    });
                });
            }

            function onDragStart(info) {
                var currentTarget = info.currentTarget;
                var classList = currentTarget.classList;

                angular.forEach(classList, function(value) {
                    if (value.indexOf("ID") !== -1)
                        vm.dragId = parseInt(value.substr(3));
                });
            }

            function onDrop() {
                if (vm.dragId) {
                    friendsService.deleteFriend(vm.dragId).then(function(status) {
                        if (status)
                            init();
                    });
                }
            }
        }]);

    function AddFriendDialog($scope, $mdDialog, friendsService) {
        $scope.friend = {};

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.save = function() {
            friendsService.addFriend($scope.friend);
            $mdDialog.hide();
        }
    }
})();