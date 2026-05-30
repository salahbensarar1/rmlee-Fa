# Character Before Carrier Farms Website

Premium Next.js + Tailwind B2B agribusiness website for Character Before Carrier Farms (Ghana).

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (Auth, Postgres, Storage)
- Resend (quote + admin reply email delivery)
- Vercel Web Analytics

## Main Pages

- `/` Homepage
- `/products` Product catalogue
- `/products/[slug]` Product detail pages
- `/about`
- `/quality`
- `/supply-solutions`
- `/contact`

## Admin Panel

Protected routes:

- `/admin/login`
- `/admin/dashboard`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]/edit`
- `/admin/quote-requests`
- `/admin/quote-requests/[id]`

Admin features:

- Supabase Auth login
- Product CRUD (create, edit, deactivate/activate, delete)
- Quote request review, status updates, admin notes
- Buyer email reply flow with templates

## Developer Panel

Protected developer routes:

- `/developer/login`
- `/developer/dashboard`
- `/developer/admin-users`
- `/developer/system-health`
- `/developer/settings`
- `/developer/audit-log`

Developer panel features:

- Separate Supabase Auth access control via `DEVELOPER_USER_EMAILS`
- Server-side system health checks for database, tables, storage bucket, and Resend
- Read-only environment configuration overview (no secret values)
- Allowed email list visibility for admin and developer roles

## Product Source Strategy

- Public catalogue/product pages read active products from Supabase when configured.
- If Supabase is unavailable or empty, public pages safely fall back to `data/products.js`.

## Quote Request Flow

- Frontend form: `components/forms/QuoteRequestForm.jsx`
- Public API route: `app/api/quotes/route.js`
- Admin reply API route: `app/api/admin/quote-requests/[id]/reply/route.js`

Behavior:

1. Validate required fields (`name`, `email or phone`, `productInterest`, `quantityMessage`)
2. Insert into `quote_requests`
3. Send notification email to business inbox (`QUOTE_TO_EMAIL`)
4. Return success + WhatsApp follow-up link

## Environment Variables

Use `.env.example` as template and create `.env.local`.

Do not commit `.env.local`.

Required:

- `RESEND_API_KEY`
- `QUOTE_FROM_EMAIL`
- `QUOTE_TO_EMAIL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_USER_EMAILS`
- `DEVELOPER_USER_EMAILS`

Optional:

- `TEST_EMAIL_OVERRIDE` (redirect all outgoing customer reply emails to one test inbox during testing)

### Vercel Environment Variables

Set in: `Vercel -> Project -> Settings -> Environment Variables`

- `RESEND_API_KEY`
- `QUOTE_FROM_EMAIL`
- `QUOTE_TO_EMAIL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_USER_EMAILS`
- `DEVELOPER_USER_EMAILS`
- `TEST_EMAIL_OVERRIDE` (optional)

Redeploy after changes.

## Supabase Setup

Run SQL in Supabase SQL Editor:

- `supabase/quote_requests.sql`
- `supabase/migrations/20260529_create_products_table.sql`
- `supabase/migrations/20260529_alter_quote_requests_for_admin.sql`

## Supabase Auth Admin User Setup

1. Open Supabase Dashboard.
2. Go to `Authentication -> Users`.
3. Create admin user(s) with email/password.
4. Set `ADMIN_USER_EMAILS` as comma-separated list, for example:
   - `owner@yourdomain.com,manager@yourdomain.com`
5. Redeploy.

Only emails listed in `ADMIN_USER_EMAILS` can access admin routes/actions.

## Developer User Setup

1. Open Supabase Dashboard.
2. Go to `Authentication -> Users`.
3. Create developer user(s) with email/password.
4. Set `DEVELOPER_USER_EMAILS` as comma-separated emails, for example:
   - `devops@yourdomain.com,engineer@yourdomain.com`
5. Redeploy.

Only emails listed in `DEVELOPER_USER_EMAILS` can access `/developer` routes.

## Supabase Storage Setup (Product Images)

Create bucket:

- Name: `product-images`
- Public bucket: enabled (so saved image URLs can be used on public pages)
- `next.config.js` allows `**.supabase.co` image hosts for uploaded product images

Admin product forms upload image files to this bucket and save public URL in `products.image`.

## Test Product CRUD

1. Login at `/admin/login` with allowlisted admin email.
2. Open `/admin/products`.
3. Create a new product (including image upload and pricing fields).
4. Edit product and confirm updates save.
5. Deactivate/activate product and confirm status changes.
6. Delete product and confirm removal.

## Test Quote Requests

1. Submit quote from `/contact`.
2. Open `/admin/quote-requests`.
3. Confirm row appears with buyer name, email, product interest, status, submitted date.
4. Open detail page, update status/notes, and save.
5. Send buyer reply email from admin detail page.

## Resend Testing Limitation

When using `onboarding@resend.dev` or unverified sending setup, Resend test mode only allows sending to your verified account email.

If you get that error:

- Use `QUOTE_TO_EMAIL` or `TEST_EMAIL_OVERRIDE` with your verified email for testing.
- Or verify a domain in Resend and send from that domain.

### TEST_EMAIL_OVERRIDE Behavior

When `TEST_EMAIL_OVERRIDE` is set, admin customer reply emails are sent to that override address instead of the buyer email. This is for testing only and does not change buyer email data stored in the database.

## Production Email Note

For production:

1. Verify your sending domain in Resend.
2. Use a domain-based `QUOTE_FROM_EMAIL` (for example `quotes@yourdomain.com`).
3. Keep `QUOTE_TO_EMAIL` set to the real business inbox.

## Run Locally

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Vercel Web Analytics

Analytics component is mounted in `app/layout.jsx` using `@vercel/analytics`.
