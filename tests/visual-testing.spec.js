import { test, expect } from '@playwright/test';

// Define a test titled "Pop-up validations"
test('Screenshot & Visual Comparison', async function ({ page }) {

  // Navigate to the practice automation website
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/');

  // Assert that the textbox is initially visible
  await expect(page.locator('#displayed-text')).toBeVisible();

  // screenhot locator
  await page.locator('#displayed-text').screenshot({
    path: 'screenshot.png'
  });

  // Click the "Hide" button to hide the textbox
  await page.locator('#hide-textbox').click();

  //screenshot whole page
  await page.screenshot({
    path: 'screenshot1.png'
  });

  await expect(page.locator('#displayed-text')).toBeHidden();

  await page.goto('https://www.google.com');
  
  //perform visual testing of the screenshots
  expect(await page.screenshot()).toMatchSnapshot('screenshot.png');

});
