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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, Send, Filter, Copy, Sparkles, RefreshCw, Loader2, Settings, Lock } from "lucide-react";
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
  const [emailType, setEmailType] = useState("general"); // general, team, individual

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

  // Check if user has access to premium features
  const hasPremiumAccess = () => {
    if (!athlete) return false;
    const plan = athlete.subscription_plan || "free";
    return ["starter", "core", "unlimited"].includes(plan);
  };

  // Get first selected coach for individual emails
  const getFirstSelectedCoach = () => {
    if (selectedCoaches.size === 0) return null;
    const firstCoachId = Array.from(selectedCoaches)[0];
    return coaches.find(c => c.id === firstCoachId);
  };

  // Get first selected school for team emails
  const getFirstSelectedSchool = () => {
    const coach = getFirstSelectedCoach();
    if (!coach) return null;
    return {
      id: coach.school_id,
      name: coach.school_name
    };
  };

  const generateWithAI = async () => {
    // Check payment access for premium features
    if ((emailType === "team" || emailType === "individual") && !hasPremiumAccess()) {
      showToast("Upgrade to access Team Personalized and Individual Coach emails!", "error");
      return;
    }

    setGenerating(true);
    try {
      if (!athlete) {
        showToast("Please complete your profile first!", "error");
        setGenerating(false);
        return;
      }

      let response;
      if (emailType === "general") {
        response = await generateGeneralEmail();
      } else if (emailType === "team") {
        response = await generateTeamPersonalizedEmail();
      } else if (emailType === "individual") {
        response = await generateIndividualCoachEmail();
      }

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

        showToast(`${emailType.charAt(0).toUpperCase() + emailType.slice(1)} email generated!`, "success");
      }
    } catch (error) {
      console.error("Error generating email:", error);
      showToast("Failed to generate email. Please try again.", "error");
    }
    setGenerating(false);
  };

  // Generate General Email (recommended for mass sends)
  const generateGeneralEmail = async () => {
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

    const prompt = `You are an expert college recruiting consultant. Write a HIGHLY effective general introduction email from a high school athlete to college coaches. This email will be sent to multiple coaches, so use PLACEHOLDERS for personalization.

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
1. Subject line must grab attention immediately with a specific stat or achievement
2. Email must be concise (3 paragraphs maximum)
3. Lead with the MOST impressive accomplishment in first sentence
4. Use placeholders: [Coach's Name], [School Name], [Coach's Title]
5. Include specific, measurable achievements
6. Professional but energetic tone
7. Clear call-to-action at the end
8. NO generic phrases - be specific and results-driven

FORMAT:
Subject: [Attention-grabbing subject with specific accomplishment]

Dear Coach [Coach's Name],

[Paragraph 1: Open with your single most impressive stat/achievement. Make it impossible to ignore. One standout accomplishment that proves you can contribute immediately.]

[Paragraph 2: Brief but powerful summary of additional achievements, academics, character. Show you're a complete package - athlete, student, teammate.]

[Paragraph 3: Express genuine interest in their program and request next steps. Be confident and specific about what you want (film review, phone call, camp invite).]

Best regards,
${athleteInfo.name}
${athleteInfo.position} | Class of ${athleteInfo.gradYear}
${athleteInfo.highSchool}
[Phone] | [Email]

Make this email stand out in an inbox full of recruit emails. Be bold, specific, and memorable.`;

    return await InvokeLLM({prompt});
  };

  // Generate Team Personalized Email (premium feature)
  const generateTeamPersonalizedEmail = async () => {
    const school = getFirstSelectedSchool();
    if (!school) {
      showToast("Please select a coach from a school first!", "error");
      throw new Error("No school selected");
    }

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

    const prompt = `You are an expert college recruiting consultant. Write a HIGHLY PERSONALIZED email to the coaching staff at ${school.name}. This email shows genuine research about THEIR SPECIFIC PROGRAM and explains exactly why this athlete is a perfect fit for THEIR TEAM.

ATHLETE PROFILE:
- Name: ${athleteInfo.name}
- Sport: ${athleteInfo.sport}
- Position: ${athleteInfo.position}
- Grad Year: ${athleteInfo.gradYear}
- GPA: ${athleteInfo.gpa}
- Height: ${athleteInfo.height}, Weight: ${athleteInfo.weight}
- Key Stats/Achievements: ${athleteInfo.stats || athleteInfo.achievements}
- Location: ${athleteInfo.city}, ${athleteInfo.state}
- High School: ${athleteInfo.highSchool}

TARGET SCHOOL: ${school.name}

REQUIREMENTS:
1. Subject must reference ${school.name} specifically with an achievement
2. Research and mention ${school.name}'s recent season, playing style, or coaching philosophy
3. Explain WHY this athlete fits ${school.name}'s system specifically
4. Reference recent games, wins, or notable moments from ${school.name}
5. Show knowledge of ${school.name}'s conference and competition level
6. Be specific about how athlete's skills match ${school.name}'s needs
7. Include measurable achievements that align with ${school.name}'s style of play
8. Use placeholder [Coach's Name] but make everything else specific to ${school.name}

FORMAT:
Subject: [${school.name}-specific subject with accomplishment]

Dear Coach [Coach's Name],

[Paragraph 1: Open with most impressive stat, then IMMEDIATELY connect it to ${school.name}'s specific system or recent performance. Show you've watched their games and understand their style.]

[Paragraph 2: Explain why your skills are a PERFECT FIT for ${school.name}. Reference their offensive/defensive scheme, recent games, or coaching philosophy. Be specific about what you can contribute to THEIR team.]

[Paragraph 3: Additional achievements and academics, but frame everything in context of ${school.name}'s values and standards.]

[Paragraph 4: Strong call-to-action. Express genuine interest in ${school.name} specifically and request film review or conversation.]

Best regards,
${athleteInfo.name}
${athleteInfo.position} | Class of ${athleteInfo.gradYear}
${athleteInfo.highSchool}
[Phone] | [Email]

Make this coach feel like ${school.name} is the athlete's DREAM SCHOOL, not just another target. Show deep research and genuine fit.`;

    return await InvokeLLM({prompt});
  };

  // Generate Individual Coach Email (premium feature)
  const generateIndividualCoachEmail = async () => {
    const coach = getFirstSelectedCoach();
    if (!coach) {
      showToast("Please select a coach first!", "error");
      throw new Error("No coach selected");
    }

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

    const prompt = `You are an expert college recruiting consultant. Write a DEEPLY PERSONALIZED email to ${coach.coach_name} at ${coach.school_name}. This email shows you've researched THIS SPECIFIC COACH and explains why you want to play for HIM/HER specifically.

ATHLETE PROFILE:
- Name: ${athleteInfo.name}
- Sport: ${athleteInfo.sport}
- Position: ${athleteInfo.position}
- Grad Year: ${athleteInfo.gradYear}
- GPA: ${athleteInfo.gpa}
- Height: ${athleteInfo.height}, Weight: ${athleteInfo.weight}
- Key Stats/Achievements: ${athleteInfo.stats || athleteInfo.achievements}
- Location: ${athleteInfo.city}, ${athleteInfo.state}
- High School: ${athleteInfo.highSchool}

TARGET COACH:
- Name: ${coach.coach_name}
- Title: ${coach.coach_title || "Coach"}
- School: ${coach.school_name}

REQUIREMENTS:
1. Subject must include ${coach.school_name} and reference the coach's position group or expertise
2. Reference ${coach.coach_name}'s coaching background or reputation if known
3. If coach is a position coach, explain why you're perfect for HIS position group
4. Show knowledge of how ${coach.coach_name} develops players at this position
5. Mention ${coach.school_name}'s recent season and this coach's impact
6. Be specific about wanting to learn from THIS COACH specifically
7. Include achievements that align with what THIS COACH values in players
8. Use ${coach.coach_name} (NOT a placeholder) throughout

FORMAT:
Subject: [${coach.school_name} ${athleteInfo.position} - Specific achievement for ${coach.coach_name}]

Dear Coach ${coach.coach_name},

[Paragraph 1: Open with most impressive stat, then explain why you're reaching out to HIM specifically. Reference his role as ${coach.coach_title} and what you admire about his coaching.]

[Paragraph 2: Explain why you'd thrive under HIS coaching. Reference his development of players at your position, his coaching philosophy, or ${coach.school_name}'s recent success under his guidance.]

[Paragraph 3: Additional achievements framed in context of what ${coach.coach_name} values. Show you understand what he looks for in recruits.]

[Paragraph 4: Express genuine desire to learn from ${coach.coach_name} specifically and contribute to ${coach.school_name}. Request film review or phone call.]

Best regards,
${athleteInfo.name}
${athleteInfo.position} | Class of ${athleteInfo.gradYear}
${athleteInfo.highSchool}
[Phone] | [Email]

Make ${coach.coach_name} feel like this athlete specifically wants to play for HIM, not just at ${coach.school_name}. Show deep personalization and genuine research about his coaching.`;

    return await InvokeLLM({prompt});
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      {/* Header with Email Settings Button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 rounded-2xl mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Outreach Center</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Compose and send messages to coaches</p>
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
        <Card className="bg-white/80 dark:bg-slate-800/90 backdrop-blur shadow-xl h-fit border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Select Recipients</CardTitle>
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
        <Card className="bg-white/80 dark:bg-slate-800/90 backdrop-blur shadow-xl border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Compose Message</CardTitle>
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

            {/* Email Type Selector */}
            <div className="space-y-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg border border-blue-200 dark:border-slate-600">
              <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Email Generation Type</Label>
              <RadioGroup value={emailType} onValueChange={setEmailType} className="space-y-2">
                <div className="flex items-start space-x-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer">
                  <RadioGroupItem value="general" id="general" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="general" className="font-medium text-slate-900 dark:text-slate-100 cursor-pointer">
                      General Email
                      <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100">Recommended</Badge>
                    </Label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Perfect for mass email sends to multiple coaches. Uses placeholders for personalization.
                    </p>
                  </div>
                </div>

                <div className={`flex items-start space-x-3 bg-white dark:bg-slate-800 p-3 rounded-lg border transition-colors ${!hasPremiumAccess() ? 'border-amber-300 dark:border-amber-600' : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer'}`}>
                  <RadioGroupItem value="team" id="team" disabled={!hasPremiumAccess()} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="team" className={`font-medium flex items-center gap-2 ${hasPremiumAccess() ? 'cursor-pointer text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      Team Personalized
                      {!hasPremiumAccess() && <Lock className="w-3 h-3" />}
                      {!hasPremiumAccess() && <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-100">Premium</Badge>}
                    </Label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Personalized for a specific school's program, system, and recent performance. Shows deep research.
                    </p>
                  </div>
                </div>

                <div className={`flex items-start space-x-3 bg-white dark:bg-slate-800 p-3 rounded-lg border transition-colors ${!hasPremiumAccess() ? 'border-amber-300 dark:border-amber-600' : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer'}`}>
                  <RadioGroupItem value="individual" id="individual" disabled={!hasPremiumAccess()} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="individual" className={`font-medium flex items-center gap-2 ${hasPremiumAccess() ? 'cursor-pointer text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      Individual Coach
                      {!hasPremiumAccess() && <Lock className="w-3 h-3" />}
                      {!hasPremiumAccess() && <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-100">Premium</Badge>}
                    </Label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Deeply personalized for a specific coach. Includes coach's name, title, and coaching background.
                    </p>
                  </div>
                </div>
              </RadioGroup>
              {!hasPremiumAccess() && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 text-sm">
                  <p className="text-amber-800 dark:text-amber-200">
                    🔒 <strong>Upgrade to unlock Team Personalized and Individual Coach emails!</strong> Get highly personalized emails that stand out.
                  </p>
                  <Link to={createPageUrl("Upgrade")}>
                    <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800">
                      Upgrade Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                id="generate-email-button"
                onClick={generateWithAI}
                disabled={generating}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20 flex items-center gap-2"
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
