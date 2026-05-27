# Character Before Carrier Farms Website

Premium Next.js + Tailwind B2B agribusiness website for Character Before Carrier Farms (Ghana).

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- React
- Resend (email notifications)
- Supabase (quote request storage)

## Main Pages

- `/` Homepage (hero, trust badges, category preview, featured products, why choose us, target buyers, quote CTA)
- `/products` Product catalogue with search + category filtering
- `/products/[slug]` Product detail pages with buyer-oriented specs
- `/about` Company overview, mission, vision, values, founder message
- `/quality` Traceability, quality control, safety, standards, certifications
- `/supply-solutions` Buyer-segment supply programs
- `/contact` Serious quote request form

## Data Architecture

Product content is centralized in:

- `data/products.js`

Each product object includes:

- `id`
- `slug`
- `name`
- `category`
- `shortDescription`
- `longDescription`
- `image`
- `pricePerKg`
- `minimumOrderQuantity`
- `packagingOptions`
- `availability`
- `certifications`
- `supplyCapacity`
- `suitableBuyers`
- `featured`

This powers both catalogue and dynamic product detail pages.

## Quote Request Flow

- Frontend form: `components/forms/QuoteRequestForm.jsx`
- API route: `app/api/quotes/route.js`

Submission behavior:

1. Validates required fields:
   - `name`
   - `email` or `phone`
   - `productInterest`
   - `quantityMessage`
2. Sends email notification through Resend to:
   - `richardafriyie22@gmail.com`
3. Stores request in Supabase table:
   - `quote_requests`
4. Returns success and shows WhatsApp follow-up link:
   - `+233242728984`

If environment variables are missing, the API fails gracefully with developer instructions in the response.

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Required:

- `RESEND_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional:

- `QUOTE_FROM_EMAIL`

## Supabase Table Setup

Run SQL in Supabase SQL Editor:

- `supabase/quote_requests.sql`

## Run Locally

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000`

## Quality Checks

```bash
npm run lint
npm run build
```
