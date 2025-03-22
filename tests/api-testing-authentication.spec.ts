import { APIRequestContext, test, request, expect } from "@playwright/test";
import * as testData from "../test-data/api-data.json" // Import test data from a JSON file

// Declare global variables to hold the shared API request context and auth token.
let requestContext: APIRequestContext;
let token: string;

// beforeAll hook: runs once before all tests to set up the API context and authenticate.
test.beforeAll("Pass base URL, headers and auth token for all tests", async () => {
  // Create a new API request context with the base URL and default HTTP headers.
  requestContext = await request.newContext({
    baseURL: "https://restful-booker.herokuapp.com", // Base URL for all subsequent API calls.
    extraHTTPHeaders: {
      "Accept": "application/json",           // Expect JSON responses.
      "Content-Type": "application/json",       // Send request bodies as JSON.
    }
  });

  // Authenticate to obtain an API token.
  const tokenResponse = await requestContext.post("/auth", {
    data: {
      "username": "admin",
      "password": "password123"
    }
  });

  // Parse the JSON response to extract the token.
  const tokenObject = await tokenResponse.json();
  token = tokenObject.token; // Save the token globally for use in subsequent tests.
});

// Test: Update an existing booking using a PUT request with authorization.
test("API Testing PUT Practice - Authorization with API Key", async () => {
  // Send a PUT request to update the booking with ID 1.
  const response = await requestContext.put("/booking/1", {
    // Pass the token in the request header as a cookie for authorization.
    headers: {
      "Cookie": `token=${token}` // Use token from the authentication step.
    },
    // Use the test data from the imported JSON file for the PUT request body.
    data: testData.putData
  });

  // Parse the response JSON to obtain the updated booking details.
  const updatedBooking = await response.json();
  // console.log(updatedBooking); // Optionally log the updated booking for debugging.

  // Validate that the API call was successful.
  expect(response.status()).toBe(200);           // Expect HTTP status code 200 (OK).
  expect(response.statusText()).toBe("OK");        // Expect status text to be "OK".
  expect(updatedBooking).toBeInstanceOf(Object);   // Verify that the response is returned as an object.
});
