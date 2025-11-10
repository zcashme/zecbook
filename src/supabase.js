import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk5NzI4MDAsImV4cCI6MTk2NTU0ODgwMH0.placeholder'

// Log warning if using placeholder values
if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn('⚠️ Using placeholder Supabase credentials. App will load but data operations will fail.')
  console.warn('📋 See ENV_SETUP_INSTRUCTIONS.md for setup guide.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)