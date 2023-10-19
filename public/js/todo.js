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
  orderByChild,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
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

  salvarTarefa();
};

// Função que realiza a exclusão da tarefa no firebase
deletarTarefa = async (key, name, imgURL) => {
  const confirmation = confirm(`Deseja realmente excluir a tarefa "${name}"?`);
  if (confirmation) {
    try {
      await excluirImagemNoStorage(imgURL);
      await remove(child(dbRefUsers, `${getUserUid()}/${key}`));
    } catch (error) {
      showError("Falha ao excluir tarefa", error);
    }
  }
};

// Função que realiza a atualização da tarefa no firebase
atualizarTarefa = async (key, name, imgURL) => {
  habilitarDesabilitarBotaoCancelarAtualizacao(true);
  updateTodoKey = key;
  updateTodoImgURL = imgURL;
  todoFormTitle.innerHTML = `<strong>Editar a tarefa: </strong>${name}`;
  todoForm.name.value = name;

  hideItem(todoFormSubmit);
  showItem(updateTodo);
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
  updateTodoKey = null;
  updateTodoImgURL = null;
  todoFormTitle.innerHTML = `Adicionar tarefa:`;
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
    };

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

const excluirImagemNoStorage = async (imgURL) => {
  if (!imgURL) return;
  try {
    const fileStorageRef = storageRef(storage, imgURL);

    await deleteObject(fileStorageRef);
  } catch (error) {
    showError("Falha ao excluir imagem", error);
  }
};

cancelTodoUpdate = () => {
  clearTodoForm();

  hideItem(updateTodo);
  showItem(todoForm.todoFormSubmit);
};

confirmTodoUpdate = async () => {
  habilitarDesabilitarBotaoCancelarAtualizacao(false);
  salvarTarefa(true);
};

const salvarTarefa = async (isUpdate) => {
  try {
    const name = todoForm.name.value;

    if (!name) throw new Error("Tarefa não pode estar vazia!");

    const file = todoForm.file.files[0];
    let fileURL;

    if (file) {
      if (!file.type.includes("image")) {
        throw new Error("O arquivo selecionado precisa ser uma imagem.");
      }

      const dezMB = 1024 * 1024 * 10;
      if (file.size > dezMB)
        throw new Error("A imagem não pode ter mais que 10MB");

      const imageName = `${new Date().toISOString()}_${file.name}`;
      const imagePath = `todoListFiles/${getUserUid()}/${imageName}`;

      const fileStorageRef = storageRef(storage, imagePath);
      const uploadTask = uploadBytesResumable(fileStorageRef, file);

      fileURL = await uploadTrack(uploadTask);
    }

    const nameLowerCase = name.toLowerCase();
    const imageURL = fileURL || null;
    const data = { name, nameLowerCase, imageURL };

    if (isUpdate) {
      await excluirImagemNoStorage(updateTodoImgURL);
      await update(child(dbRefUsers, `${getUserUid()}/${updateTodoKey}`), data);
    } else {
      await push(child(dbRefUsers, getUserUid()), data);
    }

    clearTodoForm();
    hideItem(updateTodo);
    showItem(todoForm.todoFormSubmit);
  } catch (error) {
    showError("Falha ao salvar tarefa", error);
  }
};
