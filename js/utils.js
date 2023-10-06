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

// Alterar o formulário de autenticação para o cadastro de novas contas
function toggleToRegister() {
  authForm.authFormSubmit.innerHTML = "Cadastrar conta";
  authFormTitle.innerHTML = "Insira seus dados para se cadastrar";

  hideItem(register);
  showItem(access);
  showItem(passwordConfirm);
}

// Alterar formulário para o acesso de contas já existentes
function toggleToAccess() {
  authForm.authFormSubmit.innerHTML = "Acessar";
  authFormTitle.innerHTML = "Acesse sua conta para continuar";

  hideItem(access);
  hideItem(passwordConfirm);
  showItem(register);
}

// Simplifica a exibição de elementos da página
function showItem(item) {
  if (item.style.display == "flex") {
    item.hidden = false;
  } else {
    item.style.display = "block";
    item.classList.remove("startHidden");
  }
}

// Simplifica a remoção de elementos da página
function hideItem(item) {
  if (item.style.display == "flex") {
    item.hidden = true;
  } else {
    item.style.display = "none";
  }
}

// Variável que recebe a função de deslogar dentro do arquivo firebase.js
var deslogar;

// Mostrar conteúdo para usuários autenticados
function showUserContent(user) {
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
