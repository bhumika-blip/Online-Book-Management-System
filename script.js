const API_URL = "/books";

const bookForm = document.getElementById("bookForm");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const priceInput = document.getElementById("price");
const booksTable = document.getElementById("booksTable");
const message = document.getElementById("message");
const formHeading = document.getElementById("formHeading");
const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");
const refreshButton = document.getElementById("refreshButton");

let editingId = null;

function showMessage(text, type = "success") {
  message.textContent = text;
  message.className = `message ${type}`;
}

function clearForm() {
  bookForm.reset();
  editingId = null;
  formHeading.textContent = "Add a Book";
  submitButton.textContent = "Add Book";
  cancelButton.classList.add("hidden");
}

async function loadBooks() {
  booksTable.innerHTML = '<tr><td colspan="5" class="empty">Loading books...</td></tr>';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Could not retrieve books.");
    const books = await response.json();

    if (books.length === 0) {
      booksTable.innerHTML = '<tr><td colspan="5" class="empty">No books available. Add a book above.</td></tr>';
      return;
    }

    booksTable.innerHTML = "";
    books.forEach((book) => {
      const row = document.createElement("tr");

      const values = [book.id, book.title, book.author, `₹${Number(book.price).toFixed(2)}`];
      values.forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      const actions = document.createElement("td");
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.className = "small secondary";
      editButton.addEventListener("click", () => startEdit(book));

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "small danger";
      deleteButton.addEventListener("click", () => deleteBook(book.id));

      actions.append(editButton, deleteButton);
      row.appendChild(actions);
      booksTable.appendChild(row);
    });
  } catch (error) {
    booksTable.innerHTML = '<tr><td colspan="5" class="empty">Unable to load books. Check whether the server is running.</td></tr>';
    showMessage(error.message, "error");
  }
}

function startEdit(book) {
  editingId = book.id;
  titleInput.value = book.title;
  authorInput.value = book.author;
  priceInput.value = book.price;
  formHeading.textContent = `Update Book #${book.id}`;
  submitButton.textContent = "Save Changes";
  cancelButton.classList.remove("hidden");
  titleInput.focus();
}

bookForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const bookData = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    price: Number(priceInput.value)
  };

  const isEditing = editingId !== null;
  const url = isEditing ? `${API_URL}/${editingId}` : API_URL;
  const method = isEditing ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData)
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.message || "Request failed.");

    showMessage(result.message);
    clearForm();
    await loadBooks();
  } catch (error) {
    showMessage(error.message, "error");
  }
});

async function deleteBook(id) {
  if (!confirm("Are you sure you want to delete this book?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Could not delete book.");

    showMessage(result.message);
    if (editingId === id) clearForm();
    await loadBooks();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

cancelButton.addEventListener("click", clearForm);
refreshButton.addEventListener("click", loadBooks);

loadBooks();
