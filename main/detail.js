const API = "http://localhost:8000/files";
const detailBlock = document.querySelector("#detail");

async function getOneGood(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  console.log(data);

  detailBlock.innerHTML = `
  <div class="detail_container">
        <div class="detail_block">
            <div class="detail_img">
                <img src="${data.img}" alt="nike" style="height :550px;width :550px"> 
            </div>
            <div class="detail_desc">
                   <p class="ratings">Ratings:★★★★☆</p>
                   <p class="detail_item">${data.name}</p> 
                   <p class="detail_item">${data.desc}</p> 
                   <p class="detail_item">${data.price} $</p> 
            </div>
            <div class="btns">
            <a href="./index.html">
                <button class="cancel_btn"id="${id}">Cancel</button>
            </a>
                <button class="buy_btn"id="${id}">Buy now</button>
            </div>
        </div>
  </div>
  
  `;
}

const id = localStorage.getItem("detail-id");
getOneGood(id);
