import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import React from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'

function App() {
  // Check if this is landing mode or app mode
  const isLandingMode = import.meta.env.VITE_APP_MODE === 'landing';

  // Debug: Log the environment variable
  console.log('VITE_APP_MODE:', import.meta.env.VITE_APP_MODE);
  console.log('isLandingMode:', isLandingMode);

  if (isLandingMode) {
    // Lazy load new Landing component to avoid Base44 initialization
    const NewLanding = React.lazy(() => import("@/pages/NewLanding.jsx"));

    return (
      <ThemeProvider>
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div></div>}>
          <NewLanding />
          <Analytics />
        </React.Suspense>
      </ThemeProvider>
    );
  }

  // Lazy load app Pages to ensure Base44 only loads in app mode
  const Pages = React.lazy(() => import("@/Pages.jsx"));

  return (
    <ThemeProvider>
      <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div></div>}>
        <Pages />
        <Toaster />
        <Analytics />
      </React.Suspense>
    </ThemeProvider>
  )
}

export default App 