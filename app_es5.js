// Book constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI contructor
function UI() {}

// Add book to ui list
UI.prototype.addBookToList = function (book) {
  // List
  const list = document.getElementById('book-list');

  // Creating tr elements
  const row = document.createElement('tr');
  row.innerHTML =`
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
                `
  
  // Appending table row to list
  list.appendChild(row);
  
  // Returning 1 for success
  return 1;
};

// Clear the fields after book added to both table list and local storage
UI.prototype.clearFields = function(){
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
}

// Alert 
UI.prototype.showAlert = function (message, color) {
  // Getting the parent container div
  const container = document.querySelector('.container');

  // Getting the book form
  const bookForm = document.getElementById('book-form');

  // Creating alert
  const alert = document.createElement('p');

  // Setting classes for alert based on the color
  alert.className = color === 'red' ? 'error' : 'success';

  // Adding the text content into the alert
  alert.textContent = message;

  // Inserting the alert before the book form
  container.insertBefore(alert, bookForm);

  // Removing the alert after 3s
  setTimeout(function () {
    container.removeChild(alert);
  }, 3000);
};

UI.prototype.addToLocalStorage = function(book){
  // Books arr
  let books;

  // Checking whether books exist or not in local storage
  if(localStorage.getItem('books') === null){
    books = [];
  }else{
    // Getting books from local storage
    books = JSON.parse(localStorage.getItem('books'))
  }

  // Adding book to the books list
  books.push(book);

  // Setting local storage
  localStorage.setItem('books', JSON.stringify(books));

  // Returning 1 for success
  return 1;
}

// Delete the book from table list
UI.prototype.deleteBookFromList = function(target){
  if(target.className === 'delete'){
    // Getting table row element (target - Link tag)
    const row = target.parentElement.parentElement;

    // Removing the book from the table list
    row.remove();
  }

  // Return 1 for success
  return 1;
}

// Delete the book from local storage
UI.prototype.deleteBookFromLocalStorage = function(target){
  // (target - Link tag)

  // Getting isbn to remove from the local storage
  const isbn = target.parentElement.previousElementSibling.textContent.trim();

  // Getting books in the local storage
  const books = JSON.parse(localStorage.getItem('books'));

  // Removing the book which matches isbn
  books.forEach(function(book, index){
    if(book.isbn == isbn){
      books.splice(index, 1);
    }
  });

  // Setting the updated books list to local storage
  localStorage.setItem('books', JSON.stringify(books));
  
  // Return 1 for success
  return 1;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function(){
  if(localStorage.getItem('books') !== null){
    // Getting books from local storage
    let books = JSON.parse(localStorage.getItem('books'));
    
    // Looping through each book and adding to the UI list
    books.forEach(function(book){
      // List
      const list = document.getElementById('book-list');

      // Creating table row element 
      const row = document.createElement('tr');
      
      // Adding book details inside the table list
      row.innerHTML =`
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
                    `

      // Append table row to the table list
      list.appendChild(row);
    });
  }
});

document.getElementById('book-form').addEventListener('submit', function (e) {
  // Form fields values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

  // Creating/Instasiating book object
  const book = new Book(title, author, isbn);

  // Creating/Instasiating UI object
  const ui = new UI();

  // Checking whether all fields have values
  if (title.trim() === '' || author.trim() === '' || isbn.trim() === '') {
    ui.showAlert('Invalid details, Please recheck the inputs!', 'red');
  }else{
    // Add book to ui list
    const hasBookAddedToList = ui.addBookToList(book);
    const hasBookAddedToLocalStorage = ui.addToLocalStorage(book);
  
    // Showing alert after successfully added the book
    if (hasBookAddedToList === 1 && hasBookAddedToLocalStorage === 1) {
      ui.showAlert('Book added to the book list', 'green');
    }

    // Clearing all the fields
    ui.clearFields();
  }

  // Prevents from refreshing after submit
  e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', function (e) {
  // Creating/Instasiating UI object
  const ui = new UI();

  // Link which contains the delete icon
  const deleteLink = e.target.parentElement; 

  // Delete the book 
  const hasBookDeletedFromList = ui.deleteBookFromList(deleteLink);

  // Delete the book from local storage
  const hasBookDeletedFromLocalStorage = ui.deleteBookFromLocalStorage(deleteLink);

  // Checking whether book deleted in both list and local storage
  if(hasBookDeletedFromList === 1 && hasBookDeletedFromLocalStorage === 1){
    ui.showAlert('Book deleted successfully', 'green');
  }

  // Prevents the default actions of html element
  e.preventDefault();
});
