create table if not exists public.quote_requests (
  id bigint generated always as identity primary key,
  name text not null,
  company text,
  buyer_type text,
  email text,
  phone text,
  product_interest text not null,
  delivery_location text,
  quantity_message text not null,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_quote_requests_submitted_at
  on public.quote_requests (submitted_at desc);
