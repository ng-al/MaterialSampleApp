// Copyright (c) Alvin Pivowar 2016

(function() {
    "use strict";

    angular
        .module("MaterialSampleApp")
        .controller("messagesCtrl",
        ["$scope", "Lamb", "mastheadService", "messagesService", "tabsService",
        function($scope, Lamb, mastheadService, messagesService, tabsService) {
            var bus = new Lamb("messages", $scope);

            var vm = this;
            vm.messages = [];
            vm.page = null;
            vm.pageSize = null;
            vm.selectedTab = null;

            vm.generateMessage = generateMessage;
            vm.nextPage = nextPage;

            init();

            function generateMessage() {
                messagesService.generateMessage();
                tabsService.select("Recent");
            }

            function init() {
                vm.page = 1;
                vm.pageSize = 6;

                mastheadService.settings({
                    hasSearch: true,
                    title: "Messages"
                });

                tabsService.setTabs(["Recent", "Older"]);

                bus.subscribe("tabs.select", function(selectedTab) {
                    var isRecent;

                    vm.page = 1;
                    vm.selectedTab = selectedTab;

                    isRecent = (vm.selectedTab.text === "Recent");
                    messagesService.getMessages(isRecent, vm.page, vm.pageSize).then(function(messages) {
                        vm.messages = messages;
                    });
                });

                tabsService.select("Recent");


                bus.subscribe("masthead.filter", function(filter) {
                    messagesService.setSearchFilter(filter);
                });

                bus.subscribe("messages.filter", function() {
                    var isRecent = (vm.selectedTab.text === "Recent");

                    vm.page = 1;
                    messagesService.getMessages(isRecent, vm.page, vm.pageSize).then(function(messages) {
                        vm.messages = messages;
                    });
                });

                $scope.$on("$destroy", function() {
                    tabsService.clear();
                });
            }

            function nextPage() {
                var isRecent;

                ++vm.page;
                isRecent = (vm.selectedTab.text === "Recent");

                messagesService.getMessages(isRecent, vm.page, vm.pageSize).then(function(messages) {
                    if (messages && messages.length > 0) {
                        vm.messages = messages;
                        return;
                    }

                    vm.page = 1;
                    messagesService.getMessages(isRecent, vm.page, vm.pageSize).then(function(messages) {
                        vm.messages = messages
                    });
                });
            }
        }]);
})();