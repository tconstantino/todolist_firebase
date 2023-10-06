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
  console.log(user);
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
