// Copyright (c) Alvin Pivowar 2016

(function() {
    "use strict";

    angular
        .module("MaterialSampleApp")
        .controller("mastheadCtrl",
        ["$scope", "Lamb", "mastheadService", "settingsService",
        function($scope, Lamb, mastheadService, settingsService) {
            var bus = new Lamb("masthead", $scope);

            var vm = this;
            vm.filter = null;
            vm.isSearchMode = null;
            vm.title = null;

            vm.doSearch = doSearch;
            vm.hideSearch = hideSearch;
            vm.openSettings = openSettings;
            vm.showSearch = showSearch;

            init();

            function doSearch() {
                if (vm.filter)
                    mastheadService.setSearchFilter(vm.filter);
            }

            function hideSearch() {
                vm.isSearchMode = false;

                if (vm.filter)
                    mastheadService.setSearchFilter(null);
            }

            function init() {
                vm.isSearchMode = false;

                bus.subscribe("masthead.settings", function(settings) {
                    angular.extend(vm, settings);
                });
            }

            function openSettings() {
                settingsService.show();
            }

            function showSearch() {
                if (!vm.hasSearch)
                    return;

                vm.isSearchMode = true;

                if (vm.filter)
                    mastheadService.setSearchFilter(vm.filter);
            }
        }]);
})();