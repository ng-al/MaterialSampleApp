// Copyright (c) Alvin Pivowar 2016

(function() {
    "use strict";

    angular
        .module("MaterialSampleApp")
        .controller("dashboardCtrl",
        ["friendsService", "mastheadService", "messagesService", "routingService", "tabsService",
        function(friendsService, mastheadService, messagesService, routingService, tabsService) {
            var vm = this;
            vm.items = [];
            vm.go = go;

            init();

            function go(text) {
                routingService.route(text.toLowerCase());
            }

            function init() {
                mastheadService.settings({
                    hasSearch: false,
                    title: "Dashboard"
                });

                tabsService.clear();

                friendsService.getFriendsCount().then(function(count) {
                    vm.items = [];
                    vm.items.push(new DashboardItem("Friends", "/images/friend.png", count));

                    messagesService.getMessages().then(function(messages) {
                        vm.items.push(new DashboardItem("Messages", "/images/message.png", messages.length));
                    });
                });
            }
        }]);

    function DashboardItem(title, image, count) {
        this.count = count;
        this.image = image;
        this.title = title;
    }
})();