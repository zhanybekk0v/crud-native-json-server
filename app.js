const API = "http://localhost:8001/products";



let names = document.querySelector("#name");
let surname = document.querySelector("#surname");
let phone = document.querySelector("#phone");
let image = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");


let list = document.querySelector("#product-list");
console.log(list);


let editNames = document.querySelector('#edit-name')
let editSurname = document.querySelector('#edit-surname')
let editPhone = document.querySelector('#edit-phone')
let editImage = document.querySelector('#edit-image')
let editSaveBtn = document.querySelector('#btn-save-edit')
let exampleModal = document.querySelector('#exampleModal')
let contentList = document.querySelector('#product-list')

btnAdd.addEventListener('click', async function () {
  let obj = {
    names: names.value,
    surname: surname.value,
    phone: phone.value,
    image: image.value,
  };

  if (
    !obj.names.trim() ||
    !obj.surname.trim() ||
    !obj.phone.trim() ||
    !obj.image.trim()
  ) {
    alert("Enter the brackets!");
    return;
  }
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });

  render()

  names.value = "";
  surname.value = "";
  phone.value = "";
  image.value = "";
});

render();
async function render() {
  let responce = await fetch(API)
  let products = await responce.json()

  list.innerHTML = ''

  products.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.id = element.id;
    newElem.innerHTML = `
        <div class="card m-5" style="width: 30rem;">
        <img src="${element.image}" class="card-img-top" alt="..." >
        <div class="card-body">
          <h2 class="card-title">${element.names}</h2>
          <p style="font-size: 16px" class="card-text">${element.surname}</p>
          <p style="font-size: 16px"  class="card-text">${element.phone}</p>

          <a href="#"  style="padding: 10px 30px; font-size:15px ; margin-right:70px"class="btn btn-dark btn-delete"  id=${element.id}>DELETE</a>
          <a href="#" style="padding: 10px 30px; font-size:15px ;" class="btn btn-primary btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal" id=${element.id}>EDIT</a>

        </div>
      </div>`;
    contentList.append(newElem);
  });
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-edit')) {
    let id = e.target.id
    fetch(`${API}/${id}`).then((res) => res.json())
      .then((data) => {
        editNames.value = data.names;
        editSurname.value = data.surname;
        editPhone.value = data.phone;
        editImage.value = data.image;
        editSaveBtn.setAttribute('id', data.id)
      })
  }
})

editSaveBtn.addEventListener('click', function () {
  let id = this.id
  let names = editNames.value;
  let surname = editSurname.value;
  let phone = editPhone.value;
  let image = editImage.value;
  if (!names ||
    !surname ||
    !phone ||
    !image) return;


  let editedProduct = {
    names: names,
    surname: surname,
    phone: phone,
    image: image,
  };
  saveEdit(editedProduct, id);
});
async function saveEdit(editedProduct, id) {
  await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(editedProduct),
  });
  render();
  let modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();
}


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    let id = e.target.id;
    fetch(`${API}/${id}`, {
      method: "DELETE",
    }).then(() => {
      contentList.innerHTML = "";
      render();
    });
  }
});

