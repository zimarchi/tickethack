const API = "http://localhost:3000";
let carts = [];

function readAllCartFromDB() {
  fetch(`${API}/cart/allBooked`)
    .then(response => response.json())
    .then(data => {
      if (!data.result) {
        console.error("Unable to read carts");
        return;
      }

      carts = data.carts;
      console.log(`${carts.length} carts found`);
      
      updateFromCartsArray();
    })
    .catch(error => console.error("Error while fetching carts:", error));
}

const container = document.querySelector("#container-trips");

function updateFromCartsArray() {
  container.innerHTML = "";

  carts.forEach((cart) => {
    const { departure, arrival, time, price } = cart;

    const documentTime = new Date(time).getHours();
    const currentTime = new Date().getTime();
    const difference = documentTime - currentTime;
    const hours = Math.floor(difference / (1000 * 60 * 60));

    container.innerHTML += `<div class="travel">
     <div class="text cities">${departure} > ${arrival}</div>
     <div class="text hour">${time}</div>
     <div class="text price">${price}€</div>
     <div class="text time_travel">Departure in ${hours} hours</div>
     </div>`;
  });
}

function main() {
  try {
    readAllCartFromDB();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();