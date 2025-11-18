import {test, expect} from "@playwright/test"

test("Authentication Practice Test", async ({page}) => {

    const email = "kenchezbruce@gmail.com";
    const password = "@AutomaterKen123";
    //Open the page
    await page.goto("https://rahulshettyacademy.com/client/");
    // //Register - we can only register once
    // await page.locator(".text-reset").click();
    // //Fill in the required registration fields
    // await page.locator("#firstName").fill("Kennedy");
    // await page.locator("#lastName").fill("Muia");
    // await page.locator("#userEmail").fill(email);
    // await page.locator("#userMobile").fill("1234567890");
    // await page.locator("#userPassword").fill(password);
    // await page.locator("#confirmPassword").fill(password);
    // await page.locator("[type='checkbox']").check();
    // await page.locator("#login").click();
    // await page.locator(".btn btn-primary").click();

    //after registration, login
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill(password);
    await page.locator("#login").click();

    //fetch the title of elements
    // console.log(await page.locator(".card-body b").nth(0).textContent());
    await page.waitForLoadState("networkidle");
    console.log (await page.locator(".card-body b").allTextContents());


});