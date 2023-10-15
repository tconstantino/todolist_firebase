import {
  getDatabase,
  ref,
  child,
  push,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
// import { firebase } from "./firebase";

const database = getDatabase();
const dbRefUsers = ref(database, "users");

todoForm.onsubmit = async (event) => {
  // Evita o redirecionamento da página
  event.preventDefault();
  console.log(dbRefUsers);
  const name = todoForm.name.value;

  if (!name) return alert("Tarefa não pode estar vazia!");

  try {
    const data = { name };
    const user = getAuth().currentUser;

    await push(child(dbRefUsers, user.uid), data);

    todoForm.name.value = '';
  } catch (error) {
    console.log("Error", error);
    showError('Falha ao adicionar tarefa', error);
  }
};
