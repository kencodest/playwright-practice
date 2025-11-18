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

// Test: Perform a partial update (PATCH) on a booking.
test("API Testing PATCH Practice - Partial Booking Update", async () => {
  // Send a PATCH request to update specific fields of booking with ID 1.
  const response = await requestContext.patch("booking/1", {
    data: {
      "firstname": "Alicia", // New first name to update.
      "lastname": "Brown"    // New last name to update.
    }
  });

  // Parse the response JSON to retrieve the updated booking details.
  const updatedBooking = await response.json();
  console.log(updatedBooking);

  // Assert that the response status code is 200 (OK), indicating success.
  expect(response.status()).toBe(200);
  // Assert that the response status text is "OK".
  expect(response.statusText()).toBe("OK");
  // Verify that the response data is an object.
  expect(updatedBooking).toBeInstanceOf(Object);

  // Retrieve the booking details after the update to verify changes.
  const getResponse = await requestContext.get("/booking/1");
  // Compare the updated booking with the GET response to confirm the update was applied correctly.
  expect(updatedBooking).toMatchObject(await getResponse.json());
});
