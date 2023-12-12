// ACESSO AO BACKEND
const token = localStorage.getItem('token') ?? null
const baseUrl = 'http://127.0.0.1:5000';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
  'Access-Control-Allow-Origin': '*',
}

let pagination = {
  page: 1,
  limit: 10
}

const getFinances = async () => {
  const response = await fetch(`${baseUrl}/finances/filters`, {
    method: 'GET',
    headers
  });

  const data = await response.json();
  console.log("🚀 ~ file: dashboard.js:16 ~ getFinances ~ data:", data)

  if (data?.status === 'success') {
    const { items, pagination } = data?.data;
    fillTable(items.map((item) => ({
      id: item.id,
      description: item.description,
      value: item.value,
      date: item.date,
      category: item.category.name,
      type: item.finance_type
    })));
  } else {
    alert(data?.data);
  }
}

const handleSubimitToBackend = async (data) => {
  const response = await fetch(`${baseUrl}/finances/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    mode: 'cors'
  });

  const responseData = await response.json();
  if (responseData?.status === 'success') {
    alert('Registro cadastrado com sucesso!');
    window.location.reload();
  }
}

const handleDelete = async (id) => {
  const response = await fetch(`${baseUrl}/finances/${id}`, {
    method: 'DELETE',
    headers,
    mode: 'cors'
  });

  const responseData = await response.json();
  if (responseData?.status === 'success') {
    alert('Registro deletado com sucesso!');
    window.location.reload();
  } else {
    alert(responseData?.data);
  }
}

const handleEdit = async (id, data) => {
  const response = await fetch(`${baseUrl}/finances/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
    mode: 'cors'
  });

  const responseData = await response.json();
  if (responseData?.status === 'success') {
    alert('Registro editado com sucesso!');
    window.location.reload();
  } else {
    alert(responseData?.data);
  }
}

// TABLE FUNCTIONS
const fillTable = (data) => {
  const table = document.querySelector('.table__content');

  data.forEach(row => {
    const tr = document.createElement('tr');

    fillRows(row, tr);

    table.appendChild(tr);
  })
}

const fillRows = (row, tr) => {
  for (const key in row) {
    const td = document.createElement('td');
    if (row.hasOwnProperty(key) && key !== 'id') {
      switch (key) {
        case 'description':
          td.textContent = row[key];
          break;
        case 'value':
          td.textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row[key]);
          td.classList.add('table__content--value', row['type'] === 'income'
            ? 'table__content__value--value-income'
            : 'table__content__value--value-outcome');
          break;
        case 'category':
          td.classList.add('table__content--category');
          td.appendChild(document.createElement('i'));
          const iconTag = td.querySelector('i');
          iconTag.classList.add('ph', 'ph-tag-simple', 'table__content--icon');
          td.innerHTML = iconTag.outerHTML + row[key];
          break;
        case 'date':
          td.classList.add('table__content--date');
          td.appendChild(document.createElement('i'));
          const iconDate = td.querySelector('i');
          iconDate.classList.add('ph', 'ph-calendar-blank', 'table__content--icon');
          td.innerHTML = iconDate.outerHTML + Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'America/Sao_Paulo'
          }).format(new Date(row[key])).split(', ').join(' ');
          break;
        default:
          break;
      }

      tr.appendChild(td);
    }
  }
  const tdActions = document.createElement('td');
  tdActions.classList.add('table__content--actions');

  const attrs = [
    {
      delete: {
        'size': 'sm',
        'danger-outline': '',
        'btn-icon': '',
        'data-tooltip': 'Deletar',
      },
      edit: {
        'size': 'sm',
        'warning-outline': '',
        'btn-icon': '',
        'data-tooltip': 'Editar',
      }
    }
  ];

  const deleteButton = document.createElement('button');
  const editButton = document.createElement('button');
  deleteButton.classList.add('button', 'button--icon');
  editButton.classList.add('button', 'button--icon');
  deleteButton.innerHTML = '<i class="ph ph-trash"></i>';
  editButton.innerHTML = '<i class="ph ph-pencil-line"></i>';

  for (const attr in attrs[0]) {
    for (const key in attrs[0][attr]) {
      if (attr === 'delete') {
        deleteButton.setAttribute(key, attrs[0][attr][key]);
      }
      if (attr === 'edit') {
        editButton.setAttribute(key, attrs[0][attr][key]);
      }
    }
  }

  deleteButton.addEventListener('click', async () => {
    await handleDelete(row.id);
  });

  editButton.addEventListener('click', () => {
    alert(`Editar linha com ID: ${row.id}`);
  });

  tdActions.appendChild(deleteButton);
  tdActions.appendChild(editButton);
  tr.appendChild(tdActions);
}

// MODAL FUNCTIONS
const modalContent = document.getElementById('modal');

const btnOpenModal = document.getElementById('btn-open-modal');
const openModal = () => {
  modalContent.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

btnOpenModal.addEventListener('click', () => openModal());
const btnCloseModal = document.getElementById('btn-close-modal');
btnCloseModal.addEventListener('click', () => {
  modal.style.animation = 'modalFadeOut 0.3s ease-in';
  document.body.style.overflow = 'auto';
  setTimeout(() => {
    modal.style.display = 'none';
    modal.style.animation = '';
  }, 300);
});

// FORM FUNCTIONS
const fillRadioGroupCheck = () => {
  const radios = document.querySelectorAll('input[name="type"]');
  const containerRadio = document.querySelectorAll('.radio__buttons--item');

  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      containerRadio.forEach((container) => {
        if (radio.checked && container.getAttribute('data-value') === radio.value) {
          container.classList.add('active');
        } else {
          container.classList.remove('active');
        }
      });
    });
  });
}

const formValidation = () => {
  let hasError = false;

  const containerInput = document.querySelectorAll('.model__content__main__form-group');

  for (const container of containerInput) {
    const inputs = container.querySelectorAll('input');

    for (const input of inputs) {
      const messageElement = document.createElement('span');
      messageElement.classList.add('error--message');
      if (isEmpty(input.value) && input.type !== 'radio') {
        input.classList.add('input--error');
        input.classList.remove('input--success');
        if (!document.getElementById(`${input.name}-error`)) {
          messageElement.textContent = 'Campo obrigatório';
          messageElement.setAttribute('id', `${input.name}-error`);
          container.appendChild(messageElement);
        }
        hasError = true;
      }

      if (input.type === 'radio') {
        const radioGroup = document.querySelectorAll('input[name="type"]');
        let checked = false;
        radioGroup.forEach((radio) => {
          if (radio.checked) {
            checked = true;
          }
        });

        if (!checked) {
          if (!document.getElementById(`${input.name}-error`)) {
            messageElement.textContent = 'Campo obrigatório';
            messageElement.setAttribute('id', `${input.name}-error`);
            container.appendChild(messageElement);
          }
          hasError = true;
        }
      }

      input.addEventListener('change', () => {
        if (document.getElementById(`${input.name}-error`)) {
          input.classList.add('input--success');
          input.classList.remove('input--error');
          document.getElementById(`${input.name}-error`).remove();
        }
      });
    }
  }

  return hasError;
}

const submitForm = async (event, form) => {
  const containerRadio = document.querySelectorAll('.radio__buttons--item');
  const data = new FormData(form);
  const dataObject = Object.fromEntries(data.entries());

  Object.assign(dataObject, {
    value: Number(dataObject.value),
    category_id: dataObject.category,
    finance_type: dataObject.type
  });
  delete dataObject.category;
  delete dataObject.type;

  await handleSubimitToBackend(dataObject);

  form.reset();
  event.preventDefault();
  containerRadio.forEach((container) => {
    container.classList.remove('active');
  });
}

const handleSubmit = () => {
  const buttonSubmit = document.getElementById('submit-form');
  const form = document.querySelector('.model__content__main--form');

  buttonSubmit.addEventListener('click', (event) => {
    const hasError = formValidation();
    if (hasError) {
      event.preventDefault();
    } else {
      submitForm(event, form);
    }
  });
}

// UTILS FUNCTIONS
const isEmpty = (value) => {
  return !value || value === null || value === undefined || value === '';
}

// INITIALIZE
const initialize = () => {
  if (!token) {
    window.location.href = '../../../src/app/login.html';
  }
  fillRadioGroupCheck();
  handleSubmit();
  getFinances();
}

document.addEventListener('DOMContentLoaded', initialize);