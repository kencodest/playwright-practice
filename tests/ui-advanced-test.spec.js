import { test, expect } from "@playwright/test"

test('Playwright Special Locators', async function ({ page }) {
    await page.goto('https://rahulshettyacademy.com/angularpractice/');
    await page.locator('[name="email"]').fill('rahulshetty@gmail.com');
    await page.getByPlaceholder('Password').fill('qwerty12345');
    await page.getByLabel('Check me out if you Love IceCreams!').click();
    await page.getByLabel('Gender').selectOption('Male');
    await page.getByLabel('Employed').click();
    await page.getByRole('button', { name: 'Submit'}).click();
    await page.getByText('Success! The Form has been submitted successfully!.').isVisible();
    await page.getByRole('link', { name: 'Shop'}).click();
    await page.locator('app-card').filter( { hasText: 'Nokia Edge'}).getByRole('link').click();
});

test.only('Handling Calendars', async function ({ page }) {
    const day = '2';
    const month = '6';
    const year = '2027';

    const formattedDay = day.padStart(2, '0');
    const formattedMonth = month.padStart(2, '0');

    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');
    await page.locator('.react-date-picker__inputGroup__input').first().click();
    await page.locator('.react-calendar__navigation__label__labelText').dblclick();
    await page.getByText(year).click();
    await page.locator('.react-calendar__tile').nth(Number(month)-1).click();
    await page.locator(`//abbr[text()="${Number(day)}"]`).first().click();
    console.log(await page.locator('[name="date"]').getAttribute('value'));
    expect(await page.locator('[name="date"]').getAttribute('value')).toEqual(`${year}-${formattedMonth}-${formattedDay}`);
});



