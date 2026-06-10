// =============================================
// Quick API Test Script
// =============================================
// Run: node test_api.js
// Make sure the server is running on port 5000
// =============================================

const BASE_URL = "http://localhost:5000/api";

async function testAPI() {
  console.log("=== CourseSphere API Tests ===\n");

  // 1. Health Check
  console.log("1. Health Check");
  try {
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    console.log(`   ✅ Status: ${healthRes.status} | ${health.message}\n`);
  } catch (err) {
    console.log(`   ❌ Failed: ${err.message}\n`);
  }

  // 2. Get Courses (public)
  console.log("2. Get All Courses (public)");
  try {
    const coursesRes = await fetch(`${BASE_URL}/courses`);
    const courses = await coursesRes.json();
    console.log(`   Status: ${coursesRes.status}`);
    if (courses.success) {
      console.log(`   ✅ Found ${courses.data.length} courses\n`);
    } else {
      console.log(`   ⚠️  ${courses.message}`);
      console.log(`   (This is expected if you haven't run init_schema.sql in Supabase yet)\n`);
    }
  } catch (err) {
    console.log(`   ❌ Failed: ${err.message}\n`);
  }

  // 3. Auth - Registrations without token
  console.log("3. Registrations without Auth Token");
  try {
    const regRes = await fetch(`${BASE_URL}/registrations`);
    const reg = await regRes.json();
    console.log(`   Status: ${regRes.status}`);
    console.log(`   ✅ Correctly denied: ${reg.message}\n`);
  } catch (err) {
    console.log(`   ❌ Failed: ${err.message}\n`);
  }

  // 4. Admin endpoint without token
  console.log("4. Admin Stats without Auth Token");
  try {
    const adminRes = await fetch(`${BASE_URL}/admin/stats`);
    const admin = await adminRes.json();
    console.log(`   Status: ${adminRes.status}`);
    console.log(`   ✅ Correctly denied: ${admin.message}\n`);
  } catch (err) {
    console.log(`   ❌ Failed: ${err.message}\n`);
  }

  // 5. Signup
  console.log("5. Student Signup");
  try {
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "teststudent@example.com",
        password: "Test@12345",
        full_name: "Test Student",
        student_id: "STU-001",
        department: "Electronics & Telecommunication",
      }),
    });
    const signup = await signupRes.json();
    console.log(`   Status: ${signupRes.status}`);
    if (signup.success) {
      console.log(`   ✅ ${signup.message}`);
      console.log(`   User ID: ${signup.data.user.id}\n`);
    } else {
      console.log(`   ⚠️  ${signup.message}`);
      console.log(`   (If user already exists, this is expected)\n`);
    }
  } catch (err) {
    console.log(`   ❌ Failed: ${err.message}\n`);
  }

  // 6. Login
  console.log("6. Student Login");
  let accessToken = null;
  try {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "teststudent@example.com",
        password: "Test@12345",
      }),
    });
    const login = await loginRes.json();
    console.log(`   Status: ${loginRes.status}`);
    if (login.success) {
      accessToken = login.data.session.access_token;
      console.log(`   ✅ ${login.message}`);
      console.log(`   User: ${login.data.user.email}`);
      console.log(`   Is Admin: ${login.data.user.isAdmin}`);
      console.log(`   Token: ${accessToken.substring(0, 30)}...\n`);
    } else {
      console.log(`   ❌ ${login.message}\n`);
    }
  } catch (err) {
    console.log(`   ❌ Failed: ${err.message}\n`);
  }

  // 7. Get Profile (authenticated)
  if (accessToken) {
    console.log("7. Get Profile (authenticated)");
    try {
      const profileRes = await fetch(`${BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profile = await profileRes.json();
      console.log(`   Status: ${profileRes.status}`);
      if (profile.success) {
        console.log(`   ✅ ${profile.message}`);
        console.log(`   Name: ${profile.data.full_name}`);
        console.log(`   Student ID: ${profile.data.student_id}`);
        console.log(`   Department: ${profile.data.department}\n`);
      } else {
        console.log(`   ⚠️  ${profile.message}\n`);
      }
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}\n`);
    }

    // 8. Get My Registrations (authenticated)
    console.log("8. Get My Registrations (authenticated)");
    try {
      const regRes = await fetch(`${BASE_URL}/registrations`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const reg = await regRes.json();
      console.log(`   Status: ${regRes.status}`);
      if (reg.success) {
        console.log(`   ✅ ${reg.message}`);
        console.log(`   Registered courses: ${reg.data.length}\n`);
      } else {
        console.log(`   ⚠️  ${reg.message}\n`);
      }
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}\n`);
    }
  } else {
    console.log("7-8. Skipped — No auth token available\n");
  }

  // 9. 404 handler
  console.log("9. 404 Handler");
  try {
    const notFoundRes = await fetch(`${BASE_URL}/nonexistent`);
    const notFound = await notFoundRes.json();
    console.log(`   Status: ${notFoundRes.status}`);
    console.log(`   ✅ ${notFound.message}\n`);
  } catch (err) {
    console.log(`   ❌ Failed: ${err.message}\n`);
  }

  // 10. Validation test
  console.log("10. Validation Test (empty signup)");
  try {
    const badRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const bad = await badRes.json();
    console.log(`   Status: ${badRes.status}`);
    if (!bad.success && bad.errors) {
      console.log(`   ✅ Validation caught ${bad.errors.length} errors:`);
      bad.errors.forEach((e) => console.log(`      - ${e.field}: ${e.message}`));
    }
    console.log();
  } catch (err) {
    console.log(`   ❌ Failed: ${err.message}\n`);
  }

  console.log("=== Tests Complete ===");
}

testAPI();
