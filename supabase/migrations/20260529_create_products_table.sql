create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  short_description text,
  long_description text,
  image text,
  price_per_kg text,
  minimum_order_quantity text,
  packaging_options text[] default '{}',
  availability text,
  certifications text[] default '{}',
  supply_capacity text,
  suitable_buyers text[] default '{}',
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_slug on public.products (slug);
create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_active on public.products (active);
create index if not exists idx_products_featured on public.products (featured);

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_set_updated_at on public.products;
create trigger trg_products_set_updated_at
before update on public.products
for each row
execute function public.set_products_updated_at();
