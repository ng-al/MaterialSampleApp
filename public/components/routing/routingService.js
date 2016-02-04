// Copyright (c) Alvin Pivowar 2016

(function() {
    "use strict";

    var routes = [];

    angular
        .module("MaterialSampleApp")
        .provider("routingService",
        [
        function() {
            routes.push(new Route("dashboard", "/dashboard", "/components/dashboard/dashboard.html", true));
            routes.push(new Route("friends", "/friends", "/components/friends/friends.html"));
            routes.push(new Route("messages", "/messages", "/components/messages/messages.html"));
            this.routes = routes;

            this.$get =
            ["$location",
            function($location) {
                function route(name) {
                    var i;
                    for (i = 0; i < routes.length; ++i) {
                        if (routes[i].name === name) {
                            $location.path(routes[i].path);
                            return;
                        }
                    }

                    throw new Error("Unknown route: " + name);
                }

                return {
                    route: route
                }
            }];
        }]);

    function Route(name, path, templateUrl, isDefault) {
        this.isDefault = !!isDefault;
        this.name = name;
        this.path = path;
        this.templateUrl = templateUrl;
    }
})();