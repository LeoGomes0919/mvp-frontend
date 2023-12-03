const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const button = document.getElementById('submit');
const userError = document.getElementById('user-error');
const passError = document.getElementById('pass-error');

userError.innerText = '';
passError.innerText = '';

inputEmail.addEventListener('focus', () => {
  inputEmail.classList.remove('input--error');
  inputEmail.classList.remove('input--success');
  userError.innerText = '';
});

inputPassword.addEventListener('focus', () => {
  inputPassword.classList.remove('input--error');
  inputPassword.classList.remove('input--success');
  passError.innerText = '';
});

button.addEventListener('click', () => {
  if (isEmpty(inputEmail.value)) {
    inputEmail.classList.add('input--error');
    inputEmail.classList.remove('input--success');
    createErrorMessage('O campo e-mail é obrigatório', 'user-error');
  } else {
    inputEmail.classList.add('input--success');
    inputEmail.classList.remove('input--error');
  }

  if (isEmpty(inputPassword.value)) {
    inputPassword.classList.add('input--error');
    inputPassword.classList.remove('input--success');
    createErrorMessage('O campo senha é obrigatório', 'pass-error');
  } else {
    inputPassword.classList.add('input--success');
    inputPassword.classList.remove('input--error');
  }
});

const createErrorMessage = (message, targetElementId) => {
  document.getElementById(targetElementId).innerText = message
}

const isEmpty = (value) => {
  return !value || value === null || value === undefined || value === '';
}