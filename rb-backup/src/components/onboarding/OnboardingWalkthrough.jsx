import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, Athlete, CoachContact, MailThread, Message } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WALKTHROUGH_STEPS = [
  {
    id: "welcome",
    page: "Dashboard",
    title: "Welcome to RecruitBridge! 👋",
    description: "Let's get you set up in 60 seconds. We'll guide you through the key features to start your recruiting journey.",
    position: "center"
  },
  {
    id: "profile_name",
    page: "Profile",
    title: "Enter Your Name",
    description: "Fill in your first and last name so coaches know who you are. These fields are required to continue.",
    target: "#first_name",
    highlightIds: ["#first_name", "#last_name"],
    position: "bottom",
    validation: () => {
      const firstName = document.querySelector("#first_name")?.value;
      const lastName = document.querySelector("#last_name")?.value;
      return firstName && lastName;
    }
  },
  {
    id: "pick_school",
    page: "Schools",
    title: "Pick Your First Target School 🎯",
    description: "Search for a school you're interested in and click 'Add to Target List'. You can add more anytime!",
    target: null,
    position: "center"
  },
  {
    id: "add_coach",
    page: "CoachContacts",
    title: "Meet Your First Coach 👨‍🏫",
    description: "We've added Coach Sir from your target school as a demo. This is where you'll track all your coach contacts.",
    target: null,
    position: "center",
    autoAction: async () => {
      // Auto-add fake coach "Coach Sir"
      try {
        const user = await User.me();
        const athletes = await Athlete.filter({ created_by: user.email });
        const athlete = athletes[0];
        
        if (!athlete) return;

        // Check if demo coach already exists
        const existing = await CoachContact.filter({ 
          athlete_id: athlete.id,
          coach_name: "Coach Sir" 
        });
        
        if (existing.length === 0) {
          await CoachContact.create({
            athlete_id: athlete.id,
            school_id: "demo_school",
            coach_name: "Coach Sir",
            coach_title: "Head Coach",
            coach_email: "coach.sir@demo.com",
            coach_phone: "(555) 123-4567",
            response_status: "not_contacted"
          });
        }
      } catch (err) {
        console.error('Error adding demo coach:', err);
      }
    }
  },
  {
    id: "outreach_demo",
    page: "OutreachCompose",
    title: "Send a Demo Message 📧",
    description: "Let's compose a message! Click 'Generate Email' to create a draft, then click 'Next' to send a mock demo (it won't actually send).",
    target: "#generate-email-button",
    highlightIds: ["#generate-email-button"],
    position: "top",
    mockAction: () => {
      // Mock "email sent" action
      return { success: true, message: "Demo email sent successfully!" };
    }
  },
  {
    id: "response_center",
    page: "ResponseCenter",
    title: "See How Replies Work 💬",
    description: "All coach replies land here! We've created a demo reply thread so you can see how it works.",
    target: null,
    position: "center",
    autoAction: async () => {
      // Create fake reply thread
      try {
        const user = await User.me();
        if (!user) return;

        // Check if demo thread already exists
        const existing = await MailThread.filter({ 
          userId: user.id,
          subject: "Re: Demo - Interest in Your Football Program" 
        });
        
        if (existing.length === 0) {
          // Create demo thread
          const thread = await MailThread.create({
            userId: user.id,
            subject: "Re: Demo - Interest in Your Football Program",
            participants: "coach.sir@demo.com,you@recruitbridge.net",
            lastAt: new Date().toISOString()
          });

          // Create demo messages
          await Message.create({
            threadId: thread.id,
            mailboxId: "demo_mailbox",
            direction: "OUT",
            from: "you@recruitbridge.net",
            to: "coach.sir@demo.com",
            subject: "Demo - Interest in Your Football Program",
            text: "Hi Coach Sir,\n\nI'm really interested in your football program. I'd love to learn more about opportunities to play for your team.\n\nBest regards,\nYour Name"
          });

          await Message.create({
            threadId: thread.id,
            mailboxId: "demo_mailbox",
            direction: "IN",
            from: "coach.sir@demo.com",
            to: "you@recruitbridge.net",
            subject: "Re: Demo - Interest in Your Football Program",
            text: "Hi there,\n\nThanks for reaching out! I'd be happy to discuss our program with you. Let's schedule a call this week.\n\nCoach Sir"
          });
        }
      } catch (err) {
        console.error('Error creating demo thread:', err);
      }
    }
  },
  {
    id: "complete",
    page: "Dashboard",
    title: "You're All Set! 🚀",
    description: "Now you're ready to start your real recruiting journey. Build your target list, connect with coaches, and track your progress!",
    position: "center"
  }
];

export default function OnboardingWalkthrough({ isOpen, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightElements, setHighlightElements] = useState([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const step = WALKTHROUGH_STEPS[currentStep];

  // Navigate and setup highlights when step changes
  useEffect(() => {
    if (!isOpen || !step) return;

    const currentPage = location.pathname.split('/').pop() || "Dashboard";
    
    // Navigate if needed
    if (step.page !== currentPage) {
      setIsNavigating(true);
      navigate(createPageUrl(step.page));
    } else {
      setIsNavigating(false);
    }

    // Run auto-action if step has one
    if (step.autoAction && !isNavigating) {
      step.autoAction();
    }

    // Find elements to highlight
    const timer = setTimeout(() => {
      const elements = [];
      if (step.highlightIds) {
        step.highlightIds.forEach(id => {
          const el = document.querySelector(id);
          if (el) elements.push(el);
        });
      } else if (step.target) {
        const el = document.querySelector(step.target);
        if (el) elements.push(el);
      }
      setHighlightElements(elements);
      setIsNavigating(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [currentStep, isOpen, step, navigate, location, isNavigating]);

  const handleNext = () => {
    // Validate if needed
    if (step.validation && !step.validation()) {
      alert("Please fill in the required fields to continue.");
      return;
    }

    // Run mock action if exists
    if (step.mockAction) {
      const result = step.mockAction();
      if (result?.success) {
        console.log(result.message);
      }
    }

    if (currentStep < WALKTHROUGH_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('rB_seenOnboarding', 'true');
    onComplete();
  };

  if (!isOpen) return null;

  // Calculate overlay position
  const getOverlayPosition = () => {
    if (highlightElements.length === 0 || !step.target) {
      // Center overlay
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const firstElement = highlightElements[0];
    const rect = firstElement.getBoundingClientRect();
    
    switch (step.position) {
      case 'bottom':
        return {
          top: rect.bottom + window.scrollY + 20,
          left: rect.left + window.scrollX + (rect.width / 2),
          transform: 'translateX(-50%)'
        };
      case 'top':
        return {
          top: rect.top + window.scrollY - 220,
          left: rect.left + window.scrollX + (rect.width / 2),
          transform: 'translateX(-50%)'
        };
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
    }
  };

  return (
    <>
      {/* Dark backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/60 z-[9998]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleSkip}
      />

      {/* Highlight overlays */}
      <AnimatePresence>
        {highlightElements.map((el, idx) => {
          const rect = el.getBoundingClientRect();
          return (
            <motion.div
              key={idx}
              className="fixed border-4 border-blue-500 rounded-lg z-[9999] pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height,
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)'
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Tooltip card */}
      <motion.div
        className="fixed z-[10000] w-full max-w-md px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={getOverlayPosition()}
      >
        <Card className="shadow-2xl border-2 border-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-1">
                {WALKTHROUGH_STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentStep ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {currentStep > 0 && (
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
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {currentStep === WALKTHROUGH_STEPS.length - 1 ? (
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
  );
}