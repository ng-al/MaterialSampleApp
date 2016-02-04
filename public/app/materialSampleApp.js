// Copyright (c) Alvin Pivowar 2016

angular
    .module("MaterialSampleApp", ["ngDragDrop", "ngMaterial", "ngMdIcons", "ngRoute", "apLamb"])

    // Initialize data in services
    .run(["messagesService", function(messagesService) {}]);
