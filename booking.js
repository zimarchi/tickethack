const API = "http://localhost:3000";
let carts = [];

async function readAllCartFromDB() {
  try {
    const response = await fetch(`${API}/cart/allBooked`);
    const data = await response.json();

    if (!data.result) {
      console.error("Unable to read carts");
      return;
    }

    carts = data.carts;
    console.log(`${carts.length} carts found`);
  } catch (error) {
    console.error("Error while fetching carts:", error);
  }
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

    const travelElement = document.createElement("div");
    travelElement.classList.add("travel");

    const citiesElement = document.createElement("div");
    citiesElement.classList.add("text", "cities");
    citiesElement.textContent = `${departure} > ${arrival}`;

    const hourElement = document.createElement("div");
    hourElement.classList.add("text", "hour");
    hourElement.textContent = time;

    const priceElement = document.createElement("div");
    priceElement.classList.add("text", "price");
    priceElement.textContent = `${price}€`;

    const timeTravelElement = document.createElement("div");
    timeTravelElement.classList.add("text", "time_travel");
    timeTravelElement.textContent = `Departure in ${hours} hours`;

    travelElement.appendChild(citiesElement);
    travelElement.appendChild(hourElement);
    travelElement.appendChild(priceElement);
    travelElement.appendChild(timeTravelElement);

    container.appendChild(travelElement);
  });

  connectAllRemoveButton();
}

async function main() {
  try {
    await readAllCartFromDB();
    updateFromCartsArray();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();