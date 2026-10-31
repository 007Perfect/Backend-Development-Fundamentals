
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, 'books.db');

let db = null;

// Initialize database and start server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Database connected: ${dbPath}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

// GET /books/ - Get all books
app.get('/books/', async (req, res) => {
  try {
    const books = await db.all(
      'SELECT * FROM book ORDER BY id'
    );

    return res.status(200).json(books);
  } catch (error) {
    console.error('GET all books error:', error.message);

    return res.status(500).json({
      error: 'Failed to retrieve books',
    });
  }
});

// GET /books/:bookId/ - Get a book by ID
app.get('/books/:bookId/', async (req, res) => {
  try {
    const book = await db.get(
      'SELECT * FROM book WHERE id = ?',
      [req.params.bookId]
    );

    if (!book) {
      return res.status(404).json({
        error: 'Book not found',
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('GET book error:', error.message);

    return res.status(500).json({
      error: 'Failed to retrieve the book',
    });
  }
});

// POST /books/ - Add a new book
app.post('/books/', async (req, res) => {
  try {
    if (
      !req.body ||
      typeof req.body !== 'object' ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        error: 'Request body must contain valid JSON',
      });
    }

    const { title, author, price, pages } = req.body;

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      typeof author !== 'string' ||
      !author.trim() ||
      !Number.isInteger(price) ||
      price < 0 ||
      !Number.isInteger(pages) ||
      pages <= 0
    ) {
      return res.status(400).json({
        error: 'Provide valid title, author, price and pages',
      });
    }

    const result = await db.run(
      `INSERT INTO book (title, author, price, pages)
       VALUES (?, ?, ?, ?)`,
      [title.trim(), author.trim(), price, pages]
    );

    const newBook = await db.get(
      'SELECT * FROM book WHERE id = ?',
      [result.lastID]
    );

    return res.status(201).json(newBook);
  } catch (error) {
    console.error('POST book error:', error.message);

    return res.status(500).json({
      error: 'Failed to add the book',
    });
  }
});

// PUT /books/:bookId/ - Update a book
app.put('/books/:bookId/', async (req, res) => {
  try {
    if (
      !req.body ||
      typeof req.body !== 'object' ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        error: 'Request body must contain valid JSON',
      });
    }

    const { title, author, price, pages } = req.body;

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      typeof author !== 'string' ||
      !author.trim() ||
      !Number.isInteger(price) ||
      price < 0 ||
      !Number.isInteger(pages) ||
      pages <= 0
    ) {
      return res.status(400).json({
        error: 'Provide valid title, author, price and pages',
      });
    }

    const result = await db.run(
      `UPDATE book
       SET title = ?, author = ?, price = ?, pages = ?
       WHERE id = ?`,
      [
        title.trim(),
        author.trim(),
        price,
        pages,
        req.params.bookId,
      ]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Book not found',
      });
    }

    const updatedBook = await db.get(
      'SELECT * FROM book WHERE id = ?',
      [req.params.bookId]
    );

    return res.status(200).json(updatedBook);
  } catch (error) {
    console.error('PUT book error:', error.message);

    return res.status(500).json({
      error: 'Failed to update the book',
    });
  }
});

// DELETE /books/:bookId/ - Delete a book
app.delete('/books/:bookId/', async (req, res) => {
  try {
    const result = await db.run(
      'DELETE FROM book WHERE id = ?',
      [req.params.bookId]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Book not found',
      });
    }

    return res.status(200).json({
      message: 'Book deleted successfully',
    });
  } catch (error) {
    console.error('DELETE book error:', error.message);

    return res.status(500).json({
      error: 'Failed to delete the book',
    });
  }
});

// Handle unknown routes
app.use((req, res) => {
  return res.status(404).json({
    error: 'Route not found',
  });
});

// Start the application
initializeDBAndServer();
