import { test, expect } from '@playwright/test'

test('Pop-up validations', async function ({ page }) {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    // await page.goto('https://google.com');
    // await page.goBack();
    // await page.goForward();
    await expect(page.locator('#displayed-text')).toBeVisible();
    await page.locator('#hide-textbox').click();
    await page.locator('#show-textbox').click();
    await expect(page.locator('#displayed-text')).toBeVisible();
    // To accept the dialog
    page.on('dialog', dialog => dialog.accept());
    // //To dismiss the dialog
    // page.on('dialog', dialog => dialog.dismiss());
    await page.locator('#confirmbtn').click();
    await page.pause();
    await page.locator('#mousehover').hover();

    //switch to a frame
    const frame = page.frameLocator('#courses-iframe');
    frame.locator('');

});