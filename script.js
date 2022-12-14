const wrapper = document.querySelector('[data-wr]');

const modal = document.querySelector('.modal');

const addCatBtn = document.getElementById('new');

const saveCatBtn = document.querySelector('.close');

let catParams;

function openModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

addCatBtn.onclick = openModal;

saveCatBtn.addEventListener('click', () => {
  getCatParams()
  addNewCat(catParams);
  closeModal();
  //location.reload();
});

window.onclick = function(event) {
  if (event.target == modal) closeModal()
}

const getCatElem = (cat) => {
  return `
  <div class="card mb-2 mt-2" style="width: 18rem;">
  <img src=${cat.image} class="card-img-top" alt="cat image">
  <div class="card-body">
    <h5 class="card-title">${cat.name}</h5>
    <p class="card-text">${cat.description}</p>
    <a href="#" class="btn btn-primary" onClick="openModal()">Edit</a>
    <a href="#" class="btn btn-primary" onClick="deleteCat(${cat.id})">Delete(</a>
  </div>
</div>
`
}

fetch('https://cats.petiteweb.dev/api/single/XeniaGorbunova/show/')
  .then((res) => res.json())
  .then((data) =>  {
    wrapper.insertAdjacentHTML('afterbegin', data.map((item) => getCatElem(item)).join(''));
    console.log(data);
  })

function deleteCat(id) {
  fetch(`https://cats.petiteweb.dev/api/single/XeniaGorbunova/delete/${id}`, { method: 'DELETE' })
    .then(() => {
      location.reload();
      console.log('Delete successfully');
  });
}  

function getCatParams() {
  const modalInputs = document.querySelectorAll('.modal-input');
  const inputsValue = [];
  modalInputs.forEach((item) => inputsValue.push(item.value));
  catParams = {
    id: +inputsValue[0],
    name: inputsValue[1], 
    image: inputsValue[2], 
    age: +inputsValue[3], 
    rate: inputsValue[4], 
    favorite: inputsValue[5], 
    description: inputsValue[6]
  }
  console.log(catParams);
  modalInputs.forEach((item) => item.value = '');
}

function addNewCat({ id, name = 'new cat', image = '', age = 0, rate = 0, favorite = false, description = '' }) {
  fetch('https://cats.petiteweb.dev/api/single/XeniaGorbunova/add/', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "id": id,
      "name": name,
      "image": image,
      "age": age,
      "rate": rate,
      "favorite": favorite,
      "description": description
  }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
  })
}

function editCat(id, name = 'new cat', image = '', age = 0, rate = 0, favorite = false, description = '') {
  fetch(`https://cats.petiteweb.dev/api/single/XeniaGorbunova/update/${id}`, { 
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "id": `"${id}"`,
      "name": `"${name}"`,
      "image": `"${image}"`,
      "age": `"${age}"`,
      "rate": `"${rate}"`,
      "favorite": `"${favorite}"`,
      "description": `"${description}"`
  }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
  })
}

