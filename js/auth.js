import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
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
    alert(error.message);
  } finally {
    hideItem(loading);
  }
};

// Função que centraliza e trata a autenticação
onAuthStateChanged(auth, (user) => {
  hideItem(loading);

  if (user) {
    showUserContent(user);
  } else {
    showAuth();
  }
});

// Função que permite o usuário sair da conta dele
deslogar = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    alert(error.message);
  }
};

// Função que permite o usuário fazer a verificação do e-mail dele
enviarEmailDeVerificacao = async () => {
  showItem(loading);
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    await sendEmailVerification(user);

    alert(`E-mail de verificação foi enviado para ${user.email}!
    \nVerifique sua caixa de entrada`);
  } catch (error) {
    alert(error.message);
  } finally {
    hideItem(loading);
  }
};
