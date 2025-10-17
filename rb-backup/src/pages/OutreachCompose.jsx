import React, { useState, useEffect, useCallback } from "react";
import { CoachContact, TargetedSchool, Athlete, User } from "@/api/entities";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Mail, Send, Filter, Copy, Sparkles, RefreshCw, Loader2, Settings } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useWalkthrough } from "@/components/onboarding/GlobalWalkthroughContext";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function OutreachCompose() {
  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [targetedSchools, setTargetedSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoaches, setSelectedCoaches] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [generating, setGenerating] = useState(false);

  const [sending, setSending] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  const { isTutorialMode } = useWalkthrough();

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [currentUser, coachData] = await Promise.all([
        User.me(),
        CoachContact.list()
      ]);

      setUser(currentUser);
      setCoaches(coachData);

      if (currentUser && currentUser.id) {
        const athleteData = await Athlete.filter({ created_by: currentUser.email });
        const currentAthlete = athleteData[0];
        if (currentAthlete && currentAthlete.id) {
          const targetedData = await TargetedSchool.filter({ athlete_id: currentAthlete.id });
          setTargetedSchools(targetedData);
        }
      }
    } catch (error) {
      console.error("Error loading outreach data:", error);
    }
    setLoading(false);
  };

  const filterCoaches = useCallback(() => {
    let filtered = coaches;

    if (searchTerm) {
      filtered = filtered.filter(coach =>
        coach.coach_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.coach_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const targetedSchoolIds = new Set(targetedSchools.map(ts => ts.school_id));
    filtered = filtered.filter(coach => targetedSchoolIds.has(coach.school_id));

    if (selectedSchool !== "all") {
      filtered = filtered.filter(coach => coach.school_id === selectedSchool);
    }

    setFilteredCoaches(filtered);
  }, [coaches, searchTerm, selectedSchool, targetedSchools]);

  useEffect(() => {
    filterCoaches();
  }, [filterCoaches]);

  const handleCoachSelection = (coachId, selected) => {
    setSelectedCoaches(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (selected) newSelected.add(coachId);
      else newSelected.delete(coachId);
      return newSelected;
    });
  };

  const handleSelectAll = (checked) => {
    setSelectedCoaches(checked ? new Set(filteredCoaches.map(c => c.id)) : new Set());
  };

  const generateWithAI = async () => {
    setGenerating(true);
    try {
      const prompt = `Write a short, engaging, and professional email to a college coach.
                      The email should express strong interest in their program and highlight enthusiasm.
                      Include placeholders for customization:
                      - [Coach's Name]
                      - [College Name]
                      - [Your Name]
                      - [Your Sport]

                      Subject: Interest in [College Name] [Your Sport] Program - [Your Name]

                      Body:
                      Dear Coach [Coach's Name],

                      My name is [Your Name], and I am a [Your Sport] athlete. I am writing to express my strong interest in your [College Name] [Your Sport] program.

                      I believe my skills and dedication would be a great asset to your team. I am eager to learn more about your program and how I might contribute.

                      Thank you for your time and consideration. I look forward to hearing from you.

                      Sincerely,
                      [Your Name]
                      `;
      const response = await base44.integrations.Core.InvokeLLM({prompt});
      if (response) {
        const [generatedSubject, ...generatedBodyLines] = response.split('\n').filter(line => line.trim() !== '');
        setEmailSubject(generatedSubject.replace('Subject: ', ''));
        setEmailBody(generatedBodyLines.join('\n'));
        showToast("Email generated successfully!", "success");
      }
    } catch (error) {
      console.error("Error generating email:", error);
      showToast("Failed to generate email.", "error");
    }
    setGenerating(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  const handleDemoSend = async () => {
    setSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    window.__demoEmailSent = true;
    setSending(false);
    showToast("✅ Demo email sent! Click Next to continue.", "success");
  };

  const handleBulkSend = async () => {
    // Check if user has email identity configured
    if (!user?.emailUsername) {
      showToast("Please configure your email identity in Settings first.", "error");
      return;
    }

    if (selectedCoaches.size === 0 || !emailSubject || !emailBody) {
      showToast("Please select coaches and fill out the email.", "error");
      return;
    }

    setSending(true);

    try {
      const selectedCoachDetails = coaches.filter(c => selectedCoaches.has(c.id));
      let successCount = 0;
      let failCount = 0;

      for (const coach of selectedCoachDetails) {
        try {
          const response = await fetch('https://rb-backend-mu.vercel.app/api/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              to: coach.coach_email,
              subject: emailSubject,
              text: emailBody,
              html: `<p>${emailBody.replace(/\n/g, '<br>')}</p>`
            })
          });

          const result = await response.json();

          if (response.ok && result.success) {
            successCount++;
            
            // Update coach contact status
            await CoachContact.update(coach.id, {
              response_status: 'sent',
              date_contacted: new Date().toISOString().split('T')[0]
            });
          } else {
            failCount++;
            console.error('Failed to send to', coach.coach_email, result.error);
          }
        } catch (error) {
          failCount++;
          console.error('Error sending to', coach.coach_email, error);
        }
      }

      showToast(`✅ Sent ${successCount} emails successfully!${failCount > 0 ? ` (${failCount} failed)` : ''}`, "success");
      
      // Clear selections
      setSelectedCoaches(new Set());
      
    } catch (error) {
      console.error('Bulk send error:', error);
      showToast("Failed to send emails. Please try again.", "error");
    }

    setSending(false);
  };

  const getUserEmailAddress = () => {
    if (user?.emailUsername) return `${user.emailUsername}@${user.emailDomain || 'recruitbridge.net'}`;
    return "Setup Required";
  };

  const isIdentityConfigured = !!(user?.emailUsername);

  const selectedCoachDetails = coaches.filter(c => selectedCoaches.has(c.id));

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header with Email Settings Button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Outreach Center</h1>
          <p className="text-lg text-slate-600">Compose and send messages to coaches</p>
        </div>
        <Link to={createPageUrl("Settings")}>
          <Button
            variant="outline"
            className="absolute top-6 right-6"
          >
            <Settings className="w-4 h-4 mr-2" />
            Email Settings
          </Button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr,2fr] gap-6">
        {/* Coach Selection Sidebar */}
        <Card className="bg-white/80 backdrop-blur shadow-xl h-fit">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Select Recipients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Search coaches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by school" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schools</SelectItem>
                  {[...new Set(coaches.map(c => c.school_id))].map(schoolId => {
                    const coach = coaches.find(c => c.school_id === schoolId);
                    return (
                      <SelectItem key={schoolId} value={schoolId}>
                        {coach?.school_name || "Unknown School"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {selectedCoaches.size} selected
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectAll(selectedCoaches.size !== filteredCoaches.length)}
              >
                {selectedCoaches.size === filteredCoaches.length ? "Deselect All" : "Select All"}
              </Button>
            </div>

            <Separator />

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredCoaches.map((coach) => (
                <div
                  key={coach.id}
                  className="flex items-start space-x-2 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Checkbox
                    checked={selectedCoaches.has(coach.id)}
                    onCheckedChange={(checked) => handleCoachSelection(coach.id, checked)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{coach.coach_name}</p>
                    <p className="text-xs text-slate-600">{coach.school_name}</p>
                    <p className="text-xs text-slate-500 truncate">{coach.coach_email}</p>
                  </div>
                </div>
              ))}
              {filteredCoaches.length === 0 && (
                <p className="text-center text-slate-500 py-8 text-sm">
                  No coaches found. Add target schools first!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Compose Card */}
        <Card className="bg-white/80 backdrop-blur shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">Compose Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="to" className="font-semibold">To:</Label>
              <div className="mt-1 border rounded-lg p-2 bg-slate-50 h-20 overflow-y-auto">
                {selectedCoachDetails.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedCoachDetails.map(coach => (
                      <Badge
                        key={coach.id}
                        variant="secondary"
                        className="bg-indigo-100 text-indigo-800 border border-indigo-200"
                      >
                        {coach.coach_name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Select coaches from the list on the left</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Interest in [School Name] Football Program - [Your Name]"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                placeholder="Craft your compelling message..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={10}
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                id="generate-email-button"
                onClick={generateWithAI}
                disabled={generating}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2"
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" />Generate Email</>
                )}
              </Button>
              <Button onClick={() => copyToClipboard(emailSubject + '\n\n' + emailBody)} variant="outline" className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy Email
              </Button>
              <Button onClick={() => { setEmailSubject(''); setEmailBody(''); }} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Clear
              </Button>
            </div>

            <Separator />

            <h3 className="text-lg font-semibold mt-4 mb-2">Email Preview</h3>
            <div className="border rounded-lg p-4 bg-slate-50 min-h-[150px]">
              {emailSubject && <p className="font-bold mb-2">Subject: {emailSubject}</p>}
              {(emailSubject || emailBody) && <Separator className="my-2" />}
              {emailBody && (
                <ReactMarkdown className="prose prose-sm max-w-none">
                  {emailBody}
                </ReactMarkdown>
              )}
              {!emailSubject && !emailBody && (
                <p className="text-slate-400 text-center py-8">
                  Start composing your message to see the preview here
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Sending via:</span>
                  <span className="text-sm font-medium text-slate-800">{getUserEmailAddress()}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">
                  Selected: {selectedCoaches.size}
                </span>
                {isTutorialMode ? (
                  <Button
                    id="send-demo-button"
                    onClick={handleDemoSend}
                    disabled={sending}
                    className="bg-gradient-to-r from-green-600 to-emerald-600"
                  >
                    {sending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending Demo...</>
                    ) : (
                      <><Send className="w-4 h-4 mr-2" />Send Demo</>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleBulkSend}
                    disabled={sending || selectedCoaches.size === 0 || !emailSubject || !emailBody || !isIdentityConfigured}
                    className="bg-gradient-to-r from-green-600 to-emerald-600"
                    title={!isIdentityConfigured ? "Please configure your email identity in Settings first" : ""}
                  >
                    {sending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                    ) : (
                      <><Send className="w-4 h-4 mr-2" />Send Emails</>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {!isIdentityConfigured && !isTutorialMode && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                💡 <strong>Tip:</strong> Configure your email identity in Settings to start sending real messages.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}