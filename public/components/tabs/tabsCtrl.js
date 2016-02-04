// Copyright (c) Alvin Pivowar 2016

(function() {
    "use strict";

    angular
        .module("MaterialSampleApp")
        .controller("tabsCtrl",
        ["$scope", "Lamb", "tabsService",
        function($scope, Lamb, tabsService) {
            var bus = new Lamb("tabs", $scope);

            var vm = this;
            vm.hasTabs = null;
            vm.tabs = [];

            vm.onTabSelect = onTabSelect;

            init();

            function init() {
                vm.tabs = tabsService.getTabs();
                vm.hasTabs = (vm.tabs.length > 0);

                bus.subscribe("tabs.*", function(data, message) {
                    switch(message.getSubtopic(1)) {
                        case "clear":
                            vm.tabs = [];
                            vm.hasTabs = false;
                            break;

                        case "set":
                            vm.tabs = data;
                            vm.hasTabs = (vm.tabs.length > 0);
                            break;
                    }
                });
            }

            function onTabSelect(text) {
                tabsService.select(text);
            }
        }]);
})();