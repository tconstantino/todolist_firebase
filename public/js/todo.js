import {
  getDatabase,
  ref,
  child,
  push,
  remove,
  update,
  get,
  startAt,
  endAt,
  query,
  orderByValue,
  orderByChild,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
import { auth } from "./auth.js";

const database = getDatabase();
const storage = getStorage();
const dbRefUsers = ref(database, "users");

const getUserUid = () => {
  return auth.currentUser.uid;
};

todoForm.onsubmit = async (event) => {
  // Evita o redirecionamento da página
  event.preventDefault();

  const name = todoForm.name.value;

  if (!name)
    return showError(
      "Falha ao cadastrar tarefa",
      new Error("Tarefa não pode estar vazia!")
    );

  const file = todoForm.file.files[0];
  if (file && file.type.includes("image")) {
    const imageName = `${new Date().toISOString()}_${file.name}`;
    const imagePath = `todoListFiles/${getUserUid()}/${imageName}`;

    const fileStorageRef = storageRef(storage, imagePath);
    const uploadTask = uploadBytesResumable(fileStorageRef, file);

    uploadTrack(uploadTask);
  } else {
    return showError(
      "Falha ao cadastrar tarefa",
      new Error("O arquivo selecionado precisa ser uma imagem.")
    );
  }

  try {
    const nameLowerCase = name.toLowerCase();
    const data = { name, nameLowerCase };

    await push(child(dbRefUsers, getUserUid()), data);
  } catch (error) {
    showError("Falha ao adicionar tarefa", error);
  }
};

// Função que realiza a exclusão da tarefa no firebase
deletarTarefa = async (key, name) => {
  const confirmation = confirm(`Deseja realemnte excluir a tarefa "${name}"?`);
  if (confirmation) {
    try {
      await remove(child(dbRefUsers, `${getUserUid()}/${key}`));
    } catch (error) {
      showError("Falha ao excluir tarefa", error);
    }
  }
};

// Função que realiza a atualização da tarefa no firebase
atualizarTarefa = async (key, name) => {
  const newTaskName = prompt("Informe o novo nome para a tarefa.", name);

  if (!newTaskName) return alert("Nome da tarefa não pode estar vazio!");

  try {
    const nameLowerCase = newTaskName.toLowerCase();
    const data = { name: newTaskName, nameLowerCase };

    await update(child(dbRefUsers, `${getUserUid()}/${key}`), data);
  } catch (error) {
    showError("Falha ao atualizar tarefa", error);
  }
};

buscar = async () => {
  const user = auth.currentUser;
  const filtro = search.value.toLowerCase();
  const snapshot = await get(
    query(
      child(dbRefUsers, user.uid),
      orderByChild("nameLowerCase"),
      startAt(filtro),
      endAt(filtro + "utf8ff")
    )
  );

  fillTodoList(snapshot, snapshot.size);
};

const clearTodoForm = () => {
  todoForm.name.value = "";
  todoForm.file.value = null;
  progressPercentual.innerHTML = "";
};

const uploadTrack = (uploadTask) => {
  const uploadProgress = (snapshot) => {
    const uploadProgress =
      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

    showItem(progressFeedback);
    progress.value = uploadProgress;
    progressPercentual.innerHTML = Math.round(uploadProgress) + "%";
  };

  const uploadError = (error) => showError("Falha no upload", error);

  const uploadCompleted = async () => {
    const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
    hideItem(progressFeedback);
    clearTodoForm();
    
    console.log("file URL", fileURL);
  };

  uploadTask.on("state_changed", uploadProgress, uploadError, uploadCompleted);
};
