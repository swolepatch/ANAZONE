-- Anazone Ops — initial schema
-- Run once via the Supabase SQL Editor, or `supabase db push` with the CLI.
-- Idempotent-ish: safe to re-run individual sections after fixing an error,
-- but not designed to be re-run wholesale after it has already succeeded.

-- ============================================================
-- staff
-- ============================================================
create table public.staff (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  role text not null default 'Staff' check (role in ('Coach', 'Trainer', 'Front Desk', 'Manager', 'Cleaner', 'Staff')),
  email text not null,
  avatar_url text,
  notification_prefs jsonb not null default '{"messages": true, "incidents": true, "announcements": true}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.staff enable row level security;

create policy "staff can view all staff" on public.staff
  for select using (auth.uid() is not null);

create policy "staff can update own row" on public.staff
  for update using (auth.uid() = id);

-- ============================================================
-- push_tokens
-- ============================================================
create table public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff (id) on delete cascade,
  expo_push_token text not null,
  updated_at timestamptz not null default now(),
  unique (staff_id, expo_push_token)
);

alter table public.push_tokens enable row level security;

create policy "staff manage own push tokens" on public.push_tokens
  for all using (auth.uid() = staff_id) with check (auth.uid() = staff_id);

-- ============================================================
-- conversations + conversation_participants
-- ============================================================
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('group', 'dm')),
  name text,
  created_at timestamptz not null default now()
);

create table public.conversation_participants (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  staff_id uuid not null references public.staff (id) on delete cascade,
  primary key (conversation_id, staff_id)
);

create index conversation_participants_staff_id_idx on public.conversation_participants (staff_id);

-- security definer helper avoids RLS self-recursion on conversation_participants
create or replace function public.is_conversation_participant(conv_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.conversation_participants
    where conversation_id = conv_id and staff_id = auth.uid()
  );
$$;

alter table public.conversations enable row level security;

create policy "participants can view their conversations" on public.conversations
  for select using (public.is_conversation_participant(id));

create policy "authenticated can create conversations" on public.conversations
  for insert with check (auth.uid() is not null);

alter table public.conversation_participants enable row level security;

create policy "participants can view participant rows" on public.conversation_participants
  for select using (public.is_conversation_participant(conversation_id));

create policy "authenticated can add participants" on public.conversation_participants
  for insert with check (auth.uid() is not null);

-- ============================================================
-- messages + message_reads
-- ============================================================
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.staff (id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

create index messages_conversation_id_created_at_idx on public.messages (conversation_id, created_at);

alter table public.messages enable row level security;

create policy "participants can view messages" on public.messages
  for select using (public.is_conversation_participant(conversation_id));

create policy "participants can send messages" on public.messages
  for insert with check (public.is_conversation_participant(conversation_id) and sender_id = auth.uid());

create table public.message_reads (
  message_id uuid not null references public.messages (id) on delete cascade,
  staff_id uuid not null references public.staff (id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (message_id, staff_id)
);

alter table public.message_reads enable row level security;

create policy "staff manage own read receipts" on public.message_reads
  for all using (auth.uid() = staff_id) with check (auth.uid() = staff_id);

-- Realtime for live message delivery in the open conversation
alter publication supabase_realtime add table public.messages;

-- ============================================================
-- shifts (Part 4 sync upgrade)
-- ============================================================
create table public.shifts (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff (id) on delete cascade,
  role text not null check (role in ('Coach', 'Trainer', 'Front Desk', 'Manager', 'Cleaner')),
  date date not null,
  start_time text not null,
  end_time text not null,
  created_at timestamptz not null default now()
);

create index shifts_date_idx on public.shifts (date);

alter table public.shifts enable row level security;

create policy "staff can view all shifts" on public.shifts
  for select using (auth.uid() is not null);

create policy "staff can add shifts" on public.shifts
  for insert with check (auth.uid() is not null);

create policy "staff can delete shifts" on public.shifts
  for delete using (auth.uid() is not null);

-- ============================================================
-- feed_posts (Part 4 sync upgrade)
-- ============================================================
create table public.feed_posts (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('announcement', 'handoff')),
  author_id uuid not null references public.staff (id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create index feed_posts_created_at_idx on public.feed_posts (created_at desc);

alter table public.feed_posts enable row level security;

create policy "staff can view feed" on public.feed_posts
  for select using (auth.uid() is not null);

create policy "staff can post to feed" on public.feed_posts
  for insert with check (auth.uid() is not null and author_id = auth.uid());

create policy "staff can delete feed posts" on public.feed_posts
  for delete using (auth.uid() is not null);

-- ============================================================
-- New-user bootstrap: auth.users insert -> staff row -> Team Chat membership
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.staff (id, name, role, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'Staff'),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.ensure_team_chat()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  team_chat_id uuid;
begin
  select id into team_chat_id from public.conversations where type = 'group' and name = 'Team Chat' limit 1;
  if team_chat_id is null then
    insert into public.conversations (type, name) values ('group', 'Team Chat') returning id into team_chat_id;
  end if;
  return team_chat_id;
end;
$$;

create or replace function public.handle_new_staff()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  team_chat_id uuid;
begin
  team_chat_id := public.ensure_team_chat();
  insert into public.conversation_participants (conversation_id, staff_id)
  values (team_chat_id, new.id)
  on conflict do nothing;
  return new;
end;
$$;

create trigger on_staff_created
  after insert on public.staff
  for each row execute procedure public.handle_new_staff();
