// =============================================
// Course Controller
// =============================================
// Handles: getAllCourses, getCourseById,
//          createCourse, updateCourse, deleteCourse
// =============================================

const { supabaseAdmin, supabase } = require("../services/supabase");
const { success, error } = require("../utils/apiResponse");

// ---------------------------------------------
// GET /api/courses
// Query params: ?search=&semester=&academic_year=&category=
// ---------------------------------------------
const getAllCourses = async (req, res) => {
  try {
    const { search, semester, academic_year, category } = req.query;
    const client = supabaseAdmin || supabase;

    let query = client
      .from("courses")
      .select("*, enrolled_count:registrations(count)");

    if (semester)      query = query.eq("semester", semester);
    if (academic_year) query = query.eq("academic_year", academic_year);
    if (category)      query = query.eq("category", category);
    if (search) {
      query = query.or(
        `course_no.ilike.%${search}%,course_title.ilike.%${search}%`
      );
    }

    query = query
      .order("academic_year", { ascending: true })
      .order("semester",      { ascending: true })
      .order("course_no",     { ascending: true });

    const { data: rawCourses, error: queryError } = await query;

    if (queryError) {
      return error(res, queryError.message, 400);
    }

    // Flatten the nested registrations aggregate
    const courses = (rawCourses || []).map(c => ({
      ...c,
      enrolled_count: Array.isArray(c.enrolled_count)
        ? (c.enrolled_count[0]?.count ?? 0)
        : (c.enrolled_count ?? 0),
    }));

    return success(res, "Courses retrieved successfully.", courses);
  } catch (err) {
    console.error("Get courses error:", err.message);
    return error(res, "Failed to retrieve courses.", 500);
  }
};

// ---------------------------------------------
// GET /api/courses/:id
// ---------------------------------------------
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = supabaseAdmin || supabase;

    const { data: course, error: queryError } = await client
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (queryError) {
      return error(res, "Course not found.", 404);
    }

    // Get current registration count for this course
    const { count } = await client
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("course_id", id);

    return success(res, "Course retrieved successfully.", {
      ...course,
      enrolled: count || 0,
      available_seats: course.capacity - (count || 0),
    });
  } catch (err) {
    console.error("Get course error:", err.message);
    return error(res, "Failed to retrieve course.", 500);
  }
};

// ---------------------------------------------
// POST /api/admin/courses/upload-pdf (Admin only)
// Accepts a single PDF file via multipart/form-data
// field name "pdf", uploads to Supabase Storage.
// Returns { url } on success.
// ---------------------------------------------
const uploadCoursePDF = async (req, res) => {
  try {
    if (!req.file) return error(res, "No file provided.", 400);

    const { type } = req.query; // "syllabus" | "curriculum"
    const ext      = req.file.originalname.split('.').pop() || 'pdf';
    const filename = `${type || 'pdf'}_${Date.now()}.${ext}`;
    const bucket   = "course-pdfs";
    const client   = supabaseAdmin || supabase;

    const { error: uploadError } = await client.storage
      .from(bucket)
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) return error(res, uploadError.message, 400);

    const { data: urlData } = client.storage.from(bucket).getPublicUrl(filename);

    return success(res, "File uploaded successfully.", { url: urlData.publicUrl });
  } catch (err) {
    console.error("Upload PDF error:", err.message);
    return error(res, "Failed to upload file.", 500);
  }
};

// ---------------------------------------------
// POST /api/courses (Admin only)
// ---------------------------------------------
const createCourse = async (req, res) => {
  try {
    const {
      course_no,
      course_title,
      credits,
      credit_hours,
      academic_year,
      semester,
      category,
      capacity,
      syllabus_url,
      curriculum_url,
      description,
    } = req.body;

    const client = supabaseAdmin || supabase;

    const { data: course, error: insertError } = await client
      .from("courses")
      .insert({
        course_no,
        course_title,
        credits,
        credit_hours,
        academic_year: academic_year || null,
        semester: semester || null,
        category: category || null,
        capacity: capacity || 40,
        syllabus_url: syllabus_url || null,
        curriculum_url: curriculum_url || null,
        description: description || null,
      })
      .select()
      .single();

    if (insertError) {
      // Handle duplicate course number
      if (insertError.code === "23505") {
        return error(
          res,
          `Course with number "${course_no}" already exists.`,
          409
        );
      }
      return error(res, insertError.message, 400);
    }

    return success(res, "Course created successfully.", course, 201);
  } catch (err) {
    console.error("Create course error:", err.message);
    return error(res, "Failed to create course.", 500);
  }
};

// ---------------------------------------------
// PUT /api/courses/:id (Admin only)
// ---------------------------------------------
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      course_no,
      course_title,
      credits,
      credit_hours,
      academic_year,
      semester,
      category,
      capacity,
      syllabus_url,
      curriculum_url,
      description,
    } = req.body;

    // Build update object — only include provided fields
    const updates = {};
    if (course_no       !== undefined) updates.course_no       = course_no;
    if (course_title    !== undefined) updates.course_title    = course_title;
    if (credits         !== undefined) updates.credits         = credits;
    if (credit_hours    !== undefined) updates.credit_hours    = credit_hours;
    if (academic_year   !== undefined) updates.academic_year   = academic_year;
    if (semester        !== undefined) updates.semester        = semester;
    if (category        !== undefined) updates.category        = category;
    if (capacity        !== undefined) updates.capacity        = capacity;
    if (syllabus_url    !== undefined) updates.syllabus_url    = syllabus_url   || null;
    if (curriculum_url  !== undefined) updates.curriculum_url  = curriculum_url || null;
    if (description     !== undefined) updates.description     = description    || null;

    if (Object.keys(updates).length === 0) {
      return error(res, "No fields to update.", 400);
    }

    const client = supabaseAdmin || supabase;

    const { data: course, error: updateError } = await client
      .from("courses")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === "23505") {
        return error(res, "Course number already exists.", 409);
      }
      return error(res, updateError.message, 400);
    }

    if (!course) {
      return error(res, "Course not found.", 404);
    }

    return success(res, "Course updated successfully.", course);
  } catch (err) {
    console.error("Update course error:", err.message);
    return error(res, "Failed to update course.", 500);
  }
};

// ---------------------------------------------
// DELETE /api/courses/:id (Admin only)
// ---------------------------------------------
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const client = supabaseAdmin || supabase;

    // Check if course exists
    const { data: existing } = await client
      .from("courses")
      .select("id, course_no")
      .eq("id", id)
      .single();

    if (!existing) {
      return error(res, "Course not found.", 404);
    }

    // Delete the course (cascades to registrations via FK)
    const { error: deleteError } = await client
      .from("courses")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return error(res, deleteError.message, 400);
    }

    return success(res, `Course "${existing.course_no}" deleted successfully.`);
  } catch (err) {
    console.error("Delete course error:", err.message);
    return error(res, "Failed to delete course.", 500);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  uploadCoursePDF,
};
