#!/bin/bash

echo "🚀 Deploying RecruitBridge Email Identity System to Supabase"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if we're logged in
echo "📝 Checking Supabase authentication..."
supabase status 2>/dev/null || {
    echo "❌ Not logged in to Supabase. Please run: supabase login"
    exit 1
}

echo "✅ Supabase CLI is ready"
echo ""

# Deploy Edge Functions
echo "📦 Deploying Edge Functions..."
echo ""

echo "1️⃣  Deploying check-username function..."
supabase functions deploy check-username || {
    echo "❌ Failed to deploy check-username"
    exit 1
}
echo "✅ check-username deployed"
echo ""

echo "2️⃣  Deploying create-email-identity function..."
supabase functions deploy create-email-identity || {
    echo "❌ Failed to deploy create-email-identity"
    exit 1
}
echo "✅ create-email-identity deployed"
echo ""

echo "3️⃣  Deploying handle-inbound-email function..."
supabase functions deploy handle-inbound-email || {
    echo "❌ Failed to deploy handle-inbound-email"
    exit 1
}
echo "✅ handle-inbound-email deployed"
echo ""

echo "🎉 All Edge Functions deployed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Set environment variables in Supabase Dashboard:"
echo "      - MAILGUN_API_KEY"
echo "      - MAILGUN_DOMAIN (recruitbridge.net)"
echo "      - MAILGUN_REGION (us)"
echo ""
echo "   2. Test the functions:"
echo "      - Create a test email identity from the app"
echo "      - Send a test email"
echo "      - Check inbound email handling"
echo ""
echo "   3. Monitor function logs:"
echo "      - supabase functions logs check-username"
echo "      - supabase functions logs create-email-identity"
echo "      - supabase functions logs handle-inbound-email"
echo ""
echo "✨ Deployment complete!"
