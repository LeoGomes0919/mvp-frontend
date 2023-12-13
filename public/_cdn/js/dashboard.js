// BANCKEND ACCESS
const token = localStorage.getItem('token') ?? null
const baseUrl = 'http://127.0.0.1:5000';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
  'Access-Control-Allow-Origin': '*',
}

let pagination = {
  page: 1,
  per_page: 5,
  total_pages: 0,
  total_items: 0
}

let balance = {
  income: 0,
  outcome: 0,
  total: 0
}

const getFinances = async () => {
  const { page, per_page } = pagination;
  const response = await fetch(`${baseUrl}/finances/filters?page=${page}&per_page=${per_page}`, {
    method: 'GET',
    headers
  });

  const data = await response.json();

  if (data?.status === 'success') {
    const { items, pagination: paginationData, balance: balanceData } = data?.data;
    Object.assign(pagination, paginationData);
    Object.assign(balance, balanceData);

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

const getFinanceById = async (id) => {
  const response = await fetch(`${baseUrl}/finances/${id}`, {
    method: 'GET',
    headers
  });

  const data = await response.json();

  if (data?.status === 'success') {
    return data?.data;
  } else {
    alert(data?.data);
  }

}

const handleSave = async (data) => {
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
  });

  const tableInfoQuantity = document.querySelector('.info__table--item-quantity');
  tableInfoQuantity.textContent = pagination.total_items + ' item(s)';

  const balanceIncome = document.getElementById('balance-income');
  const balanceOutcome = document.getElementById('balance-outcome');
  const balanceTotal = document.getElementById('balance-total');

  balanceIncome.textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance.income);
  balanceOutcome.textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance.outcome);
  balanceTotal.textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance.total);
}

const fillRows = (row, tr) => {
  for (const key in row) {
    const td = document.createElement('td');
    if (row.hasOwnProperty(key) && !['id', 'type'].includes(key)) {
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

  editButton.addEventListener('click', async () => {
    isUpdate = true;
    const response = await getFinanceById(row.id);
    openModal();
    const form = document.querySelector('.model__content__main--form');
    const inputs = form.querySelectorAll('input');

    const idInput = document.createElement('input');
    idInput.setAttribute('type', 'hidden');
    idInput.setAttribute('name', 'id');
    idInput.setAttribute('value', response.id);
    form.appendChild(idInput);

    for (const input of inputs) {
      if (input.id === 'category') {
        input.value = response.category.name;
      } else if (input.type === 'radio') {
        if (input.getAttribute('id') === response.finance_type) {
          input.value = response.finance_type;
          input.checked = true;
          input.parentElement.classList.add('active');
          input.value = response.finance_type;
        }
      } else {
        input.value = response[input.name];
      }
    }
  });

  tdActions.appendChild(deleteButton);
  tdActions.appendChild(editButton);
  tr.appendChild(tdActions);
}

// PAGINATION
const fillPagination = () => {
  const paginationContainer = document.querySelector('.table--pagination');

  const previeusButton = document.createElement('span');
  previeusButton.innerHTML = '<i class="ph-bold ph-caret-left"></i>';
  previeusButton.classList.add('table__pagination--previous');

  const nextButton = document.createElement('span');
  nextButton.innerHTML = '<i class="ph-bold ph-caret-right"></i>';
  nextButton.classList.add('table__pagination--next');

  const paginationItem = document.createElement('span');
  paginationItem.classList.add('table__pagination--item');

  for (let i = 1; i <= pagination.total_pages; i++) {
    const item = paginationItem.cloneNode();
    item.textContent = i;
    item.setAttribute('data-page', i);
    item.addEventListener('click', async (event) => {
      const table = document.querySelector('.table__content');
      table.innerHTML = '';
      const page = event.target.getAttribute('data-page');
      pagination.page = page;
      await getFinances();

      const items = document.querySelectorAll('.table__pagination--item');
      items.forEach((item) => {
        item.classList.remove('active');
      });
      event.target.classList.add('active');
    });

    if (i === 1) {
      item.classList.add('active');
    }

    paginationContainer.appendChild(item);
  }

  previeusButton.addEventListener('click', async () => {
    const table = document.querySelector('.table__content');
    table.innerHTML = '';
    if (pagination.page > 1) {
      pagination.page--;
    }
    await getFinances();

    const items = document.querySelectorAll('.table__pagination--item');
    items.forEach((item) => {
      item.classList.remove('active');
    });
    items[pagination.page - 1].classList.add('active');
  });

  nextButton.addEventListener('click', async () => {
    const table = document.querySelector('.table__content');
    table.innerHTML = '';
    if (pagination.page < pagination.total_pages) {
      pagination.page++;
    }
    await getFinances();

    const items = document.querySelectorAll('.table__pagination--item');
    items.forEach((item) => {
      item.classList.remove('active');
    });
    items[pagination.page - 1].classList.add('active');
  });

  paginationContainer.prepend(previeusButton);
  paginationContainer.appendChild(nextButton);
}

const handlePerPage = async (event) => {
  const table = document.querySelector('.table__content');
  table.innerHTML = '';
  pagination.per_page = event.target.value;
  await getFinances();
  const paginationContainer = document.querySelector('.table--pagination');
  paginationContainer.innerHTML = '';
  fillPagination();
}

const perPageItem = document.getElementById('pagination-range');
perPageItem.addEventListener('change', async (event) => handlePerPage(event));

// MODAL FUNCTIONS
const modalContent = document.getElementById('modal');
const openModal = () => {
  modalContent.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

const btnOpenModal = document.getElementById('btn-open-modal');
btnOpenModal.addEventListener('click', () => openModal());

const btnCloseModal = document.getElementById('btn-close-modal');
btnCloseModal.addEventListener('click', () => {
  const form = document.querySelector('.model__content__main--form');
  if (form.querySelector('input[name="id"]')) {
    form.removeChild(form.querySelector('input[name="id"]'));
  }

  modal.style.animation = 'modalFadeOut 0.3s ease-in';
  document.body.style.overflow = 'auto';

  form.reset();
  fillRadioGroupCheck();

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
    radio.parentElement.classList.remove('active');
    radio.addEventListener('change', () => {
      containerRadio.forEach((container) => {
        if (radio.checked && container.getAttribute('data-value') === radio.id) {
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
  event.preventDefault();
  const containerRadio = document.querySelectorAll('.radio__buttons--item');
  const data = new FormData(form);
  const dataObject = Object.fromEntries(data.entries());

  Object.assign(dataObject, {
    value: Number(dataObject.value),
    finance_type: dataObject.type
  });

  delete dataObject.type;

  const inputId = form.querySelector('input[name="id"]');
  if (inputId && inputId.value) {
    await handleEdit(inputId.value, dataObject);
  } else {
    await handleSave(dataObject);
  }

  form.reset();
  containerRadio.forEach((container) => {
    container.classList.remove('active');
  });
}

const handleSubmit = (event) => {
  const form = document.querySelector('.model__content__main--form');
  const hasError = formValidation();
  if (hasError) {
    event.preventDefault();
  } else {
    submitForm(event, form);
  }
}
const buttonSubmit = document.getElementById('submit-form');
buttonSubmit.addEventListener('click', (event) => handleSubmit(event));

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
  getFinances();
  setTimeout(() => {
    fillPagination();
  }, 200);
}

document.addEventListener('DOMContentLoaded', initialize);