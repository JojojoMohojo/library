// Shelf elements
const shelf = document.querySelector(".shelf");
const newBookForm = document.querySelector(".new-book-display");
const newBookButton = document.querySelector(".new-book-icon");
// Book display elements
const display = document.querySelector(".book-display");
const closeBookButton = document.querySelector("#close-book");
const changeReadButton = document.querySelector("#change-read-status");
const removeBookButton = document.querySelector("#remove-book-button");
// Form elements
const form = document.querySelector("#new-book-form");
const titleInput = document.querySelector("#title-input");
const authorInput = document.querySelector("#author-input");
const genresInput = document.querySelector("#genres-input");
const pagesInput = document.querySelector("#pages-input");
const publishedInput = document.querySelector("#published-input");
const sequelsInput = document.querySelector("#sequels-input");
const haveReadInput = document.querySelector("#have-read-input");
const closeFormButton = document.querySelector("#close-form");
const submitButton = document.querySelector("#submit-button");

const openBookIconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z"/></svg>
`;

const removeBookIconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
`;

const addBookIconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
`;

let currentBook;

function Book(title, author, genres, pages, published, sequels, haveRead) {
    this.title = title;
    this.author = author;
    this.genres = genres
    this.pages = pages;
    this.published = published;
    this.haveRead = haveRead;
    this.sequels = sequels.length === 0 ? "None" : sequels;
}

Book.prototype.changeReadStatus = function() {
    this.haveRead = this.haveRead === "Yes" ? "No" : "Yes";
    document.getElementById('book-read').textContent = `Read: ${this.haveRead}`;
    document.getElementById('change-read-status').textContent = `Change status to ${this.haveRead === "Yes" ? '"Not read"' : '"Read"'}`
};

const myLibrary = [
    new Book("House of Leaves", "Mark Z. Danielewski", "Horror", 736, 2000, "None", "Yes"),
    new Book("Brave New World", "Aldous Huxley", "Sci-fi, Dystopian", 290, 1932, "None", "No")
];

myLibrary.forEach((book, index) => book.id = index + 1);

newBookButton.addEventListener("click", () => {
    newBookForm.showModal();
})

closeBookButton.addEventListener("click", () => {
    closeBook();
})

removeBookButton.addEventListener("click", () => {
    removeBook(currentBook);
    closeBook();
})

changeReadButton.addEventListener("click", () => {
    currentBook.changeReadStatus();
})

closeFormButton.addEventListener("click", () => {
    event.preventDefault();
    clearForm();
    clearErrorMessages();
    newBookForm.close();
})

submitButton.addEventListener("click", function () {
    event.preventDefault();
    const validationResult = validateForm();
    if (validationResult.valid) {
        console.log(haveReadInput.checked);
        addBookToLibrary(
            formatInput(titleInput.value, "Title"),
            formatInput(authorInput.value, "Author"),
            validationResult.genresArray,
            pagesInput.value,
            publishedInput.value,
            validationResult.sequelsArray,
            haveReadInput.checked ? "Yes" : "No"
        );
        newBookForm.close();
        console.log("Book added successfully!");
    } else {
        console.log("Form validation failed");
    }
})

function addBookToLibrary(title, author, genres, pages,  published, sequels, haveRead) {
    const newBook = new Book(title, author, genres, pages,  published, sequels, haveRead);
    newBook.id = myLibrary.length + 1;
    myLibrary.push(newBook);
    refreshShelf();
}

function refreshShelf() {
    while (shelf.querySelector(".book")) {
        shelf.querySelector(".book").remove();
    }
    myLibrary.forEach( (item) => {
        createBook(item);
    })
    clearForm();
}

function createBook(item) {
    const book = document.createElement("div");
    book.id = `Book-${item.id}`;
    book.classList.add("book-container", "book");
    book.textContent = item.title;

    const iconContainer = document.createElement("div");
    iconContainer.classList.add("icon-container");

    const openIcon = document.createElement("div");
    openIcon.classList.add("icon", "open-book-icon");
    openIcon.innerHTML = openBookIconSVG;
    openIcon.addEventListener("click", () => {
        displayBook(item);
    });

    const removeIcon = document.createElement("div");
    removeIcon.classList.add("icon", "remove-book-icon");
    removeIcon.innerHTML = removeBookIconSVG;
    removeIcon.addEventListener("click", () => {
        removeBook(item);
    });

    book.appendChild(iconContainer);
    iconContainer.appendChild(openIcon);
    iconContainer.appendChild(removeIcon);
    shelf.appendChild(book);
}

function displayBook(book) {
    //Populate the display with book details
    document.getElementById('book-title').textContent = `Title: ${book.title}`;
    document.getElementById('book-author').textContent = `Author: ${book.author}`;
    document.getElementById('book-genres').textContent = `Genres: ${book.genres}`;
    document.getElementById('book-pages').textContent = `Pages: ${book.pages}`;
    document.getElementById('book-published').textContent = `Year published: ${book.published}`;
    document.getElementById('book-read').textContent = `Read: ${book.haveRead}`;
    document.getElementById('book-sequels').textContent = `Sequels: ${book.sequels}`;
    document.getElementById('change-read-status').textContent = `Change read status to ${book.haveRead === "Yes" ? '"Not read"' : '"Read"'}`
    display.classList.add("flex");
    display.showModal();
    currentBook = book;
}

function closeBook() {
    display.close();
    display.classList.remove("flex");
}

function removeBook(book) {
    shelf.querySelector(`#Book-${book.id}`).remove();
}

function validateForm() {
    clearErrorMessages();
    let valid = true;

    if (titleInput.value === "") {
        valid = false;
        addErrorMessage(titleInput, "empty");
    }

    if (authorInput.value === "") {
        valid = false;
        addErrorMessage(authorInput, "empty");
    }

    let genresResult = isValidGenres(genresInput.value);
    if (genresInput.value === "") {
        valid = false;
        addErrorMessage(genresInput, "empty");
    } else {
        
        if (!genresResult.isValid) {
            valid = false;
            addErrorMessage(genresInput, "invalid");
        }
    }

    if (pagesInput.value === "") {
        valid = false;
        addErrorMessage(pagesInput, "empty");
    }

    if (publishedInput.value === "") {
        valid = false;
        addErrorMessage(publishedInput, "empty");
    } else if (!isValidYear(publishedInput.value)) {
        valid = false;
        addErrorMessage(publishedInput, "invalid");
    }

    let sequelsResult = isValidSequels(sequelsInput.value);
    if (sequelsInput.value !== "" && !sequelsResult.isValid) {
        valid = false;
        addErrorMessage(sequelsInput, "invalid");
    }

    return valid ? { valid, genresArray: genresResult.genresArray, sequelsArray: sequelsResult.sequelsArray } : { valid };
}

function isValidGenres(genres) {
    let genresArray = formatInput(genres, "Genres");
    return { isValid: genresArray.length > 0, genresArray };
}

function isValidYear (year) {
    return year > 0 && year < 2026;
}

function isValidSequels(sequels) {
    let sequelsArray = sequels.match(/"([^"]*)"/g);
    if (!sequelsArray) return { isValid: false, sequelsArray: [] };
    sequelsArray = formatInput(sequelsArray, "Sequels");
    return { isValid: sequelsArray.length > 0, sequelsArray };
}

function formatInput(input, type) {
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
                        } else {
                            return word.toLowerCase();
                        }
                    })   
                    .join(" ");
            })
            .map(sequel => `"${sequel}"`)
            .join(", ");
    } else if (type === "Genres") {
        return input.split(",")
            .map(genre => genre.trim())
            .filter(genre => genre !== "")
            .map(genre => {
                return genre.charAt(0).toUpperCase() + genre.slice(1);
            })
            .join(", ");
    } else if (type === "Title" || type === "Author") {
        return input.split(" ")
        .map((word, index) => {
            if (index === 0 || !nonCapitalizedWords.includes(word.toLowerCase())) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            } else {
                return word.toLowerCase();
            }
        })
        .join(" ");  
    }
}

function addErrorMessage(input, reason) {
    const formRow = input.parentNode;
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("message");
    switch (input) {
        case titleInput:
            if (reason === "empty") {
                errorMessage.textContent = "*Please enter a title.";
            }
            break;

        case authorInput:
            if (reason === "empty") {
                errorMessage.textContent = "*Please enter an author.";
            }
            break;

        case genresInput:
            if (reason === "empty") {
                errorMessage.textContent = "*Please enter at least 1 genre.";
            } else if (reason === "invalid") {
                errorMessage.textContent = "Please enter each genre separated by a comma.";
            }
            break;

        case pagesInput:
            if (reason === "empty") {
                errorMessage.textContent = "*Please enter the number of pages.";
            }
            break;

        case publishedInput:
            if (reason === "empty") {
                errorMessage.textContent = "*Please enter the year the book was published.";
            } else if (reason === "invalid") {
                errorMessage.textContent = "Please enter a valid year.";
            }
            break;

        case sequelsInput:
            if (reason === "invalid") {
                errorMessage.textContent = "Please enter the sequel title within quotes, each separated by a comma.";
            }
            break;

        default:
            errorMessage.textContent = "Invalid input.";
    }
    formRow.appendChild(errorMessage);
}

function clearErrorMessages() {
    const formRows = document.querySelectorAll('.form-row');
    formRows.forEach(formRow => {
        const errorMessages = formRow.querySelectorAll('.message');
        errorMessages.forEach(message => {
            message.remove();
        });
    });
}

function clearForm() {
    titleInput.value = "";
    authorInput.value = "";
    genresInput.value = ""; 
    pagesInput.value = "";
    publishedInput.value = "";
    sequelsInput.value = "";
    haveReadInput.value = "";
}

refreshShelf();