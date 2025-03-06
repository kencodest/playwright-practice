const {test, expect} = require("@playwright/test");
// import {test} from "@playwright/test"


// Browser context
test("Browser Context Playwright test", async ({browser}) => 
{
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const usernameLocator = page.locator("#username");
    const signInLocator = page.locator("#signInBtn");

    await page.goto("https://rahulshettyacademy.com/loginpagePractise");
    // console.log(await page.title());
    //fill in username
    await usernameLocator.fill("kennedy");
    //fill in password
    await page.locator("[type='password']").fill("learning");
    await signInLocator.click();
    // console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText("Incorrect");
    //remove the wrong username and enter the correct one
    await usernameLocator.fill("");
    await usernameLocator.fill("rahulshettyacademy");
    await signInLocator.click();

    //User has signed in
    //get the title of the first element
    console.log(await page.locator(".card-body a").nth(0).textContent());
    // get all titles of all elements
    // await page.locator(".card-body a").first().waitFor();
    console.log(await page.locator(".card-body a").allTextContents());

});


// Page context
test("Page Playwright test", async ({page}) =>
{
    await page.goto("https://google.com");
    // get the title of the page
    console.log(await page.title());
    //assert if the title is correct
    await expect(page).toHaveTitle("Google");

});

//Dropdowns
test.only("UI Controls", async ({page}) => {
    
    await page.goto("https://rahulshettyacademy.com/loginpagePractise");
    const usernameLocator = page.locator("#username");
    const signInLocator = page.locator("#signInBtn");

    //click radio button
    await page.locator(".radiotextsty").nth(1).click();
    await page.locator("#okayBtn").click();
    await expect(page.locator(".radiotextsty").nth(1)).toBeChecked();

    //select dropdown
    await page.locator("select.form-control").selectOption("consult");

    //check the checbox
    await page.locator("#terms").check();
    await expect(page.locator("#terms")).toBeChecked();
    //uncheck the checkbox
    await page.locator("#terms").uncheck();
    await expect(page.locator("#terms")).not.toBeChecked();
    await page.pause();
});