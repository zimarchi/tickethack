let API = "http://localhost:3000";
let box = document.querySelector("#container_box");

// Add click to purchase button
document.querySelector("#purchase").onclick = purchase;

// Function to fetch all carts from the mongoose thing
function readAllCartFromDB() {
  return fetch(API + '/cart/mongoosethingidkwhatitsnamed') // Fetch data from the mongoose
    .then(function(response) { 
      return response.json();
    })
    .then(function(data) {
      let result = data.result;
      let carts = data.carts;
      // Check the result if its not equal to the result then it shows that its unable to read
      if (!result) {
        console.log("Unable to read carts");
        return [];
      }
      // Log the number of trips/carts found (idk what its called on the mongoose thing so i just named it carts)
      carts = carts || [];
      console.log(carts.length + ' carts found');
      return carts;
    })
    .catch(function(error) {
      // shows any errors
      console.error("Error reading carts:", error);
      return [];
    });
}

// Function to remove a trips/cart from the server
function removeItem(id) {
  id = id.replace("ID", ""); // Remove 'ID' from the start of the id
  console.log("Remove item with id " + id); // Log the id of the item that has to be removed

  fetch(API + "/cart/delete/" + id, {
    method: "DELETE"
  })
  .then(function(response) {
    return response.json(); // Convert the response to a JavaScript object
  })
  .then(function(data) {
    let result = data.result;
    // Checks if it was reussi or not
    if (!result) {
      console.log("Unable to remove item");
      return;
    }
    // Remove the trip from the cart
    document.getElementById("ID" + id).remove();
  })
  .catch(function(error) {
    // shows if there are errors
    console.error("Error removing item:", error);
  });
}

// Function to purchase all trips in the cart
function purchase() {
  // Again i think this is one way os assigning all the trips to their IDs so they can purchase in one go and get rid of it after purchase but not too sure
  let PotentialTrips = Array.from(document.querySelectorAll(".item_box"));
  let ids = PotentialTrips.map(function(box) {
    return box.id.replace("ID", "");
  });

  let body = { ids: ids }; // Create the request body
  console.log("POST body");
  console.log(body); // Log the request body

  fetch(API + "/cart/book", {// i wanted to try and add the cart purchased thing to the booking so i saw that perhaps this is a possible way of doing it but im not too sure
    method: "POST", // Used the post method in the services tiers thing on ariane
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify(body), 
  })
  .then(function(response) {
    return response.json(); 
  })
  .then(function(data) {
    let result = data.result;
    // Check the result
    if (!result) {
      console.log("Unable to complete purchase"); // shows if there was a problem with the booking in the cart
      return;
    }
    alert("Purchase completed successfully!"); // shows that it has been added to the booking page
  })
  .catch(function(error) {
    console.error("Error purchasing:", error);
  });
}
