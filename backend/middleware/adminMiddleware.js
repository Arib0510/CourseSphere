// =============================================
// Admin Authorization Middleware
// =============================================
// Checks if the authenticated user's email exists
// in the admins table. Must be used AFTER authMiddleware.
// =============================================

const { supabaseAdmin, supabase } = require("../services/supabase");
const { error } = require("../utils/apiResponse");

const adminMiddleware = async (req, res, next) => {
  try {
    // Ensure user is authenticated first
    if (!req.user || !req.user.email) {
      return error(
        res,
        "Authentication required before admin check.",
        401
      );
    }

    // Use admin client if available, otherwise fall back to anon client
    const client = supabaseAdmin || supabase;

    // Check if user's email exists in the admins table
    const { data: admin, error: dbError } = await client
      .from("admins")
      .select("id, email")
      .eq("email", req.user.email)
      .single();

    if (dbError || !admin) {
      return error(
        res,
        "Access denied. Admin privileges required.",
        403
      );
    }

    // Attach admin flag to request
    req.isAdmin = true;

    next();
  } catch (err) {
    console.error("Admin middleware error:", err.message);
    return error(res, "Admin authorization failed.", 500);
  }
};

module.exports = { adminMiddleware };
