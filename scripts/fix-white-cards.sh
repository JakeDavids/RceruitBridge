#!/bin/bash

echo "🎨 Fixing white card backgrounds for dark mode..."
echo ""

# Profile.jsx - Fix white/80 backdrop-blur cards
sed -i '' 's/bg-white\/80 backdrop-blur/bg-white\/80 dark:bg-slate-800\/80 backdrop-blur/g' src/pages/Profile.jsx
sed -i '' 's/text-slate-600\([^"]*\)">/text-slate-600 dark:text-slate-400\1">/g' src/pages/Profile.jsx
echo "✓ Profile.jsx cards updated"

# OutreachCompose.jsx - Fix slate-50 elements
sed -i '' 's/bg-slate-50\([^"]*\)">/bg-slate-50 dark:bg-slate-800\1">/g' src/pages/OutreachCompose.jsx
echo "✓ OutreachCompose.jsx elements updated"

# Questionnaires.jsx - Fix white accordion and info boxes
sed -i '' 's/className="bg-white rounded-lg"/className="bg-white dark:bg-slate-800 rounded-lg"/g' src/pages/Questionnaires.jsx
sed -i '' 's/bg-blue-50 border-blue-200/bg-blue-50 dark:bg-blue-900\/20 border-blue-200 dark:border-blue-800/g' src/pages/Questionnaires.jsx
sed -i '' 's/text-blue-700/text-blue-700 dark:text-blue-300/g' src/pages/Questionnaires.jsx
echo "✓ Questionnaires.jsx updated"

# BillingPortal.jsx - Fix slate/yellow backgrounds
sed -i '' 's/bg-slate-50\([^"]*\)">/bg-slate-50 dark:bg-slate-800\1">/g' src/pages/BillingPortal.jsx
sed -i '' 's/bg-blue-50\([^"]*\)">/bg-blue-50 dark:bg-blue-900\/20\1">/g' src/pages/BillingPortal.jsx
sed -i '' 's/bg-yellow-50\([^"]*\)">/bg-yellow-50 dark:bg-yellow-900\/20\1">/g' src/pages/BillingPortal.jsx
echo "✓ BillingPortal.jsx updated"

# Outreach.jsx - Fix light UI element backgrounds
sed -i '' 's/"bg-slate-50/"bg-slate-50 dark:bg-slate-800/g' src/pages/Outreach.jsx
sed -i '' 's/"bg-white border/"bg-white dark:bg-slate-800 border dark:border-slate-700/g' src/pages/Outreach.jsx
echo "✓ Outreach.jsx updated"

# Admin.jsx - Fix status boxes
sed -i '' 's/bg-green-50/bg-green-50 dark:bg-green-900\/20/g' src/pages/Admin.jsx
sed -i '' 's/bg-blue-50/bg-blue-50 dark:bg-blue-900\/20/g' src/pages/Admin.jsx
sed -i '' 's/bg-purple-50/bg-purple-50 dark:bg-purple-900\/20/g' src/pages/Admin.jsx
sed -i '' 's/text-green-700/text-green-700 dark:text-green-300/g' src/pages/Admin.jsx
sed -i '' 's/text-blue-700/text-blue-700 dark:text-blue-300/g' src/pages/Admin.jsx
sed -i '' 's/text-purple-700/text-purple-700 dark:text-purple-300/g' src/pages/Admin.jsx
echo "✓ Admin.jsx updated"

# MyRecruitingJourney.jsx - Fix header and cards
sed -i '' 's/bg-white\/80 backdrop-blur-sm/bg-white\/80 dark:bg-slate-800\/80 backdrop-blur-sm/g' src/pages/MyRecruitingJourney.jsx
sed -i '' 's/"bg-white rounded-lg/"bg-white dark:bg-slate-800 rounded-lg/g' src/pages/MyRecruitingJourney.jsx
echo "✓ MyRecruitingJourney.jsx updated"

# Login & Signup - Fix Google buttons
sed -i '' 's/bg-white hover:bg-gray-50/bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/g' src/pages/Login.jsx
sed -i '' 's/bg-white hover:bg-gray-50/bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/g' src/pages/Signup.jsx
echo "✓ Login & Signup updated"

echo ""
echo "✅ All card backgrounds updated for dark mode!"
