import { APIRequestContext, test, request, expect } from "@playwright/test";

// Declare a global variable to hold the shared API request context.
let requestContext: APIRequestContext;

// beforeAll hook: executed once before all tests to set up the API context.
test.beforeAll("Pass base URL and headers for all tests", async () => {
  // Create a new API request context with a base URL and default HTTP headers.
  requestContext = await request.newContext({
    baseURL: "https://restful-booker.herokuapp.com", // Base URL for all API calls in this context.
    extraHTTPHeaders: {
      "Content-Type": "application/json",       // Request bodies will be sent as JSON.
      "Authorization": "Basic YWRtaW46cGFzc3dvcmQxMjM=" // Authorization header for secured endpoints.
    }
  });
});

// Test: Delete a booking and validate API responses.
test("API Testing DELETE Practice - Delete Booking", async () => {
  // Attempt to delete booking with ID 5.
  const response = await requestContext.delete("/booking/5");

  // Assert that the deletion response returns a 201 status ("Created").
  expect(response.status()).toBe(201);
  expect(response.statusText()).toBe("Created");

  // Attempt to delete the same booking again.
  // Expect a 405 status ("Method Not Allowed") because the booking has already been deleted.
  const response2 = await requestContext.delete("/booking/5");
  expect(response2.status()).toBe(405);
  expect(response2.statusText()).toBe("Method Not Allowed");

  // Attempt to retrieve the deleted booking.
  // Expect a 404 status ("Not Found") indicating that the booking no longer exists.
  const response3 = await requestContext.get("/booking/5");
  expect(response3.status()).toBe(404);
  expect(response3.statusText()).toBe("Not Found");
});
