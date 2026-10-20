create table if not exists public.products (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.monthly_predictions (
  id text primary key default 'current',
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  constraint monthly_predictions_singleton check (id = 'current')
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.monthly_predictions enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public can view product images'
  ) then
    create policy "Public can view product images"
      on storage.objects for select
      using (bucket_id = 'product-images');
  end if;
end
$$;