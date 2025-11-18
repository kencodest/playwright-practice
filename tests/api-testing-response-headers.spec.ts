import { APIRequestContext, test, request, expect } from "@playwright/test";

// Declare a global variable to hold the shared API request context.
let requestContext: APIRequestContext;

// beforeAll hook: executed once before all tests to set up the API context.
test.beforeAll("Pass base URL and headers for all tests", async () => {
  // Create a new API request context with the specified base URL and default HTTP headers.
  requestContext = await request.newContext({
    baseURL: "https://restful-booker.herokuapp.com", // Base URL for all subsequent API calls.
    extraHTTPHeaders: {
      "Accept": "application/json",           // Instructs the server to send responses in JSON format.
    }
  });
});

// Test: Fetch a booking and validate its response headers.
test("API Testing Practice - Fetch and validate response headers", async () => {
  // Send a GET request to retrieve booking details for booking ID 10.
  const response = await requestContext.get("/booking/10");

  // Retrieve the response headers as an object.
  const headers = response.headers();
  // Log the headers for debugging
  console.log(headers);

  // Assert that the "server" header equals "Cowboy".
  expect(headers.server).toEqual("Cowboy");

  // Assert that the "x-powered-by" header equals "Express".
  // Note: Since the header contains hyphens, we use bracket notation instead of dot notation.
  expect(headers["x-powered-by"]).toEqual("Express");

  // Assert that the total number of headers (object keys) is 11.
  expect(Object.keys(headers).length).toEqual(11);

  // Retrieve the response headers as an array of header objects.
  const headersArray = response.headersArray();
  // Log the array for debugging
  console.log(headersArray);

  // Assert that the length of the headers array is 11.
  expect(headersArray.length).toEqual(11);

  // Loop through each header in the array and log its name and value.
  headersArray.forEach((header) => {
    console.log(`${header.name}:: ${header.value}`);
  });
});
