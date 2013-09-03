(function () {
    var BookModel = WinJS.Class.define(function (name, author, genre, rating, resume, notes, url, bookId, group) {
        this.name = name;
        this.author = author;
        this.genre = genre;
        this.rating = rating;
        this.resume = resume;
        this.notes = notes;
        this.url = url;
        this.bookId = bookId;
    }, {
        name: "",
        author: "",
        genre: "",
        rating: "",
        resume: "",
        notes: "",
        url: "",
        bookId: "",
        group: ""
    });

    WinJS.Namespace.define("Models", {
        BookModel: BookModel,
    })
})()