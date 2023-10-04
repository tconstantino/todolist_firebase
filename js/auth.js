import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

authForm.onsubmit = (event) => {
  const auth = getAuth();
  const email = authForm.email.value;
  const password = authForm.password.value;

  event.preventDefault();
  if (authForm.authFormSubmit.innerHTML == "Acessar") {
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log("Login realizado com sucesso");
        console.log(user);
      })
      .catch((err) => {
        console.log("Erro ao realizar o login");
        console.log(err);
      });
  } else {
    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log("Cadastro realizado com sucesso");
        console.log(user);
      })
      .catch((err) => {
        console.log("Erro ao realizar o cadastro");
        console.log(err);
      });
  }
};
