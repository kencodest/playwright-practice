import { test, expect } from "@playwright/test";

// ----------------------------
// Test 1: Using Playwright's Special Locators
// ----------------------------
test('Playwright Special Locators', async function ({ page }) {
    // Navigate to the Angular Practice form page
    await page.goto('https://rahulshettyacademy.com/angularpractice/');

    // Fill in the email input field by its name attribute
    await page.locator('[name="email"]').fill('rahulshetty@gmail.com');

    // Fill in the password input field using its placeholder text
    await page.getByPlaceholder('Password').fill('qwerty12345');

    // Click the checkbox labeled "Check me out if you Love IceCreams!"
    await page.getByLabel('Check me out if you Love IceCreams!').click();

    // Select "Male" from the Gender dropdown using the label
    await page.getByLabel('Gender').selectOption('Male');

    // Select the "Employed" radio button using its label
    await page.getByLabel('Employed').click();

    // Click the Submit button by its role and visible name
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify that the success message is visible
    await page.getByText('Success! The Form has been submitted successfully!.').isVisible();

    // Click on the "Shop" link using its role and name
    await page.getByRole('link', { name: 'Shop' }).click();

    // Locate the "Nokia Edge" card and click the associated link inside it
    await page.locator('app-card')
        .filter({ hasText: 'Nokia Edge' })
        .getByRole('link')
        .click();
});


// ----------------------------
// Test 2: Handling Calendars (Date Picker Interaction)
// ----------------------------
test.only('Handling Calendars', async function ({ page }) {
    // Define the target day, month, and year for the date picker
    const day = '2';
    const month = '6';
    const year = '2027';

    // Ensure day and month are in two-digit format for comparison (e.g., "02", "06")
    const formattedDay = day.padStart(2, '0');
    const formattedMonth = month.padStart(2, '0');

    // Navigate to the page with the calendar widget
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');

    // Open the date picker by clicking on the input field
    await page.locator('.react-date-picker__inputGroup__input').first().click();

    // Double-click the calendar label to switch to year selection view
    await page.locator('.react-calendar__navigation__label__labelText').dblclick();

    // Select the target year (e.g., 2027)
    await page.getByText(year).click();

    // Select the target month by index (0-based, so subtract 1)
    await page.locator('.react-calendar__tile').nth(Number(month) - 1).click();

    // Select the target day from the calendar using its number
    await page.locator(`//abbr[text()="${Number(day)}"]`).first().click();

    // Log the final value selected in the hidden date input
    console.log(await page.locator('[name="date"]').getAttribute('value'));

    // Assert that the selected date matches the expected formatted date (YYYY-MM-DD)
    expect(
        await page.locator('[name="date"]').getAttribute('value')
    ).toEqual(`${year}-${formattedMonth}-${formattedDay}`);
});



