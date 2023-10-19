// Definido referências para elementos da página
var authForm = document.getElementById("authForm");
var authFormTitle = document.getElementById("authFormTitle");
var register = document.getElementById("register");
var access = document.getElementById("access");
var passwordConfirm = document.getElementById("authFormPassordConfirm");
var loading = document.getElementById("loading");
var authContent = document.getElementById("auth");
var userContent = document.getElementById("userContent");
var userEmail = document.getElementById("userEmail");
var emailVerified = document.getElementById("emailVerified");
var sendEmailVerificationPanel = document.getElementById(
  "sendEmailVerificationPanel"
);
var passwordReset = document.getElementById("passwordReset");
var userImg = document.getElementById("userImg");
var userName = document.getElementById("userName");
var todoCount = document.getElementById("todoCount");
var tasksTodoList = document.getElementById("tasksTodoList");
var search = document.getElementById("search");
var progressFeedback = document.getElementById("progressFeedback");
var progress = document.getElementById("progress");
var progressPercentual = document.getElementById("progressPercentual");
var playPauseUpload = document.getElementById("playPauseUpload");
var cancelUpload = document.getElementById("cancelUpload");

// Alterar o formulário de autenticação para o cadastro de novas contas
function toggleToRegister() {
  authForm.authFormSubmit.innerHTML = "Cadastrar conta";
  authFormTitle.innerHTML = "Insira seus dados para se cadastrar";

  hideItem(register);
  showItem(access);
  showItem(passwordConfirm);
  hideItem(passwordReset);
}

// Alterar formulário para o acesso de contas já existentes
function toggleToAccess() {
  authForm.authFormSubmit.innerHTML = "Acessar";
  authFormTitle.innerHTML = "Acesse sua conta para continuar";

  hideItem(access);
  hideItem(passwordConfirm);
  showItem(register);
  showItem(passwordReset);
}

// Simplifica a exibição de elementos da página
function showItem(item) {
  item.style.display = item.getAttribute("display") || "block";
  item.classList.remove("startHidden");
}

// Simplifica a remoção de elementos da página
function hideItem(item) {
  item.hidden = true;
  item.style.display = "none";
}

// Variável que recebe a função de deslogar dentro do arquivo firebase.js
var deslogar;

// Mostrar conteúdo para usuários autenticados
function showUserContent(user) {
  if (user.emailVerified || user.providerData[0].providerId !== "password") {
    emailVerified.innerHTML = "E-mail verificado";
    hideItem(sendEmailVerificationPanel);
  } else {
    emailVerified.innerHTML = "E-mail não verificado";
    showItem(sendEmailVerificationPanel);
  }

  userImg.src = user.photoURL || "./img/unknownUser.png";
  userName.innerHTML = user.displayName;
  userEmail.innerHTML = user.email;
  hideItem(authContent);
  showItem(userContent);
}

// Mostrar conteúdo para usuários não autenticados
function showAuth() {
  authForm.email.value = "";
  authForm.password.value = "";
  authForm.passwordConfirm.value = "";
  hideItem(userContent);
  showItem(authContent);
}

// Variável que recebe a função de sendEmailVerification do firebase
var enviarEmailDeVerificacao;

// Atributos extras de configuração de e-mail
var actionCodeSettings = {
  url: "http://127.0.0.1:5500",
};

// Variável que recebe a função de reset de email do firebase
var enviarEmailDeResetDeSenha;

// Variável que reebe a função de autenticação pelo Google
var loginComGoogle;

// Variável que recebe a função de autenticação pelo Facebook
var loginComFacebook;

// Variável que recebe a função de autenticação pelo Github
var loginComGithub;

// Variável que recebe a função de atualizar nome do usuário no firebase
var atualizarNomeUsuario;

// Variável que recebe a função de excluir conta de usuário no firebase
var excluirConta;

// Objeto de mapeamento de erros
var errorMap = {
  "auth/invalid-email": "E-mail e/ou senha inválidos",
  "auth/wrong-password": "E-mail e/ou senha inválidos",
  "auth/invalid-login-credentials": "E-mail e/ou senha inválidos",
  "auth/weak-password": "Senha deve ter pelo menos 6 caracteres",
  "auth/email-already-in-use": "E-mail já está em uso por outra conta",
  "auth/popup-closed-by-user":
    "O popup de autenticação foi fechado antes da operação ser concluída",
  "PERMISSION_DENIED": "Acesso não permitido!!!",
  "storage/canceled": "Upload cancelado pelo usuário",
};

// Função que centraliza e traduz os erros no firebase
function showError(context, error) {
  console.log(error);
  console.log("code", error.code);

  const mensagemDeErro =
    error.code && errorMap[error.code] ? errorMap[error.code] : error.message;

  alert(`${context}: ${mensagemDeErro}`);
}

// Exibe a lista de tarefas do usuário
var fillTodoList = (dados, qtd) => {
  tasksTodoList.innerHTML = "";
  todoCount.innerHTML = `${qtd} tarefa(s)`;
  dados.forEach((dado) => {
    const tarefa = dado.val();
    const li = document.createElement("li");
    const span = document.createElement("span");

    const deleteButton = document.createElement("button");
    deleteButton.appendChild(document.createTextNode("Excluir"));
    deleteButton.setAttribute(
      "onclick",
      `deletarTarefa('${dado.key}', '${tarefa.name}')`
    );
    deleteButton.setAttribute("class", "danger todoButton");

    const editButton = document.createElement("button");
    editButton.appendChild(document.createTextNode("Editar"));
    editButton.setAttribute(
      "onclick",
      `atualizarTarefa('${dado.key}', '${tarefa.name}')`
    );
    editButton.setAttribute("class", "alternative todoButton");

    span.appendChild(document.createTextNode(tarefa.name));
    li.appendChild(span);
    li.appendChild(deleteButton);
    li.appendChild(editButton);
    tasksTodoList.appendChild(li);
  });
};

// Variável que recebe a função de excluir no firebase
var deletarTarefa;

// Variável que recebe a função de atualizar no firebase
var atualizarTarefa;

// Variável que recebe a função de busca no firebase
var buscar;
