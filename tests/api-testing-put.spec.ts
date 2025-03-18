import { APIRequestContext, test, request, expect } from "@playwright/test";


// Declare a global variable to hold the shared API request context.
let requestContext: APIRequestContext;


// beforeAll hook: executed once before all tests to set up the API context.
test.beforeAll("Pass base URL and headers for all tests", async () => {
  // Create a new API request context with a base URL and default HTTP headers.
  requestContext = await request.newContext({
    baseURL: "https://restful-booker.herokuapp.com", // Base URL for all subsequent API calls.
    extraHTTPHeaders: {
      "Accept": "application/json",           // Expect JSON responses from the server.
      "Content-Type": "application/json",       // Send request bodies in JSON format.
      "Authorization": "Basic YWRtaW46cGFzc3dvcmQxMjM=" // Basic auth header for secured endpoints.
    }
  });
});


// Test: Update an existing booking using a PUT request.
test("API Testing PUT Practice - Update Booking", async () => {
  // Send a PUT request to update the booking with ID 1.
  const response = await requestContext.put("/booking/1", {
    data: {
      "firstname": "James",
      "lastname": "Brown",
      "totalprice": 111,
      "depositpaid": true,
      "bookingdates": {
        "checkin": "2018-01-01",
        "checkout": "2019-01-01"
      },
      "additionalneeds": "Pancakes"
    }
  });

  // Parse the response JSON to obtain the updated booking details.
  const updatedBooking = await response.json();
  console.log(updatedBooking);

  // Assert that the response status code is 200 (OK).
  expect(response.status()).toBe(200);
  // Assert that the response status text is "OK".
  expect(response.statusText()).toBe("OK");
  // Verify that the updated booking is returned as an object.
  expect(updatedBooking).toBeInstanceOf(Object);

  // Send a GET request to retrieve the booking details after update.
  const getResponse = await requestContext.get("/booking/1");
  // Compare the updated booking with the data from the GET response to ensure the update was successful.
  expect(updatedBooking).toMatchObject(await getResponse.json());
});
