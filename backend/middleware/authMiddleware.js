// =============================================
// Authentication Middleware
// =============================================
// Verifies the Supabase JWT from the Authorization header.
// Attaches the authenticated user to req.user.
// =============================================

const { supabase } = require("../services/supabase");
const { error } = require("../utils/apiResponse");

const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return error(
        res,
        "Access denied. No authentication token provided.",
        401
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return error(res, "Access denied. Invalid token format.", 401);
    }

    // Verify the token with Supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return error(
        res,
        "Invalid or expired authentication token.",
        401
      );
    }

    // Attach user info to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Attach the token so downstream operations can use it
    req.token = token;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return error(res, "Authentication failed.", 500);
  }
};

module.exports = { authMiddleware };
