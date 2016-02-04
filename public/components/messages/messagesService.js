// Copyright (c) Alvin Pivowar 2016

(function() {

    var _friends = [];
    var _messages = [];

    angular
        .module("MaterialSampleApp")
        .factory("messagesService",
        ["$q", "$rootScope", "friendsService", "Lamb",
        function($q, $rootScope, friendsService, Lamb) {
            var _bus = new Lamb("messages", $rootScope);
            var _filter = null;

            init();

            function filterByNew(isNew, messages) {
                var result = [];

                if (!angular.isDefined(isNew))
                    return messages;

                angular.forEach(messages, function(message) {
                    if (message.isNew === isNew)
                        result.push(message);
                });

                return result;
            }

            function filterByPaging(page, pageSize, messages) {
                var i;
                var index;
                var result = [];
                var startIndex;

                if (! (page && pageSize))
                    return messages;

                startIndex = page * pageSize - pageSize;
                for (i = 0; i < pageSize; ++i) {
                    index = startIndex + i;
                    if (index < messages.length)
                        result.push(messages[startIndex + i]);
                }

                return result;
            }

            function filterBySearch(messages) {
                var result = [];

                if (_filter == null)
                    return messages;

                angular.forEach(messages, function(message) {
                    if (message.sender.name.toLowerCase().indexOf(_filter) !== -1 ||
                        message.text.toLowerCase().indexOf(_filter) !== -1) {
                        result.push(message);
                    }
                });

                return result;
            }

            function generateMessage() {
                var date;
                var friend;
                var message;
                var messageSender;
                var scope;
                var text;
                var time;

                friend = getRandomFriend();
                date = new Date();
                time = hoursAndMinutesToText(date.getHours(), date.getMinutes());
                text = getRandomText(friend);

                messageSender = new MessageSender(friend.id, friend.name);

                scope = $rootScope.$new(true);
                message = new Message(scope.$id, messageSender, date, time,text);
                _messages.unshift(message);

                _bus.publish("messages.add", message);
                return message;
            }

            function getMessages(isNew, page, pageSize) {
                return $q(function(accept, reject) {
                    var messages = _getMessages(isNew, page, pageSize);
                    accept(messages);
                });
            }

            function _getMessages(isNew, page, pageSize) {
                var messages = filterByNew(isNew, _messages);
                messages = filterBySearch(messages);
                messages = filterByPaging(page, pageSize, messages);
                return messages;
            }

            function getRandomDate() {
                var days = Math.floor(10 * Math.random());
                var today = new Date();

                return new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
            }

            function getRandomFriend() {
                var index = Math.floor(_friends.length * Math.random());
                return _friends[index];
            }

            function getRandomText(friend) {
                var result = "";
                var sentences = friend.bio.split('.');

                while (result === "") {
                    angular.forEach(sentences, function (sentence) {
                        if (sentence.trim().length > 0 && Math.random() > .5)
                            result += sentence + ". ";
                    });
                }

                return result;
            }

            function getRandomTime() {
                var hours = 8 + Math.floor(10 * Math.random());
                var minutes = 15 * Math.floor(3 * Math.random());

                return hoursAndMinutesToText(hours, minutes);
            }

            function hoursAndMinutesToText(hours, minutes) {
                var meridian;

                if (hours > 12) {
                    hours -= 12;
                    meridian = "PM";
                } else
                    meridian = "AM";

                return hours + ":" + minutes + " " + meridian;
            }

            function init() {
                friendsService.getFriends().then(function(friends) {
                    var i;
                    var friend;
                    var message;
                    var messageSender;
                    var scope;

                    _friends = friends;

                    for (i = 0; i < 50; ++i) {
                        friend = getRandomFriend();
                        messageSender = new MessageSender(friend.id, friend.name);

                        scope = $rootScope.$new(true);
                        message = new Message(scope.$id, messageSender, getRandomDate(), getRandomTime(), getRandomText(friend));
                        _messages.push(message);
                    }

                    _messages.sort(function(a, b) {
                        return b.date.getTime() - a.date.getTime();
                    });
                });
            }

            function setSearchFilter(filter) {
                var newFilter = filter ? filter.toLowerCase() : null;
                if (_filter !== newFilter) {
                    _filter = newFilter
                    _bus.publish("messages.filter", newFilter);
                }
            }


            return {
                generateMessage: generateMessage,
                getMessages: getMessages,
                setSearchFilter: setSearchFilter
            }
        }]);

    function Message(id, messageSender, date, time, text) {
        this.id = id;

        this.date = date;
        this.isNew = date.getTime() >= new Date().getTime() - 3 * 24 * 60 * 60 * 1000;
        this.sender = messageSender;
        this.text = text;
        this.time = time;
    }

    function MessageSender(id, name) {
        this.id = id;
        this.name = name;
    }
})();