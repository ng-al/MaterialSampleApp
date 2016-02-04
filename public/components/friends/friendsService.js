// Copyright (c) Alvin Pivowar 2016

(function() {
    "use strict";

    var _friends = [];

    angular
        .module("MaterialSampleApp")
        .factory("friendsService",
        ["$q", "$rootScope", "Lamb",
        function($q, $rootScope, Lamb) {
            var _bus = new Lamb("friends", $rootScope);
            var _filter = null;

            init();

            function addFriend(friend) {
                var scope;

                if (!friend.id) {
                    scope = $rootScope.$new(true);
                    friend.id = scope.$id;

                    _friends.unshift(friend);
                    _bus.publish("friends.add", friend);
                }
            }

            function deleteFriend(id) {
                return $q(function(accept, reject) {
                    var result = [];
                    angular.forEach(_friends, function(friend) {
                        if (friend.id !== id)
                            result.push(friend);
                    });
                    if (result.length === _friends.length)
                        reject(false);
                    else {
                        _friends = result;
                        _bus.publish("friends.delete", id);
                        accept(true);
                    }
                });
            }

            function init() {
                _friends.push(new Friend("Alexandra Hall", "alexandra.hall@testing.net", "Interactive Designer", "999-000-2222", "1474 Fletcher Avenue", "I have a cat named Napolean. I love spicy foods and beautiful pictures."));
                _friends.push(new Friend("Emma Reynolds", "emma.reynolds@testing.net", "Android Developer", "555-666-9999", "1009 Railroad Lane", "Avid consumer of Chinese food and old movies. Old soul."));
                _friends.push(new Friend("Gemma Edwards", "gemma.edwards@testing.net", "Architect", "888-999-5555", "8534 Yellow Lane", "Currently in love with cycling. Obsessed with creating helpful stuff."));
                _friends.push(new Friend("Harry Andrews", "harry.andrews@example.com", "Art Director", "444-555-2222", "3644 Green Street", "I am based in Totonto, Canada. I enjoy good music and indie movies."));
                _friends.push(new Friend("Joe Dunn", "joe.dunn@fakemail.com", "Graphic Designer", "111-222-3333", "1555 Black River Way", "Living in Athens, Greece. I love black and white classics, chillout music and green tea."));
                _friends.push(new Friend("Lauren Walsh", "lauren.walsh@mailtest.com", "Product Designer", "666-777-9999", "1236 Colorado Avenue", "I'm a happy person with mediocre dance moves. Based in San Diego, California."));
                _friends.push(new Friend("Leonardo Hunter", "leonardo.hunter@fakemail.com", "Product Manager", "555-666-3333", "1453 Cunningham Drive", "I'm a dog and cat lover. If you're interested in working with me get in touch via email."));
                _friends.push(new Friend("Marie Murray", "marie.murray@test.com", "Visual Designer", "999-000-9999", "1003 Sushi Street", "Aspiring creative writer. I like spicy food and good people."));
                _friends.push(new Friend("Shane Crawford", "shane.crawford@fakemail.com", "UI Designer", "666-777-6666", "4583 Summer Way", "Based in Berlin. I love dubstep, kittens and hot coffee."));
                _friends.push(new Friend("Taylor Weber", "taylor.weber@fakemail.com", "Network Architect", "111-222-1111", "1256 Park Camp Avenue", "I like to create works with a strong message. Contact me if you want to collaborate."));

                angular.forEach(_friends, function(friend) {
                    var scope = $rootScope.$new(true);
                    friend.id = scope.$id;
                });
            }

            function _getFriends(page, pageSize) {
                var i;
                var index;
                var friends = [];
                var result = [];
                var startIndex;

                angular.forEach(_friends, function(friend) {
                    if (!_filter)
                        friends.push(friend);
                    else {
                        if (friend.address.toLowerCase().indexOf(_filter) !== -1 ||
                            friend.email.toLowerCase().indexOf(_filter) !== -1 ||
                            friend.name.toLowerCase().indexOf(_filter) !== -1 ||
                            friend.phone.toLowerCase().indexOf(_filter) !== -1 ||
                            friend.title.toLowerCase().indexOf(_filter) !== -1) {

                            friends.push(friend);
                        }
                    }
                });

                if (! (page && pageSize))
                    return _friends;

                startIndex = page * pageSize - pageSize;
                for (i = 0; i < pageSize; ++i) {
                    index = startIndex + i;
                    if (index < friends.length)
                        result.push(friends[startIndex + i]);
                }

                return result;
            }

            function getFriends(page, pageSize) {
                return $q(function(accept, reject) {
                    var result = _getFriends(page, pageSize);
                    accept(result);
                });
            }

            function getFriendsCount() {
                return $q(function(accept, reject) {
                    return accept(_friends.length);
                });
            }

            function setSearchFilter(filter) {
                var newFilter = filter ? filter.toLowerCase() : null;
                if (_filter !== newFilter) {
                    _filter = newFilter
                    _bus.publish("friends.filter", newFilter);
                }
            }


            return {
                addFriend: addFriend,
                deleteFriend: deleteFriend,
                getFriends: getFriends,
                getFriendsCount: getFriendsCount,
                setSearchFilter: setSearchFilter
            }
        }]);

    function Friend(name, email, title, phone, address, bio) {
        this.id = null;
        this.address = address;
        this.bio = bio;
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.title = title;
    }
})();

