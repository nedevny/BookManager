(function () {
    "use strict";

    var localFolder = Windows.Storage.ApplicationData.current.localFolder;
    var list = new WinJS.Binding.List();
    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );

    // TODO: Replace the data with your real data.
    // You can add data from asynchronous sources whenever it becomes available.
    generateInitialData();

    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference,
        addNewBook: addNewBook
    });

    function addNewBook(book) {
        book.group = {
            key: "" + book.genre,
            title: "" + book.genre,
            backgroundImage: "images/" + book.genre + ".jpg"
        };

        list.push(book);
    }

    // Get a reference for an item, using the group key and item title as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.group.key, item.title];
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    // Get the unique group corresponding to the provided group key.
    function resolveGroupReference(key) {
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).key === key) {
                return groupedItems.groups.getAt(i);
            }
        }
    }

    // Get a unique item from the provided string array, which should contain a
    // group key and an item title.
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }

    //Loads the initial data that is already in the app
    function generateInitialData() {
        localFolder.getFolderAsync("Genres").done(
            function (folder) {
                if (folder) {
                    folder.getFilesAsync().then(
                        function (files) {
                            files.forEach(function (file) {
                                Windows.Storage.FileIO.readTextAsync(file).then(function (text) {

                                    var books = text.split("},");
                                    for (var j = 0; j < books.length - 1; j++) {
                                        var book = JSON.parse(books[j] + '}');

                                        var bookItem = {
                                            group: { key: "" + book.genre, title: "" + book.genre, backgroundImage: "images/" + book.genre + ".jpg" },
                                            name: book.name,
                                            author: book.author,
                                            genre: book.genre,
                                            rating: book.rating,
                                            resume: book.resume,
                                            notes: book.notes,
                                            url: book.url,
                                            bookId: book.bookId
                                        };

                                        list.push(bookItem);
                                    }
                                }, function (e) {
                                    Windows.UI.Popups.MessageDialog("Something went wrong, and couldn't load some files");
                                });
                            });
                        });
                }
            }, function (e) {
                Windows.UI.Popups.MessageDialog("Something went wrong, and couldn't open some application folders");
            });
    }
})();
