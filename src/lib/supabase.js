// lib/supabase.js

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://nrnbofdrdyspkcjtyaus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybmJvZmRyZHlzcGtjanR5YXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MTE1MzYsImV4cCI6MjA2MjE4NzUzNn0.L23sEn13jlhLPBMD-WlzlLTZBFCkBrR3JFTwnyc6JSQ"
);

export default supabase;
