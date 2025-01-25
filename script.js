const shelf = document.querySelector(".shelf");
const display = document.querySelector(".book-display");
const closeBookButton = document.querySelector("#close-book");
const newBookForm = document.querySelector(".new-book-display");
const newBookButton = document.querySelector(".new-book-icon");
const form = document.querySelector("#new-book-form");
// Form inputs
const titleInput = document.querySelector("#title-input");
const authorInput = document.querySelector("#author-input");
const genresInput = document.querySelector("#genres-input");
const pagesInput = document.querySelector("#pages-input");
const publishedInput = document.querySelector("#published-input");
const sequelsInput = document.querySelector("#sequels-input");
const haveReadInput = document.querySelector("#have-read-input");
const closeFormButton = document.querySelector("#close-form");
const submitButton = document.querySelector("#submit-button");

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
function Book(title, author, genres, pages, published, sequels, haveRead,) {
    this.id = myLibrary.length + 1;
    this.title = title;
    this.author = author;
    this.genres = genres
    this.pages = pages;
    this.published = published;
    this.haveRead = haveRead;
    this.sequels = sequels.length === 0 ? "None" : sequels;
    this.info = function() {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.haveRead.toLowerCase}`;
    }
}

function addBookToLibrary(title, author, genres, pages,  published, sequels, haveRead) {
    myLibrary.push(new Book(title, author, genres, pages,  published, sequels, haveRead,));
    refreshShelf();
}

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

function refreshShelf() {
    while (shelf.querySelector('.book')) {
        shelf.querySelector('.book').remove();
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