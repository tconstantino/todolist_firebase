import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const auth = getAuth();
auth.languageCode = "pt-BR";

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
  console.log(user)
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
    const user = auth.currentUser;
    await sendEmailVerification(user, actionCodeSettings);

    alert(
      `E-mail de verificação foi enviado para ${user.email}!\nVerifique sua caixa de entrada`
    );
  } catch (error) {
    alert(error.message);
  } finally {
    hideItem(loading);
  }
};

//Função que permite a redefinição de senha do usuário
enviarEmailDeResetDeSenha = async () => {
  showItem(loading);
  try {
    const email = prompt("Informe seu e-mail cadastrado no TodoList_firebase");
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    alert(
      `Caso tenha conta cadastrada, um e-mail de redefinição de senha enviado para ${email}`
    );
  } catch (error) {
    alert(error.message);
  } finally {
    hideItem(loading);
  }
};

// Função que permite a autenticação pelo Google
loginComGoogle = async () => {
  showItem(loading);
  try {
    const googleProvider = new GoogleAuthProvider();
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.log(error)
    alert(error.message);
  } finally {
    hideItem(loading);
  }
};

// Função que permite a autenticação pelo Facebook
loginComFacebook = async () => {
  showItem(loading);
  try {
    const facebookAuthProvider = new FacebookAuthProvider();
    await signInWithRedirect(auth, facebookAuthProvider);
  } catch (error) {
    alert(error.message);
  } finally {
    hideItem(loading);
  }
};

// Função que permite a autenticação pelo Github
loginComGithub = async () => {
  showItem(loading);
  try {
    const githubAuthProvider = new GithubAuthProvider();
    await signInWithRedirect(auth, githubAuthProvider);
  } catch (error) {
    console.log(error)
    alert(error.message);
  } finally {
    hideItem(loading);
  }
};
