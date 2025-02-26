const {test, expect} = require('@playwright/test');
// import {test} from '@playwright/test'

// Browser context
test.only('Browser Context Playwright test', async ({browser}) => 
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise');
    console.log(await page.title());
    //fill in username
    await page.locator('#username').fill('kennedy');
    //fill in password
    await page.locator("[type='password']").fill('learning');
    await page.locator('#signInBtn').click();

});


// Page context
test('Page Playwright test', async ({page}) =>
{
    await page.goto('https://google.com');
    // get the title of the page
    console.log(await page.title());
    //assert if the title is correct
    await expect(page).toHaveTitle('Google');

});