// =============================================
// Admin Controller
// =============================================
// Handles: getDashboardStats, getAllStudents,
//          getAllRegistrations
// All endpoints require admin authorization.
// =============================================

const { supabaseAdmin, supabase } = require("../services/supabase");
const { success, error } = require("../utils/apiResponse");

// ---------------------------------------------
// GET /api/admin/stats
// Returns dashboard analytics:
//   - Total students
//   - Total courses
//   - Total registrations
//   - Courses by academic year
//   - Courses by semester
// ---------------------------------------------
const getDashboardStats = async (req, res) => {
  try {
    const client = supabaseAdmin || supabase;

    // Count total students (profiles)
    const { count: totalStudents } = await client
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Count total courses
    const { count: totalCourses } = await client
      .from("courses")
      .select("*", { count: "exact", head: true });

    // Count total registrations
    const { count: totalRegistrations } = await client
      .from("registrations")
      .select("*", { count: "exact", head: true });

    // Get courses breakdown by academic year and semester
    const { data: courses } = await client
      .from("courses")
      .select("academic_year, semester, category");

    const yearCounts = {};
    const semesterCounts = {};
    const categoryCounts = {};

    if (courses) {
      courses.forEach((c) => {
        if (c.academic_year) {
          yearCounts[c.academic_year] =
            (yearCounts[c.academic_year] || 0) + 1;
        }
        if (c.semester) {
          semesterCounts[c.semester] =
            (semesterCounts[c.semester] || 0) + 1;
        }
        if (c.category) {
          categoryCounts[c.category] =
            (categoryCounts[c.category] || 0) + 1;
        }
      });
    }

    return success(res, "Dashboard stats retrieved successfully.", {
      totalStudents: totalStudents || 0,
      totalCourses: totalCourses || 0,
      totalRegistrations: totalRegistrations || 0,
      coursesByAcademicYear: yearCounts,
      coursesBySemester: semesterCounts,
      coursesByCategory: categoryCounts,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err.message);
    return error(res, "Failed to retrieve dashboard stats.", 500);
  }
};

// ---------------------------------------------
// GET /api/admin/students
// Returns all student profiles.
// ---------------------------------------------
const getAllStudents = async (req, res) => {
  try {
    const client = supabaseAdmin || supabase;

    const { data: profiles, error: queryError } = await client
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) {
      return error(res, queryError.message, 400);
    }

    // Build an email map from auth.users (only possible with admin client)
    const emailMap = {};
    if (supabaseAdmin) {
      const { data: authData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      (authData?.users || []).forEach(u => { emailMap[u.id] = u.email; });
    }

    const students = (profiles || []).map(p => ({
      ...p,
      name:  p.full_name || "",
      email: emailMap[p.id] || "",
    }));

    return success(res, "Students retrieved successfully.", students);
  } catch (err) {
    console.error("Get students error:", err.message);
    return error(res, "Failed to retrieve students.", 500);
  }
};

// ---------------------------------------------
// GET /api/admin/registrations
// Returns all registrations with student and
// course details joined.
// Query params: ?course_id=&academic_year=&semester=
// ---------------------------------------------
const getAllRegistrations = async (req, res) => {
  try {
    const { course_id, academic_year, semester } = req.query;
    const client = supabaseAdmin || supabase;

    let query = client.from("registrations").select(
      `
      id,
      created_at,
      profiles (
        id,
        full_name,
        student_id,
        department
      ),
      courses (
        id,
        course_no,
        course_title,
        credits,
        credit_hours,
        academic_year,
        semester,
        category
      )
    `
    );

    // Filter by specific course
    if (course_id) {
      query = query.eq("course_id", course_id);
    }

    query = query.order("created_at", { ascending: false });

    const { data: registrations, error: queryError } = await query;

    if (queryError) {
      return error(res, queryError.message, 400);
    }

    // Filter by academic year or semester (on the joined courses table)
    let filtered = registrations;
    if (academic_year) {
      filtered = filtered.filter(
        (r) => r.courses?.academic_year === academic_year
      );
    }
    if (semester) {
      filtered = filtered.filter(
        (r) => r.courses?.semester === semester
      );
    }

    // Build email map for student display
    const emailMap = {};
    if (supabaseAdmin) {
      const { data: authData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      (authData?.users || []).forEach(u => { emailMap[u.id] = u.email; });
    }

    // Format the response — normalize full_name → name for all frontend views
    const formatted = filtered.map((reg) => {
      const p = reg.profiles || {};
      return {
        id: reg.id,
        registration_id: reg.id,
        registered_at: reg.created_at,
        created_at: reg.created_at,
        student: {
          ...p,
          name:  p.full_name || "",
          email: emailMap[p.id] || "",
        },
        course: reg.courses,
      };
    });

    return success(
      res,
      "Registrations retrieved successfully.",
      formatted
    );
  } catch (err) {
    console.error("Get registrations error:", err.message);
    return error(res, "Failed to retrieve registrations.", 500);
  }
};

// ---------------------------------------------
// POST /api/admin/students
// Creates a new student account.
// ---------------------------------------------
const createStudent = async (req, res) => {
  try {
    const { email, password, full_name, student_id, department } = req.body;
    if (!email || !password) return error(res, "Email and password are required.", 400);

    if (!supabaseAdmin) return error(res, "Admin client unavailable.", 500);

    const { data, error: signupError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name || "" },
    });

    if (signupError) return error(res, signupError.message, 400);

    if (data.user) {
      await supabaseAdmin.from("profiles").upsert({
        id: data.user.id,
        full_name: full_name || "",
        student_id: student_id || null,
        department: department || null,
      });
    }

    return success(res, "Student created successfully.", { id: data.user?.id, email }, 201);
  } catch (err) {
    console.error("Create student error:", err.message);
    return error(res, "Failed to create student.", 500);
  }
};

// ---------------------------------------------
// PUT /api/admin/students/:id
// Updates a student's profile fields.
// ---------------------------------------------
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, student_id, department } = req.body;
    const client = supabaseAdmin || supabase;

    const updates = {};
    if (full_name  !== undefined) updates.full_name  = full_name;
    if (student_id !== undefined) updates.student_id = student_id;
    if (department !== undefined) updates.department = department;

    if (Object.keys(updates).length === 0) return error(res, "No fields to update.", 400);

    const { data: profile, error: updateError } = await client
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === "23505") return error(res, "Student ID already exists.", 409);
      return error(res, updateError.message, 400);
    }

    return success(res, "Student updated successfully.", profile);
  } catch (err) {
    console.error("Update student error:", err.message);
    return error(res, "Failed to update student.", 500);
  }
};

// ---------------------------------------------
// DELETE /api/admin/students/:id
// Deletes a student profile and auth account.
// ---------------------------------------------
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const client = supabaseAdmin || supabase;

    const { error: profileError } = await client.from("profiles").delete().eq("id", id);
    if (profileError) return error(res, profileError.message, 400);

    if (supabaseAdmin) {
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (authError) console.error("Auth delete error (non-fatal):", authError.message);
    }

    return success(res, "Student deleted successfully.");
  } catch (err) {
    console.error("Delete student error:", err.message);
    return error(res, "Failed to delete student.", 500);
  }
};

// ---------------------------------------------
// DELETE /api/admin/registrations/:id
// Rejects (deletes) a registration.
// ---------------------------------------------
const rejectRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const client = supabaseAdmin || supabase;

    const { error: deleteError } = await client.from("registrations").delete().eq("id", id);
    if (deleteError) return error(res, deleteError.message, 400);

    return success(res, "Registration rejected successfully.");
  } catch (err) {
    console.error("Reject registration error:", err.message);
    return error(res, "Failed to reject registration.", 500);
  }
};

module.exports = {
  getDashboardStats,
  getAllStudents,
  getAllRegistrations,
  createStudent,
  updateStudent,
  deleteStudent,
  rejectRegistration,
};
