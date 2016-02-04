// Copyright (c) Alvin Pivowar 2016

(function() {
    "use strict";

    angular
        .module("MaterialSampleApp")
        .factory("mastheadService",
        ["$rootScope", "Lamb",
        function($rootScope, Lamb) {
            var _bus = new Lamb("masthead", $rootScope);

            var _settings;

            function setSearchFilter(filter) {
                _bus.publish("masthead.filter", filter);
            }

            /*
                {
                    hasSearch: boolean
                    title: string,
                }
             */
            function settings(obj) {
                if (obj) {
                    _settings = obj;
                    _bus.publish("masthead.settings", _settings);
                }

                return _settings;
            }


            return {
                setSearchFilter: setSearchFilter,
                settings: settings
            }
        }])
})();