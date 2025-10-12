import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * PageGuide - A floating guide card that appears on pages to walk users through tasks
 *
 * @param {boolean} isOpen - Whether the guide is visible
 * @param {function} onClose - Callback when user closes the guide
 * @param {function} onNext - Callback when user clicks "Next" or "Complete"
 * @param {string} title - Guide title
 * @param {string} description - Guide description
 * @param {Array} steps - Array of step objects with { label, completed }
 * @param {number} currentStep - Current step index
 * @param {React.Node} children - Custom content for the guide
 * @param {string} nextButtonText - Text for the next button (default: "Next")
 * @param {boolean} showSteps - Whether to show step indicators (default: true)
 */
export default function PageGuide({
  isOpen,
  onClose,
  onNext,
  title,
  description,
  steps = [],
  currentStep = 0,
  children,
  nextButtonText = "Next",
  showSteps = true,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 max-w-md w-full mx-4"
        >
          <Card className="border-2 border-blue-500 shadow-2xl bg-white">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      Guided Tour
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                  {description && (
                    <p className="text-sm text-slate-600 mt-1">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Step Indicators */}
              {showSteps && steps.length > 0 && (
                <div className="mb-4 space-y-2">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 text-sm ${
                        index === currentStep
                          ? 'text-blue-600 font-medium'
                          : step.completed
                          ? 'text-green-600'
                          : 'text-slate-400'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                          index === currentStep
                            ? 'border-blue-600 bg-blue-50'
                            : step.completed
                            ? 'border-green-600 bg-green-50'
                            : 'border-slate-300 bg-slate-50'
                        }`}
                      >
                        {step.completed ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      <span>{step.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Custom Content */}
              {children && <div className="mb-4">{children}</div>}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  onClick={onClose}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Skip for now
                </button>
                <Button
                  onClick={onNext}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {nextButtonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
