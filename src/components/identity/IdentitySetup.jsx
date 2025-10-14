import React, { useState, useEffect } from "react";
import { useRecruitBridgeIdentity } from "../hooks/useRecruitBridgeIdentity";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle, Lock, Mail, Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function IdentitySetup({ onClose, onSuccess }) {
  const { loading, error, identity, getMe, checkUsername, createIdentity } = useRecruitBridgeIdentity();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Load current user and existing identity on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        await getMe();
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };
    loadData();
  }, [getMe]);

  const handleUsernameChange = async (value) => {
    const cleanValue = value.trim().toLowerCase();
    setUsername(cleanValue);
    setStatus("");
    setValidationMessage("");

    if (cleanValue.length < 3) {
      return;
    }
    
    setChecking(true);
    
    try {
      const result = await checkUsername(cleanValue);
      if (result.ok) {
        setStatus(result.available ? "available" : "taken");
        setValidationMessage(result.available ? "Available!" : "Sorry, that username is taken.");
      } else {
        setStatus("error");
        setValidationMessage(result.error || "Failed to check availability");
      }
    } catch (err) {
      console.error("Username check error:", err);
      setStatus("error");
      setValidationMessage("Error checking availability");
    }
    
    setChecking(false);
  };

  const handleCreate = async () => {
    if (!username || status !== "available" || !currentUser?.id || !displayName.trim()) return;

    setCreating(true);

    try {
      const result = await createIdentity(username, displayName.trim());

      if (result.ok) {
        // Update user's emailIdentityType to mark as configured
        try {
          await User.update(currentUser.id, { emailIdentityType: 'recruitbridge' });
        } catch (updateErr) {
          console.warn("Could not update user emailIdentityType:", updateErr);
        }

        // Success - close modal after brief delay
        setTimeout(() => {
          setCreating(false);
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        }, 1500);
      } else {
        throw new Error(result.error || "Failed to create email identity");
      }

    } catch (err) {
      console.error("Create identity error:", err);
      setStatus("error");
      setValidationMessage(err.message || "Failed to create email identity");
      setCreating(false);
    }
  };

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading your email configuration...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          RecruitBridge Email Identity
        </CardTitle>
        <CardDescription>
          {identity ? "Your professional email address is configured and ready to use." : "Create a professional email address to contact coaches."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {identity ? (
          <div className="space-y-6">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <strong>Your RecruitBridge email is active!</strong> This is now your professional sending address for coach outreach.
              </AlertDescription>
            </Alert>

            <div className="rounded-lg border-2 border-green-200 bg-green-50 px-4 py-4">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-green-600" />
                <Label className="text-sm font-semibold text-green-800">Your Professional Email (Locked)</Label>
              </div>
              <div className="font-bold text-lg text-green-900 mb-2 flex items-center gap-2">
                {identity.displayName || identity.username} &lt;{identity.address}&gt;
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyEmail(identity.address)}
                  className="h-6 px-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Send from:</strong> {identity.address}</p>
                <p><strong>Domain:</strong> {identity.domain}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Ready for Outreach!
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Use this address in the Outreach Center to send emails</li>
                <li>✅ All replies will be tracked in your Response Center</li>
                <li>✅ Coaches will see your professional RecruitBridge email</li>
                <li>✅ Your username is locked for security (cannot be changed)</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Create your professional email address to start contacting coaches. This will be your permanent sending address.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName" className="text-sm font-semibold">Display Name *</Label>
                <p className="text-xs text-slate-500 mb-2">Your full name as coaches will see it</p>
                <Input
                  id="displayName"
                  className="mt-1"
                  placeholder="Jake Davids"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              <div>
                <Label htmlFor="username" className="text-sm font-semibold">Email Address *</Label>
                <p className="text-xs text-slate-500 mb-2">Choose your username - this email address is <strong className="text-amber-700">permanent</strong></p>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    id="username"
                    className={`flex-1 ${
                      status === "available"
                        ? "border-green-500 focus-visible:ring-green-500"
                        : status === "taken" || status === "invalid" || status === "error"
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                    placeholder="username"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    autoComplete="off"
                  />
                  <span className="text-sm text-slate-700 font-medium whitespace-nowrap">@recruitbridge.net</span>
                </div>
                <div className={`text-xs mt-1.5 flex items-center gap-1.5 ${
                  status === "available"
                    ? "text-green-600 font-medium"
                    : status === "taken" || status === "invalid" || status === "error"
                    ? "text-red-600 font-medium"
                    : "text-slate-500"
                }`}>
                  {checking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Checking availability…
                    </>
                  ) : status === "available" ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      ✓ Available! This email address is yours.
                    </>
                  ) : status === "taken" ? (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      {validationMessage}
                    </>
                  ) : status === "error" ? (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      {validationMessage}
                    </>
                  ) : (
                    "Choose a username (3-64 characters, letters, numbers, dots, or dashes)"
                  )}
                </div>
              </div>

              <div className="rounded-lg border-2 border-blue-200 px-4 py-3 bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <Label className="text-xs font-semibold text-blue-900">Email Preview</Label>
                </div>
                <div className="font-bold text-base text-blue-900">
                  {displayName || "Your Name"} &lt;{username || "username"}@recruitbridge.net&gt;
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  ✓ Coaches will see this professional address<br/>
                  ✓ All replies will be tracked automatically<br/>
                  ✓ This email address is <strong>permanent</strong> and cannot be changed
                </p>
              </div>

              <Button
                onClick={handleCreate}
                disabled={status !== "available" || creating || !displayName.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Your Email Address...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Create Email Address
                  </>
                )}
              </Button>

              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Lock className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-900 mb-1">⚠️ This email address is PERMANENT</p>
                    <p className="text-xs text-amber-800">
                      Once you click "Create Email Address", your username cannot be changed for security reasons. Make sure you're happy with your choice!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}