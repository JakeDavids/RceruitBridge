import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/pages/Layout';

// Lazy load all app pages
const Login = React.lazy(() => import('@/pages/Login'));
const Signup = React.lazy(() => import('@/pages/Signup'));
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
            {/* TEMPORARY: Root redirects directly to Dashboard (auth disabled) */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* Login/Signup routes kept for future re-enabling */}
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/signup" element={<Navigate to="/dashboard" replace />} />

          {/* Main app routes (protected) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/coachcontacts" element={<CoachContacts />} />
          <Route path="/outreachcompose" element={<OutreachCompose />} />
          <Route path="/responsecenter" element={<ResponseCenter />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/coachanalytics" element={<CoachAnalytics />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/questionnaires" element={<Questionnaires />} />
          <Route path="/recruitingcounseling" element={<RecruitingCounseling />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/emailguide" element={<EmailGuide />} />
          <Route path="/scholarshipsnil" element={<ScholarshipsNIL />} />
          <Route path="/myrecruitingjourney" element={<MyRecruitingJourney />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/billingportal" element={<BillingPortal />} />

          {/* Catch all - redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </React.Suspense>
      </Layout>
    </BrowserRouter>
  );
}
