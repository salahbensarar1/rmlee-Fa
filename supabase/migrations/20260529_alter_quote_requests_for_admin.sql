alter table if exists public.quote_requests
  add column if not exists status text default 'new',
  add column if not exists admin_notes text,
  add column if not exists replied_at timestamptz,
  add column if not exists reply_subject text,
  add column if not exists reply_body text;

update public.quote_requests
set status = 'new'
where status is null;

create index if not exists idx_quote_requests_status
  on public.quote_requests (status);

create index if not exists idx_quote_requests_replied_at
  on public.quote_requests (replied_at desc);
