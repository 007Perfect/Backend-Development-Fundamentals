CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price INTEGER NOT NULL,
  pages INTEGER NOT NULL
);

INSERT OR IGNORE INTO book (id, title, author, price, pages) VALUES
(1, 'The Alchemist', 'Paulo Coelho', 299, 208),
(2, 'Wings of Fire', 'A. P. J. Abdul Kalam', 250, 180),
(3, 'Atomic Habits', 'James Clear', 499, 320),
(4, 'The Hobbit', 'J. R. R. Tolkien', 399, 310),
(5, 'Ikigai', 'Hector Garcia', 299, 194),
(6, 'The Guide', 'R. K. Narayan', 220, 224),
(7, 'Deep Work', 'Cal Newport', 450, 296),
(8, 'Sapiens', 'Yuval Noah Harari', 599, 498),
(9, 'Train to Pakistan', 'Khushwant Singh', 275, 192),
(10, 'Ponniyin Selvan', 'Kalki Krishnamurthy', 550, 240);
