import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/pages/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy load all app pages
const Login = React.lazy(() => import('@/pages/Login'));
const Signup = React.lazy(() => import('@/pages/Signup'));
const AuthCallback = React.lazy(() => import('@/pages/AuthCallback'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const Schools = React.lazy(() => import('@/pages/Schools'));
const CoachContacts = React.lazy(() => import('@/pages/CoachContacts'));
const OutreachCompose = React.lazy(() => import('@/pages/OutreachCompose'));
const ResponseCenter = React.lazy(() => import('@/pages/ResponseCenter'));
const Tracking = React.lazy(() => import('@/pages/Tracking'));
const CoachAnalytics = React.lazy(() => import('@/pages/CoachAnalytics'));
const Timeline = React.lazy(() => import('@/pages/Timeline'));
const Questionnaires = React.lazy(() => import('@/pages/Questionnaires'));
const RecruitingCounseling = React.lazy(() => import('@/pages/RecruitingCounseling'));
const Feedback = React.lazy(() => import('@/pages/Feedback'));
const EmailGuide = React.lazy(() => import('@/pages/EmailGuide'));
const ScholarshipsNIL = React.lazy(() => import('@/pages/ScholarshipsNIL'));
const MyRecruitingJourney = React.lazy(() => import('@/pages/MyRecruitingJourney'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const Upgrade = React.lazy(() => import('@/pages/Upgrade'));
const BillingPortal = React.lazy(() => import('@/pages/BillingPortal'));

export default function Pages() {
  return (
    <BrowserRouter>
      <Layout>
        <React.Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div>
          </div>
        }>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/schools" element={<ProtectedRoute><Schools /></ProtectedRoute>} />
          <Route path="/coachcontacts" element={<ProtectedRoute><CoachContacts /></ProtectedRoute>} />
          <Route path="/outreachcompose" element={<ProtectedRoute><OutreachCompose /></ProtectedRoute>} />
          <Route path="/responsecenter" element={<ProtectedRoute><ResponseCenter /></ProtectedRoute>} />
          <Route path="/tracking" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
          <Route path="/coachanalytics" element={<ProtectedRoute><CoachAnalytics /></ProtectedRoute>} />
          <Route path="/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
          <Route path="/questionnaires" element={<ProtectedRoute><Questionnaires /></ProtectedRoute>} />
          <Route path="/recruitingcounseling" element={<ProtectedRoute><RecruitingCounseling /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
          <Route path="/emailguide" element={<ProtectedRoute><EmailGuide /></ProtectedRoute>} />
          <Route path="/scholarshipsnil" element={<ProtectedRoute><ScholarshipsNIL /></ProtectedRoute>} />
          <Route path="/myrecruitingjourney" element={<ProtectedRoute><MyRecruitingJourney /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
          <Route path="/billingportal" element={<ProtectedRoute><BillingPortal /></ProtectedRoute>} />

          {/* Catch all - redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </React.Suspense>
      </Layout>
    </BrowserRouter>
  );
}
