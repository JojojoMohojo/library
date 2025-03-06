class Book {
    constructor(title, author, genres, pages, published, sequels, haveRead) {
        this.title = title;
        this.author = author;
        this.genres = genres;
        this.pages = pages;
        this.published = published;
        this.haveRead = haveRead;
        this.sequels = sequels.length === 0 ? "None" : sequels;
    } 
    
    changeReadStatus() {
        this.haveRead = !this.haveRead;
        document.getElementById('book-read').textContent = `${this.haveRead ? "You have read this book" : "You haven't finished this book yet"}`;
        document.getElementById('change-read-status').textContent = `${this.haveRead ? "I haven't finished this book yet" : "I have read this book"}`;
    };
}

class Shelf {
    constructor(shelf) {
        this.shelf = shelf
        this.library = [
            new Book("House of Leaves", "Mark Z. Danielewski", "Horror", 736, 2000, "None", true),
            new Book("Brave New World", "Aldous Huxley", "Sci-fi, Dystopian", 290, 1932, "None", false)
        ];
        this.library.forEach((book, index) => book.id = Date.now() + index);
    }

    addBookToLibrary(title, author, genres, pages, published, sequels, haveRead) {
        const book = new Book(title, author, genres, pages, published, sequels, haveRead);
        book.id = Date.now();
        this.library.push(book);
        this.refreshShelf();
    }

    refreshShelf() {
        while (this.shelf.querySelector(".book")) {
            this.shelf.querySelector(".book").remove();
        }
        this.library.forEach((book) => this.createBookOnShelf(book));
        formHandler.clearForm();
    }

    createBookOnShelf(item) {
        const book = document.createElement("div");
        book.id = `Book-${item.id}`;
        book.classList.add("book-container", "book");
        book.textContent = item.title;

        const iconContainer = document.createElement("div");
        iconContainer.classList.add("icon-container");

        const openIcon = document.createElement("div");
        openIcon.classList.add("icon", "open-book-icon");
        openIcon.innerHTML = uiHandler.openBookIconSVG;
        openIcon.addEventListener("click", () => {
            uiHandler.displayBook(item);
        });

        const removeIcon = document.createElement("div");
        removeIcon.classList.add("icon", "remove-book-icon");
        removeIcon.innerHTML = uiHandler.removeBookIconSVG;
        removeIcon.addEventListener("click", () => {
            this.removeBook(item);
        });

        book.appendChild(iconContainer);
        iconContainer.appendChild(openIcon);
        iconContainer.appendChild(removeIcon);
        this.shelf.appendChild(book);
    }

    removeBook(book) {
        this.shelf.querySelector(`#Book-${book.id}`).remove();
        this.library = this.library.filter((thisBook) => thisBook.id !== book.id);
    }
}

class FormHandler {
    constructor(form) {
        this.form = form;
        this.title = form.querySelector("#title");
        this.author = form.querySelector("#author");
        this.genres = form.querySelector("#genres");
        this.pages = form.querySelector("#pages");
        this.published = form.querySelector("#published");
        this.sequels = form.querySelector("#sequels");
        this.haveRead = form.querySelector("#have-read");
        this.closeFormButton = document.querySelector("#close-form");
        this.submitButton = document.querySelector("#submit-button");

        this.closeFormButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.clearForm();
            this.clearErrorMessages();
            uiHandler.newBookForm.close();
        })

        this.submitButton.addEventListener("click", (e) => {
            e.preventDefault();
            const formValues = this.validateForm();
            if (formValues.isValid) {
                shelf.addBookToLibrary(
                    this.formatInput(formValues.title.value, "Title"),
                    this.formatInput(formValues.author.value, "Author"),
                    formValues.genres,
                    formValues.pages.value,
                    formValues.published.value,
                    formValues.sequels,
                    formValues.haveRead.checked
                );
                this.clearForm();
                uiHandler.newBookForm.close();
            }
        })
    }

    validateForm() {
        this.clearErrorMessages();
        let isValid = true;
        
        if (this.title.value === "") {
            isValid = false;
            uiHandler.addErrorMessage(this.title, "empty");
        }

        if (this.author.value === "") {
            isValid = false;
            uiHandler.addErrorMessage(this.author, "empty");
        }

        let genresResult = this.isValidGenres(this.genres.value);
        if (this.genres.value === "") {
            isValid = false;
            uiHandler.addErrorMessage(this.genres, "empty");
        } else {
            if (!genresResult.isValid) {
                isValid = false;
                uiHandler.addErrorMessage(this.genres, "invalid");
            }
        }

        if (this.pages.value === "") {
            isValid = false;
            uiHandler.addErrorMessage(this.pages, "empty");
        }

        if (this.published.value === "") {
            isValid = false;
            uiHandler.addErrorMessage(this.published, "empty");
        } else if (!this.isValidYear(this.published.value)) {
            isValid = false;
            uiHandler.addErrorMessage(this.published, "invalid");
        }

        let sequelsResult = this.isValidSequels(this.sequels.value);
        if (this.sequels.value !== "" && !sequelsResult.isValid) {
            isValid = false;
            uiHandler.addErrorMessage(this.sequels, "invalid");
        }

        return { 
            isValid, 
            title: this.title, 
            author: this.author, 
            genres: genresResult.genresArray, 
            pages: this.pages, 
            published: this.published, 
            sequels: sequelsResult.sequelsArray,
            haveRead: this.haveRead
        };
    }

    isValidGenres(genres) {
        let genresArray = this.formatInput(genres, "Genres");
        return { isValid: genresArray.length > 0, genresArray };
    }

    isValidYear(year) {
        const currentYear = new Date().getFullYear();
        return year > 0 && year <= currentYear;
    }

    isValidSequels(sequels) {
        let sequelsArray = sequels.match(/"([^"]*)"/g);
        if (!sequelsArray) return { isValid: false, sequelsArray: [] };
        sequelsArray = this.formatInput(sequelsArray, "Sequels");
        return { isValid: sequelsArray.length > 0, sequelsArray };
    }

    formatInput(input, type) {
        const nonCapitalizedWords = [
            "a", "an", "and", "but", "for", "nor", "or", "so", "the", "to", "up", "in", "on", "at", "by", "as", "of", "nor"
        ];

        if (type === "Sequels") {
            return input
                .map(sequel => sequel.slice(1, -1))
                .map(sequel => sequel.trim())
                .map(sequel => {
                    return sequel
                        .split(" ")
                        .map((word, index) => {
                            if (index === 0 || !nonCapitalizedWords.includes(word.toLowerCase())) {
                                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                            }
                            return word.toLowerCase();
                        })
                        .join(" ");
                })
                .map(sequel => `"${sequel}"`)
                .join(", ");
        }

        if (type === "Genres") {
            return input.split(",")
                .map(genre => genre.trim())
                .filter(genre => genre !== "")
                .map(genre => genre.charAt(0).toUpperCase() + genre.slice(1))
                .join(", ");
        }

        if (type === "Title" || type === "Author") {
            return input.split(" ")
                .map((word, index) => {
                    if (index === 0 || !nonCapitalizedWords.includes(word.toLowerCase())) {
                        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                    }
                    return word.toLowerCase();
                })
                .join(" ");
        }
    }  

    clearErrorMessages() {
        this.form.querySelectorAll(".message").forEach(message => message.remove());
    }

    clearForm() {
        this.form.reset();
    }
}

class UIHandler {
    constructor() {
        // Shelf elements
        this.newBookForm = document.querySelector(".new-book-display");
        this.newBookButton = document.querySelector(".new-book-icon");

        this.newBookButton.addEventListener("click", () => {
            this.newBookForm.showModal();
        })
        // SVG for shelf icons
        this.openBookIconSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z"/></svg>
        `;
        this.removeBookIconSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        `;
        this.addBookIconSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
        `;
        // Book display elements
        this.display = document.querySelector(".book-display");
        this.closeBookButton = document.querySelector("#close-book");
        this.changeReadButton = document.querySelector("#change-read-status");
        this.removeBookButton = document.querySelector("#remove-book-button");
        this.bookTitle = document.querySelector("#book-title");
        this.bookAuthor = document.querySelector("#book-author");
        this.bookGenres = document.querySelector("#book-genres");
        this.bookPages = document.querySelector("#book-pages");
        this.bookPublished = document.querySelector("#book-published");
        this.bookRead = document.querySelector("#book-read");
        this.bookSequels = document.querySelector("#book-sequels");
        this.changeReadButton = document.querySelector("#change-read-status");

        this.changeReadButton.addEventListener("click", () => {
            this.currentBook.changeReadStatus();
        })        

        this.closeBookButton.addEventListener("click", () => {
            this.closeBook();
        })

        this.removeBookButton.addEventListener("click", () => {
            shelf.removeBook(this.currentBook);
            this.closeBook();
        })
    }

    displayBook(book) {      
        //Populate the display with book details
        this.bookTitle.textContent = `Title: ${book.title}`;
        this.bookAuthor.textContent = `Author: ${book.author}`;
        this.bookGenres.textContent = `Genres: ${book.genres}`;
        this.bookPages.textContent = `Pages: ${book.pages}`;
        this.bookPublished.textContent = `Year published: ${book.published}`;
        this.bookRead.textContent = `${book.haveRead ? "You have read this book" : "You haven't finished this book yet"}`;
        this.bookSequels.textContent = `Sequels: ${book.sequels}`;
        this.changeReadButton.textContent = `${book.haveRead ? "I haven't finished this book yet" : "I have read this book"}`;
        this.currentBook = book;
        // Show the book modal
        this.display.classList.add("flex");
        this.display.showModal();    
    }

    changeReadStatus(book) {
        book.changeReadStatus(); // Call the method on the passed book instance
        this.bookRead.textContent = `${book.haveRead ? "You have read this book" : "You haven't finished this book yet"}`;
        this.changeReadButton.textContent = `${book.haveRead ? "I haven't finished this book yet" : "I have read this book"}`;
    }

    closeBook() {
        this.display.close();
        this.display.classList.remove("flex");
    }

    addErrorMessage(input, reason) {
        const formRow = input.parentNode;
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("message");
        const messages = {
            title_empty: "*Please enter a title.",
            author_empty: "*Please enter an author.",
            genres_empty: "*Please enter at least one genre, separated by commas.",
            pages_empty: "*Please enter the number of pages.",
            published_empty: "*Please enter a year.",
            published_invalid: "*Please enter a valid year (before 2026).",
            sequels_invalid: "Sequels must be in quotes, separated by commas."
        };
        errorMessage.textContent = messages[`${input.id}_${reason}`] || "Invalid input.";
        formRow.appendChild(errorMessage);
    }    
}

const formHandler = new FormHandler(document.querySelector("#new-book-form"));
const shelf = new Shelf(document.querySelector(".shelf"));
const uiHandler = new UIHandler();
shelf.refreshShelf();