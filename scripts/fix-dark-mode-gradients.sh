#!/bin/bash

# Script to add dark mode to gradient backgrounds across all pages

# The common pattern to find and replace
OLD_PATTERN='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'
NEW_PATTERN='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'

# List of files to update
FILES=(
  "src/pages/Admin.jsx"
  "src/pages/AdminMailboxManager.jsx"
  "src/pages/AdminSchoolDataManager.jsx"
  "src/pages/BillingPortal.jsx"
  "src/pages/CoachAnalytics.jsx"
  "src/pages/CoachContacts.jsx"
  "src/pages/CounselingPricing.jsx"
  "src/pages/DevSetup.jsx"
  "src/pages/EmailGuide.jsx"
  "src/pages/Feedback.jsx"
  "src/pages/Inbox.jsx"
  "src/pages/MyRecruitingJourney.jsx"
  "src/pages/Outreach.jsx"
  "src/pages/ProductionCutover.jsx"
  "src/pages/Questionnaires.jsx"
  "src/pages/RecruitingCounseling.jsx"
  "src/pages/ResponseCenter.jsx"
  "src/pages/ScholarshipsNIL.jsx"
  "src/pages/Settings.jsx"
  "src/pages/TestCoachContacts.jsx"
  "src/pages/TestEmail.jsx"
  "src/pages/Timeline.jsx"
  "src/pages/TwitterGuide.jsx"
  "src/pages/Welcome.jsx"
)

echo "🌙 Adding dark mode gradients to page backgrounds..."
echo ""

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    # Use sed to replace the pattern (macOS compatible)
    sed -i '' "s|$OLD_PATTERN|$NEW_PATTERN|g" "$file"
    echo "✓ Updated: $file"
  else
    echo "⚠ File not found: $file"
  fi
done

echo ""
echo "✅ Dark mode gradients added to all pages!"
