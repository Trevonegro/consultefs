
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkyblumrvbppmuctmujm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5reWJsdW1ydmJwcG11Y3RtdWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NDgzNzAsImV4cCI6MjA4MDAyNDM3MH0.4HppMSvgoiTr_GinN6IebEv023fk8acEkX8JiZTNlqY';

export const supabase = createClient(supabaseUrl, supabaseKey);
