import { test, expect } from '@playwright/test';

test.describe('Intelligent Coding IDE', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the coding IDE
    await page.goto('/coding');
  });

  test('should load the MANG 250 DB and default to Arrays & Hashing', async ({ page }) => {
    // Check if the drawer button exists
    const dbButton = page.locator('text=MANG 250 DB');
    await expect(dbButton).toBeVisible();

    // The drawer should be open by default
    const drawerHeader = page.locator('text=MANG 250 Database');
    await expect(drawerHeader).toBeVisible();

    // The active problem should be "Concatenation of Array" (the first problem)
    const title = page.locator('h1');
    await expect(title).toHaveText(/Concatenation of Array|Two Sum/);
  });

  test('should execute code and return a verdict', async ({ page }) => {
    // Locate the Run Code button
    const runButton = page.locator('button:has-text("Run Code")');
    await expect(runButton).toBeVisible();

    // Click Run Code
    await runButton.click();

    // It should show Evaluating state
    const evaluatingText = page.locator('text=Evaluating...');
    await expect(evaluatingText).toBeVisible();

    // After evaluation (mocked 800ms delay), it should show a result (Failed or Accepted)
    // Since default code just returns input, it will likely fail for complex problems, 
    // but pass for a mock test case that expects the input to equal the output.
    const resultAlert = page.locator('.border-red-500\\/30, .border-emerald-500\\/30').first();
    await expect(resultAlert).toBeVisible({ timeout: 2000 });
  });

  test('should progressively reveal AI hints', async ({ page }) => {
    // Locate the AI Mentor panel
    const hintButton = page.locator('button:has-text("Give me a hint")');
    await expect(hintButton).toBeVisible();

    // Click for first hint (Concept)
    await hintButton.click();
    await expect(page.locator('text=Concept')).toBeVisible();

    // Click for more help (Approach)
    const moreHelpButton = page.locator('button:has-text("I need more help")');
    await moreHelpButton.click();
    await expect(page.locator('text=Approach')).toBeVisible();

    // Click for final hint (Pseudocode)
    await moreHelpButton.click();
    await expect(page.locator('text=Pseudocode')).toBeVisible();
  });
});
