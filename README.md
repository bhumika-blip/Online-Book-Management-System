# Online Book Management System

A simple practical application built using Node.js, Express.js, HTML, CSS and JavaScript Fetch API.

## Requirements
- Node.js and npm installed
- VS Code (recommended)

## Run the project

1. Extract `online-book-management-system.zip`.
2. Open the extracted `online-book-management-system` folder in VS Code.
3. Open the VS Code terminal: **Terminal > New Terminal**.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the server:

   ```bash
   npm start
   ```

6. Open this address in your browser:

   http://localhost:3000

Keep the terminal running while using the website. Press `Ctrl + C` in the terminal to stop the server.

## API routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get one book by ID |
| POST | `/books` | Add a book |
| PUT | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |

## Book fields
- `id`
- `title`
- `author`
- `price`

## Note
This practical uses an in-memory JavaScript array, so newly added, updated or deleted books are reset to the sample data when the server restarts. No database is required for this version.
