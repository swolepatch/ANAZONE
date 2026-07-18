-- Fixes "new row violates row-level security policy for table conversations"
-- when starting a new DM or group from the client.
--
-- Root cause: supabase-js's insert(...).select() asks Postgres to return the
-- inserted row, which requires it to pass the table's SELECT policy too. The
-- "conversations" SELECT policy only allows rows the caller already
-- participates in (public.is_conversation_participant), but at the moment a
-- brand-new conversation is inserted, the caller isn't a participant yet
-- (that row is added in a second, separate insert). So the RETURNING clause
-- fails RLS even though the INSERT itself was allowed.
--
-- Fix: create the conversation and add its participants atomically inside a
-- security-definer function (bypasses RLS, like the other helpers in
-- 0001_init.sql), and have the client call it via RPC instead of raw inserts.

create or replace function public.create_dm(other_staff_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  insert into public.conversations (type, name) values ('dm', null)
  returning id into new_id;

  insert into public.conversation_participants (conversation_id, staff_id)
  values (new_id, auth.uid()), (new_id, other_staff_id)
  on conflict do nothing;

  return new_id;
end;
$$;

create or replace function public.create_group(group_name text, participant_ids uuid[])
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  insert into public.conversations (type, name) values ('group', group_name)
  returning id into new_id;

  insert into public.conversation_participants (conversation_id, staff_id)
  select new_id, staff_id
  from unnest(array_append(participant_ids, auth.uid())) as staff_id
  on conflict do nothing;

  return new_id;
end;
$$;
