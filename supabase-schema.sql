create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  species text,
  room text,
  category text,
  image_key text default 'monstera',
  photo_uri text,
  favorite boolean default false,
  humidity integer default 50,
  light text,
  next_watering text,
  frequency text,
  mood text,
  accent text,
  description text,
  tips jsonb default '[]'::jsonb,
  compatible jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.plants enable row level security;

create policy "Users can read own plants"
on public.plants for select
using (auth.uid() = user_id);

create policy "Users can insert own plants"
on public.plants for insert
with check (auth.uid() = user_id);

create policy "Users can update own plants"
on public.plants for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own plants"
on public.plants for delete
using (auth.uid() = user_id);
