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
          td.setAttribute('data-id', row.id);
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

}

document.addEventListener('DOMContentLoaded', fillTable);