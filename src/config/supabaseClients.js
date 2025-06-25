import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://meppqytugnpzabklqlyh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcHBxeXR1Z25wemFia2xxbHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDE0MTgsImV4cCI6MjA2NjMxNzQxOH0.YHKEvbg7OruM4BHZpnOAvc5ykwUHF3mDRJgbDeuV6TE';

export const supabase = createClient(supabaseUrl, supabaseKey);
