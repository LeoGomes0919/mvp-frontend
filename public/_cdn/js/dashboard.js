const data = [
  {
    id: 1,
    name: 'Desenvolvimento de site',
    value: 12000,
    category: 'Venda',
    date: '18/11/2023'
  },
  {
    id: 2,
    name: 'Hamburger',
    value: -59,
    category: 'Alimentação',
    date: '17/11/2023'
  },
  {
    id: 3,
    name: 'Trabalho Freelancer',
    value: 5000,
    category: 'Serviços',
    date: '19/11/2023'
  },
  {
    id: 4,
    name: 'Jantar',
    value: -230,
    category: 'Alimentação',
    date: '20/11/2023'
  },
  {
    id: 5,
    name: 'Viagem',
    value: -2500,
    category: 'Lazer',
    date: '21/11/2023'
  }
];

const fillTable = () => {
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
        case 'name':
          td.textContent = row[key];
          break;
        case 'value':
          td.textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row[key]);
          td.classList.add('table__content--value', row[key] >= 0
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
          td.innerHTML = iconDate.outerHTML + row[key];
          break;
        default:
          td.textContent = row[key];
          break;
      }

      tr.appendChild(td);
    }
  }
  const tdActions = document.createElement('td');
  tdActions.classList.add('table__content--actions');

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('button', 'button--sm', 'button--danger--outline', 'button--icon')
  deleteButton.innerHTML = '<i class="ph ph-trash"></i>';
  deleteButton.addEventListener('click', () => {
    alert(`Deletar linha com ID: ${row.id}`);
  });

  const editButton = document.createElement('button');
  editButton.classList.add('button', 'button--sm', 'button--warning--outline', 'button--icon')
  editButton.innerHTML = '<i class="ph ph-pencil-line"></i>';
  editButton.addEventListener('click', () => {
    alert(`Editar linha com ID: ${row.id}`);
  });

  tdActions.appendChild(deleteButton);
  tdActions.appendChild(editButton);
  tr.appendChild(tdActions);
}

const fillRadioGroupCheck = () => {
  const radios = document.querySelectorAll('input[name="type"]');
  const containerRadio = document.querySelectorAll('.radio__buttons--item');

  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      containerRadio.forEach((container) => {
        const selectedRadio = container.querySelector('input');
        if (selectedRadio.checked) {
          console.log(selectedRadio.value)
          container.classList.add('active');
        } else {
          container.classList.remove('active');
        }
      });
    });
  });
}

const modal = () => {
  const btnOpenModal = document.getElementById('btn-open-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const modal = document.getElementById('modal');

  btnOpenModal.addEventListener('click', () => {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  btnCloseModal.addEventListener('click', () => {
    modal.style.animation = 'modalFadeOut 0.3s ease-in';
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      modal.style.display = 'none';
      modal.style.animation = '';
    }, 300);
  });
}

const initialize = () => {
  fillTable();
  fillRadioGroupCheck();
  modal();
}

document.addEventListener('DOMContentLoaded', initialize);