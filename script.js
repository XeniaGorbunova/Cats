const $wrapper = document.querySelector('[data-wr]');
const modal = document.querySelector('.modal');
const addCatBtn = document.getElementById('new');
const saveCatBtn = document.querySelector('.close');
function openModal() {
  modal.style.display = 'block';
}
function closeModal() {
  modal.style.display = 'none';
}
addCatBtn.onclick = openModal;
saveCatBtn.addEventListener('click', () => {
  addNewCat(getCatParams());
  closeModal();
});
window.onclick = function (event) {
  if (event.target == modal) closeModal();
};
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
    deleteCat(e.target.dataset.id);
    e.target.closest('.card').remove();
  }
});

function deleteCat(id) {
  fetch(`https://cats.petiteweb.dev/api/single/XeniaGorbunova/delete/${id}`, { method: 'DELETE' })
    .then(() => {
      console.log('Delete successfully');
    });
}
function getCatParams() {
  const modalInputs = document.querySelectorAll('.modal-input');
  const inputsValue = [];
  modalInputs.forEach((item) => inputsValue.push(item.value));
  const catParams = {
    id: +inputsValue[0],
    name: inputsValue[1],
    image: inputsValue[2],
    age: +inputsValue[3],
    rate: inputsValue[4],
    favorite: inputsValue[5],
    description: inputsValue[6],
  };
  modalInputs.forEach((item) => { item.value = ''; });
  return catParams;
}
function addNewCat({
  id, name = 'new cat', image = '', age = 0, rate = 0, favorite = false, description = '',
}) {
  fetch('https://cats.petiteweb.dev/api/single/XeniaGorbunova/add/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      name,
      image,
      age,
      rate,
      favorite,
      description,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
function editCat(id, name = 'new cat', image = '', age = 0, rate = 0, favorite = false, description = '') {
  fetch(`https://cats.petiteweb.dev/api/single/XeniaGorbunova/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: `"${id}"`,
      name: `"${name}"`,
      image: `"${image}"`,
      age: `"${age}"`,
      rate: `"${rate}"`,
      favorite: `"${favorite}"`,
      description: `"${description}"`,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
