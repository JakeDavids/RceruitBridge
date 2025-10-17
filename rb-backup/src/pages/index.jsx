import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately redirect to Dashboard
    // If user is not logged in, the layout will catch it and show login
    navigate(createPageUrl("Dashboard"), { replace: true });
  }, [navigate]);

  // Show minimal loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading RecruitBridge...</p>
      </div>
    </div>
  );
}