# SNAPSTER secure checkout deployment

## What this branch changes

- Browser checkout sends only product IDs, size, color, quantity, delivery address and an optional promo code.
- The Express API verifies Firebase ID tokens with Firebase Admin.
- Product prices and stock are read from Firestore on the server. Browser-submitted prices, totals, images, discounts and payment status are not trusted.
- Stock is reserved inside Firestore transactions, including multiple sizes/colors from the same product.
- Razorpay order creation uses the server-calculated amount.
- Payment verification checks the HMAC signature and fetches the payment from Razorpay. Only a captured INR payment for the exact order amount is marked Paid.
- Payment idempotency is persisted in Firestore.
- Firestore rules deny browser writes to orders and payment event records.
- Fake phone OTP and hard-coded admin username/password flows are disabled. Use Firebase Google or email/password authentication. Only verified allowlisted admin emails receive admin UI access.

## Required server configuration

Copy `.env.example` to `.env` on the server. Never commit the real `.env` file.

1. In Firebase Console, select project `proverbial-dream-gc70r`, open Project settings > Service accounts, generate a private key, and store the complete service-account JSON in `FIREBASE_SERVICE_ACCOUNT_JSON` as a single-line JSON string. Keep this secret server-side only.
2. Set `FIREBASE_DATABASE_ID` to the Firestore database ID used by this application.
3. Add Razorpay API credentials and webhook secret from the Razorpay Dashboard. Start with test keys.
4. Set a long random `CRON_SECRET`.
5. Deploy to a Node.js 20+ environment and run `npm start` with `NODE_ENV=production`.

If Firebase Admin credentials are missing, secure checkout intentionally returns 503; it never falls back to client-side order writes.

## Razorpay webhook

Configure the webhook URL:

`https://YOUR_DOMAIN/api/razorpay/webhook`

Subscribe to `payment.captured` and `payment.failed`. Use the exact webhook secret configured in `RAZORPAY_WEBHOOK_SECRET`.

## Release expired inventory reservations

A pending online order reserves stock. Configure an external scheduler to POST every 5 minutes to:

`https://YOUR_DOMAIN/api/maintenance/expire-pending-orders`

Send header `x-cron-secret: YOUR_CRON_SECRET`. Orders awaiting payment for more than 20 minutes are marked failed/cancelled and stock is returned transactionally. Protect this endpoint; never expose the cron secret in browser code.

## Firestore deployment

Deploy the updated `firestore.rules` to the same named Firestore database used by this application. Orders and paymentEvents are server-write-only after deployment. Order status updates use the authenticated administrator API; direct browser order writes remain blocked.

## Product data requirements

- Each product document must have numeric `price`, non-negative integer `stock`, a `sizes` array and a `colors` array whose entries have a `name`.
- This implementation treats `stock` as one total count across sizes/colors. If your inventory is tracked separately per size/color, the Firestore schema and transaction must be extended to variant-level stock before launch.
- The server owns the promo policy: EDGE20, EDGE10, SNAP10 and FREESHIP. Shipping is ₹149 below ₹2,499 after discount, otherwise free. The browser cannot set a discount or shipping fee.

## Test before live payments

1. Run `npm install`, `npm run lint` and `npm run build`.
2. With Razorpay test keys, place a successful payment and confirm the order is marked Paid only after capture.
3. Modify the browser request amount, product price, discount, user ID and payment status. The server must ignore or reject those values.
4. Simulate two customers buying the final unit concurrently. Only one checkout may reserve it.
5. Replay the same payment callback and webhook. It must not create a second payment record or mark another order paid.
6. Test invalid signatures, failed payments, abandoned-checkout expiry, COD, invalid promo codes and insufficient stock.
7. Only after tests pass, use production Razorpay keys and deploy to production.

This is a security hardening implementation, not a legal, tax, penetration-test or production-readiness certification.
