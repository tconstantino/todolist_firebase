import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const auth = getAuth();

// Função que trata a submissão do formulário de autenticação
authForm.onsubmit = async (event) => {
  showItem(loading);

  const email = authForm.email.value;
  const password = authForm.password.value;
  const passwordConfirm = authForm.passwordConfirm.value;

  event.preventDefault();

  try {
    if (authForm.authFormSubmit.innerHTML == "Acessar") {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      if (password !== passwordConfirm) {
        throw new Error("Senha e Confirmação da senha estão diferentes!");
      }

      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Cadastro realizado com sucesso");
      console.log(user);
    }
  } catch (error) {
    console.log("Erro ao realizar operação");
    console.log(error);
    alert(error.message);
    hideItem(loading);
  }
};

// Função que centraliza e trata a autenticação
onAuthStateChanged(auth, (user) => {
  hideItem(loading);

  if(user) {
    showUserContent(user);
  } else {
    showAuth();
  }
});

// Função que permite o usuário sair da conta dele
deslogar = async () => {
  try {
    await signOut(auth)
  } catch(error) {
    alert(error.message);
  }
}