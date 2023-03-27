// lib/supabase.js

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ffyuiicnuiyyufohhsca.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmeXVpaWNudWl5eXVmb2hoc2NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgyMDU4NzcsImV4cCI6MTk5Mzc4MTg3N30.dBMmhouMgYab22Ar3NWJ1NvfUmswHhbI_o3LnJeuifI"
);
