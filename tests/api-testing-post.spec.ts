import { APIRequestContext, test, request, expect } from "@playwright/test";


// Declare a variable to hold the shared API request context.
let requestContext: APIRequestContext;


// beforeAll hook: runs once before all tests.
// Creates a global request context with a base URL and default headers.
test.beforeAll("Pass base URL and headers for all tests", async () => {
  requestContext = await request.newContext({
    baseURL: "https://restful-booker.herokuapp.com", // Base URL for all API calls in this context.
    extraHTTPHeaders: {
      "Accept": "application/json",           // Informs the server that the client expects JSON responses.
      "Content-Type": "application/json"        // Sets the content type of the request body to JSON.
    }
  });
});


// Test: Create a new booking using a POST request.
test("API Testing POST Practice - Create Booking", async () => {
  // Send a POST request to the /booking endpoint with booking data.
  const response = await requestContext.post("/booking", {
    data: {
      "firstname": "Jim",
      "lastname": "Brown",
      "totalprice": 111,
      "depositpaid": true,
      "bookingdates": {
        "checkin": "2018-01-01",
        "checkout": "2019-01-01"
      },
      "additionalneeds": "Breakfast"
    }
  });

  // Parse the JSON response into an object.
  const booking = await response.json();
  console.log(booking);

  // Assert that the response status is 200 OK.
  expect(response.status()).toBe(200);
  // Assert that the response status text is "OK".
  expect(response.statusText()).toBe("OK");
  // Assert that the booking response is an object.
  expect(booking).toBeInstanceOf(Object);
  // Assert that the booking details match the expected values.
  expect(booking.booking).toMatchObject({
    firstname: 'Jim',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: { checkin: '2018-01-01', checkout: '2019-01-01' },
    additionalneeds: 'Breakfast'
  });
});


// This test sends a POST request to add an item to the cart on a different API endpoint and checks the response.
test.only("API Testing POST Practice - UI validation", async ({ request, page }) => {
  // Send a POST request to the given URL with specified data.
  const response = await request.post("https://api.demoblaze.com/addtocart", {
    data: {
      "id": "0ea87618-5023-df7c-0407-c6c8e67bc7da",
      "cookie": "user=8e426ce0-74da-eb6d-c8cd-a4ffc45f797a",
      "prod_id": 5,
      "flag": false
    }
  });
  // Assert that the API response status is 200 OK.
  expect(response.status()).toBe(200);

});
