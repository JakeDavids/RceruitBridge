import { useState, useEffect } from 'react';
import { User } from '@/api/entities';

/**
 * useGuidedTour - Hook to manage guided tour state across pages
 *
 * Tour Flow:
 * 1. Profile - Complete profile information
 * 2. Email - Create @recruitbridge.net email
 * 3. Target Schools - Add first school
 * 4. Coach Contacts - Add first coach contact
 * 5. Outreach - Send first email
 * 6. Response Center - View responses
 */

const TOUR_STEPS = {
  PROFILE: 'profile',
  EMAIL: 'email',
  SCHOOLS: 'schools',
  COACHES: 'coaches',
  OUTREACH: 'outreach',
  RESPONSES: 'responses',
  COMPLETED: 'completed',
};

const STEP_ORDER = [
  TOUR_STEPS.PROFILE,
  TOUR_STEPS.EMAIL,
  TOUR_STEPS.SCHOOLS,
  TOUR_STEPS.COACHES,
  TOUR_STEPS.OUTREACH,
  TOUR_STEPS.RESPONSES,
  TOUR_STEPS.COMPLETED,
];

export default function useGuidedTour() {
  const [currentStep, setCurrentStep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadTourProgress();
  }, []);

  const loadTourProgress = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Check if user has completed onboarding
      if (!currentUser.onboarding_completed) {
        // Start at profile step
        setCurrentStep(TOUR_STEPS.PROFILE);
      } else {
        // Check tour_progress field
        const progress = currentUser.tour_progress || TOUR_STEPS.PROFILE;
        setCurrentStep(progress);
      }
    } catch (error) {
      console.error('Error loading tour progress:', error);
      setCurrentStep(TOUR_STEPS.PROFILE);
    }
    setLoading(false);
  };

  const completeCurrentStep = async () => {
    if (!user || !currentStep) return;

    try {
      const currentIndex = STEP_ORDER.indexOf(currentStep);
      const nextStep = STEP_ORDER[currentIndex + 1] || TOUR_STEPS.COMPLETED;

      // Update user's tour progress
      await User.update(user.id, {
        tour_progress: nextStep,
        onboarding_completed: nextStep === TOUR_STEPS.COMPLETED,
      });

      setCurrentStep(nextStep);
      return nextStep;
    } catch (error) {
      console.error('Error updating tour progress:', error);
    }
  };

  const skipTour = async () => {
    if (!user) return;

    try {
      await User.update(user.id, {
        tour_progress: TOUR_STEPS.COMPLETED,
        onboarding_completed: true,
      });

      setCurrentStep(TOUR_STEPS.COMPLETED);
    } catch (error) {
      console.error('Error skipping tour:', error);
    }
  };

  const isStepActive = (step) => currentStep === step;
  const isStepCompleted = (step) => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    const stepIndex = STEP_ORDER.indexOf(step);
    return stepIndex < currentIndex;
  };

  const isTourComplete = () => currentStep === TOUR_STEPS.COMPLETED;

  return {
    currentStep,
    loading,
    completeCurrentStep,
    skipTour,
    isStepActive,
    isStepCompleted,
    isTourComplete,
    TOUR_STEPS,
  };
}
