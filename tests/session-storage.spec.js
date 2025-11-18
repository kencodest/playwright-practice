import { test, expect } from '@playwright/test'

let updatedContext;
const loginPayload = {
    'userEmail': 'anshika@gmail.com',
    'userPassword': 'Iamking@000'
}

test.beforeAll(async function ({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator("#userEmail").fill('anshika@gmail.com');
    await page.locator("#userPassword").fill('Iamking@000');
    await page.locator("#login").click();
    await page.waitForLoadState("networkidle");

    // store the storage state
    await context.storageState({ path: 'state.json' });

    // create a new browser context with the storage state
    updatedContext = await browser.newContext({
        storageState: 'state.json'
    })

});

test('Session Storage Test', async function () {
    const page = await updatedContext.newPage();

    const productName = 'ZARA COAT 3';

    // Navigate to the client application
    await page.goto('https://rahulshettyacademy.com/client/');

    // Get all product cards and their titles
    const products = page.locator('.card-body');
    const titles = await page.locator('.card-body b').allTextContents();
    const count = await products.count();

    // Find the product with the specified name and click "Add To Cart"
    for (let i = 0; i < count; i++) {
        if (await products.nth(i).locator('b').textContent() === productName) {
            await products.nth(i).locator('text = Add To Cart').click();
            break;
        }
    }

    // Go to the cart
    await page.locator('[routerlink*="cart"]').click();

    // Wait for the cart to load and assert that the correct product is visible
    await page.locator('div li').first().waitFor();
    const bool = await page.locator('h3:has-text("ZARA COAT 3")').isVisible();
    expect(bool).toBeTruthy();

    // Proceed to checkout
    await page.locator('text=Checkout').click();

    // Start typing 'ind' into the country input with a typing delay
    await page.locator('[placeholder*="Country"]').pressSequentially('ind', { delay: 100 });

    // Wait for the dropdown with suggestions to appear
    const dropdown = page.locator('.ta-item');
    await dropdown.nth(0).waitFor();
    const optionCount = await dropdown.count();

    // Select "India" from the list
    for (let i = 0; i < optionCount; ++i) {
        const text = await dropdown.nth(i).textContent();
        if (text.trim() === 'India') {
            await dropdown.nth(i).click();
            break;
        }
    }

    // Assert that the email shown matches the logged-in user
    await expect(page.locator('.user__name [type="text"]').nth(0)).toHaveText(loginPayload.userEmail);

    // Submit the order
    await page.locator('a.action__submit').click();

    // Confirm the order submission message
    await expect(page.locator('.hero-primary')).toHaveText('Thankyou for the order.');

    // Capture the order ID from the confirmation page
    const orderId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
    console.log(orderId);

    // Navigate to the "My Orders" section
    await page.locator('button[routerlink*="myorders"]').click();
    await page.locator('tbody').waitFor();

    const rows = page.locator('tbody tr');

    // Loop through all orders to find the one just created
    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator('th').textContent();
        if (orderId.includes(rowOrderId)) {
            await rows.nth(i).locator('button').first().click();
            break;
        }
    }

    // Verify that the order details page matches the expected order ID
    const orderDetails = await page.locator('.col-text').textContent();
    expect(orderId.includes(orderDetails)).toBeTruthy();
})