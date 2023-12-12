const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const button = document.getElementById('submit');
const userError = document.getElementById('user-error');
const passError = document.getElementById('pass-error');

userError.innerText = '';
passError.innerText = '';

// ACESSO AO BACKEND
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();

  if (data?.status === 'success' && data?.data?.access_token) {
    if (typeof (Storage) !== "undefined") {
      localStorage.setItem('token', data.data.access_token);
    }
    window.location.href = '../../../src/app/dashboard/index.html';
  } else {
    alert(data?.data);
  }
}

button.addEventListener('click', async () => {
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

  await login(inputEmail.value, inputPassword.value)
});

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

const createErrorMessage = (message, targetElementId) => {
  document.getElementById(targetElementId).innerText = message
}

const isEmpty = (value) => {
  return !value || value === null || value === undefined || value === '';
}



