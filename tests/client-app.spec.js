import { test, expect, request, APIRequestContext } from '@playwright/test';

let token;
const loginPayload = {
    'userEmail': 'anshika@gmail.com',
    'userPassword': 'Iamking@000'
}



// executed once before all tests
test.beforeAll( async function () {
    const apiContext = await request.newContext({
        baseURL: 'https://rahulshettyacademy.com'
    });

    const loginResponseObject = await apiContext.post('/api/ecom/auth/login', {
        data: loginPayload
    });

    expect(loginResponseObject.ok()).toBeTruthy();
    const loginResponseJson = await loginResponseObject.json();
    token = loginResponseJson.token;
    // console.log(token);
});


test('Client App Login', async function ( { page } ) {
    page.addInitScript( value => {
        window.localStorage.setItem('token', value);
    }, token);

    // await page.pause();
    const productName = 'ZARA COAT 3';
    await page.goto('https://rahulshettyacademy.com/client/');
    const products = page.locator('.card-body');
    const titles = await page.locator('.card-body b').allTextContents();
    // console.log(titles);
    const count = await products.count();
    // await page.pause();
    for(let i=0; i<count; i++){
        if( await products.nth(i).locator('b').textContent() === productName) {
            //add to cart
            await products.nth(i).locator('text = Add To Cart').click();
            break;
        };
    };
    await page.locator('[routerlink*="cart"]').click();
    await page.locator('div li').first().waitFor();
    const bool = await page.locator('h3:has-text("ZARA COAT 3")').isVisible();
    expect(bool).toBeTruthy();
    await page.locator('text=Checkout').click();
    await page.locator('[placeholder*="Country"]').pressSequentially('ind',{ delay: 100});
    const dropdown = page.locator('.ta-item');
    await dropdown.nth(0).waitFor();
    const optionCount = await dropdown.count();
    for(let i=0; i<optionCount; ++i) {
        let text = await dropdown.nth(i).textContent();
        if(text.trim() === 'India') {
            await dropdown.nth(i).click();
            break;
        };
    };

    await expect(page.locator('.user__name [type="text"]').nth(0)).toHaveText(loginPayload.userEmail);
    await page.locator('a.action__submit').click();

    await expect(page.locator('.hero-primary')).toHaveText('Thankyou for the order.');
    const orderId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
    console.log(orderId);
    await page.locator('button[routerlink*="myorders"]').click();
    await page.locator('tbody').waitFor();
    const rows = page.locator('tbody tr');

    for(let i=0; i<await rows.count(); ++i){
        const rowOrderId = await rows.nth(i).locator('th').textContent();
        if(orderId.includes(rowOrderId)){
            await rows.nth(i).locator('button').first().click();
            break;
        };
    };

    const orderDetails = await page.locator('.col-text').textContent();
    expect(orderId.includes(orderDetails)).toBeTruthy();
});