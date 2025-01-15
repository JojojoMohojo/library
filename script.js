const myLibrary = [
    {
        id: 1,
        title: "House of Leaves",
        author: "Mark Z. Danielewski",
        genres: "Horror",
        pages: 736,
        published: 2000,
        haveRead: "Read",
        sequels: "None",
    },
    {
        id: 2,
        title: "Brave New World",
        author: "Aldous Huxley",
        genres: "Sci-fi, Dystopian",
        pages: 290,
        published: 1932,
        haveRead: "Not read",
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
    this.haveRead = haveRead ? "Read" : "Not read"
    this.sequels = Array.isArray(sequels) ? sequels.join(", ") : sequels;
    this.info = function() {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.haveRead.toLowerCase}`;
    }
}

function addBookToLibrary(title, author, genres, pages, haveRead, published, sequels = ["None"]) {
    myLibrary.push(new Book(title, author, pages, genres, haveRead, published, sequels));
}

const shelf = document.querySelector(".shelf");

function displayBook() {
    while (shelf.querySelector('.book')) {
        shelf.querySelector('.book').remove();
    }
    myLibrary.forEach( (item) => {
        const book = document.createElement("div");
        book.id = `Book-${item.id}`;
        console.log(`${item.id}`);
        book.classList.add("book-container", "book");
        book.textContent = item.title;
        const bookIcon = document.createElement("div");
        bookIcon.classList.add("icon", "open-book-icon");
        bookIcon.addEventListener("click", () => {
            displayBookContent(item);
        });
        book.appendChild(bookIcon);
        shelf.appendChild(book);
    })
}

function displayBookContent(book) {
    console.log(`Clicked on ${book.title}`);
}

displayBook();