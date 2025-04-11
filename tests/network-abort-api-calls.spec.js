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
test('Network Request Interception', async function ({ page }) {
    // Inject the authentication token into local storage before the page loads
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

    const productName = 'ZARA COAT 3';  // Product name used in actual order (not used in this test directly)

    // Navigate to the client app
    await page.goto('https://rahulshettyacademy.com/client/');

    await page.locator('button[routerlink*="myorders"]').click();

    // Intercept the API request
    await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*', async route => {
        await route.continue({
            url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=67f85e5afc76541aad29c042'
        });
    });

    // await page.pause();
    await page.locator('button:has-text("View")').nth(0).click();
    await page.pause();

    const notAuthorizedText = await page.locator('.blink_me').textContent();
    // console.log(notAuthorizedText);

    expect(await page.locator('.blink_me').textContent()).toEqual(notAuthorizedText);

});
