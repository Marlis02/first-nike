const API = "http://localhost:8000/files";

const addProduct = document.querySelector(".product");
const modalInp = document.querySelector(".modal__container");
const addBtn = document.querySelector(".add_btn");
const inpName = document.querySelector("#inpName");
const inpDesc = document.querySelector("#inpDesc");
const inpImg = document.querySelector("#inpImg");
const inpPrice = document.querySelector("#inpPrice");
const btnAdd = document.querySelector("#btnAdd");
const cardsContainer = document.querySelector("#cardsContainer");
const section = document.querySelector("section");
const navi = document.querySelector(".navi");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

let searchValue = "";

const LIMIT = 6;
let currentPage = 1;
let countPage = 1;

addProduct.addEventListener("click", () => {
  if (modalInp.style.display === "none") {
    modalInp.style.display = "flex";
  } else {
    modalInp.style.display = "none";
  }

  if (modalInp.style.display === "flex") {
    navi.style.height = "1000px";
  }
});

btnAdd.addEventListener("click", () => {
  if (
    !inpName.value.trim() ||
    !inpDesc.value.trim() ||
    !inpImg.value.trim() ||
    !inpPrice.value.trim()
  ) {
    return alert("Заполните все поля!");
  }

  const newProduct = {
    name: inpName.value,
    desc: inpDesc.value,
    img: inpImg.value,
    price: inpPrice.value,
  };
  createItem(newProduct);
  renderGoods();
});

async function createItem(product) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(product),
  });
  btnAdd.classList.toggle("show");
  inpName.value = "";
  inpDesc.value = "";
  inpImg.value = "";
  inpPrice.value = "";
}

async function renderGoods() {
  let res;
  if (searchValue) {
    res = await fetch(
      `${API}?name=${searchValue}&_page=${currentPage}&_limit=${LIMIT}`
    );
  } else {
    res = await fetch(`${API}?_page=${currentPage}&_limit=${LIMIT}`);
  }

  const data = await res.json();
  console.log(data);

  cardsContainer.innerHTML = "";
  data.forEach(({ name, desc, img, price, id }) => {
    cardsContainer.innerHTML += `<div class="cards" id="${id}">
               <div class="cards_img">
               <img src="${img}" alt="Изображение продукта" class="cards_img">
           </div>
           <div class="cards_desc">
               <p class="cards_item">${name}</p>
               <p class="cards_item">${desc}</p>
               <p class="cards_item">${price} $</p>
           </div>
           <div class="cards_btn">
               <button class="btn_edit"id="${id}">Edit</button>
               <button class="btn_delete" id="${id}">Delete</button>
           </div>
</div>`;
  });
  pageFunc();
}

window.addEventListener("load", () => {
  renderGoods();
});

document.addEventListener("click", async (event) => {
  const deleteBtn = event.target;

  if (deleteBtn.classList.contains("btn_delete")) {
    try {
      const id = deleteBtn.getAttribute("id");
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      renderGoods();
    } catch (error) {
      console.log(error);
    }
  }
});

//================= Edit===============

const editInpName = document.querySelector("#editInpName");
const editInpDesc = document.querySelector("#editInpDesc");
const editInpPrice = document.querySelector("#editInpPrice");
const editInpImage = document.querySelector("#editInpImg");
const editBtnSave = document.querySelector(".btn_save");
const modal = document.querySelector(".edit__block");
const x = document.querySelector("#x");

document.addEventListener("click", async (event) => {
  const modalEdit = event.target;
  if (modalEdit.classList.contains("btn_edit")) {
    const id = modalEdit.getAttribute("id");
    if (modal.style.display === "none") {
      modal.style.display = "flex";
    } else {
      modal.style.display = "none";
    }
    const res = await fetch(`${API}/${id}`);
    const { name, desc, img, price } = await res.json();
    editInpName.value = name;
    editInpDesc.value = desc;
    editInpImage.value = img;
    editInpPrice.value = price;

    editBtnSave.setAttribute("id", id);
  }
});

x.addEventListener("click", () => {
  modal.style.display = "none";
});

editBtnSave.addEventListener("click", async () => {
  const id = editBtnSave.getAttribute("id"); // Get the product ID from the data attribute
  const editedProduct = {
    name: editInpName.value,
    desc: editInpDesc.value,
    img: editInpImage.value,
    price: editInpPrice.value,
  };

  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(editedProduct),
    });

    modal.style.display = "none";
    renderGoods();
  } catch (error) {
    console.log(error);
  }
});

//-----------------pagin

async function pageFunc() {
  const res = await fetch(API);
  const data = await res.json();
  countPage = Math.ceil(data.length / LIMIT);

  if (currentPage === countPage) {
    nextBtn.style.color = "black";
    nextBtn.style.border = "black";
  } else {
    nextBtn.style.color = "white  ";
    nextBtn.style.border = "rgb(13, 110, 253)";
  }

  if (currentPage === 1) {
    prevBtn.style.color = "black";
    prevBtn.style.border = "black";
  } else {
    prevBtn.style.color = "white";
    prevBtn.style.border = "rgb(13, 110, 253)";
  }
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  renderGoods();
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  renderGoods();
});

//-----------------Search

const searchInp = document.querySelector(".nav_inp_item");
const searchBtn = document.querySelector(".nav_sumbit");

searchInp.addEventListener("input", ({ target: { value } }) => {
  console.log(value);
  searchValue = value;
});

searchBtn.addEventListener("click", () => {
  renderGoods();
});

//----------------------deatail====
