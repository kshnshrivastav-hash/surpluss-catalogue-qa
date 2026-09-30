
# Write-up

## 1. Strategy

- I prioritized testing based on business impact and risk rather than trying to test every feature.

- I started with catalogue lifecycle behavior because published, draft, and expired catalogues directly affect what buyers can access.

- I then focused on authorization and role boundaries, particularly the distinction between staff and admin capabilities.

- I prioritized server-side authorization because frontend controls alone are not sufficient protection if a restricted server action can still be invoked directly.

- I also tested product pricing and validation because incorrect commercial data can directly affect catalogue accuracy and buyer-facing information.

- I validated the buyer enquiry journey because it represents an important end-to-end business workflow from catalogue browsing through lead creation.

- For automation, I used:
  - Vitest for focused business-logic and server-side authorization tests.
  - Playwright for the browser-based buyer journey.
  - Manual testing for additional pricing and workflow scenarios.

- I focused on a smaller number of meaningful tests and findings rather than creating a large number of low-value test cases.

## 2. The riskiest part of this product

- The riskiest areas are **catalogue lifecycle, authorization, and product pricing**.

- Catalogue lifecycle directly affects whether buyers can access a catalogue and whether its administrative state accurately reflects its configured validity.

- Authorization is particularly important because staff and admin users have different responsibilities. Server-side actions must enforce these boundaries independently of the UI.

- Product pricing is commercially sensitive. Allowing inconsistent pricing values can result in incorrect or misleading catalogue information.

- The buyer enquiry flow is also important because it converts buyer activity into leads that are subsequently managed by administrators.

## 3. What I left out, and why

- I did not attempt exhaustive UI coverage of every product-management field or every catalogue-management screen.

- I prioritized catalogue lifecycle, authorization, pricing validation, and the buyer enquiry journey because these areas presented greater potential business impact.

- I did not prioritize cosmetic UI issues unless they affected functionality or a critical workflow.

- I did not attempt full cross-browser coverage for the Playwright journey because the assessment asks for one reliable end-to-end buyer journey.

- I did not attempt load or performance testing because the assessment time was limited and functional correctness and authorization presented higher immediate risk.

- Import mapping and validation were reviewed at implementation level, but full end-to-end import testing was not performed because no representative CSV/XLSX import file was provided with realistic test data.

- I did not invent an import file solely to claim coverage. Additional import testing would require representative data containing valid and invalid rows, duplicate SKUs, missing fields, pricing variations, and other relevant edge cases.

- During pricing testing, normal discount calculation and equal MRP/offer-price behavior did not reveal defects. The finding recorded in `FINDINGS.md` is specifically the ability to save an offer price greater than MRP.

## 4. AI tool usage

- I used AI as a development and testing assistant, not as a replacement for test analysis.

- I used AI to help understand the existing codebase, identify relevant files, explain unfamiliar code, and suggest possible test scenarios.

- I reviewed the suggested tests against the actual application behavior and source code before using them.

- I manually reproduced important findings in the application.

- I modified generated code to use the application's actual selectors, fields, roles, and workflows.

- For Playwright, I avoided relying on brittle positional locators when the DOM provided meaningful accessible names.

- I investigated failing tests and adjusted them based on the actual application behavior rather than assuming the generated test was correct.

- The final findings and automated tests were based on behavior verified against the application.

## 5. One thing this codebase gets wrong

- The catalogue expiry logic in `src/lib/catalogue-status.ts` incorrectly treats a future expiry date as expired.

- A published catalogue whose validity date has not yet been reached can therefore be reported as expired.

- I added a focused automated test in `tests/assessment-1/catalogue-expiry.test.ts` that expects a future-dated published catalogue to remain published.

- The test currently fails against the existing implementation, reproducing the defect documented in `FINDINGS.md`.

- A separate authorization test in `tests/assessment-1/catalogue-authorization.test.ts` also reproduces the missing admin-role enforcement in the catalogue deletion server action.

- Manual testing additionally identified that the product form allows an offer price greater than MRP. This is documented as a pricing validation finding in `FINDINGS.md`.

---

## Notes

- The application was run locally using Docker for PostgreSQL and the Next.js development server on `http://localhost:3001`.

- The seeded application data was used where appropriate.

- The Playwright browser initially required installation with `npx playwright install chromium`.

- During Playwright development, I encountered locator ambiguity caused by elements with similar text appearing in different parts of the page. I resolved these by scoping assertions to the relevant UI element rather than adding arbitrary waits.

- The final buyer journey was automated in `e2e/assessment-4/buyer-enquiry-journey.spec.ts` and verified successfully.

- The buyer journey covers opening a published catalogue, opening a product, submitting an enquiry, signing in as an admin, opening Leads, and verifying that the submitted enquiry is present.

- The staff product create/delete workflow was not treated as a security finding because the assessment explicitly allows staff users to manage products. The authorization finding documented in `FINDINGS.md` instead concerns catalogue deletion, which is an admin-level capability.


