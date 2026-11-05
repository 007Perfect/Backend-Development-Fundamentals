# Lab 3: REST API, query parameters, validation, debugging

**Name:** Replace with your name  
**Registration number:** Replace with your registration number  
**Section:** Replace with your section  

**Live link:** Add your deployed public URL after deployment.

## Objective
Turn the Lab 2 book routes into a REST API with search, sorting, price filtering, pagination, validation, correct status codes and debugging practice.

## Requirements
- Node.js and npm
- SQLite database
- Postman

## Install and run
```powershell
npm install
npm run dev
```
For normal start:
```powershell
npm start
```

## Environment variables
- `PORT` — server port. Local default: 3000.
- `DB_PATH` — optional full path to the SQLite database file. Local default: `books.db` in this folder.
Do not put real secrets in this README. Do not commit `.env`.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | API health check |
| GET | `/books` | List books with search, sort, price filters and pagination |
| GET | `/books/:bookId` | Get one book |
| POST | `/books` | Create a book |
| PUT | `/books/:bookId` | Update a book |
| DELETE | `/books/:bookId` | Delete a book |

### GET /books query parameters
- `search_q` — partial title search; default empty string.
- `order_by` — one of `id`, `title`, `author`, `price`, `pages`; default `id`.
- `order` — `ASC` or `DESC`; default `ASC`.
- `limit` — integer 1–100; default `10`.
- `offset` — non-negative integer; default `0`.
- `min_price` — optional non-negative number.
- `max_price` — optional non-negative number.

Example:
`/books?search_q=atomic&order_by=price&order=DESC&limit=5&offset=0&min_price=100&max_price=500`

## Postman test list
Add screenshots proving successful and failure cases:
1. GET `/books` — 200.
2. GET `/books?search_q=atomic` — 200, filtered title.
3. GET `/books?order_by=price&order=DESC` — 200, descending price.
4. GET `/books?limit=3&offset=0` — 200, maximum 3 records.
5. GET `/books?min_price=200&max_price=400` — 200, price range.
6. GET `/books/1` — 200 if ID 1 exists.
7. GET `/books/99999` — 404 if that ID does not exist.
8. POST `/books` with valid JSON — 201.
9. POST `/books` without title — 400.
10. POST `/books` with non-numeric price — 400.
11. PUT `/books/1` with valid JSON — 200 if ID 1 exists.
12. PUT `/books/99999` — 404 if ID does not exist.
13. DELETE `/books/<existing-id>` — 200.
14. DELETE `/books/99999` — 404 if ID does not exist.
15. GET `/not-a-route` — 404.

POST/PUT JSON example:
```json
{
  "title": "Test Book",
  "author": "Test Author",
  "price": 250,
  "pages": 150
}
```

## Screenshots
Place your own screenshots in `screenshots/` and embed them below:
- `![GET all books](screenshots/get-all-books.png)`
- `![Search and filters](screenshots/search-filters.png)`
- `![POST success](screenshots/post-success.png)`
- `![Validation error](screenshots/validation-error.png)`
- `![PUT success](screenshots/put-success.png)`
- `![DELETE success](screenshots/delete-success.png)`
- `![404 response](screenshots/not-found.png)`

## Debugging practice
Record the actual problem, the cause and how you fixed it:
- `EADDRINUSE`: another process is already using the port. Stop the other server or choose a free port.
- Wrong import path: check spelling and relative path; install the required package if it is missing.
- `no such table`: verify the database file path and exact table name (`book`).
- Missing `await`: await asynchronous database operations before using their result.

## Notes: problems faced and solutions
Write your own short notes about the errors you actually encountered and how you fixed them.
