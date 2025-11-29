import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pcakrzrdpgwqwgylxllj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjYWtyenJkcGd3cXdneWx4bGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MjkwNTksImV4cCI6MjA4MDAwNTA1OX0.mZbtZbQOcsPJ5vUXeB6jPvnbU-CyZIGZGmoBE7oN4W0';

export const supabase = createClient(supabaseUrl, supabaseKey);