import { test, expect } from "@playwright/test";

test("buyer can submit an enquiry and admin can see the lead", async ({ page }) => {

  // 1. Open the published catalogue
  await page.goto("/catalogue/premium-corporate-essentials");

  await expect(
    page.getByRole("heading", { name: "Premium corporate essentials" }),
  ).toBeVisible();

  // 2. Open a product
  await page
    .getByRole("link", { name: "Studio wireless headphones" })
    .click();

  await expect(
    page.getByRole("heading", { name: "Studio wireless headphones" }),
  ).toBeVisible();

  // 3. Open the enquiry form
  await page.getByRole("button", { name: "Contact Us" }).click();

  await expect(
    page.locator('[data-slot="dialog-title"]', {
      hasText: "Contact supplier",
    }),
  ).toBeVisible();

  // 4. Fill buyer details
  await page
    .locator("#contact-name")
    .fill("Kishan Kumar Srivastav");

  await page
    .locator("#contact-phone")
    .fill("8369628082");

  await page
    .locator("#contact-quantity")
    .fill("50");

  // 5. Submit enquiry
  await page.getByRole("button", { name: "Send enquiry" }).click();

  // 6. Capture the enquiry reference
  const reference = (
    await page
      .locator("span.font-mono.font-semibold.text-brand")
      .textContent()
  )?.trim();

  expect(reference).toMatch(/^ENQ-\d+$/);

  // 7. Verify enquiry was successfully submitted
  await expect(
    page.getByRole("heading", { name: "Enquiry sent" }),
  ).toBeVisible();

  // 8. Open the normal login page
  await page.goto("/login");

  // 9. Enter admin credentials
  await page.getByLabel("Email").fill("admin@catalogue.test");
  await page.getByLabel("Password").fill("Admin#2026");

  // 10. Sign in
  await page.getByRole("button", { name: /sign in|login/i }).click();

  // 11. Open Leads
  await page.getByRole("link", { name: "Leads" }).click();

  // 12. Verify the same enquiry reference exists in Leads
  await expect(
    page.getByText(reference!),
  ).toBeVisible();
});