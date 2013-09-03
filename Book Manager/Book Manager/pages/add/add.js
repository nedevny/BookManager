// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var localFolder = Windows.Storage.ApplicationData.current.localFolder;
    var storagePermissions = Windows.Storage.AccessCache.StorageApplicationPermissions;
    var app = WinJS.Application;
    var currentBookId;

    var saveState = function () {
        var bookName = document.getElementById("name");
        app.sessionState["bookNameValue"] = bookName.value;

        var authorName = document.getElementById("author");
        app.sessionState["authorNameValue"] = authorName.value;

        var resume = document.getElementById("resume");
        app.sessionState["resume"] = resume.innerText;

        var notes = document.getElementById("notes");
        app.sessionState["notes"] = notes.innerText;

        var genre = document.getElementById("genre");
        app.sessionState["genre"] = genre.value.toString();
    }

    var loadState = function () {
        var bookName = document.getElementById("name");
        var authorName = document.getElementById("author");
        var resume = document.getElementById("resume");
        var notes = document.getElementById("notes");
        var genre = document.getElementById("genre");

        var bookNameValue = app.sessionState["bookNameValue"]
        var authorNameValue = app.sessionState["authorNameValue"]
        var resumeValue = app.sessionState["resume"]
        var notesValue = app.sessionState["notes"]
        var genreValue = WinJS.Application.sessionState["genre"];

        if (bookNameValue) {
            bookName.value = bookNameValue;
        }
        if (authorNameValue) {
            authorName.value = authorNameValue;
        }
        if (resumeValue) {
            WinJS.Utilities.setInnerHTML(resume, resumeValue);
        }
        if (notesValue) {
            WinJS.Utilities.setInnerHTML(notes, notesValue);
        }
        if (genreValue) {
            genre.value = genreValue;
        }
    }


    var addImage = function (storageFile) {
        localFolder.createFolderAsync("pictures", Windows.Storage.CreationCollisionOption.openIfExists);
        var image = MSApp.createFileFromStorageFile(storageFile);

        localFolder.getFolderAsync("pictures").then(
            function (folder) {

                var name = document.getElementById("name").value,
                author = document.getElementById("author").value;

                folder.createFileAsync(name + author + ".jpg",
                    Windows.Storage.CreationCollisionOption.replaceExisting).done(
                    function (file) {
                        return file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (stream) {

                            return Windows.Storage.Streams.RandomAccessStream.copyAsync(image.msDetachStream(), stream).then(function () {
                                return stream.flushAsync().then(function () {
                                    stream.close();
                                });
                            })
                        });

                    });
            });
    }

    var saveBook = function (stringifiedBook) {

        localFolder.createFolderAsync("Genres", Windows.Storage.CreationCollisionOption.openIfExists);

        var genre = document.getElementById("genre").value;

        localFolder.createFileAsync("Books.txt",
            Windows.Storage.CreationCollisionOption.openIfExists).done(
            function (file) {
                Windows.Storage.FileIO.appendTextAsync(file, stringifiedBook + ",");
                localFolder.getFolderAsync("Genres").done(
                    function (folder) {
                        folder.createFileAsync(genre + ".txt",
                        Windows.Storage.CreationCollisionOption.openIfExists).done(
                        function (file) {
                            Windows.Storage.FileIO.appendTextAsync(file, stringifiedBook + ",");
                            document.getElementById("result").innerText = "Your book was successfuly added.";
                        }, function (e) {
                            document.getElementById("result").innerText = "There is a problem with the book.";
                        });
                    });
            }, function (e) {
                document.getElementById("result").innerText = "There is a problem with the book.";
            });
    }

    var createBook = function () {
        var name = document.getElementById("name").value,
            author = document.getElementById("author").value,
            rating = document.getElementById("rating").winControl.userRating,
            resume = document.getElementById("resume").value,
            notes = document.getElementById("notes").value,
            genre = document.getElementById("genre").value;

        var book = new Models.BookModel(name, author, genre, rating,
             resume, notes, "ms-appdata:///local/pictures/" + name + author + ".jpg", currentBookId
        );
        currentBookId = "";

        return book;
    }

    var addBookToStorage = function (storageFile) {
        currentBookId = Date.now();
        storagePermissions.futureAccessList.addOrReplace(currentBookId, storageFile).then(function(){
        }, function (e) {
            Windows.UI.Popups.MessageDialog("Couldn't make link with book, please try again.");
        });
    }


    WinJS.UI.Pages.define("/pages/add/add.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        init: function () {
            app.addEventListener("checkpoint", saveState);
        },

        ready: function (element, options) {
            loadState();

            var submit = document.getElementById("submit");
            submit.addEventListener("click", function () {
                var book = createBook();
                var stringifiedBook = JSON.stringify(book);

                saveBook(stringifiedBook);

                Data.addNewBook(book);
            });

            var getImage = document.getElementById("pick-single-file-button");
            getImage.addEventListener("click", function () {
                var filePicker = Windows.Storage.Pickers.FileOpenPicker();
                filePicker.fileTypeFilter.replaceAll([".jpg"]);
                filePicker.viewMode = Windows.Storage.Pickers.PickerViewMode.list;
                filePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
                filePicker.pickSingleFileAsync().then(addImage,
                    function (e) {
                        Windows.UI.Popups.MessageDialog("Couldn't add image please try again");
                    });
            });

            var fromCameraButton = document.getElementById("from-camera");
            fromCameraButton.addEventListener("click", function () {
                var captureUI = new Windows.Media.Capture.CameraCaptureUI();
                captureUI.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo)
                .then(function (capturedImage) {
                    if (capturedImage) {
                        addImage(capturedImage)
                    }
                });
            }, function (e) {
                Windows.UI.Popups.MessageDialog("Something went wrong, and we couldn't take a a picture");
            });

            var pickBook = document.getElementById("pick-book");
            pickBook.addEventListener("click", function () {
                var filePicker = Windows.Storage.Pickers.FileOpenPicker();
                filePicker.fileTypeFilter.replaceAll([".epub", ".djvu", ".chm", ".pdf", ".txt", ".docx", ".doc", ".pdb",
                    ".fb2", ".xeb", ".ceb", ".htm", ".ibooks", ".azw", ".lit", ".pkg", ".xml", ".oxps", ".xps", ".tr2", ".tr3"]);

                filePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
                filePicker.pickSingleFileAsync().then(addBookToStorage,
                    function (e) {
                    Windows.UI.Popups.MessageDialog("Couldn't save the book path please try again");
                });
            });

            var addResumeButton = document.getElementById("add-resume");
            addResumeButton.addEventListener("click", function () {
                document.getElementById("resume").className = "visible";
                document.getElementById("notes").className = "hidden";
            });

            var addNotesButton = document.getElementById("add-notes");
            addNotesButton.addEventListener("click", function () {
                document.getElementById("notes").className = "visible";
                document.getElementById("resume").className = "hidden";
            });
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
            app.removeEventListener("checkpoint", saveState);
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();
