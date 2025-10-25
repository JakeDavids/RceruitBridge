import React, { useState, useEffect, useCallback } from "react";
import { CoachContact, TargetedSchool, Athlete, User } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
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
  const [athlete, setAthlete] = useState(null);
  const [toast, setToast] = useState(null);

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
        setAthlete(currentAthlete); // Store athlete data for email generation
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
      if (!athlete) {
        showToast("Please complete your profile first!", "error");
        setGenerating(false);
        return;
      }

      // Build detailed athlete profile for AI
      const athleteInfo = {
        name: `${athlete.first_name} ${athlete.last_name}`,
        sport: athlete.sport || 'football',
        position: athlete.position || '',
        gradYear: athlete.graduation_year || '',
        gpa: athlete.gpa || '',
        height: athlete.height || '',
        weight: athlete.weight || '',
        stats: athlete.key_stats || '',
        achievements: athlete.achievements || '',
        city: athlete.city || '',
        state: athlete.state || '',
        highSchool: athlete.high_school || ''
      };

      const prompt = `You are an expert college recruiting consultant. Write an EXTREMELY attention-grabbing, personalized email from a high school athlete to a college football coach. This email must stand out among hundreds of recruit emails.

ATHLETE PROFILE:
- Name: ${athleteInfo.name}
- Sport: ${athleteInfo.sport}
- Position: ${athleteInfo.position}
- Grad Year: ${athleteInfo.gradYear}
- GPA: ${athleteInfo.gpa}
- Height: ${athleteInfo.height}, Weight: ${athleteInfo.weight}
- Key Stats/Achievements: ${athleteInfo.stats || athleteInfo.achievements || 'Dedicated team player with strong work ethic'}
- Location: ${athleteInfo.city}, ${athleteInfo.state}
- High School: ${athleteInfo.highSchool}

REQUIREMENTS:
1. Subject line must be SHORT (5-8 words), ATTENTION-GRABBING, and mention a specific accomplishment or standout quality
2. Email must be 3-4 short paragraphs maximum
3. Lead with the MOST impressive stat/achievement immediately
4. Show genuine research about their program
5. Include specific, measurable accomplishments
6. End with a clear call-to-action
7. Sound authentic and confident, NOT generic or robotic
8. Use placeholders: [Coach's Name], [College Name], [Coach's Title]

FORMAT:
Subject: [Your attention-grabbing subject here]

Dear Coach [Coach's Name],

[First paragraph: Open with your most impressive stat/achievement. Make it impossible to ignore.]

[Second paragraph: Show you've researched their program. Mention specific aspects that align with your strengths.]

[Third paragraph: Brief but impactful summary of other key achievements, grades, character.]

[Final paragraph: Strong call-to-action. Request film review or conversation.]

Best regards,
${athleteInfo.name}
${athleteInfo.position} | Class of ${athleteInfo.gradYear}
${athleteInfo.highSchool}
[Your Phone] | [Your Email]

DO NOT use generic phrases like "I believe I would be a great fit" or "I am writing to express my interest". Be specific, confident, and results-driven. Make coaches WANT to open this email and respond.`;

      const response = await InvokeLLM({prompt});
      if (response) {
        const lines = response.split('\n').filter(line => line.trim() !== '');
        const subjectLine = lines.find(line => line.toLowerCase().startsWith('subject:'));

        if (subjectLine) {
          setEmailSubject(subjectLine.replace(/^subject:\s*/i, '').trim());
          const bodyStartIndex = lines.indexOf(subjectLine) + 1;
          setEmailBody(lines.slice(bodyStartIndex).join('\n').trim());
        } else {
          setEmailBody(response);
        }

        showToast("Personalized email generated!", "success");
      }
    } catch (error) {
      console.error("Error generating email:", error);
      showToast("Failed to generate email. Please try again.", "error");
    }
    setGenerating(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  const handleBulkSend = async () => {
    // Mock email identity from localStorage
    const mockIdentity = localStorage.getItem('rb_email_identity');

    if (!mockIdentity) {
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

      // Mock sending - just simulate delay and update coach status
      console.log('[MOCK] Sending emails to:', selectedCoachDetails.map(c => c.coach_email));
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update coach contact status in mock mode
      for (const coach of selectedCoachDetails) {
        try {
          await CoachContact.update(coach.id, {
            response_status: 'contacted',
            date_contacted: new Date().toISOString().split('T')[0]
          });
        } catch (error) {
          console.warn('[MOCK] Could not update coach status:', error);
        }
      }

      showToast(`✅ Sent ${selectedCoachDetails.length} emails successfully!`, "success");

      // Clear selections
      setSelectedCoaches(new Set());

      // Reload data to show updated statuses
      await loadData();

    } catch (error) {
      console.error('Bulk send error:', error);
      showToast("Failed to send emails. Please try again.", "error");
    }

    setSending(false);
  };

  const getUserEmailAddress = () => {
    try {
      const mockIdentity = localStorage.getItem('rb_email_identity');
      if (mockIdentity) {
        const identity = JSON.parse(mockIdentity);
        return identity.address || "Setup Required";
      }
    } catch (err) {
      console.error('[MOCK] Error reading email identity:', err);
    }
    return "Setup Required";
  };

  const isIdentityConfigured = !!localStorage.getItem('rb_email_identity');

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
              </div>
            </div>

            {!isIdentityConfigured && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                💡 <strong>Tip:</strong> Configure your email identity in Settings to start sending messages.
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
