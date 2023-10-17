import {
  getDatabase,
  ref,
  child,
  push,
  get,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { auth } from "./auth.js"

const database = getDatabase();
const dbRefUsers = ref(database, "users");

const getUserUid = () => {
  return auth.currentUser ? auth.currentUser.uid : '';
}

todoForm.onsubmit = async (event) => {
  // Evita o redirecionamento da página
  event.preventDefault();
  const name = todoForm.name.value;

  if (!name) return alert("Tarefa não pode estar vazia!");

  try {
    const data = { name };
    console.log('Tentando salvar', getUserUid());
    await push(child(dbRefUsers, getUserUid()), data);

    todoForm.name.value = '';
  } catch (error) {
    console.log("Error", error);
    showError('Falha ao adicionar tarefa', error);
  }
};

