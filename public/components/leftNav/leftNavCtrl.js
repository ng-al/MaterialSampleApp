// Copyright (c) Alvin Pivowar 2016

(function() {
    "use strict";

    angular
        .module("MaterialSampleApp")
        .controller("leftNavCtrl",
        ["configService", "routingService", "settingsService",
        function(configService, routingService, settingsService) {
            var vm = this;
            vm.author = configService.config.author;
            vm.userMenu = [];
            vm.adminMenu = [];

            vm.onClick = onClick;

            init();

            function init() {
                vm.userMenu = [];
                vm.userMenu.push(new MenuItem("Dashboard", "dashboard"));
                vm.userMenu.push(new MenuItem("Friends", "group"));
                vm.userMenu.push(new MenuItem("Messages", "message"));

                vm.adminMenu = [];
                //vm.adminMenu.push(new MenuItem("Trash", "delete"));
                vm.adminMenu.push(new MenuItem("Settings", "settings"));
            }

            function onClick(text) {
                switch (text) {
                    case "Settings":
                        settingsService.show();
                        break;
                    default:
                        routingService.route(text.toLowerCase());
                        break;
                }
            }
        }]);

    function MenuItem(text, iconName) {
        this.iconName = iconName;
        this.text = text;
    }
})();