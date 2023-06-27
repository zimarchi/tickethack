
const departureInput = document.getElementById('departure');
const arrivalInput = document.getElementById('arrival');
const dateInput = document.getElementById('date');
const searchButton = document.getElementById('search-btn');
const tripContainer = document.getElementById('container-trips');


searchButton.addEventListener('click', searchTrips);


function searchTrips() {

  const departure = departureInput.value.trim();
  const arrival = arrivalInput.value.trim();
  const date = dateInput.value.trim();


  if (departure === '' || arrival === '' || date === '') {
    alert('Please fill in all fields');
    return;
  }


  fetch(`api/trips?departure=${departure}&arrival=${arrival}&date=${date}`)
    .then(response => response.json())
    .then(data => {

      tripContainer.innerHTML = '';

      if (data.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No trips found';
        tripContainer.appendChild(message);
      } else {
        data.forEach(trip => {
          const tripElement = document.createElement('div');
          tripElement.classList.add('travel');

          const tripInfo = document.createElement('p');
          tripInfo.textContent = `${trip.departure} to ${trip.arrival} - ${trip.date}`;

          const bookButton = document.createElement('button');
          bookButton.classList.add('book-class');
          bookButton.textContent = 'Book Now';

          tripElement.appendChild(tripInfo);
          tripElement.appendChild(bookButton);
          tripContainer.appendChild(tripElement);
        });
      }
    })
    .catch(error => {
      console.log('An error occurred:', error);
      alert('An error occurred. Please try again later.');
    });
}