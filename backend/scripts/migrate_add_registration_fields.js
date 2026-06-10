// One-off migration: adds 4 registration-detail columns to the profiles table.
// Run with: node scripts/migrate_add_registration_fields.js
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const SUPABASE_URL         = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY     = process.env.SUPABASE_SERVICE_ROLE_KEY
const PROJECT_REF          = SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]

const SQL = `
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS registration_no  TEXT,
  ADD COLUMN IF NOT EXISTS academic_session TEXT,
  ADD COLUMN IF NOT EXISTS earned_credits   NUMERIC(6,2),
  ADD COLUMN IF NOT EXISTS backlog_count    INTEGER;
`

async function run() {
  if (!PROJECT_REF || !SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
    process.exit(1)
  }

  console.log(`Project ref : ${PROJECT_REF}`)
  console.log('Running migration via Supabase Management API...\n')

  // Management API endpoint — requires a personal access token as Bearer,
  // but we try with the service role key first.
  const mgmtUrl = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`
  const res = await fetch(mgmtUrl, {
    method : 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify({ query: SQL }),
  })

  const text = await res.text()
  let body
  try { body = JSON.parse(text) } catch { body = text }

  if (res.ok) {
    console.log('Migration succeeded!')
    console.log(body)
    process.exit(0)
  }

  // Management API rejected the service role key (expected — it needs a PAT).
  // Fall back: try calling a raw-SQL RPC function that may exist on the project.
  console.log(`Management API responded ${res.status}: ${JSON.stringify(body)}`)
  console.log('\nTrying fallback via PostgREST RPC exec_sql ...\n')

  const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method : 'POST',
    headers: {
      'apikey'       : SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify({ sql: SQL }),
  })

  const rpcText = await rpcRes.text()
  let rpcBody
  try { rpcBody = JSON.parse(rpcText) } catch { rpcBody = rpcText }

  if (rpcRes.ok) {
    console.log('Migration succeeded via RPC!')
    console.log(rpcBody)
    process.exit(0)
  }

  console.log(`RPC also failed (${rpcRes.status}): ${JSON.stringify(rpcBody)}`)
  console.log('\n──────────────────────────────────────────────────')
  console.log('Automated migration not possible without a Supabase')
  console.log('Personal Access Token. Run this SQL manually in the')
  console.log('Supabase dashboard → SQL Editor:\n')
  console.log(SQL)
  console.log('──────────────────────────────────────────────────')
  process.exit(1)
}

run().catch(err => { console.error(err); process.exit(1) })
