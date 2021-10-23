'use strict';
import { initializeApp } from 'firebase/app';
import config from './firebase-config.js';
import { getFirestore, collection, getDocs, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore/lite';


const app = initializeApp(config);
const db = getFirestore(app);
// const library = collection(db, "library");
// const fetchLibrary = await getDocs(library);
// fetchLibrary.forEach((doc) => {
//   console.log(doc.data());
// })
// const defaultItem = doc(db, "library", "default");
// const item = await getDoc(defaultItem);
// console.log(item.data());
const pushData = async(data) => {
  myLibrary = [];
  await setDoc(doc(db, 'library', data.title), { 
    title: data.title,
    author: data.author,
    pages: data.pages,
    read: data.read,
  });
}

const fetchData = async() => {
  const library = await getDocs(collection(db, 'library'))
      await library.forEach((doc) => {
        const data = doc.data();
        addBook(data.title, data.author, data.pages, data.checked);
      });
}

const container = document.querySelector(".container");
const card = document.querySelector(".card");
//modal selectors
const openModal = document.querySelector(".open-modal");
const modalContainer = document.querySelector(".modal-container");
const closeModal = document.querySelector(".close-modal");
const deleteBook = document.querySelector(".delete-book");
//get input values + add book on submission
document.getElementById("form").onsubmit = async function(e) {
  e.preventDefault();
  const formTitle = document.getElementById("title").value;
  const formAuthor = document.getElementById("author").value;
  const formPages = document.getElementById("pages").value;
  const formReadStatus = document.getElementById("readStatus").value;
  const data = {
    title: formTitle,
    author: formAuthor,
    pages: formPages,
    read: formReadStatus,
  };
  await pushData(data);
  await fetchData();
  await appendBooks();
  container.innerHTML = "";
    modalContainer.classList.remove('show');
    console.log(myLibrary);
}
// modal 
openModal.addEventListener("click", () => modalContainer.classList.add('show'));
closeModal.addEventListener("click", () => modalContainer.classList.remove('show'));
modalContainer.addEventListener("click", (e) => {
  if (e.target === modalContainer) modalContainer.classList.remove('show');
});
//delete card on click + toggle readStatus
container.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-book")) {
    const cardIndex = e.target.parentNode.dataset.index;
    myLibrary.splice(cardIndex, 1);
    e.target.parentNode.remove();
  };
  if (e.target.matches("input")) {
    const cardIndex = e.target.parentNode.parentNode.dataset.index;
    if (e.target.checked) {
      e.target.parentNode.parentNode.classList.toggle("checked");
      myLibrary[cardIndex].read = "checked";
    } else { 
      myLibrary[cardIndex].read = "";
      e.target.parentNode.parentNode.classList.toggle("checked");
    };
  };
})
//toggle read status on click
//main logic
let myLibrary = [];
class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
  info() { 
    return `${this.title} by ${this.author}, ${this.pages}, ${this.read}`
  }
}
function addBook(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
}
function appendBooks() {
  myLibrary.forEach(book => { 
    let html = `
    <div class="card ${book.read}" data-index="${myLibrary.indexOf(book)}">
      <span class="delete-book">&times;</span>
    <h4>${book.title}</h4>
    <ul>
      <li>Author: ${book.title}</li>
      <li>Pages: ${book.pages}</li>
    </ul>
    <label>
      Read status:<input type="checkbox" name="read" ${book.read}>
    </label>
  </div>
    `
  container.innerHTML += html })
}

await fetchData();
appendBooks();





