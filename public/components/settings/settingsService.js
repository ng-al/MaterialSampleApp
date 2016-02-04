// Copyright (c) Alvin Pivowar 2016

(function() {
    "use strict";

    angular
        .module("MaterialSampleApp")
        .factory("settingsService",
        ["$mdBottomSheet",
        function($mdBottomSheet) {
            function show() {
                $mdBottomSheet.show({
                    templateUrl: "/settings/settings.html",
                    controller: "settingsCtrl",
                    controllerAs: "vm"
                })
            }

            function hide() {
                $mdBottomSheet.hide();
            }


            return {
                hide: hide,
                show: show
            }
        }]);
})();