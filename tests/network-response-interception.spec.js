import { test, expect, request } from '@playwright/test';
import ApiUtils from '../utils/api/apiUtils';

// Declare variables to store authentication token and order ID globally
let token;
let orderId;

// Payload for logging in via the API
const loginPayload = {
    'userEmail': 'anshika@gmail.com',
    'userPassword': 'Iamking@000'
};

// Fake response payload used to intercept and mock the real order response
const fakePayload = {
    "data": [],
    "message": "No Orders"
};

// ----------------------------
// Hook: Runs once before all tests
// ----------------------------
test.beforeAll(async function () {
    // Create a new API context with the specified base URL
    const apiContext = await request.newContext({
        baseURL: 'https://rahulshettyacademy.com'
    });

    // Create an instance of the API utility class with context and login data
    const apiUtils = new ApiUtils(apiContext, loginPayload);

    // Get authentication token using login API
    token = await apiUtils.getToken();

});

// ----------------------------
// Test Case: Network Interception
// Purpose: Verify that intercepted response shows "No Orders"
// ----------------------------
test('Network Response Interception', async function ({ page }) {
    // Inject the authentication token into local storage before the page loads
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

    const productName = 'ZARA COAT 3';  // Product name used in actual order (not used in this test directly)

    // Navigate to the client app
    await page.goto('https://rahulshettyacademy.com/client/');

    // Intercept the API response
    await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*', async route => {
        // Optional: This would allow fetching the real response
        // const response = await page.request.fetch(route.request());

        // Fulfill the intercepted request with fake data (mocked response)
        await route.fulfill({
            body: JSON.stringify(fakePayload)
        });
    });

    // Click on the "My Orders" button in the UI
    await page.locator('button[routerlink*="myorders"]').click();

    // Capture the text that appears when there are no orders
    const noOrderText = await page.locator('.mt-4').textContent();

    // Assert that the text content is the expected "No Orders" message
    expect(await page.locator('.mt-4').textContent()).toEqual(noOrderText);
});
