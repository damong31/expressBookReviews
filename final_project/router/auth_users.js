const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.hasOwnProperty(username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    if (!isValid(username)) return false;
    return users[username].password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // 1. Validate presence
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // 2. Check if registered and credentials match
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login. Check username and password" });
  }

  // 3. Create JWT token
  let accessToken = jwt.sign(
    { username: username },   // payload
    "access",                 // secret key
    { expiresIn: "1h" }       // token validity
  );

  // 4. Save token to session
  req.session.authorization = { accessToken };

  return res.status(200).json({
    message: "User successfully logged in",
    token: accessToken
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;

  // 1. Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // 2. Ensure review text is provided
  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  // 3. Identify logged-in user (from JWT payload)
  const username = req.user.username;

  // 4. Insert/update review
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully added/updated",
    reviews: books[isbn].reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({
        message: "Review deleted",
        reviews: books[isbn].reviews
      });
    }
  
    return res.status(404).json({ message: "No review by this user" });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
