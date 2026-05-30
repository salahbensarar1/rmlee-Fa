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
  status text default 'new',
  admin_notes text,
  replied_at timestamptz,
  reply_subject text,
  reply_body text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_quote_requests_submitted_at
  on public.quote_requests (submitted_at desc);

create index if not exists idx_quote_requests_status
  on public.quote_requests (status);
