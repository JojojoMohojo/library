const myLibrary = [
    {
        id: 1,
        title: "House of Leaves",
        author: "Mark Z. Danielewski",
        genres: "Horror",
        pages: 736,
        published: 2000,
        haveRead: "Yes",
        sequels: "None",
    },
    {
        id: 2,
        title: "Brave New World",
        author: "Aldous Huxley",
        genres: "Sci-fi, Dystopian",
        pages: 290,
        published: 1932,
        haveRead: "No",
        sequels: "None",
    }
]
function Book(title, author, genres, pages, published, haveRead, sequels) {
    this.id = myLibrary.length + 1;
    this.title = title;
    this.author = author;
    this.genres = Array.isArray(genres) ? genres.join(", ") : genres;
    this.pages = pages;
    this.published = published;
    this.haveRead = haveRead ? "Yes" : "No"
    this.sequels = Array.isArray(sequels) ? sequels.join(", ") : sequels;
    this.info = function() {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.haveRead.toLowerCase}`;
    }
}

function addBookToLibrary(title, author, genres, pages, haveRead, published, sequels = ["None"]) {
    myLibrary.push(new Book(title, author, pages, genres, haveRead, published, sequels));
}

const shelf = document.querySelector(".shelf");
const display = document.querySelector(".book-display");
const closeBookButton = document.querySelector("#close-book");
const newBookForm = document.querySelector(".new-book-display");
const newBookButton = document.querySelector(".new-book-icon");
const closeFormButton = document.querySelector("#close-form");

newBookButton.addEventListener("click", () => {
    newBookForm.showModal();
})

closeBookButton.addEventListener("click", () => {
    display.close();
    display.classList.remove("flex");
})

closeFormButton.addEventListener("click", () => {
    newBookForm.close();
})

function addBooksToShelf() {
    while (shelf.querySelector('.book')) {
        shelf.querySelector('.book').remove();
    }
    myLibrary.forEach( (item) => {
        createBook(item);
    })
}

function createBook(item) {
    const book = document.createElement("div");
    book.id = `Book-${item.id}`;
    book.classList.add("book-container", "book");
    book.textContent = item.title;
    const bookIcon = document.createElement("div");
    bookIcon.classList.add("icon", "open-book-icon");
    bookIcon.addEventListener("click", () => {
        displayBook(item);
    });
    book.appendChild(bookIcon);
    shelf.appendChild(book);
}

function displayBook(book) {
    console.log(`Clicked on ${book.title}`);

    //Populate the display with book details
    document.getElementById('book-title').textContent = `Title: ${book.title}`;
    document.getElementById('book-author').textContent = `Author: ${book.author}`;
    document.getElementById('book-genres').textContent = `Genres: ${book.genres}`;
    document.getElementById('book-pages').textContent = `Pages: ${book.pages}`;
    document.getElementById('book-published').textContent = `Year published: ${book.published}`;
    document.getElementById('book-read').textContent = `Read?: ${book.haveRead}`;
    document.getElementById('book-sequels').textContent = `Sequels: ${book.sequels}`;
    display.classList.add("flex");
    display.showModal();
}


addBooksToShelf();