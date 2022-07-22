// Book class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class
class UI {
  constructor() {}

  addBookToList(book) {
    // Getting table list
    const list = document.getElementById('book-list');

    // Creating table row
    const row = document.createElement('tr');

    // Adding book details inside table row
    row.innerHTML = `
                      <td>
                        ${book.title}
                      </td>
                      <td>
                        ${book.author}
                      </td>
                      <td>
                        ${book.isbn}
                      </td>
                      <td>
                        <a class="delete" href="#">
                          <i class="fa fa-remove"></i>
                        </a>
                      </td>
                    `;

    // Adding table row inside table list
    list.appendChild(row);
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }

  showAlert(message, color) {
    // Getting parent container div
    const container = document.querySelector('.container');

    // Getting the book form
    const bookForm = document.getElementById('book-form');

    // Creating alert
    const alert = document.createElement('p');

    // Setting class name for alert
    alert.className = color === 'red' ? 'error' : 'success';

    // Adding text content to the alert
    alert.textContent = message;

    // Inserting the alert before the book form
    container.insertBefore(alert, bookForm);

    // Removing alert after 3s
    setTimeout(function () {
      container.removeChild(alert);
    }, 3000);
  }

  addBookToLocalStorage(book) {
    // Books arr
    let books;

    // Checking whether books exist in the local storage
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    // Adding the book to book list
    books.push(book);

    // Setting the local storage with updated book arr
    localStorage.setItem('books', JSON.stringify(books));
  }

  deleteBookFromList(target) {
    // Checking whether selected element contains delete link class
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  deleteBookFromLocalStorage(target) {
    // target - link tag

    // Getting isbn to remove the book from the local storage
    const isbn = target.parentElement.previousElementSibling.textContent.trim();

    // Checking books exist in local storage
    if (localStorage.getItem('books') !== null) {
      // Getting books from the local storage
      const books = JSON.parse(localStorage.getItem('books'));

      // Removing book which matches book
      books.forEach(function (book, index) {
        if (book.isbn === isbn) {
          books.splice(index, 1);
        }
      });

      // Setting the updated book to local storage
      localStorage.setItem('books', JSON.stringify(books));
    }
  }
}

// Event listener
document.addEventListener('DOMContentLoaded', function () {
  // Checking whether books exist in local storage
  if (localStorage.getItem('books') !== null) {
    // Getting books from local storage
    const books = JSON.parse(localStorage.getItem('books'));

    // Instance of ui
    const ui = new UI();

    // Looping through each book and adding to UI table list
    books.forEach(function () {
      ui.addBookToList(book);
    });
  }
});

document.getElementById('book-form').addEventListener('submit', function (e) {
  // Form field values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

  // Creating instance of Book class
  const book = new Book(title, author ,isbn);  

  // Creating instance of UI class
  const ui = new UI();

  // Checking whether all fields have value
  if(title.trim() === '' || author.trim() === '' || isbn.trim() === ''){
    ui.showAlert('Invalid details, Please recheck the inputs!', 'red');  
  }else{
    // Add book to ui list
    ui.addBookToList(book);
    
    // Add book to local storage
    ui.addBookToLocalStorage(book);

    // Show alert after successfully added the book
    ui.showAlert('Book added to the book list', 'green');

    // Clear fields
    ui.clearFields();
  }

  // Prevent default behavior
  e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', function(){
  // Creating instance of ui
  const ui = new UI();

  // Link which contains the delete icon
  const deleteLink = e.target.parentElement;

  // Delete the book from table list
  ui.deleteBookFromList(deleteLink);

  // Delete the book from local storage
  ui.deleteBookFromLocalStorage(deleteLink);

  // Show Alert
  ui.showAlert('Book deleted successfully', 'green');

  // Prevents the default actions of html elements
  e.preventDefault();
});
