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
    <button type="button" data-action="edit" data-id=${cat.id} class="btn btn-primary" onClick="openModal()">Edit</button>
    <button type="button" data-action="detail" data-id=${cat.id} class="btn btn-info">Detail</button>
    <button type="button" data-action="delete" data-id=${cat.id} class="btn btn-danger">Delete</button>
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
  }
}

function openModalHandler() {
  $modal.style.display = 'block';
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
    console.log(catParams);
    addNewCat(catParams);
    $createCatForm.addEventListener('change', () => {
      const formattedData = getCatParams(
        Object.fromEntries(new FormData($createCatForm).entries()),
      );

      localStorage.setItem('createCatLSData', JSON.stringify(formattedData));
    });
  });
}
addCatBtn.onclick = openModalHandler;

/* function openCreateCatModal() {
  modal.style.display = 'block';
  createCatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewCat(getCatParams(e.target));
    console.log(e.target, new FormData(e.target));
  });
}
function closeCreateCatModal() {
  modal.style.display = 'none';
  createCatForm.removeEventListener('submit');
}

addCatBtn.onclick = openCreateCatModal;

saveCatBtn.addEventListener('click', (e) => {
  addNewCat(getCatParams(e.closest('form')));
  closeCreateCatModal();
});
window.onclick = function (event) {
  if (event.target == modal) closeCreateCatModal();
}; */

function editCat(catParams) {
  fetch(`https://cats.petiteweb.dev/api/single/XeniaGorbunova/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(catParams),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
