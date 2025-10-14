import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/pages/Layout';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Schools from '@/pages/Schools';
import CoachContacts from '@/pages/CoachContacts';
import OutreachCompose from '@/pages/OutreachCompose';
import ResponseCenter from '@/pages/ResponseCenter';
import Tracking from '@/pages/Tracking';
import CoachAnalytics from '@/pages/CoachAnalytics';
import Timeline from '@/pages/Timeline';
import Questionnaires from '@/pages/Questionnaires';
import RecruitingCounseling from '@/pages/RecruitingCounseling';
import Feedback from '@/pages/Feedback';
import EmailGuide from '@/pages/EmailGuide';
import ScholarshipsNIL from '@/pages/ScholarshipsNIL';
import MyRecruitingJourney from '@/pages/MyRecruitingJourney';
import Settings from '@/pages/Settings';
import Upgrade from '@/pages/Upgrade';
import BillingPortal from '@/pages/BillingPortal';

export default function Pages() {
  return (
    <BrowserRouter>
      <Layout>
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
      </Layout>
    </BrowserRouter>
  );
}
