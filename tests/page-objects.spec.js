import { test } from '@playwright/test'
import PageObjectManager from '../page_objects/page-objects-manager';
import testData from "../utils/test-data/place-order-data.json"

let context, page;

for (const data of testData) {
    test(`Page Object Test for product: ${data.productName}`, async function ({browser}) {
        context = await browser.newContext();
        page = await context.newPage(); 
        const pageObjectManager = new PageObjectManager(page);
        const loginPage = pageObjectManager.getLoginPage();
        const dashboardPage = pageObjectManager.getDashboardPage();
        const checkout = pageObjectManager.getCheckoutPage();
        const productName = data.productName;
    
        // Navigate to the client application
        await loginPage.goToLoginPage();
        await loginPage.validLogin(data.username, data.password);
        await page.waitForLoadState("networkidle");
    
        // Search for product and add to cart
        await dashboardPage.searchProductAddCart(productName);
    
        // Go to the cart
        await dashboardPage.navigateToCart(productName);
    
        // Proceed to checkout
        await checkout.checkout(data.username, data.country, data["country-prefix"]);
    
    
    
    });
}
