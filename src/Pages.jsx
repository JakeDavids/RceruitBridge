import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/pages/Layout';

// CRITICAL FIX: Lazy load ALL pages to prevent Base44 entity imports
// Static imports cause Dashboard etc to import entities.js immediately
// which triggers Base44 initialization and redirect to base44.app/login
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
            {/* Default route - redirect to Dashboard */}
            <Route path="/" element={<Navigate to="/Dashboard" replace />} />

          {/* Main app routes */}
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Schools" element={<Schools />} />
          <Route path="/CoachContacts" element={<CoachContacts />} />
          <Route path="/OutreachCompose" element={<OutreachCompose />} />
          <Route path="/ResponseCenter" element={<ResponseCenter />} />
          <Route path="/Tracking" element={<Tracking />} />
          <Route path="/CoachAnalytics" element={<CoachAnalytics />} />
          <Route path="/Timeline" element={<Timeline />} />
          <Route path="/Questionnaires" element={<Questionnaires />} />
          <Route path="/RecruitingCounseling" element={<RecruitingCounseling />} />
          <Route path="/Feedback" element={<Feedback />} />
          <Route path="/EmailGuide" element={<EmailGuide />} />
          <Route path="/ScholarshipsNIL" element={<ScholarshipsNIL />} />
          <Route path="/MyRecruitingJourney" element={<MyRecruitingJourney />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Upgrade" element={<Upgrade />} />
          <Route path="/BillingPortal" element={<BillingPortal />} />

          {/* Catch all - redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/Dashboard" replace />} />
        </Routes>
        </React.Suspense>
      </Layout>
    </BrowserRouter>
  );
}
