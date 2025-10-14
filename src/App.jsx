import './App.css'
import Landing from "@/pages/Landing.jsx"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter } from "react-router-dom"
import Base44Client from "@/Base44Client"

function App() {
  // Check if this is landing mode or app mode
  const isLandingMode = import.meta.env.VITE_APP_MODE === 'landing';

  if (isLandingMode) {
    // Landing page only - no routing, no Base44, no auth
    return (
      <>
        <Landing />
        <Analytics />
      </>
    );
  }

  // Full app with routing and auth (Base44 handles routing automatically)
  return (
    <BrowserRouter>
      <Base44Client />
      <Toaster />
      <Analytics />
    </BrowserRouter>
  )
}

export default App 