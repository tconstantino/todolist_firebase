import {
  getDatabase,
  ref,
  child,
  push,
  remove,
  update,
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

    await push(child(dbRefUsers, getUserUid()), data);

    todoForm.name.value = '';
  } catch (error) {
    showError('Falha ao adicionar tarefa', error);
  }
};

// Função que realiza a exclusão da tarefa no firebase
deletarTarefa = async (key, name) => {
  const confirmation = confirm(`Deseja realemnte excluir a tarefa "${name}"?`);
  if(confirmation) {
    try {
      await remove(child(dbRefUsers, `${getUserUid()}/${key}`));
    } catch (error) {
      showError('Falha ao excluir tarefa', error);
    }
  }
}

// Função que realiza a atualização da tarefa no firebase
atualizarTarefa = async (key, name) => {
  const newTaskName = prompt('Informe o novo nome para a tarefa.', name);

  if (!newTaskName) return alert("Nome da tarefa não pode estar vazio!");

  try {
    const data = { name:  newTaskName };
    
    await update(child(dbRefUsers, `${getUserUid()}/${key}`), data);
  } catch (error) {
    showError('Falha ao atualizar tarefa', error);
  }
}
