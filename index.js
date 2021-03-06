//wave 1
const URL = 'https://trektravel.herokuapp.com/trips';
let currentTripID = 0;

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};

//load trips wave 1
const loadTrips = () => {
  reportStatus("loading trip detail...");

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      const trips = $(`<li>${trip.name}</li>`)
      tripList.append(trips);
      trips.on('click', () => {
        loadTripDetails(`${trip.id}`)
      });
      trips.on("click", function() {
        $("#addForm").toggle()
        currentTripID = trip.id
      });
    });
  })
  .catch((error) => {
    reportStatus(error);
  });
};

//wave 2

const URL1 = 'https://trektravel.herokuapp.com/trips/';

const loadTripDetails = (tripId) => {

  reportStatus("loading trips...")

  const tripDetail = $('#trip-detail');
  tripDetail.empty();

  axios.get(URL1+`${tripId}`)
  .then((response) => {
    reportStatus(`successfully loaded individual trip ${response.data.id}`)
    tripDetail.append(`<p> Trip Detail </p>`);
    tripDetail.append(`<li>Id: ${response.data.id}</li>`);
    tripDetail.append(`<li>Name: ${response.data.name}</li>`);
    tripDetail.append(`<li>continent: ${response.data.continent}</li>`);
    tripDetail.append(`<li> Details: ${response.data.about}</li>`);
    tripDetail.append(`<li> Category: ${response.data.category}</li>`);
    tripDetail.append(`<li> Weeks: ${response.data.weeks}</li>`);
    tripDetail.append(`<li>Cost: ${response.data.cost}</li>`);
  })
  .catch((error) => {
    reportStatus(error);
  });

};


// wave 3 -creating a reservation

const readFormData = () => {
  const parsedFormData = {};

  const nameFromForm = $(`#addForm input[name="name"]`).val();
  parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;

  const emailFromForm = $(`#addForm input[name="email"]`).val();
  parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

  return parsedFormData;
};

const clearForm = () => {
  $(`#addForm input[name="name"]`).val('');
  $(`#addForm input[name="email"]`).val('');
}

const createReservation = (event) => {
  // Note that createPet is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload
  event.preventDefault();

  const reservationData = readFormData();
  console.log(reservationData);

  reportStatus('Sending reservation data...');

  axios.post((URL + `/${currentTripID}/reservations`), reservationData)
  .then((response) => {
    reportStatus(`Successfully added a reservation with ID ${response.data.id}!`);
    clearForm();
  })
  .catch((error) => {
    console.log(error.response);
    if (error.response.data && error.response.data.errors) {
      reportError(
        `Encountered an error: ${error.message}`,
        error.response.data.errors
      );
    } else {
      reportStatus(`Encountered an error: ${error.message}`);
    }
  });
};


$(document).ready(() => {
  $('#button-load-trips').click(loadTrips);
  $('#addForm').submit(createReservation);
});
