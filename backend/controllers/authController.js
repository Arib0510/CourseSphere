// =============================================
// Authentication Controller
// =============================================
// Handles: signup, login, logout, getProfile, updateProfile
// Uses Supabase Auth for credential management.
// =============================================

const { supabase, supabaseAdmin } = require("../services/supabase");
const { success, error } = require("../utils/apiResponse");

// ---------------------------------------------
// POST /api/auth/signup
// ---------------------------------------------
const signup = async (req, res) => {
  try {
    const { email, password, full_name, student_id, department } = req.body;

    if (!supabaseAdmin) {
      return error(res, "Server configuration error: admin client unavailable.", 500);
    }

    // Use admin API to create the user with email already confirmed —
    // this bypasses the email verification step so users can log in immediately.
    const { data, error: signupError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name || "" },
    });

    if (signupError) {
      return error(res, signupError.message, 400);
    }

    // Upsert the extended profile fields
    if (data.user) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .upsert({
          id: data.user.id,
          full_name: full_name || "",
          student_id: student_id || null,
          department: department || null,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError.message);
      }
    }

    return success(
      res,
      "Account created successfully. You can now log in.",
      {
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
      },
      201
    );
  } catch (err) {
    console.error("Signup error:", err.message);
    return error(res, "Registration failed. Please try again.", 500);
  }
};

// ---------------------------------------------
// POST /api/auth/login
// ---------------------------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      return error(res, loginError.message, 401);
    }

    // Fetch the user's profile
    const client = supabaseAdmin || supabase;
    const { data: profile } = await client
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    // Check if user is admin
    const { data: adminRecord } = await client
      .from("admins")
      .select("id")
      .eq("email", data.user.email)
      .single();

    const isAdmin = !!adminRecord;

    return success(res, "Login successful.", {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.full_name || "",
        student_id: profile?.student_id || null,
        department: profile?.department || null,
        registration_no:      profile?.registration_no      || null,
        academic_session:     profile?.academic_session     || null,
        earned_credits:       profile?.earned_credits       ?? null,
        backlog_count:        profile?.backlog_count         ?? null,
        name_bangla:          profile?.name_bangla          || null,
        father_name:          profile?.father_name          || null,
        father_name_bangla:   profile?.father_name_bangla   || null,
        address_current:      profile?.address_current      || null,
        role: isAdmin ? "admin" : "student",
        isAdmin,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return error(res, "Login failed. Please try again.", 500);
  }
};

// ---------------------------------------------
// POST /api/auth/logout
// ---------------------------------------------
const logout = async (req, res) => {
  try {
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      return error(res, logoutError.message, 400);
    }

    return success(res, "Logged out successfully.");
  } catch (err) {
    console.error("Logout error:", err.message);
    return error(res, "Logout failed.", 500);
  }
};

// ---------------------------------------------
// GET /api/auth/profile
// ---------------------------------------------
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const client = supabaseAdmin || supabase;

    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      return error(res, "Profile not found.", 404);
    }

    // Check if user is an admin so role survives page refresh
    const { data: adminRecord } = await client
      .from("admins")
      .select("id")
      .eq("email", req.user.email)
      .single();

    const isAdmin = !!adminRecord;

    return success(res, "Profile retrieved successfully.", {
      ...profile,
      email: req.user.email,
      name: profile?.full_name || "",
      role: isAdmin ? "admin" : "student",
      isAdmin,
    });
  } catch (err) {
    console.error("Get profile error:", err.message);
    return error(res, "Failed to retrieve profile.", 500);
  }
};

// ---------------------------------------------
// PUT /api/auth/profile
// ---------------------------------------------
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, student_id, department, registration_no, academic_session, earned_credits, backlog_count, name_bangla, father_name, father_name_bangla, address_current } = req.body;

    // Build the update object — only include provided fields
    const updates = {};
    if (full_name            !== undefined) updates.full_name            = full_name;
    if (student_id           !== undefined) updates.student_id           = student_id;
    if (department           !== undefined) updates.department           = department;
    if (registration_no      !== undefined) updates.registration_no      = registration_no      || null;
    if (academic_session     !== undefined) updates.academic_session     = academic_session     || null;
    if (earned_credits       !== undefined) updates.earned_credits       = earned_credits       !== '' && earned_credits       != null ? Number(earned_credits)  : null;
    if (backlog_count        !== undefined) updates.backlog_count        = backlog_count        !== '' && backlog_count        != null ? Number(backlog_count)   : null;
    if (name_bangla          !== undefined) updates.name_bangla          = name_bangla          || null;
    if (father_name          !== undefined) updates.father_name          = father_name          || null;
    if (father_name_bangla   !== undefined) updates.father_name_bangla   = father_name_bangla   || null;
    if (address_current      !== undefined) updates.address_current      = address_current      || null;

    if (Object.keys(updates).length === 0) {
      return error(res, "No fields to update.", 400);
    }

    const client = supabaseAdmin || supabase;

    const { data: profile, error: updateError } = await client
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      // Handle duplicate student_id
      if (updateError.code === "23505") {
        return error(res, "Student ID already exists.", 409);
      }
      return error(res, updateError.message, 400);
    }

    return success(res, "Profile updated successfully.", profile);
  } catch (err) {
    console.error("Update profile error:", err.message);
    return error(res, "Failed to update profile.", 500);
  }
};

module.exports = { signup, login, logout, getProfile, updateProfile };
