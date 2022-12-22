const $wrapper = document.querySelector('[data-wr]');
const $modal = document.querySelector('.modal');
const $modalContent = document.querySelector('.modal-content');
const addCatBtn = document.getElementById('new');
const $createCatFormTemplate = document.getElementById('createCatForm');

const getCatElem = (cat) => `
  <div class="card mb-2 mt-2" style="width: 18rem;">
  <img src=${cat.image} class="card-img-top" alt="cat image">
  <div class="card-body">
    <h5 class="card-title">${cat.name}</h5>
    <p class="card-text">${cat.description}</p>
    <button type="button" data-action="edit" data-id=${cat.id} class="btn btn-primary">Edit</button>
    <button type="button" data-action="detail" data-id=${cat.id} class="btn btn-info">Detail</button>
    <button type="button" data-action="delete" data-id=${cat.id} class="btn btn-danger">Delete</button>
  </div>
</div>
`;

const getCatDetailElem = (cat) => `
  <div class="card mb-2 mt-2" style="width: 18rem;">
    <img src=${cat.image} class="card-img-top" alt="cat image">
    <div class="card-body">
      <h5 class="card-title">${cat.name}</h5>
      <p class="card-text">${cat.age} years</p>
      <p class="card-text">id: ${cat.id}</p>
      <p class="card-text"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-suit-heart" viewBox="0 0 16 16">
      <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
    </svg>${cat.rate}</p>
      <p class="card-text">${cat.description}</p>
      <label><input type="checkbox">Is it favorite?</label>
    </div>
  </div>
`;

fetch('https://cats.petiteweb.dev/api/single/XeniaGorbunova/show/')
  .then((res) => res.json())
  .then((data) => {
    $wrapper.insertAdjacentHTML('afterbegin', data.map((item) => getCatElem(item)).join(''));
    console.log(data);
  });
$wrapper.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.dataset.action === 'delete') {
    deleteCat(e.target.dataset.id, e.target.closest('div'));
    e.target.closest('.card').remove();
  }
});

function deleteCat(id, elem) {
  fetch(`https://cats.petiteweb.dev/api/single/XeniaGorbunova/delete/${id}`, { method: 'DELETE' })
    .then((res) => {
      if (res.status === 200) {
        return elem.remove();
      }

      alert(`Удаление кота с id = ${Id} не удалось`);
    });
}

const getCatParams = (formDataObject) => ({
  ...formDataObject,
  id: +formDataObject.id,
  rate: +formDataObject.rate,
  age: +formDataObject.age,
  favorite: !!formDataObject.favorite,
});

function addNewCat(catParams) {
  fetch('https://cats.petiteweb.dev/api/single/XeniaGorbunova/add/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(catParams),
  })
    .then((res) => {
      if (res.status === 200) {
        $modal.style.display = 'none';
        $modalContent.innerHTML = '';
        $modal.removeEventListener('click', closeModalHandler);
        localStorage.removeItem('createCatLSData');
        return $wrapper.insertAdjacentHTML('afterbegin', getCatElem(catParams));
      }
      throw Error('Ошибка при добавлении кота');
    })
    .catch(alert);
}

function closeModalHandler(e) {
  const $thisModal = document.querySelector('.modal');
  const closeNewCatBtn = document.querySelector('.close');
  if (e.target === closeNewCatBtn || e.target === $thisModal) {
    $modal.style.display = 'none';
    $modal.removeEventListener('click', closeModalHandler);
    $modalContent.innerHTML = '';
    document.body.style.overflow = 'auto';
  }
}

function openModalHandler() {
  $modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  $modal.addEventListener('click', closeModalHandler);
  const cloneCatCreateForm = $createCatFormTemplate.content.cloneNode(true);
  $modalContent.appendChild(cloneCatCreateForm);
  const dataFromLs = localStorage.getItem('createCatLSData');
  const preparedDataFromLS = dataFromLs && JSON.parse(dataFromLs);
  const $createCatForm = document.forms.createCatForm;
  if (preparedDataFromLS) {
    Object.keys(preparedDataFromLS).forEach((key) => {
      $createCatForm[key].value = preparedDataFromLS[key];
    });
  }
  $createCatForm.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
    const catParams = getCatParams(
      Object.fromEntries(new FormData(submitEvent.target).entries()),
    );
    addNewCat(catParams);
  });
  $createCatForm.addEventListener('change', () => {
    const formattedData = getCatParams(
      Object.fromEntries(new FormData($createCatForm).entries()),
    );
    localStorage.setItem('createCatLSData', JSON.stringify(formattedData));
  });
}
addCatBtn.onclick = openModalHandler;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    $modal.style.display = 'none';
    $modal.removeEventListener('click', closeModalHandler);
    $modalContent.innerHTML = '';
    document.body.style.overflow = 'auto';
  }
});

function openEditModal(e) {
  $modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  $modal.addEventListener('click', closeModalHandler);
  const cloneCatCreateForm = $createCatFormTemplate.content.cloneNode(true);
  $modalContent.appendChild(cloneCatCreateForm);
  const $editCatForm = document.forms.createCatForm;
  fetch(`https://cats.petiteweb.dev/api/single/XeniaGorbunova/show/${+e.target.dataset.id}`)
    .then((res) => res.json())
    .then((data) => {
      Object.keys(data).forEach((key) => {
        $editCatForm[key].value = data[key];
      });
    });
  $editCatForm.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
    const catParams = getCatParams(
      Object.fromEntries(new FormData(submitEvent.target).entries()),
    );
    editCat(catParams);
    e.target.closest('.card').remove();
  });
}

function openDetailModal(e) {
  $modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  $modal.addEventListener('click', closeModalHandler);
  fetch(`https://cats.petiteweb.dev/api/single/XeniaGorbunova/show/${+e.target.dataset.id}`)
    .then((res) => res.json())
    .then((data) => {
      $modalContent.insertAdjacentHTML('afterbegin', getCatDetailElem(data));
      const modalInput = $modalContent.querySelector('input');
      if (data.favorite === true) modalInput.checked = true;
    });
}

$wrapper.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.dataset.action === 'edit') openEditModal(e);
  if (e.target.dataset.action === 'detail') openDetailModal(e);
});

function editCat(catParams) {
  fetch(`https://cats.petiteweb.dev/api/single/XeniaGorbunova/update/${catParams.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(catParams),
  })
    .then((res) => {
      if (res.status === 200) {
        $modal.style.display = 'none';
        $modalContent.innerHTML = '';
        $modal.removeEventListener('click', closeModalHandler);
        return $wrapper.insertAdjacentHTML('afterbegin', getCatElem(catParams));
      }
      throw Error('Ошибка при редактировании кота');
    })
    .catch(alert);
}
