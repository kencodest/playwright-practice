import { test, expect } from '@playwright/test';

// Define a test titled "Pop-up validations"
test('Pop-up validations', async function ({ page }) {

  // Navigate to the practice automation website
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/');

  // Assert that the textbox is initially visible
  await expect(page.locator('#displayed-text')).toBeVisible();

  // Click the "Hide" button to hide the textbox
  await page.locator('#hide-textbox').click();

  // Click the "Show" button to make the textbox visible again
  await page.locator('#show-textbox').click();

  // Assert that the textbox is visible again after clicking "Show"
  await expect(page.locator('#displayed-text')).toBeVisible();

  // Set up a listener to automatically accept any dialog (alert, confirm, prompt)
  page.on('dialog', dialog => dialog.accept());

  // Click the "Confirm" button to trigger the confirm dialog
  await page.locator('#confirmbtn').click();

  // Hover over the "Mouse Hover" element to test hover behavior
  await page.locator('#mousehover').hover();

  // Interact with an iframe on the page
  const framePage = page.frameLocator('#courses-iframe');

  // Inside the iframe: Click the link for lifetime access course
  await framePage.locator('li a[href*="lifetime-access"]:visible').click();

  // Inside the iframe: Extract the text from the heading (e.g., "Join now to get lifetime access")
  const grabbedText = await framePage.locator('.text h2').textContent();

  // Log the second word from the heading (after splitting by space)
  console.log(grabbedText.split(' ')[1]);

});
