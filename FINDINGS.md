
# Findings

## 1. Future-dated published catalogue is incorrectly marked as expired

**What happens**

A published catalogue is marked as **Expired** even when its "Valid until" date is still in the future.

**Steps to reproduce**

1. Sign in to the admin portal as `admin@catalogue.test`.
2. Open the **Monsoon clearance 2026** catalogue.
3. Observe that its **Valid until** date is **1 Oct 2026**.
4. On **29 Sep 2026**, observe that the catalogue is displayed as **Expired**.
5. Open the catalogue's public URL and observe that the catalogue is still accessible.
6. Open a product from the public catalogue.
7. Add the product to an enquiry and submit the enquiry.
8. Observe that the enquiry can be submitted successfully.

**What should happen instead**

A published catalogue should remain **Published/live** while its validity date is in the future. It should only become **Expired** after its validity date has passed.

**Impact — how bad is this, and why?**

**High functional/business risk.**

The application incorrectly treats a catalogue that is still within its validity period as expired in the admin UI.

The public catalogue can still be accessed and buyers can interact with it, creating a mismatch between the catalogue's administrative status and its buyer-facing behavior.

This can lead to incorrect catalogue lifecycle handling and confusion for both administrators and buyers.

**Failing automated test**

`tests/assessment-1/catalogue-expiry.test.ts` — `keeps a published catalogue published when its expiry date is in the future`

The test expects a future-dated published catalogue to return `published`, but the application returns `expired`.

---

## 2. Staff user can delete a catalogue without admin authorization

**What happens**

A user signed in with the `staff` role can invoke the catalogue deletion server action.

The `deleteCatalogue()` action verifies that the user is authenticated and that the catalogue ID is valid, but it does not enforce an admin-role check before performing the deletion.

**Steps to reproduce**

1. Authenticate as the staff user:
   - Email: `staff@catalogue.test`
   - Password: `Staff#2026`
2. Invoke the catalogue deletion operation with a valid catalogue ID.
3. Observe the response from the server action.

**What should happen instead**

Catalogue deletion should be restricted to an administrator.

A staff user should be rejected with an authorization error and the delete operation should not be executed.

**Impact — how bad is this, and why?**

**Critical security/authorization risk.**

A lower-privileged staff account can invoke a destructive catalogue-management operation that should be restricted to an administrator.

Because the missing authorization check is on the server-side action, the restriction cannot be bypassed merely by changing or hiding frontend controls.

This creates a privilege-boundary failure and could allow unauthorized deletion of catalogue data.

**Failing automated test**

`tests/assessment-1/catalogue-authorization.test.ts` — `should reject catalogue deletion by a staff user`

The test uses a valid catalogue UUID and mocks the authenticated actor as a staff user.

The test expects:

```text
{ error: "Only an admin can delete a catalogue." }
````

The application instead returns:

```text
{ ok: true, name: "Test catalogue" }
```

Therefore, the test fails against the current implementation.

---

## 3. Offer price can be set higher than MRP

**What happens**

The product form allows an offer price to be entered that is higher than the product's MRP.

**Steps to reproduce**

1. Sign in to the admin portal.
2. Open **Products**.
3. Create or edit a product.
4. Enter an MRP value.
5. Enter an **Offer Price greater than the MRP**.
6. Save the product.
7. Observe that the product is accepted.

**What should happen instead**

An offer price should not be greater than the MRP if the offer price represents the selling price after a discount.

The application should reject the invalid combination and display a validation message.

**Impact — how bad is this, and why?**

**Medium functional/business risk.**

Allowing an offer price greater than MRP can result in inconsistent commercial data and incorrect pricing expectations for buyers.

It can also produce misleading discount information because the application's pricing logic is designed around the relationship between MRP and offer price.

**Automated test**

No automated failing test was added for this finding.

The behavior was identified through manual testing. The available application requirements do not explicitly define `Offer Price <= MRP` as a formal validation rule, so an automated test was not created that would assume an undocumented business rule.

**Recommendation**

If the intended business rule is that an offer price cannot exceed MRP, enforce the following validation on the server side as well as in the UI:

```text
Offer Price <= MRP
```

---

