// Copyright (c) Alvin Pivowar 2016

(function() {
    "use strict";

    angular
        .module("MaterialSampleApp")
        .factory("tabsService",
        ["$rootScope", "Lamb",
        function($rootScope, Lamb) {
            var _bus = new Lamb("tabs", $rootScope);
            var _tabs = [];

            function clear() {
                _tabs = [];
                _bus.publish("tabs.clear");
            }

            function getTabs() {
                return _tabs;
            }

            function hide() {
                _bus.publish("tabs.hide");
            }

            function select(tab) {
                var selectedTab = null;
                var target = angular.isString(tab) ? tab : tab.text;

                angular.forEach(_tabs, function(tab) {
                    var currentValue = tab.isActive;
                    var newValue = (tab.text === target);

                    if (newValue !== currentValue) {
                        tab.isActive = newValue;

                        if (newValue)
                            selectedTab = tab;
                    }
                });

                if (selectedTab)
                    _bus.publish("tabs.select", selectedTab);
            }

            function setTabs(tabs) {
                var i;
                var tab;

                if (! (tabs && angular.isArray(tabs) && tabs.length > 0)) {
                    clear();
                    return;
                }

                for (i = 0; i < tabs.length; ++i) {
                    tab = angular.isString(tabs[i]) ? new Tab(tabs[i]) : tabs[i];
                    _tabs.push(tab);
                }

                _bus.publish("tabs.set", _tabs);
            }

            function show() {
                _bus.publish("tabs.show");
            }

            return {
                Tab: Tab,

                clear: clear,
                getTabs: getTabs,
                hide: hide,
                select: select,
                setTabs: setTabs,
                show: show
            }
        }]);

    function Tab(text, isActive) {
        this.isActive = !!isActive;
        this.text = text;
    }
})();