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

  try {
    const file = todoForm.file.files[0];
    let fileURL;

    if (file) {
      if (!file.type.includes("image")) {
        return showError(
          "Falha ao cadastrar tarefa",
          new Error("O arquivo selecionado precisa ser uma imagem.")
        );
      }
      const imageName = `${new Date().toISOString()}_${file.name}`;
      const imagePath = `todoListFiles/${getUserUid()}/${imageName}`;

      const fileStorageRef = storageRef(storage, imagePath);
      const uploadTask = uploadBytesResumable(fileStorageRef, file);

      fileURL = await uploadTrack(uploadTask);
    }

    const nameLowerCase = name.toLowerCase();
    const data = { name, nameLowerCase };

    if (fileURL) data.imageURL = fileURL;

    await push(child(dbRefUsers, getUserUid()), data);

    clearTodoForm();
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
  return new Promise((resolve, reject) => {
    let uploadIsPaused = false;

    const uploadProgress = (snapshot) => {
      const uploadProgress =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      showItem(progressFeedback);
      progress.value = uploadProgress;
      progressPercentual.innerHTML = Math.round(uploadProgress) + "%";
    };

    const uploadError = (error) => {
      hideItem(progressFeedback);
      reject(error);
    };

    const uploadCompleted = async () => {
      const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
      hideItem(progressFeedback);
      resolve(fileURL);
    };

    uploadTask.on(
      "state_changed",
      uploadProgress,
      uploadError,
      uploadCompleted
    );

      const pausarUpload = () => {
        uploadTask.pause();
        uploadIsPaused = true;
        playPauseUpload.innerHTML = "Continuar";
      };

      const continuarUpload = () => {
        uploadTask.resume();
        uploadIsPaused = false;
        playPauseUpload.innerHTML = "Pausar";
      }


    playPauseUpload.onclick = () => {
      if (uploadIsPaused) continuarUpload();
      else pausarUpload();
    };

    cancelUpload.onclick = () => {
      continuarUpload();
      uploadTask.cancel(); 
    };
  });
};
