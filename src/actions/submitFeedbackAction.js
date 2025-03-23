"use server";

import { createFeedback } from "@/lib/db/feedback";
import { validateFeedback } from "@/lib/validators/feedbackValidator";
import { getAllFeedback } from "@/lib/db/feedback";
export async function submitFeedbackAction(data) {
  try {
    // Validate input using a separate validator
    const validationResult = validateFeedback(data);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error,
      };
    }

    // Create new feedback entry using the database service
    const newFeedback = await createFeedback(data);

    return {
      success: true,
      data: newFeedback,
    };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return {
      success: false,
      error: "Failed to submit feedback",
    };
  }
}

// Server action to fetch feedback with admin authentication
export async function fetchAdminFeedback(token) {
  try {
    // Check if the token is valid
    if (!token || token !== process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
      return {
        success: false,
        error: "Unauthorized access",
      };
    }

    // Get all feedback entries
    const feedback = await getAllFeedback();

    return {
      success: true,
      data: feedback,
    };
  } catch (error) {
    console.error("Error fetching admin feedback:", error);
    return {
      success: false,
      error: "Failed to fetch feedback data",
    };
  }
}
