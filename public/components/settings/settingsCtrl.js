// Copyright (c) Alvin Pivowar 2016

(function() {
    "use strict";

    angular
        .module("MaterialSampleApp")
        .controller("settingsCtrl",
        ["settingsService",
        function(settingsService) {
            var vm = this;
            vm.items = [];

            vm.onClick = onClick;

            init();

            function init() {
                vm.items = [];
                vm.items.push(new SettingsItem("Share", "share"));
                vm.items.push(new SettingsItem("Upload", "file_upload"));
                vm.items.push(new SettingsItem("Copy", "content_copy"));
                vm.items.push(new SettingsItem("Print this page", "print"));
            }

            function onClick() {
                settingsService.hide();
            }
        }]);

    function SettingsItem(text,  iconName) {
        this.iconName = iconName;
        this.text = text;
    }
})();