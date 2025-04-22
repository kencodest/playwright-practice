import { test, expect } from '@playwright/test'

export default class CheckoutPage {

    constructor(page){
        this.page = page;

    };

    async checkout(username, country, countryPrefix){
        // Proceed to checkout
        await this.page.locator('text=Checkout').click();
    
        // Start typing 'ind' into the country input with a typing delay
        await this.page.locator('[placeholder*="Country"]').pressSequentially(countryPrefix, { delay: 100 });
    
        // Wait for the dropdown with suggestions to appear
        const dropdown = this.page.locator('.ta-item');
        await dropdown.nth(0).waitFor();

        // Use selectOption()
        await dropdown.selectOption(country);

        // const optionCount = await dropdown.count();
    
        // // Select "India" from the list
        // for (let i = 0; i < optionCount; ++i) {
        //     const text = await dropdown.nth(i).textContent();
        //     if (text.trim() === country) {
        //         await dropdown.nth(i).click();
        //         break;
        //     }
        // }
    
        // Assert that the email shown matches the logged-in user
        await expect(this.page.locator('.user__name [type="text"]').nth(0)).toHaveText(username);
    
        // Submit the order
        await this.page.locator('a.action__submit').click();

        // Confirm the order submission message
        await expect(this.page.locator('.hero-primary')).toHaveText('Thankyou for the order.');

        // Capture the order ID from the confirmation page
        const orderId = await this.page.locator('.em-spacer-1 .ng-star-inserted').textContent();
        console.log(orderId);

        // Navigate to the "My Orders" section
        await this.page.locator('button[routerlink*="myorders"]').click();
        await this.page.locator('tbody').waitFor();

        const rows = this.page.locator('tbody tr');

        // Loop through all orders to find the one just created
        for (let i = 0; i < await rows.count(); ++i) {
            const rowOrderId = await rows.nth(i).locator('th').textContent();
            if (orderId.includes(rowOrderId)) {
                await rows.nth(i).locator('button').first().click();
                break;
            }
        }

        // Verify that the order details page matches the expected order ID
        const orderDetails = await this.page.locator('.col-text').textContent();
        expect(orderId.includes(orderDetails)).toBeTruthy();
    };
}