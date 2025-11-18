const { test, expect } = require("@playwright/test");

// ----------------------------
// Test 1: Browser Context - Simulating Multiple Users or Clean Sessions
// ----------------------------
test("Browser Context Playwright test", async ({ browser }) => {
    // Create a new isolated browser context
    const context = await browser.newContext();
    const page = await context.newPage();

    const usernameLocator = page.locator("#username");
    const signInLocator = page.locator("#signInBtn");

    // Navigate to login page
    await page.goto("https://rahulshettyacademy.com/loginpagePractise");

    // Fill in wrong username and password
    await usernameLocator.fill("kennedy");
    await page.locator("[type='password']").fill("learning");

    // Click sign in and assert error appears
    await signInLocator.click();
    await expect(page.locator("[style*='block']")).toContainText("Incorrect");

    // Clear the username and enter the correct one
    await usernameLocator.fill("");
    await usernameLocator.fill("rahulshettyacademy");
    await signInLocator.click();

    // User is now signed in
    // Log the first product title
    console.log(await page.locator(".card-body a").nth(0).textContent());

    // Log all product titles
    console.log(await page.locator(".card-body a").allTextContents());
});

// ----------------------------
// Test 2: Page Context - Basic Navigation and Title Assertion
// ----------------------------
test("Page Playwright test", async ({ page }) => {
    await page.goto("https://google.com");

    // Log the title of the page
    console.log(await page.title());

    // Assert the title is "Google"
    await expect(page).toHaveTitle("Google");
});

// ----------------------------
// Test 3: UI Controls - Radio buttons, checkboxes, dropdowns, and dynamic attributes
// ----------------------------
test("UI Controls", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise");

    const usernameLocator = page.locator("#username");
    const signInLocator = page.locator("#signInBtn");

    // Select the second radio button ("User")
    await page.locator(".radiotextsty").nth(1).click();

    // Handle confirmation popup
    await page.locator("#okayBtn").click();

    // Assert that the selected radio button is checked
    await expect(page.locator(".radiotextsty").nth(1)).toBeChecked();

    // Select "Consultant" from the dropdown
    await page.locator("select.form-control").selectOption("consult");

    // Check the "Terms and Conditions" checkbox and assert it's checked
    await page.locator("#terms").check();
    await expect(page.locator("#terms")).toBeChecked();

    // Uncheck it and assert it's unchecked
    await page.locator("#terms").uncheck();
    await expect(page.locator("#terms")).not.toBeChecked();

    // Assert that the blinking text has the correct class
    await expect(page.locator("[href*='documents-request']")).toHaveAttribute("class", "blinkingText");
});

// ----------------------------
// Test 4: Child Windows - Handle new tab and extract info from it
// ----------------------------
test("Child windows handling", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = await page.locator("[href*='documents-request']");

    // Wait for a new page (tab) to open upon clicking the link
    const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        documentLink.click() // This triggers the new page
    ]);

    // Log the title of the newly opened tab
    console.log(await newPage.title());

    // Extract text content containing the email address
    const text = await newPage.locator(".red").textContent();
    console.log(text);

    // Extract the email from the string
    const splitText = text.split(" ");
    const email = splitText[4];
    console.log(email);

    // Fill the extracted email back into the original login form
    const usernameLocator = page.locator("#username");
    await usernameLocator.fill(email);
});
