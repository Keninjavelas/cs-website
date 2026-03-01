import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error('Missing Supabase env vars.');
  process.exit(1);
}

const supabase = createClient(url, anonKey);

const requiredTables = [
  'announcements',
  'events',
  'team_members',
  'registrations',
  'achievements',
];

async function checkTableExists(table) {
  const { error } = await supabase.from(table).select('*', { head: true, count: 'exact' }).limit(1);

  if (!error) {
    return { table, exists: true, detail: 'ok' };
  }

  if (String(error.message || '').includes('schema cache') || error.code === 'PGRST205') {
    return { table, exists: false, detail: `${error.code ?? 'unknown'}: ${error.message}` };
  }

  return { table, exists: true, detail: `reachable (with access error: ${error.code ?? 'unknown'}: ${error.message})` };
}

async function testRestrictedWrites() {
  const now = Date.now();
  const checks = [];

  const attempts = [
    {
      table: 'announcements',
      payload: { title: 'x', slug: `x-${now}`, content: 'x' },
    },
    {
      table: 'events',
      payload: { title: 'x' },
    },
    {
      table: 'team_members',
      payload: { name: 'x', role: 'x' },
    },
    {
      table: 'achievements',
      payload: { title: 'x' },
    },
  ];

  for (const attempt of attempts) {
    const { error } = await supabase.from(attempt.table).insert(attempt.payload).select();
    const blocked = !!error;
    checks.push({
      table: attempt.table,
      blocked,
      detail: error
        ? `${error.code ?? 'unknown'}: ${error.message}`
        : 'insert succeeded (NOT expected for public)',
    });
  }

  return checks;
}

async function testRegistrationsRead() {
  const { error } = await supabase.from('registrations').select('*').limit(1);
  return {
    blocked: !!error,
    detail: error
      ? `${error.code ?? 'unknown'}: ${error.message}`
      : 'public read succeeded (NOT expected)',
  };
}

async function testDuplicateRegistrationConstraint() {
  const { data: events, error: eventError } = await supabase
    .from('events')
    .select('id')
    .eq('is_published', true)
    .limit(1);

  if (eventError) {
    return { skipped: true, detail: `could not fetch event for duplicate test: ${eventError.code ?? 'unknown'}: ${eventError.message}` };
  }

  if (!events || events.length === 0) {
    return { skipped: true, detail: 'no published event found, duplicate registration test skipped' };
  }

  const eventId = events[0].id;
  const email = `security-check-${Date.now()}@example.com`;

  const payload = {
    event_id: eventId,
    name: 'Security Check User',
    email,
    usn: null,
    branch: null,
    company: null,
  };

  const first = await supabase.from('registrations').insert(payload).select();
  if (first.error) {
    return { skipped: true, detail: `first registration failed: ${first.error.code ?? 'unknown'}: ${first.error.message}` };
  }

  const second = await supabase.from('registrations').insert(payload).select();
  return {
    skipped: false,
    duplicateBlocked: !!second.error,
    detail: second.error
      ? `${second.error.code ?? 'unknown'}: ${second.error.message}`
      : 'second insert succeeded (NOT expected)',
  };
}

console.log('--- Supabase Runtime Validation ---');

const tableChecks = await Promise.all(requiredTables.map(checkTableExists));
console.log('\n1) Table existence / schema-cache checks:');
for (const row of tableChecks) {
  console.log(`- ${row.table}: ${row.exists ? 'PASS' : 'FAIL'} (${row.detail})`);
}

const restrictedWrites = await testRestrictedWrites();
console.log('\n2) Public restricted-write checks:');
for (const row of restrictedWrites) {
  console.log(`- ${row.table} public INSERT blocked: ${row.blocked ? 'PASS' : 'FAIL'} (${row.detail})`);
}

const registrationsRead = await testRegistrationsRead();
console.log('\n3) Public registrations SELECT blocked:');
console.log(`- registrations public SELECT blocked: ${registrationsRead.blocked ? 'PASS' : 'FAIL'} (${registrationsRead.detail})`);

const duplicate = await testDuplicateRegistrationConstraint();
console.log('\n4) Duplicate registration unique constraint:');
if (duplicate.skipped) {
  console.log(`- SKIPPED (${duplicate.detail})`);
} else {
  console.log(`- duplicate blocked: ${duplicate.duplicateBlocked ? 'PASS' : 'FAIL'} (${duplicate.detail})`);
}

const failedSchemaChecks = tableChecks.filter((t) => !t.exists);
if (failedSchemaChecks.length > 0) {
  console.log('\nSchema cache status: FAIL');
  process.exit(2);
}

console.log('\nSchema cache status: PASS (no missing table in cache errors)');
