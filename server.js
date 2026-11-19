const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware: read JSON request bodies and serve frontend files.
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Sample in-memory book data. Changes reset when the server restarts.
let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 250 },
  { id: 2, title: "Wings of Fire", author: "A. P. J. Abdul Kalam", price: 300 }
];
let nextId = 3;

// GET /books - retrieve all books.
app.get("/books", (req, res) => {
  res.json(books);
});

// GET /books/:id - retrieve one book by ID.
app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((item) => item.id === id);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }
  res.json(book);
});

// POST /books - add a new book.
app.post("/books", (req, res) => {
  const { title, author, price } = req.body;

  if (!title || !author || price === undefined || price === "") {
    return res.status(400).json({ message: "Title, author and price are required." });
  }

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ message: "Price must be a valid non-negative number." });
  }

  const newBook = {
    id: nextId++,
    title: String(title).trim(),
    author: String(author).trim(),
    price: numericPrice
  };

  if (!newBook.title || !newBook.author) {
    return res.status(400).json({ message: "Title and author cannot be empty." });
  }

  books.push(newBook);
  res.status(201).json({ message: "Book added successfully.", book: newBook });
});

// PUT /books/:id - update an existing book.
app.put("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((item) => item.id === id);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  const { title, author, price } = req.body;
  if (!title || !author || price === undefined || price === "") {
    return res.status(400).json({ message: "Title, author and price are required." });
  }

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ message: "Price must be a valid non-negative number." });
  }

  book.title = String(title).trim();
  book.author = String(author).trim();
  book.price = numericPrice;

  if (!book.title || !book.author) {
    return res.status(400).json({ message: "Title and author cannot be empty." });
  }

  res.json({ message: "Book updated successfully.", book });
});

// DELETE /books/:id - delete a book.
app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Book not found." });
  }

  const deletedBook = books.splice(index, 1)[0];
  res.json({ message: "Book deleted successfully.", book: deletedBook });
});

// Handle invalid JSON and other server errors.
app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON request body." });
  }
  res.status(500).json({ message: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`Book Management System is running at http://localhost:${PORT}`);
});
