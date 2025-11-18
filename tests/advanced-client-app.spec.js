import { test, expect, request, APIRequestContext } from '@playwright/test';
import ApiUtils from '../utils/api/apiUtils';

// Declare variables to store token and orderId globally
let token;
let orderId;

// Payload used to login via API
const loginPayload = {
    'userEmail': 'anshika@gmail.com',
    'userPassword': 'Iamking@000'
}

// Payload used to create an order via API
const orderPayload = {
    orders: [{
        country: "Cuba",
        productOrderedId: "67a8dde5c0d3e6622a297cc8"
    }]
}

// ----------------------------
// Hook: Runs once before all tests
// ----------------------------
test.beforeAll(async function () {
    // Create a new API context with base URL
    const apiContext = await request.newContext({
        baseURL: 'https://rahulshettyacademy.com'
    });

    // Initialize utility class with context and login credentials
    const apiUtils = new ApiUtils(apiContext, loginPayload);

    // Get authentication token using API login
    token = await apiUtils.getToken();

    // Create an order and capture its ID
    orderId = await apiUtils.createOrder(orderPayload);
});

// ----------------------------
// Test: Verify order appears in client app
// ----------------------------
test('Client App Playwright + APIs', async function ({ page }) {
    // Inject the token into local storage before page loads
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

    const productName = 'ZARA COAT 3';

    // Navigate to the client app
    await page.goto('https://rahulshettyacademy.com/client/');

    // Click on the "My Orders" button
    await page.locator('button[routerlink*="myorders"]').click();

    // Wait for the order table to appear
    await page.locator('tbody').waitFor();

    // Get all rows from the order table
    const rows = page.locator('tbody tr');

    // Loop through each row to find the matching order ID
    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator('th').textContent();

        // If the row's order ID matches the one we created, click to view details
        if (orderId.includes(rowOrderId)) {
            await rows.nth(i).locator('button').first().click();
            break;
        }
    }

    // Get the order details text
    const orderDetails = await page.locator('.col-text').textContent();       

    // Assert that the order details contain the correct order ID
    expect(orderId.includes(orderDetails)).toBeTruthy();
});
