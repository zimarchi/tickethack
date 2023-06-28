const API = "http://localhost:3000";
const box = document.querySelector("#container_box");

document.querySelector("#purchase").addEventListener("click", purchase);

async function readAllCartFromDB() {
  try {
    const response = await fetch(`${API}/cart/allNonBooked`);
    const { result, carts } = await response.json();

    if (!result) {
      throw new Error("Unable to read carts");
    }

    carts = carts || [];
    console.log(`${carts.length} carts found`);
    return carts;
  } catch (error) {
    console.error("Error reading carts:", error);
    return [];
  }
}

function createCartElement(cart) {
  const { _id, departure, arrival, time, price } = cart;
  const itemBox = document.createElement("div");
  itemBox.id = `ID${_id}`;
  itemBox.classList.add("item_box");

  itemBox.innerHTML = `
    <div class="trip_name">${departure} > ${arrival}</div>
    <div class="trip_time">${time}</div>
    <div class="trip_price">${price}</div>
    <button class="remove-trip-btn">X</button>
  `;

  itemBox.querySelector(".remove-trip-btn").addEventListener("click", removeItem);

  return itemBox;
}

async function updateFromCartsArray() {
  try {
    const carts = await readAllCartFromDB();
    console.log("UPDATE GUI FROM DB", carts);

    box.innerHTML = "";
    carts.forEach((cart) => {
      const itemBox = createCartElement(cart);
      box.appendChild(itemBox);
    });

    updateTotalPrice();
  } catch (error) {
    console.error("Error updating GUI:", error);
  }
}

function updateTotalPrice() {
  const tripPrices = Array.from(document.querySelectorAll(".trip_price"));
  const total = tripPrices.reduce((sum, element) => sum + Number(element.textContent), 0);

  document.querySelector("#total").textContent = `Total: ${total} €`;
}

async function removeItem() {
  try {
    const id = this.parentNode.id.replace("ID", "");
    console.log(`Remove item with id ${id}`);

    const response = await fetch(`${API}/cart/delete/${id}`, {
      method: "DELETE",
    });

    const { result } = await response.json();

    if (!result) {
      throw new Error("Unable to remove item");
    }

    this.parentNode.remove();
    updateTotalPrice();
  } catch (error) {
    console.error("Error removing item:", error);
  }
}

async function purchase() {
  try {
    const itemBoxes = Array.from(document.querySelectorAll(".item_box"));
    const ids = itemBoxes.map((box) => box.id.replace("ID", ""));

    const body = { ids };
    console.log("POST body");
    console.log(body);

    const response = await fetch(`${API}/cart/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const { result } = await response.json();

    if (!result) {
      throw new Error("Unable to complete purchase");
    }

    alert("Purchase completed successfully!");
    updateFromCartsArray();
  } catch (error) {
    console.error("Error purchasing:", error);
  }
}

// Initialize the visuals
document.addEventListener("DOMContentLoaded", () => {
  updateFromCartsArray();
});