export function validateFeedback(data) {
  const { name, phone, feedback } = data;

  // Check for required fields
  if (!name || !phone || !feedback) {
    return {
      success: false,
      error: "Missing required fields",
    };
  }

  // Validate name (at least 2 characters)
  if (name.trim().length < 2) {
    return {
      success: false,
      error: "Name must be at least 2 characters long",
    };
  }

  // Simple phone validation (numbers only)
  const phoneRegex = /^\d+$/;
  if (!phoneRegex.test(phone.replace(/[\s-]/g, ""))) {
    return {
      success: false,
      error: "Phone number must contain only digits",
    };
  }

  // Validate feedback (at least 10 characters)
  if (feedback.trim().length < 10) {
    return {
      success: false,
      error: "Feedback must be at least 10 characters long",
    };
  }

  return { success: true };
}
