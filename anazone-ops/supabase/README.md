# Supabase setup

This container's network policy blocks `supabase.com`/`supabase.co`, so migrations and
Edge Function deploys couldn't be run or tested from within the session. Run these
yourself once, from a machine with normal internet access:

1. Apply the schema: open the Supabase SQL Editor for your project and run
   `migrations/0001_init.sql`, or `supabase db push` with the CLI linked to your project.
2. Deploy the push-notification function: `supabase functions deploy send-notification`
   (see `functions/send-notification/index.ts`). Set its `EXPO_ACCESS_TOKEN` secret if you
   have one (optional, only needed if you enforce Expo push security).
3. Copy `.env.example` to `.env` in `anazone-ops/` and fill in your project's URL and
   publishable/anon key (Settings → API in the dashboard). Never put the secret/service_role
   key in `.env` — it isn't used by the app at all, only by the Edge Function server-side.
4. Turn off email confirmation for signup: Authentication → Sign In / Providers → Email →
   disable "Confirm email". The signup screen has no verification-link flow, so without this
   `auth.signUp()` will return a user with no session and login will silently not work.
