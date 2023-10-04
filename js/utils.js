// Definido referências para elementos da página
var authForm = document.getElementById('authForm');
var authFormTitle = document.getElementById('authFormTitle');
var register = document.getElementById('register');
var access = document.getElementById('access');
var passwordConfirm = document.getElementById('authFormPassordConfirm');

// Alterar o formulário de autenticação para o cadastro de novas contas
function toggleToRegister() {
    authForm.authFormSubmit.innerHTML = 'Cadastrar conta';
    authFormTitle.innerHTML = 'Insira seus dados para se cadastrar';

    hideItem(register);
    showItem(access);
    showItem(passwordConfirm);
}

// Alterar formulário para o acesso de contas já existentes
function toggleToAccess() {
    authForm.authFormSubmit.innerHTML = 'Acessar';
    authFormTitle.innerHTML = 'Acesse sua conta para continuar';

    hideItem(access);
    hideItem(passwordConfirm);
    showItem(register);
}

// Simplifica a exibição de elementos da página
function showItem(item) {
    item.style.display = 'flex';
    item.classList.remove('startHidden');
}

// Simplifica a remoção de elementos da página
function hideItem(item) {
    item.style.display = 'none';
}