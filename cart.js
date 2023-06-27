function deleteCartTrip(trips) {
    const deleteButton = document.querySelectorAll(".delete")
    for (let i = 0; i < deleteButton.length; i++) {
        deleteButton[i].addEventListener("click", () => {
            const cartTrip = trips[i]
            fetch("http://localhost:3000/cart", {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({departure: cartTrip.departure, arrival: cartTrip.arrival, date: cartTrip.date, price: cartTrip.price}),
      })
        .then(res => res.json())
        .then(data => {
            if (data.result) {
                deleteButton[i].parentNode.remove()
                window.location.reload()
                console.log(data.message)
            } else {
                console.log(data.error)
            }
        })
        })
    }

}

function addToBookings(trips) {
    const bookingChoice = document.querySelectorAll(".booking-choices");
    for (let i = 0; i < bookingChoice.length; i++) {
      document.querySelector("#btn-purchase").addEventListener("click", () => {
      const purchasedTrip = trips.data[i]
        fetch("http://localhost:3000/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({departure: purchasedTrip.departure, arrival: purchasedTrip.arrival, date: purchasedTrip.date, price: purchasedTrip.price}),
        })
        .then(res => res.json())
        .then(data => {
          if (data.result) {
            fetch("http://localhost:3000/cart/all", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                  },
            })
              window.location = './bookings.html'
              return true
  
          } else {
              console.log("Already in cart")
              return false
          }
        })
      });
    }
  }


  
  window.addEventListener('load', (event) => {
    const noTicket = document.querySelector(".text-no-ticket")
    const textCart = document.querySelector(".text-cart")
    const rowCartTotal = document.querySelector(".row-cart-total")
    rowCartTotal.style.display = "none"
    textCart.style.display = "none"
  noTicket.style.display = "block"
    fetch("http://localhost:3000/cart")
        .then(res => res.json())
        .then(data => {
            if (data.data.length > 0) {
              noTicket.style.display = "none"
              textCart.style.display = "block"
              rowCartTotal.style.display = "block"
                const rowCarts = document.querySelector(".row-cart")
                let totalCart = 0
                for (let trip of data.data) {
                    const date = new Date(trip.date)
                    rowCarts.innerHTML += `
                <div class="booking-choices">
                    <p class="choice">${trip.departure} > ${trip.arrival}</p>
                    <p class="choice">${(date.getHours() < 10 ? "0" : "") + date.getHours()}:${(date.getMinutes() < 10 ? "0" : "") + date.getMinutes()}</p>
                    <p class="choice">${trip.price}€</p>
                    <span class="delete">X</span>
                </div>` 
                totalCart += Number(trip.price)
                }
                document.querySelector("#total-price").textContent = `Total : ${totalCart}`
                addToBookings(data)
                deleteCartTrip(data.data)
            } else {
              noTicket.style.display = "block"
              textCart.style.display = "none"
              rowCartTotal.style.display = "none"
            }
        })
});