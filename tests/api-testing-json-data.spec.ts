import { APIRequestContext, test, request, expect } from "@playwright/test";
import * as testData from "../utils/test-data/api-data.json" // Import test data from a JSON file

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


test("API Testing POST Practice - Passing data from a JSON file - Create Booking", async () => {
    const response = await requestContext.post("/booking", {
        data: testData.postData
    });

    // Parse the JSON response into an object.
    const booking = await response.json();
    // console.log(booking);

    // Assert that the response status is 200 OK.
    expect(response.status()).toBe(200);
    // Assert that the response status text is "OK".
    expect(response.statusText()).toBe("OK");
    // Assert that the booking response is an object.
    expect(booking).toBeInstanceOf(Object);
    // Assert that the booking details match the expected values.
    expect(booking.booking).toMatchObject(testData.postData);
});


test("API Testing PUT Practice - Passing data from a JSON file - Update Booking", async () => {
  // Send a PUT request to update the booking with ID 1.
  const response = await requestContext.put("/booking/1", {
    data: testData.putData
  });

  // Parse the response JSON to obtain the updated booking details.
  const updatedBooking = await response.json();
//   console.log(updatedBooking);

  // Assert that the response status code is 200 (OK).
  expect(response.status()).toBe(200);
  // Assert that the response status text is "OK".
  expect(response.statusText()).toBe("OK");
  // Verify that the updated booking is returned as an object.
  expect(updatedBooking).toBeInstanceOf(Object);

  // Send a GET request to retrieve the booking details after update.
  const getResponse = await requestContext.get("/booking/1");
  // Compare the updated booking with the test data to ensure the update was successful.
  expect(updatedBooking).toMatchObject(await getResponse.json());
});