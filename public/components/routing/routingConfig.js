// Copyright (c) Alvin Pivowar 2016

(function() {
    "use strict;"

    angular
        .module("MaterialSampleApp")
        .config(
        ["$routeProvider", "routingServiceProvider",
        function($routeProvider, routingServiceProvider) {
            var defaultRoute = null;

            angular.forEach(routingServiceProvider.routes, function(route) {
               $routeProvider.when(route.path, { templateUrl: route.templateUrl});
                if (route.isDefault)
                    defaultRoute = route;
            });

            if (defaultRoute)
                $routeProvider.otherwise({ redirectTo: defaultRoute.path});
        }]);
})();