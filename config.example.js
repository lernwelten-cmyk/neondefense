// Rename this file to config.js and fill in your values.
window.CONFIG = {
  // n8n Webhook URLs
  N8N_WEBHOOK_TEST: "https://YOUR-N8N-INSTANCE/webhook-test/YOUR-WEBHOOK-ID",
  N8N_WEBHOOK_PROD: "https://YOUR-N8N-INSTANCE/webhook/YOUR-WEBHOOK-ID",

  // n8n New Run Webhooks
  N8N_NEW_RUN_TEST: "https://YOUR-N8N-INSTANCE/webhook-test/neon/new_run",
  N8N_NEW_RUN_PROD: "https://YOUR-N8N-INSTANCE/webhook/neon/new_run",

  // n8n Spawn Wave Webhooks
  N8N_SPAWN_WAVE_TEST: "https://YOUR-N8N-INSTANCE/webhook-test/neon/spawn_wave",
  N8N_SPAWN_WAVE_PROD: "https://YOUR-N8N-INSTANCE/webhook/neon/spawn_wave",

  // Legacy n8n configuration (backward compatibility)
  N8N_BASE_URL: "https://YOUR-N8N-INSTANCE",
  ENDPOINTS: {
    NEW_RUN: "/webhook/YOUR-WEBHOOK-ID/neon/new_run",
    SPAWN_WAVE: "/webhook/YOUR-WEBHOOK-ID/neon/spawn_wave"
  },

  // Supabase configuration
  SUPABASE_URL: "https://YOUR-PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "YOUR-ANON-PUBLIC-KEY"
};
