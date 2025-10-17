import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, Athlete } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WalkthroughContext = createContext();

export const useWalkthrough = () => {
  const ctx = useContext(WalkthroughContext);
  if (!ctx) throw new Error("useWalkthrough must be used within GlobalWalkthroughProvider");
  return ctx;
};

const STEPS = [
  {
    id: 0,
    route: "Dashboard",
    nextRoute: "Profile",
    title: "Welcome to RecruitBridge! 👋",
    description: "We'll walk you through the core features in under a minute. Let's get started!",
    action: "Click Next to begin"
  },
  {
    id: 1,
    route: "Profile",
    nextRoute: "Schools",
    title: "Add Your Basic Info",
    description: "Enter your first and last name so coaches know who you are.",
    action: "Fill both fields to continue",
    highlightIds: ["#first_name", "#last_name"],
    require: () => {
      const firstName = document.querySelector("#first_name")?.value?.trim();
      const lastName = document.querySelector("#last_name")?.value?.trim();
      return !!(firstName && lastName);
    }
  },
  {
    id: 2,
    route: "Schools",
    nextRoute: "OutreachCompose",
    title: "Pick Your First Target School 🎯",
    description: "Choose at least one school to start building your recruiting list.",
    action: "Add a school to continue",
    require: async () => {
      try {
        const user = await User.me();
        const athletes = await Athlete.filter({ created_by: user.email });
        if (athletes.length === 0) return false;
        
        const targetSchools = window.__targetSchoolsCache || [];
        return targetSchools.length > 0;
      } catch {
        return false;
      }
    }
  },
  {
    id: 3,
    route: "OutreachCompose",
    nextRoute: "ResponseCenter",
    title: "Send Your First Message 📧",
    description: "Here's how sending a message works. We'll do a safe demo - no real emails sent!",
    action: "Click 'Send Demo' to continue",
    highlightIds: ["#send-demo-button"],
    require: () => window.__demoEmailSent === true
  },
  {
    id: 4,
    route: "ResponseCenter",
    nextRoute: "Dashboard",
    title: "Track Coach Replies 💬",
    description: "All replies show up here. Open the demo reply to see how conversations work.",
    action: "Open the demo thread to continue",
    require: () => window.__demoThreadRead === true
  },
  {
    id: 5,
    route: "Dashboard",
    nextRoute: null,
    title: "You're All Set! 🚀",
    description: "You're ready to start your real recruiting journey. Create your email identity to send real messages!",
    action: "Click Finish to complete setup",
    isComplete: true,
    require: () => true
  }
];

export function GlobalWalkthroughProvider({ children }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTutorialMode, setIsTutorialMode] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const currentStep = STEPS[currentStepIndex];

  // Auto-start for brand new users
  useEffect(() => {
    const checkAutoStart = async () => {
      const hasSeen = localStorage.getItem('hasSeenWalkthrough');
      if (hasSeen === 'true') return;

      try {
        const user = await User.me();
        if (!user) return;

        const athletes = await Athlete.filter({ created_by: user.email });
        
        if (athletes.length === 0) {
          setTimeout(() => {
            setIsActive(true);
            setIsTutorialMode(true);
            setCurrentStepIndex(0);
            window.__demoEmailSent = false;
            window.__demoThreadRead = false;
          }, 1000);
        } else {
          localStorage.setItem('hasSeenWalkthrough', 'true');
        }
      } catch (err) {
        console.error('Walkthrough check failed:', err);
      }
    };

    checkAutoStart();
  }, []);

  // ✅ THE FIX: Update step index using callback to ensure synchronous state update
  const handleNext = async () => {
    if (!currentStep) return;

    // Check requirement
    const canProceed = await currentStep.require?.() ?? true;
    if (!canProceed) {
      alert(currentStep.action || "Please complete the required action before continuing.");
      return;
    }

    // If completion step, finish
    if (currentStep.isComplete) {
      handleComplete();
      return;
    }

    // ✅ CRITICAL FIX: Use functional update to ensure step increments
    setCurrentStepIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      console.log('Walkthrough: Moving from step', prevIndex, 'to step', nextIndex);
      
      // Navigate AFTER state updates
      setTimeout(() => {
        const nextStep = STEPS[nextIndex];
        if (nextStep && nextStep.route) {
          navigate(createPageUrl(nextStep.route));
        }
      }, 50);
      
      return nextIndex;
    });
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prevIndex => {
        const prevStep = prevIndex - 1;
        navigate(createPageUrl(STEPS[prevStep].route));
        return prevStep;
      });
    }
  };

  const handleClose = () => {
    localStorage.setItem('hasSeenWalkthrough', 'true');
    setIsActive(false);
    setIsTutorialMode(false);
    setCurrentStepIndex(0);
    window.__demoEmailSent = false;
    window.__demoThreadRead = false;
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenWalkthrough', 'true');
    setIsActive(false);
    setIsTutorialMode(false);
    setCurrentStepIndex(0);
    window.__demoEmailSent = false;
    window.__demoThreadRead = false;
  };

  const startWalkthrough = () => {
    localStorage.removeItem('hasSeenWalkthrough');
    setIsActive(true);
    setIsTutorialMode(true);
    setCurrentStepIndex(0);
    window.__demoEmailSent = false;
    window.__demoThreadRead = false;
    navigate(createPageUrl("Dashboard"));
  };

  const value = {
    isActive,
    isTutorialMode,
    currentStep,
    currentStepIndex,
    startWalkthrough
  };

  return (
    <WalkthroughContext.Provider value={value}>
      {children}
      
      <AnimatePresence>
        {isActive && currentStep && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-full max-w-lg px-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={currentStepIndex}
            >
              <Card className="shadow-2xl border-2 border-purple-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {currentStepIndex + 1}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{currentStep.title}</h3>
                      </div>
                      <p className="text-slate-700 mb-2">{currentStep.description}</p>
                      <p className="text-sm text-purple-600 font-medium">{currentStep.action}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClose}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="flex gap-1.5">
                      {STEPS.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 rounded-full transition-all ${
                            idx === currentStepIndex ? 'w-8 bg-purple-600' : 
                            idx < currentStepIndex ? 'w-2 bg-purple-400' : 'w-2 bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {currentStepIndex > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBack}
                        >
                          <ArrowLeft className="w-4 h-4 mr-1" />
                          Back
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        onClick={handleNext}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {currentStep.isComplete ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Finish
                          </>
                        ) : (
                          <>
                            Next
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </WalkthroughContext.Provider>
  );
}