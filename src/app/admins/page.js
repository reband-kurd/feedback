"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchAdminFeedback } from "@/actions/submitFeedbackAction";

export default function AdminPage() {
  const [feedbackEntries, setFeedbackEntries] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const router = useRouter();

  // Check if user is authenticated via localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setIsAuthenticated(true);
      setIsDialogOpen(false);
      setToken(storedToken);
      loadFeedbackData(storedToken);
    }
  }, []);

  // For debugging - we'll remove this in production
  useEffect(() => {
    console.log("Using NEXT_PUBLIC_ADMIN_TOKEN for authentication");
  }, []);

  // Function to load feedback data using server action
  const loadFeedbackData = async (adminToken) => {
    setIsDataLoading(true);
    try {
      const result = await fetchAdminFeedback(adminToken || token);

      if (!result.success) {
        if (result.error === "Unauthorized access") {
          // Token is invalid or expired
          localStorage.removeItem("adminToken");
          setIsAuthenticated(false);
          setIsDialogOpen(true);
          toast.error("Authentication expired. Please log in again.");
          return;
        }
        throw new Error(result.error || "Failed to fetch feedback data");
      }

      setFeedbackEntries(result.data);
    } catch (error) {
      console.error("Failed to load feedback data", error);
      toast.error("Failed to load feedback entries");
    } finally {
      setIsDataLoading(false);
    }
  };

  // Handle token submission
  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate token using server action
      const result = await fetchAdminFeedback(token);

      if (result.success) {
        // Store token in localStorage
        localStorage.setItem("adminToken", token);
        setIsAuthenticated(true);
        setIsDialogOpen(false);
        toast.success("Admin access granted");

        // Set the feedback data
        setFeedbackEntries(result.data);
      } else {
        toast.error("Invalid admin token");
      }
    } catch (error) {
      toast.error("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  // If not authenticated and dialog is closed, redirect to home
  useEffect(() => {
    if (!isAuthenticated && !isDialogOpen) {
      router.push("/");
    }
  }, [isAuthenticated, isDialogOpen, router]);

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open && !isAuthenticated) {
            router.push("/");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Access Required</DialogTitle>
            <DialogDescription>
              Please enter the admin token to access this page.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTokenSubmit} className="space-y-4 mt-4">
            <Input
              type="password"
              placeholder="Enter admin token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Access Admin"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {isAuthenticated && (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Feedback Administration</h1>

          {isDataLoading ? (
            <div className="text-center py-12">
              <p>Loading feedback data...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {feedbackEntries.map((entry) => (
                  <Card key={entry.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between">
                        <span>{entry.name}</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(entry.createdAt)}
                        </span>
                      </CardTitle>
                      <p className="text-sm text-gray-600">{entry.phone}</p>
                    </CardHeader>
                    <CardContent>
                      <p>{entry.feedback}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {feedbackEntries.length === 0 && (
                <p className="text-center text-gray-500 my-12">
                  No feedback entries yet.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
