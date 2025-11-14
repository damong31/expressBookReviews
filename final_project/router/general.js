const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here//
  // Send JSON response with formatted friends data
  res.send(JSON.stringify(books,null,4));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // Retrieve ISBN from request parameters
  const isbn = req.params.isbn;

  // Check if the book exists in the books object
  const book = books[isbn];

  if (book) {
    // If found, send the book details as JSON
    return res.status(200).json(book);
  } else {
    // If not found, return a 404 error
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // 1. Retrieve the author name from request parameters
  const author = req.params.author;

  // Get all book keys
  const bookKeys = Object.keys(books);

  //Initialize an empty array to store matching books
  let booksByAuthor = [];

  //Loop through the books and find matches
  bookKeys.forEach((key) => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push(books[key]);
    }
  });

  //Send response
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // Retrieve the title from request parameters
  const title = req.params.title.toLowerCase();

  // Get all book keys
  const bookKeys = Object.keys(books);

  // Store matching books
  let booksByTitle = [];

  // Loop through books and find title matches
  bookKeys.forEach((key) => {
    if (books[key].title.toLowerCase() === title) {
      booksByTitle.push(books[key]);
    }
  });

  // Send response
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
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
