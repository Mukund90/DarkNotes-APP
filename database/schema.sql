
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text default '',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Enable Row Level Security
alter table public.notes enable row level security;

create policy "Users can view their own notes"
on public.notes for select
using (auth.uid() = user_id);


create policy "Users can insert their own notes"
on public.notes for insert
with check (auth.uid() = user_id);

create policy "Users can update their own notes"
on public.notes for update
using (auth.uid() = user_id);

-- 6. Policy: users can DELETE only their own notes
create policy "Users can delete their own notes"
on public.notes for delete
using (auth.uid() = user_id);

-- 7. Auto-update updated_at on every update
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
before update on public.notes
for each row
execute function public.handle_updated_at();

-- 8. Helpful index for search by title
create index if not exists notes_title_idx on public.notes using gin (to_tsvector('english', title));
