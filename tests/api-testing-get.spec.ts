import { test, request, APIRequestContext, expect } from "@playwright/test";


// Declare a global variable to hold a shared API request context.
let requestContext2: APIRequestContext;


// Before all tests run, create a global API request context with a base URL and default headers.
test.beforeAll("Pass the base URL before all tests", async () => {
  // Create a new request context with the specified base URL and HTTP headers.
  requestContext2 = await request.newContext({
    baseURL: "https://restful-booker.herokuapp.com",
    extraHTTPHeaders: {
      "Accept": "application/json" // All requests will accept JSON responses.
    }
  });
});


// Test using the default request fixture to get booking IDs.
test("API Testing Get Practice - request fixture - Get booking IDs", async ({ request }) => {
  // Send a GET request to the full URL.
  const response = await request.get("https://restful-booker.herokuapp.com/booking", {
    headers: {
      "Accept": "application/json" // Override header if needed.
    }
  });
  // Parse the JSON response containing booking IDs.
  const ids = await response.json();
  console.log(ids); // Log the response to the console.
});


// Test creating a local API context with base URL and headers, then fetching booking IDs.
test("Passing base URL in the local API Context - Get booking IDs", async () => {
  // Create a local request context for this test with a base URL.
  const requestContext = await request.newContext({
    baseURL: "https://restful-booker.herokuapp.com",
    extraHTTPHeaders: {
      "Accept": "application/json"
    }
  });
  // Send a GET request using the base URL defined in the context.
  const response = await requestContext.get("/booking");
  // Parse the JSON response containing booking IDs.
  const ids = await response.json();
  console.log(ids);
});


// Test using the global API request context created in beforeAll to fetch booking IDs.
test("Passing base URL in the global API Context - Get booking IDs", async () => {
  // Use the pre-configured global request context.
  const response = await requestContext2.get("/booking");
  // Parse the JSON response.
  const ids = await response.json();
  console.log(ids);
});


// Test fetching a single booking using path parameters, with assertions to validate the response.
test("Passing path parameters - global API context - Get a booking", async () => {
  // Send a GET request to retrieve booking details for booking ID 7.
  const response = await requestContext2.get("/booking/7");
  // Parse the booking details from the response.
  const booking = await response.json();
  console.log(booking);

  // Assert that the response status is 200 (OK).
  expect(response.status()).toBe(200);
  // Assert that the parsed JSON is an object.
  expect(response.json()).toBeInstanceOf(Object);
  // Compare the response with an expected object structure.
  expect(await response.json()).toMatchObject({
    firstname: "Eric",
    lastname: "Jones",
    totalprice: 326,
    depositpaid: true,
    bookingdates: { checkin: '2018-03-26', checkout: '2018-08-02' },
    additionalneeds: 'Breakfast'
  });
  // Assert that the 'firstname' property in the booking object equals "Eric".
  expect(booking.firstname).toEqual("Eric");
});


// Test fetching bookings using query parameters to filter results.
test("Passing query parameters - global API context - Get a booking", async () => {
  // Send a GET request with query parameters for firstname and lastname.
  const response = await requestContext2.get("/booking", {
    params: {
      "firstname": "Sally",
      "lastname": "Smith"
    }
  });
  // Parse the response containing filtered booking data.
  const booking = await response.json();
  console.log(booking);
});


// Test integrating API data with UI validation using the request fixture and page context.
test.only("API with UI validation", async ({ request, page }) => {
  // Send a GET request to fetch API entries.
  const response = await request.get("https://api.demoblaze.com/entries");
  // Parse the JSON response.
  const items = await response.json();
  
  // Navigate to the UI page.
  await page.goto("https://demoblaze.com");
  // Retrieve the title from the first product link on the page.
  const title = await page.locator(".hrefch").nth(0).textContent();
  // Assert that the UI title matches the API title.
  expect(title).toEqual(items.Items[0].title);
});
