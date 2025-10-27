import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Info,
  XCircle
} from "lucide-react";

export default function BillingPortal() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelReasonText, setCancelReasonText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setLoading(false);
  };

  const handleCancelSubscription = async () => {
    if (!cancelReason) {
      alert("Please select a reason for cancellation.");
      return;
    }

    setSubmitting(true);
    try {
      // Submit cancellation request to backend
      const response = await fetch("/functions/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: user.id,
          reason: cancelReason,
          reasonText: cancelReasonText,
          currentPlan: user.plan
        })
      });

      if (response.ok) {
        // Update user to free plan
        await User.update(user.id, { plan: 'free' });
        alert("Your subscription has been cancelled. Your account has been reverted to the free plan. You will receive a refund confirmation email within 24-48 hours.");
        setShowCancelDialog(false);
        loadUser(); // Reload to show updated plan
      } else {
        throw new Error("Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert("There was an error processing your cancellation. Please contact support at realrecruitbridge@gmail.com");
    }
    setSubmitting(false);
  };

  const getPlanDetails = (plan) => {
    switch (plan) {
      case 'unlimited':
        return {
          name: 'Unlimited',
          color: 'purple',
          icon: '👑',
          price: '$375/year',
          features: [
            'Unlimited target schools',
            'Unlimited outreach messages',
            'Unlimited AI message generation',
            'Response Center & AI Replies',
            'Advanced analytics',
            '1 FREE 1-on-1 Session + 50% off next'
          ]
        };
      case 'core':
        return {
          name: 'Core',
          color: 'blue',
          icon: '⚡',
          price: '$335/year',
          features: [
            '15 target schools',
            '75 outreach messages/month',
            '15 AI messages/month',
            'Advanced coach tracking',
            'Progress analytics'
          ]
        };
      case 'starter':
        return {
          name: 'Starter',
          color: 'green',
          icon: '🌟',
          price: '$163/year',
          features: [
            '7 target schools',
            '25 outreach messages/month',
            'Basic coach tracking'
          ]
        };
      default:
        return {
          name: 'Free',
          color: 'gray',
          icon: '📋',
          price: '$0',
          features: [
            'Limited features',
            'Basic tracking'
          ]
        };
    }
  };

  const planDetails = getPlanDetails(user?.plan);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Billing & Subscription</h1>
            <p className="text-slate-600">Manage your plan and billing information</p>
          </div>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-slate-100 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{planDetails.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{planDetails.name} Plan</h3>
                  <p className="text-slate-600 mt-1">{planDetails.price}</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-slate-900 mb-3">Your Plan Includes:</h4>
              <ul className="space-y-2">
                {planDetails.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade/Change Plan */}
        {user?.plan !== 'unlimited' && (
          <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                Upgrade Your Plan
              </CardTitle>
              <CardDescription>
                Get more features and better recruiting results with Unlimited
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">Unlock all features + 1 FREE counseling session</p>
                  <p className="text-sm text-slate-600 mt-1">Only $375/year or $39/month</p>
                </div>
                <Link to={createPageUrl("Upgrade")}>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    View Plans
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing Information */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>Manage your payment methods and billing history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <Calendar className="w-8 h-8 text-slate-400" />
              <div>
                <p className="font-medium text-slate-900">Next Billing Date</p>
                <p className="text-sm text-slate-600">Feature coming soon</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <CreditCard className="w-8 h-8 text-slate-400" />
              <div>
                <p className="font-medium text-slate-900">Payment Method</p>
                <p className="text-sm text-slate-600">Managed through Stripe</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 text-sm">Manage Your Subscription</p>
                  <p className="text-xs text-blue-700 mt-1">
                    To update payment methods, view invoices, or cancel your subscription, please contact support at{" "}
                    <a href="mailto:realrecruitbridge@gmail.com" className="font-semibold underline">
                      realrecruitbridge@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Change Options */}
        {user?.plan && user?.plan !== 'free' && (
          <Card>
            <CardHeader>
              <CardTitle>Plan Management</CardTitle>
              <CardDescription>Change or cancel your subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.plan !== 'unlimited' && (
                <Link to={createPageUrl("Upgrade")}>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Upgrade to Unlimited</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
              
              <div className="border-t pt-4">
                <Button
                  variant="ghost"
                  className="w-full text-slate-600 hover:text-red-600 flex items-center justify-center gap-2"
                  onClick={() => setShowCancelDialog(true)}
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Subscription
                </Button>
                <p className="text-xs text-slate-500 text-center mt-2">
                  30-day money-back guarantee
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Support */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
              <p className="text-slate-600 text-sm mb-4">
                Have questions about billing or your subscription?
              </p>
              <Button variant="outline" asChild>
                <a href="mailto:realrecruitbridge@gmail.com">
                  Contact Support
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription>
              We're sorry to see you go. Please help us improve by telling us why you're cancelling.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-semibold mb-3 block">Reason for Cancellation *</Label>
              <RadioGroup value={cancelReason} onValueChange={setCancelReason}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="too_expensive" id="too_expensive" />
                  <Label htmlFor="too_expensive" className="font-normal cursor-pointer">Too expensive</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not_using" id="not_using" />
                  <Label htmlFor="not_using" className="font-normal cursor-pointer">Not using it enough</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="missing_features" id="missing_features" />
                  <Label htmlFor="missing_features" className="font-normal cursor-pointer">Missing features I need</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="found_alternative" id="found_alternative" />
                  <Label htmlFor="found_alternative" className="font-normal cursor-pointer">Found a better alternative</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="technical_issues" id="technical_issues" />
                  <Label htmlFor="technical_issues" className="font-normal cursor-pointer">Technical issues</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="font-normal cursor-pointer">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="cancelReasonText" className="text-sm font-semibold mb-2 block">
                Additional Comments (Optional)
              </Label>
              <Textarea
                id="cancelReasonText"
                placeholder="Tell us more about your experience..."
                value={cancelReasonText}
                onChange={(e) => setCancelReasonText(e.target.value)}
                rows={4}
              />
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-900">
                <strong>Note:</strong> Your account will be immediately reverted to the free plan, and you'll receive a refund within 24-48 hours.
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelDialog(false);
                setCancelReason("");
                setCancelReasonText("");
              }}
              disabled={submitting}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={!cancelReason || submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? "Processing..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}