CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pg_cron SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;

-- Create a scheduled job to invoke the check-session-followup Edge Function
-- This runs every day at 8:00 AM UTC.
-- Note: Supabase provides an interface in the dashboard for Edge Function scheduling,
-- but this script sets it up directly in the database using pg_cron.

-- If you get an error about missing settings, you may need to hardcode the URL and Bearer token,
-- or use the Supabase Dashboard -> Integrations -> Webhooks / Cron to schedule the Edge Function.
SELECT cron.schedule(
  'check-session-followup-daily',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := coalesce(current_setting('app.settings.edge_function_base_url', true), 'https://YOUR_PROJECT_REF.supabase.co/functions/v1') || '/check-session-followup',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(current_setting('app.settings.service_role_key', true), 'YOUR_SERVICE_ROLE_KEY')
    )
  );
  $$
);
