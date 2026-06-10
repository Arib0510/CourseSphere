// Run once: node create_admin.js
// Creates the admin user in Supabase auth and the admins table.

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const ADMIN_EMAIL = "atiqueashfakarib@gmail.com";
const ADMIN_PASSWORD = "124578";
const ADMIN_NAME = "Admin";

async function createAdmin() {
  console.log(`Creating admin user: ${ADMIN_EMAIL}`);

  // 1. Create or retrieve the auth user
  let userId;

  // Try creating first
  const { data: created, error: createErr } =
    await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: ADMIN_NAME },
    });

  if (createErr) {
    if (createErr.message.toLowerCase().includes("already")) {
      // User exists — list and find by email
      console.log("User already exists in auth, looking up...");
      const { data: list } = await supabaseAdmin.auth.admin.listUsers();
      const existing = list?.users?.find((u) => u.email === ADMIN_EMAIL);
      if (!existing) {
        console.error("Could not find existing user.");
        process.exit(1);
      }
      userId = existing.id;
    } else {
      console.error("Auth user creation failed:", createErr.message);
      process.exit(1);
    }
  } else {
    userId = created.user.id;
    console.log("Auth user created:", userId);
  }

  // 2. Upsert the profile
  const { error: profileErr } = await supabaseAdmin
    .from("profiles")
    .upsert({ id: userId, full_name: ADMIN_NAME });

  if (profileErr) {
    console.error("Profile upsert error:", profileErr.message);
  } else {
    console.log("Profile upserted.");
  }

  // 3. Upsert into admins table
  const { error: adminErr } = await supabaseAdmin
    .from("admins")
    .upsert({ email: ADMIN_EMAIL }, { onConflict: "email" });

  if (adminErr) {
    console.error("Admins table upsert error:", adminErr.message);
    process.exit(1);
  }

  console.log(`\nAdmin created successfully.`);
  console.log(`  Email   : ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  process.exit(0);
}

createAdmin();
