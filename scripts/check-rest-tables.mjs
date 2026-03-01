import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

const tables = ['announcements', 'events', 'team_members', 'registrations', 'achievements'];

for (const table of tables) {
  const { error } = await supabase.from(table).select('id').limit(1);
  if (error) {
    console.log(`${table} | status=error | body=${error.code ?? 'unknown'}: ${error.message}`);
  } else {
    console.log(`${table} | status=ok | body=query succeeded`);
  }
}
