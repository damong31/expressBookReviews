const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username or password missing
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  // Check if user already exists
  if (users[username]) {
    return res.status(400).json({
      message: "User already exists"
    });
  }

  // Store new user
  users[username] = { password: password };

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });
});

// Get the book list available in the shop
public_users.get("/promise/books", (req, res) => {
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then(data => {
    res.status(200).json(data);
  })
  .catch(err => {
    res.status(500).json({ message: "Error retrieving books" });
  });
});

// Get book details based on ISBN
public_users.get("/promise/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) resolve(book);
    else reject("Book not found");
  })
  .then(data => {
    res.status(200).json(data);
  })
  .catch(err => {
    res.status(404).json({ message: err });
  });
});
  
// Get book details based on author
public_users.get("/promise/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();

  new Promise((resolve, reject) => {
    const matches = Object.keys(books)
      .filter(isbn => books[isbn].author.toLowerCase() === author)
      .map(isbn => ({ isbn, ...books[isbn] }));

    if (matches.length > 0) resolve(matches);
    else reject("No books found for this author");
  })
  .then(data => {
    res.status(200).json(data);
  })
  .catch(err => {
    res.status(404).json({ message: err });
  });
});

// Get all books based on title
public_users.get("/promise/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();

  new Promise((resolve, reject) => {
    const matches = Object.keys(books)
      .filter(isbn => books[isbn].title.toLowerCase() === title)
      .map(isbn => ({ isbn, ...books[isbn] }));

    if (matches.length > 0) resolve(matches);
    else reject("No books found with this title");
  })
  .then(data => res.status(200).json(data))
  .catch(err => res.status(404).json({ message: err }));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  // 1. Get ISBN from request parameters
  const isbn = req.params.isbn;

  // 2. Check if the book exists
  const book = books[isbn];

  if (book) {
    // 3. Return the reviews for the book
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
