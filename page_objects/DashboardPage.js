import { expect } from '@playwright/test'

export default class DashboardPage {

    constructor(page){
        this.page = page;
        this.products = this.page.locator('.card-body');
        this.productsTitles = this.page.locator('.card-body b');
        this.cart = this.page.locator('[routerlink*="cart"]');
    };


    async searchProductAddCart(productName){
        // Get all product cards and their titles
        const titles = await this.productsTitles.allTextContents();
        console.log(titles);
        const count = await this.products.count();

        // Find the product with the specified name and click "Add To Cart"
        for (let i = 0; i < count; i++) {
            if (await this.products.nth(i).locator('b').textContent() === productName) {
                await this.products.nth(i).locator('text = Add To Cart').click();
                break;
            }
        }
    };

    async navigateToCart(productName){
        await this.cart.click();

        // Wait for the cart to load and assert that the correct product is visible
        await this.page.locator('div li').first().waitFor();
        const bool = await this.page.locator(`h3:has-text("${productName}")`).isVisible();
        expect(bool).toBeTruthy();
    };
    
}