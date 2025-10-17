
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import IdentitySetupFixed from "../components/identity/IdentitySetupFixed";
import { useWalkthrough } from "@/components/onboarding/GlobalWalkthroughContext";
import {
  Settings as SettingsIcon,
  User as UserIcon,
  CreditCard,
  ArrowRight,
  Mail,
  LogOut,
  Download,
  Trash2,
  Shield,
  AlertTriangle,
  Loader2,
  MessageSquare,
  BookOpen
} from "lucide-react";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const { startWalkthrough } = useWalkthrough();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.href = "/";
  };

  const handleDownloadData = () => {
    alert("Data export feature coming soon! You'll be able to download all your recruiting data in JSON format.");
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "⚠️ ARE YOU ABSOLUTELY SURE?\n\n" +
      "This will permanently delete:\n" +
      "• Your athlete profile\n" +
      "• All coach contacts and outreach history\n" +
      "• Email identities and mailboxes\n" +
      "• All recruiting data\n\n" +
      "This action CANNOT be undone.\n\n" +
      "Type 'DELETE' in the next prompt to confirm."
    );
    
    if (!confirmed) return;

    const confirmText = prompt("Type 'DELETE' to confirm account deletion:");
    if (confirmText !== 'DELETE') {
      alert("Account deletion cancelled.");
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch('/functions/deleteAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        alert("Your account has been deleted. You will be redirected to the home page.");
        window.location.href = '/';
      } else {
        alert(`Failed to delete account: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred while deleting your account. Please contact support.');
    }
    setDeleting(false);
  };

  const handleManageBilling = () => {
    window.location.href = createPageUrl("BillingPortal");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600">Manage your account, plan, and profile information.</p>
          </div>
        </div>

        {/* Profile Settings */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              Profile Settings
            </CardTitle>
            <CardDescription>Update your personal and athletic information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to={createPageUrl("Profile")}>
              <Button variant="outline" className="w-full justify-between">
                Manage Profile
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Email Identity */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              Email Identity
            </CardTitle>
            <CardDescription>Manage your sending email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <IdentitySetupFixed />
          </CardContent>
        </Card>

        {/* Billing & Subscription Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              Billing & Subscription
            </CardTitle>
            <CardDescription>Manage your plan and payment details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-plan" className="text-base font-medium">Current Plan</Label>
              <div className="flex items-center justify-between mt-2">
                <span className="font-semibold capitalize text-slate-900">{user?.plan || 'Free'} Plan</span>
                <Link to={createPageUrl("Upgrade")}>
                  <Button variant="outline" size="sm">
                    Upgrade Plan
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <Button 
                variant="outline" 
                onClick={handleManageBilling}
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Billing Management
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help & Support Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Help & Support
            </CardTitle>
            <CardDescription>View onboarding tutorial and get help</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={startWalkthrough}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              View Walkthrough Again
            </Button>
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-xs text-slate-600">
                New to RecruitBridge? Watch the walkthrough again to learn how to use all features.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Privacy & Security
            </CardTitle>
            <CardDescription>Manage your data and account security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={handleDownloadData}
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download My Data
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-xs text-slate-600">
                Your recruiting data is encrypted and secure. We follow industry best practices to protect your information.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-red-600">
              Irreversible and destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                className="border-red-300 text-red-700 hover:bg-red-100"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </>
                )}
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
            <p className="text-xs text-red-600">
              Account deletion will permanently remove all your recruiting data, outreach history, and profile information.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
