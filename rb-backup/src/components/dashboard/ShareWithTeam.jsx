import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Users, Copy, Check, Share2 } from "lucide-react";

export default function ShareWithTeam({ user, referralCode }) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralUrl = `${window.location.origin}/?ref=${referralCode}`;
  
  const shareMessage = `I'm using RecruitBridge to contact college coaches with AI-powered outreach — it's super easy to track who replies. You should join so we can compare responses and hold each other accountable: ${referralUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant="outline"
        className="flex items-center gap-2 border-blue-200 hover:bg-blue-50"
      >
        <Share2 className="w-4 h-4 text-blue-600" />
        <span className="font-medium">Share with Teammates</span>
        {user?.referral_count > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
            {user.referral_count}
          </span>
        )}
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              Share with Teammates
            </DialogTitle>
            <DialogDescription>
              Invite your teammates to join RecruitBridge. Track progress together and hold each other accountable.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 block">Your Referral Link</label>
              <div className="flex items-center gap-2">
                <Input
                  value={referralUrl}
                  readOnly
                  className="bg-white text-sm"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 block">Share Message</label>
              <div className="bg-slate-50 border rounded-lg p-3 text-sm text-slate-700 mb-2 max-h-32 overflow-y-auto">
                {shareMessage}
              </div>
              <Button
                onClick={handleCopy}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Message
                  </>
                )}
              </Button>
            </div>

            {user?.referral_count > 0 && (
              <div className="pt-3 border-t">
                <p className="text-sm text-slate-600 text-center">
                  🎉 <span className="font-semibold">{user.referral_count}</span> teammate{user.referral_count !== 1 ? 's' : ''} joined via your link!
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}