// =============================================
// Registration Controller
// =============================================
// Handles: getMyRegistrations, registerCourse, dropCourse
// All operations are scoped to the authenticated student.
// =============================================

const { supabaseAdmin, supabase } = require("../services/supabase");
const { success, error } = require("../utils/apiResponse");

// ---------------------------------------------
// GET /api/registrations
// Returns the authenticated student's registrations
// with full course details joined.
// ---------------------------------------------
const getMyRegistrations = async (req, res) => {
  try {
    const studentId = req.user.id;
    const client = supabaseAdmin || supabase;

    const { data: registrations, error: queryError } = await client
      .from("registrations")
      .select(
        `
        id,
        created_at,
        courses (
          id,
          course_no,
          course_title,
          credits,
          credit_hours,
          academic_year,
          semester,
          category,
          capacity
        )
      `
      )
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (queryError) {
      return error(res, queryError.message, 400);
    }

    const formatted = registrations.map((reg) => ({
      id: reg.id,
      registration_id: reg.id,   // alias kept for compatibility
      registered_at: reg.created_at,
      created_at: reg.created_at,
      course: reg.courses,
    }));

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
// POST /api/registrations
// Body: { course_id }
// Registers the authenticated student for a course.
// Checks: duplicate enrollment, capacity limits.
// ---------------------------------------------
const registerCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { course_id } = req.body;

    const client = supabaseAdmin || supabase;

    // 1. Check if the course exists
    const { data: course, error: courseError } = await client
      .from("courses")
      .select("id, course_no, course_title, capacity")
      .eq("id", course_id)
      .single();

    if (courseError || !course) {
      return error(res, "Course not found.", 404);
    }

    // 2. Check for duplicate registration
    const { data: existing } = await client
      .from("registrations")
      .select("id")
      .eq("student_id", studentId)
      .eq("course_id", course_id)
      .single();

    if (existing) {
      return error(
        res,
        `You are already registered for "${course.course_title}".`,
        409
      );
    }

    // 3. Check course capacity
    const { count: enrolledCount } = await client
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("course_id", course_id);

    if (enrolledCount >= course.capacity) {
      return error(
        res,
        `Course "${course.course_title}" is full (${course.capacity}/${course.capacity}).`,
        400
      );
    }

    // 4. Register the student
    const { data: registration, error: insertError } = await client
      .from("registrations")
      .insert({
        student_id: studentId,
        course_id: course_id,
      })
      .select(
        `
        id,
        created_at,
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
      )
      .single();

    if (insertError) {
      // Handle unique constraint violation (race condition safety)
      if (insertError.code === "23505") {
        return error(
          res,
          `You are already registered for "${course.course_title}".`,
          409
        );
      }
      return error(res, insertError.message, 400);
    }

    return success(
      res,
      `Successfully registered for "${course.course_title}".`,
      {
        id: registration.id,
        registration_id: registration.id,
        registered_at: registration.created_at,
        created_at: registration.created_at,
        course: registration.courses,
      },
      201
    );
  } catch (err) {
    console.error("Register course error:", err.message);
    return error(res, "Failed to register for course.", 500);
  }
};

// ---------------------------------------------
// DELETE /api/registrations/:id
// Drops a course registration.
// Only the owning student can drop their registration.
// ---------------------------------------------
const dropCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;

    const client = supabaseAdmin || supabase;

    // Check if this registration belongs to the student
    const { data: registration, error: findError } = await client
      .from("registrations")
      .select(
        `
        id,
        student_id,
        courses (
          course_title
        )
      `
      )
      .eq("id", id)
      .single();

    if (findError || !registration) {
      return error(res, "Registration not found.", 404);
    }

    if (registration.student_id !== studentId) {
      return error(
        res,
        "You can only drop your own registrations.",
        403
      );
    }

    // Delete the registration
    const { error: deleteError } = await client
      .from("registrations")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return error(res, deleteError.message, 400);
    }

    const courseTitle = registration.courses?.course_title || "the course";
    return success(
      res,
      `Successfully dropped "${courseTitle}".`
    );
  } catch (err) {
    console.error("Drop course error:", err.message);
    return error(res, "Failed to drop course.", 500);
  }
};

module.exports = { getMyRegistrations, registerCourse, dropCourse };
