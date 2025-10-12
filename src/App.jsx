import './App.css'
import Pages from "@/pages/index.jsx"
import Landing from "@/pages/Landing.jsx"
import { Toaster } from "@/components/ui/toaster"

function App() {
  // Check if this is landing mode or app mode
  const isLandingMode = import.meta.env.VITE_APP_MODE === 'landing';

  if (isLandingMode) {
    // Landing page only - no routing, no Base44, no auth
    return <Landing />;
  }

  // Full app with routing and auth
  return (
    <>
      <Pages />
      <Toaster />
    </>
  )
}

export default App 