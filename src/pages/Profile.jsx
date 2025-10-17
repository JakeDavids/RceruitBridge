
import React, { useState, useEffect, useRef } from "react";
import { Athlete } from "@/api/entities";
import { User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User as UserIcon, Trophy, GraduationCap, Target, Save, Upload, Link as LinkIcon, Camera, Info, Share2, ExternalLink, Check, Copy, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const sports = [
  { value: "football", label: "Football" },
  { value: "basketball", label: "Basketball" },
  { value: "baseball", label: "Baseball" }
];

const divisions = [
  { value: "JUCO", label: "JUCO" },
  { value: "D3", label: "Division III" },
  { value: "D2", label: "Division II" },
  { value: "FCS", label: "FCS" },
  { value: "FBS", label: "FBS" }
];

const regions = [
  "Northeast", "Southeast", "Midwest", "Southwest", "West", "Northwest", "South"
];

export default function Profile() {
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    height: "",
    weight: "",
    position: "",
    sport: "football",
    graduation_year: new Date().getFullYear() + 1,
    gpa: "",
    sat_score: "",
    act_score: "",
    forty_time: "",
    bench_press: "",
    squat: "",
    vertical_jump: "",
    broad_jump: "",
    pro_agility: "",
    stats: {},
    highlights_url: "",
    highlights_url_2: "",
    highlights_url_3: "",
    transcript_url: "",
    bio: "",
    preferred_regions: [],
    target_levels: [],
    academic_achievements: "",
    athletic_achievements: "",
    community_service: "",
    coach_references: ""
  });
  const [user, setUser] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingAthlete, setExistingAthlete] = useState(null);

  // Walkthrough State
  const [walkthroughActive, setWalkthroughActive] = useState(false);
  const [currentWalkthroughStepIndex, setCurrentWalkthroughStepIndex] = useState(0);
  const [showWalkthroughWelcome, setShowWalkthroughWelcome] = useState(false); // Initially false, triggered by button

  const profileFields = [
    'first_name', 'last_name', 'email', 'phone', 'date_of_birth',
    'height', 'weight', 'position', 'graduation_year', 'gpa',
    'sat_score', 'act_score', 'forty_time', 'bench_press', 'squat',
    'vertical_jump', 'broad_jump', 'pro_agility',
    'highlights_url', 'highlights_url_2', 'highlights_url_3',
    'bio', 'coach_references',
    'preferred_regions', 'target_levels',
    'academic_achievements', 'athletic_achievements', 'community_service',
  ];

  const calculateProfileCompletion = () => {
    if (!athlete) return 0;
    let filledCount = 0;
    const totalFields = profileFields.length;

    profileFields.forEach(field => {
      const value = athlete[field];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          filledCount++;
        }
      } else if (value !== null && value !== undefined && value !== '') {
        filledCount++;
      }
    });

    if (totalFields === 0) return 0;
    return Math.round((filledCount / totalFields) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  // Define walkthrough steps
  const walkthroughSteps = [
    {
      id: "profile-completion-step",
      title: "Profile Completion",
      description: "Track your progress! A complete profile significantly boosts your visibility to coaches. Aim for 100%!",
      targetSelector: "#profile-completion-card",
    },
    {
      id: "profile-photo-step",
      title: "Your Profile Photo",
      description: "Upload a clear, professional headshot. Coaches want to put a face to the name!",
      targetSelector: "#profile-photo-card",
    },
    {
      id: "personal-info-step",
      title: "Personal Information",
      description: "Keep your contact details up-to-date and share a compelling personal bio. What makes you stand out?",
      targetSelector: "#basic-info-card", // Updated target
    },
    {
      id: "academic-info-step",
      title: "Academic Achievements",
      description: "Highlight your academic strengths here. Good grades are crucial for college eligibility and scholarships.",
      targetSelector: "#academic-info-card",
    },
    {
      id: "athletic-info-step",
      title: "Athletic Information",
      description: "Showcase your physical stats and athletic achievements. Be specific with your personal bests!",
      targetSelector: "#athletic-info-card",
    },
    {
      id: "community-service-step",
      title: "Community & Leadership",
      description: "Colleges value well-rounded individuals. Detail your volunteer work and leadership roles.",
      targetSelector: "#community-service-card",
    },
    {
      id: "coach-references-step",
      title: "Coach References",
      description: "Provide contact information for coaches who can speak to your character and athletic ability.",
      targetSelector: "#coach-references-card",
    },
    {
      id: "target-divisions-step",
      title: "Target Division Levels",
      description: "Select the NCAA/NAIA divisions you are interested in. This helps us match you with suitable programs.",
      targetSelector: "#target-divisions-section",
    },
    {
      id: "preferred-regions-step",
      title: "Preferred Regions",
      description: "Tell us which geographic regions you'd like to play in. You can select multiple!",
      targetSelector: "#preferred-regions-section",
    },
    {
      id: "highlight-video-step",
      title: "Primary Highlight Video",
      description: "Your best highlight reel! This video will be sent to coaches. Make it count!",
      targetSelector: "#highlights_url_input",
    },
    {
      id: "transcript-url-step",
      title: "Academic Transcript",
      description: "Provide a link to your academic transcript. A Google Drive link is a common method.",
      targetSelector: "#transcript_url_input",
    },
    {
      id: "save-profile-step",
      title: "Save Your Profile!",
      description: "You've almost made it! Remember to save all your changes to activate your profile.",
      targetSelector: "#save-profile-button",
      isDoneStep: true,
    },
  ];

  useEffect(() => {
    loadAthlete();
  }, []);

  // Walkthrough Effects: Scrolls to the target element when the step changes
  useEffect(() => {
    if (walkthroughActive && currentWalkthroughStepIndex >= 0 && currentWalkthroughStepIndex < walkthroughSteps.length) {
      const currentStep = walkthroughSteps[currentWalkthroughStepIndex];
      const targetElement = document.querySelector(currentStep.targetSelector);
      if (targetElement) {
        // Scroll target element into view, with some offset from the top
        const elementRect = targetElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const scrollPosition = elementRect.top + window.pageYOffset - (viewportHeight * 0.2); // Scroll to about 20% from top
        window.scrollTo({
          top: scrollPosition > 0 ? scrollPosition : 0,
          behavior: "smooth"
        });
      }
    }
  }, [walkthroughActive, currentWalkthroughStepIndex, walkthroughSteps]);


  const loadAthlete = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const athletes = await Athlete.filter({ created_by: currentUser.email });
      if (athletes.length > 0) {
        setAthlete(athletes[0]);
        setExistingAthlete(athletes[0]);
      } else {
        setAthlete(prev => ({
          ...prev,
          email: currentUser.email
        }));
      }
    } catch (error) {
      console.error("Error loading athlete:", error);
    }
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setAthlete(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
        const { file_url } = await UploadFile({ file });
        await User.updateMyUserData({ profile_picture_url: file_url });
        const updatedUser = await User.me();
        setUser(updatedUser);
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Failed to upload picture. Please try again.");
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...athlete, sport: "football" };

      const numericFields = [
        'weight', 'graduation_year', 'gpa', 'sat_score',
        'act_score', 'forty_time', 'bench_press', 'squat',
        'vertical_jump', 'pro_agility'
      ];

      numericFields.forEach(field => {
        if (payload[field] === '') {
          payload[field] = null;
        }
      });

      if (existingAthlete) {
        await Athlete.update(existingAthlete.id, payload);
        // Mark onboarding as complete if this is their first save
        if (!user.onboarding_completed) {
          await User.updateMyUserData({ onboarding_completed: true });
        }
        navigate(createPageUrl("Dashboard"));
      } else {
        await Athlete.create(payload);
        // Mark onboarding as complete for first-time users
        await User.updateMyUserData({ onboarding_completed: true });
        navigate(createPageUrl("Dashboard"));
      }
    } catch (error) {
      console.error("Error saving athlete:", error);
      alert("There was an error saving your profile. Please try again.");
    }
    setSaving(false);
  };

  const handleRegionChange = (region, checked) => {
    if (checked) {
      setAthlete(prev => ({
        ...prev,
        preferred_regions: [...prev.preferred_regions, region]
      }));
    } else {
      setAthlete(prev => ({
        ...prev,
        preferred_regions: prev.preferred_regions.filter(r => r !== region)
      }));
    }
  };

  const handleSelectAllRegions = () => {
    setAthlete(prev => ({
      ...prev,
      preferred_regions: regions
    }));
  };

  const handleDeselectAllRegions = () => {
    setAthlete(prev => ({
      ...prev,
      preferred_regions: []
    }));
  };

  const handleLevelChange = (level, checked) => {
    if (checked) {
      setAthlete(prev => ({
        ...prev,
        target_levels: [...prev.target_levels, level]
      }));
    } else {
      setAthlete(prev => ({
        ...prev,
        target_levels: prev.target_levels.filter(l => l !== level)
      }));
    }
  };

  const handleSelectAllLevels = () => {
    setAthlete(prev => ({
      ...prev,
      target_levels: divisions.map(d => d.value)
    }));
  };

  const handleDeselectAllLevels = () => {
    setAthlete(prev => ({
      ...prev,
      target_levels: []
    }));
  };

  // Walkthrough functions
  const startWalkthrough = () => {
    setShowWalkthroughWelcome(false);
    setWalkthroughActive(true);
    setCurrentWalkthroughStepIndex(0);
  };

  const nextWalkthroughStep = () => {
    if (currentWalkthroughStepIndex < walkthroughSteps.length - 1) {
      setCurrentWalkthroughStepIndex(currentWalkthroughStepIndex + 1);
    } else {
      endWalkthrough(); // End walkthrough on last step's "Next"
    }
  };

  const prevWalkthroughStep = () => {
    if (currentWalkthroughStepIndex > 0) {
      setCurrentWalkthroughStepIndex(currentWalkthroughStepIndex - 1);
    }
  };

  const endWalkthrough = () => {
    setWalkthroughActive(false);
    setCurrentWalkthroughStepIndex(0);
  };

  const currentStep = walkthroughSteps[currentWalkthroughStepIndex];
  const isFirstStep = currentWalkthroughStepIndex === 0;
  const isLastStep = currentWalkthroughStepIndex === walkthroughSteps.length - 1;


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-3 md:p-6">
      {/* Hero Banner - SMALLER & Mobile-Friendly */}
      <div className="relative mb-6 md:mb-8 rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="relative z-10 p-6 md:p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur rounded-xl md:rounded-2xl mb-2 md:mb-3">
            <UserIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Your Athletic Profile</h1>
          <p className="text-sm md:text-lg text-white/90 max-w-2xl mx-auto">
            Build a standout profile that catches coaches' attention
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-24 md:pb-32">
        {/* Profile Completion Card with Walkthrough Button */}
        <Card id="profile-completion-card" className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md">
            <CardContent className="pt-4 md:pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <Label className="text-sm md:text-base font-medium">Profile Completion</Label>
                    <Button variant="outline" size="sm" onClick={() => setShowWalkthroughWelcome(true)} className="flex items-center gap-1 text-xs md:text-sm">
                        <Info className="h-3 w-3 md:h-4 md:w-4" /> Take a Tour
                    </Button>
                </div>
                <div className="flex items-center gap-3 md:gap-4 mt-2">
                    <Progress value={profileCompletion} className="h-2 flex-1 [&>div]:bg-green-600" />
                    <span className="font-semibold text-blue-600 text-sm md:text-base">{profileCompletion}%</span>
                </div>
                 <p className="text-xs text-slate-500 mt-2">A complete profile is 80% more likely to get a coach's attention. Keep it updated!</p>
            </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          {/* Profile Photo */}
          <Card id="profile-photo-card" className="bg-white/80 backdrop-blur shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-2xl font-bold text-slate-900">
                <Camera className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                Profile Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                  {user?.profile_picture_url ? (
                    <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-12 h-12 md:w-16 md:h-16 text-slate-400" />
                  )}
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handlePictureUpload} style={{ display: 'none' }} accept="image/*" />
              <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} size="sm" className="text-sm md:text-base">
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Change Photo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card id="basic-info-card" className="bg-white/80 backdrop-blur shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-sm md:text-base">First Name *</Label>
                  <Input
                    id="first_name"
                    value={athlete?.first_name || ""}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    placeholder="Enter your first name"
                    className="text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-sm md:text-base">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={athlete?.last_name || ""}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    placeholder="Enter your last name"
                    className="text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm md:text-base">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={athlete?.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    className="text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm md:text-base">Phone</Label>
                  <Input
                    id="phone"
                    value={athlete?.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    className="text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2 col-span-1 sm:col-span-2">
                  <Label htmlFor="date_of_birth" className="text-sm md:text-base">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={athlete?.date_of_birth || ""}
                    onChange={(e) => handleChange("date_of_birth", e.target.value)}
                    className="text-base md:text-lg"
                  />
                </div>
              </div>
              <div className="mt-4 md:mt-6 space-y-2">
                <Label htmlFor="bio" className="text-sm md:text-base">Personal Bio</Label>
                <Textarea
                  id="bio"
                  value={athlete?.bio || ""}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Tell coaches about yourself, your goals, and what makes you unique..."
                  rows={4}
                  className="text-base md:text-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card id="academic-info-card" className="bg-white/80 backdrop-blur shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="graduation_year" className="text-sm md:text-base">Graduation Year</Label>
                  <Input
                    id="graduation_year"
                    type="number"
                    value={athlete?.graduation_year || ""}
                    onChange={(e) => handleChange("graduation_year", parseInt(e.target.value))}
                    placeholder="2025"
                    className="text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa" className="text-sm md:text-base">GPA</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    value={athlete?.gpa || ""}
                    onChange={(e) => handleChange("gpa", parseFloat(e.target.value))}
                    placeholder="3.75"
                    className="text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sat_score" className="text-sm md:text-base">SAT Score</Label>
                  <Input
                    id="sat_score"
                    type="number"
                    value={athlete?.sat_score || ""}
                    onChange={(e) => handleChange("sat_score", parseInt(e.target.value))}
                    placeholder="1200"
                    className="text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="act_score" className="text-sm md:text-base">ACT Score</Label>
                  <Input
                    id="act_score"
                    type="number"
                    value={athlete?.act_score || ""}
                    onChange={(e) => handleChange("act_score", parseInt(e.target.value))}
                    placeholder="26"
                    className="text-base md:text-lg"
                  />
                </div>
              </div>
              <div className="mt-4 md:mt-6 space-y-2">
                <Label htmlFor="academic_achievements" className="text-sm md:text-base">Academic Achievements & Awards</Label>
                <Textarea
                  id="academic_achievements"
                  value={athlete?.academic_achievements || ""}
                  onChange={(e) => handleChange("academic_achievements", e.target.value)}
                  placeholder="e.g., Valedictorian, National Honor Society, 4.0 GPA, Dean's List..."
                  rows={4}
                  className="text-base md:text-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Athletic Information */}
          <Card id="athletic-info-card" className="bg-white/80 backdrop-blur shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                Athletic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label className="text-sm md:text-base">Sport</Label>
                  <Input
                    value="Football"
                    disabled
                    className="bg-slate-100 text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-sm md:text-base">Position</Label>
                  <Input
                    id="position"
                    value={athlete?.position || ""}
                    onChange={(e) => handleChange("position", e.target.value)}
                    placeholder="e.g., Quarterback, Point Guard"
                    className="text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-sm md:text-base">Height</Label>
                  <Input
                    id="height"
                    value={athlete?.height || ""}
                    onChange={(e) => handleChange("height", e.target.value)}
                    placeholder="e.g., 6'2"
                    className="text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm md:text-base">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={athlete?.weight || ""}
                    onChange={(e) => handleChange("weight", parseInt(e.target.value))}
                    placeholder="185"
                    className="text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forty_time" className="text-sm md:text-base">40-Yard Dash (s)</Label>
                  <Input
                    id="forty_time"
                    type="number"
                    step="0.01"
                    value={athlete?.forty_time || ""}
                    onChange={(e) => handleChange("forty_time", parseFloat(e.target.value))}
                    placeholder="4.5"
                    className="text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bench_press" className="text-sm md:text-base">Bench Press (lbs)</Label>
                  <Input
                    id="bench_press"
                    type="number"
                    value={athlete?.bench_press || ""}
                    onChange={(e) => handleChange("bench_press", parseInt(e.target.value))}
                    placeholder="225"
                    className="text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="squat" className="text-sm md:text-base">Squat (lbs)</Label>
                  <Input
                    id="squat"
                    type="number"
                    value={athlete?.squat || ""}
                    onChange={(e) => handleChange("squat", parseInt(e.target.value))}
                    placeholder="315"
                    className="text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vertical_jump" className="text-sm md:text-base">Vertical Jump (in)</Label>
                  <Input
                    id="vertical_jump"
                    type="number"
                    step="0.1"
                    value={athlete?.vertical_jump || ""}
                    onChange={(e) => handleChange("vertical_jump", parseFloat(e.target.value))}
                    placeholder="36"
                    className="text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="broad_jump" className="text-sm md:text-base">Broad Jump</Label>
                  <Input
                    id="broad_jump"
                    value={athlete?.broad_jump || ""}
                    onChange={(e) => handleChange("broad_jump", e.target.value)}
                    placeholder="e.g., 9' 5&quot;"
                    className="text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pro_agility" className="text-sm md:text-base">Pro Agility (s)</Label>
                  <Input
                    id="pro_agility"
                    type="number"
                    step="0.01"
                    value={athlete?.pro_agility || ""}
                    onChange={(e) => handleChange("pro_agility", parseFloat(e.target.value))}
                    placeholder="4.2"
                    className="text-base md:text-lg"
                  />
                </div>
              </div>
              <div className="mt-4 md:mt-6 space-y-2 col-span-1 sm:col-span-2">
                <Label htmlFor="athletic_achievements" className="text-sm md:text-base">Athletic Achievements & Awards</Label>
                <Textarea
                  id="athletic_achievements"
                  value={athlete?.athletic_achievements || ""}
                  onChange={(e) => handleChange("athletic_achievements", e.target.value)}
                  placeholder="e.g., Team Captain, All-Conference Selection, State Qualifier, MVP Award..."
                  rows={6}
                  className="text-base md:text-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Community Service */}
          <Card id="community-service-card" className="bg-white/80 backdrop-blur shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                Community Service & Leadership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="community_service" className="text-sm md:text-base">Community Service Activities</Label>
                <Textarea
                  id="community_service"
                  value={athlete?.community_service || ""}
                  onChange={(e) => handleChange("community_service", e.target.value)}
                  placeholder="e.g., 100+ volunteer hours, Mission trip participant, Leadership roles in clubs..."
                  rows={4}
                  className="text-base md:text-lg"
                />
                <p className="text-xs text-slate-500 mt-1">Include volunteer work, fundraising, and leadership roles</p>
              </div>
            </CardContent>
          </Card>

          {/* Coach References */}
          <Card id="coach-references-card" className="bg-white/80 backdrop-blur shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                Coach References
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="coach_references" className="text-sm md:text-base">High School Coach Information</Label>
                <Textarea
                  id="coach_references"
                  value={athlete?.coach_references || ""}
                  onChange={(e) => handleChange("coach_references", e.target.value)}
                  placeholder="Coach Name - coach.email@school.com - (555) 555-5555"
                  rows={4}
                  className="text-base md:text-lg"
                />
                <p className="text-xs text-slate-500 mt-1">Include coach names, emails, and phone numbers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recruiting Preferences */}
        <Card className="bg-white/80 backdrop-blur shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              Recruiting Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div id="target-divisions-section">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm md:text-base font-medium">Target Division Levels</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllLevels}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAllLevels}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {divisions.map(division => (
                  <div key={division.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={division.value}
                      checked={athlete?.target_levels.includes(division.value)}
                      onCheckedChange={(checked) => handleLevelChange(division.value, checked)}
                    />
                    <Label htmlFor={division.value} className="text-base cursor-pointer">
                      {division.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div id="preferred-regions-section">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm md:text-base font-medium">Preferred Regions</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllRegions}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAllRegions}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {regions.map(region => (
                  <div key={region} className="flex items-center space-x-2">
                    <Checkbox
                      id={region}
                      checked={athlete?.preferred_regions.includes(region)}
                      onCheckedChange={(checked) => handleRegionChange(region, checked)}
                    />
                    <Label htmlFor={region} className="text-base cursor-pointer">
                      {region}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Center - Integrated into Profile */}
        <Card className="bg-white/80 backdrop-blur shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
              Media & Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="highlights_url_input" className="text-sm md:text-base">Primary Highlight Video URL</Label>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-slate-500" />
                <Input
                  id="highlights_url_input"
                  value={athlete?.highlights_url || ""}
                  onChange={(e) => handleChange("highlights_url", e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or HUDL link"
                  className="flex-1 text-base md:text-lg"
                />
              </div>
              <p className="text-sm text-slate-600 mt-1">Your best plays - will be automatically included in outreach emails</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="highlights_url_2" className="text-sm md:text-base">Secondary Highlight Video URL (Optional)</Label>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-slate-500" />
                <Input
                  id="highlights_url_2"
                  value={athlete?.highlights_url_2 || ""}
                  onChange={(e) => handleChange("highlights_url_2", e.target.value)}
                  placeholder="Additional highlight reel link"
                  className="flex-1 text-base md:text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="highlights_url_3" className="text-sm md:text-base">Tertiary Highlight Video URL (Optional)</Label>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-slate-500" />
                <Input
                  id="highlights_url_3"
                  value={athlete?.highlights_url_3 || ""}
                  onChange={(e) => handleChange("highlights_url_3", e.target.value)}
                  placeholder="Additional highlight reel link"
                  className="flex-1 text-base md:text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transcript_url_input" className="text-sm md:text-base">Academic Transcript URL</Label>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-slate-500" />
                <Input
                  id="transcript_url_input"
                  value={athlete?.transcript_url || ""}
                  onChange={(e) => handleChange("transcript_url", e.target.value)}
                  placeholder="Google Drive link to your transcript"
                  className="flex-1 text-base md:text-lg"
                />
              </div>
              <p className="text-sm text-slate-600 mt-1">Upload your official academic records</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Pro Tip:</strong> Your primary highlight video will be automatically included in all outreach emails to coaches!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Save Button - Mobile Optimized */}
      <div id="save-profile-button-container" className="fixed bottom-0 left-0 right-0 p-3 md:p-4 bg-white/90 backdrop-blur-sm border-t border-slate-200 z-[100] md:left-64">
        <div className="max-w-6xl mx-auto flex justify-center">
          <Button
            id="save-profile-button"
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-8 md:px-12 w-full md:w-auto"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Walkthrough Welcome Dialog */}
      <Dialog open={showWalkthroughWelcome} onOpenChange={setShowWalkthroughWelcome}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to Your Profile Tour!</DialogTitle>
            <DialogDescription>
              We'll guide you through the key sections of your athlete profile, helping you understand how to make it stand out to college coaches.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWalkthroughWelcome(false)}>
              Skip Tour
            </Button>
            <Button onClick={startWalkthrough}>
              Start Tour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Walkthrough Step Dialog */}
      <Dialog open={walkthroughActive} onOpenChange={endWalkthrough}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentStep?.title} ({currentWalkthroughStepIndex + 1} of {walkthroughSteps.length})</DialogTitle>
            <DialogDescription>
              {currentStep?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={prevWalkthroughStep}
              disabled={isFirstStep}
            >
              Previous
            </Button>
            <Button variant="outline" onClick={endWalkthrough}>
              Skip Tour
            </Button>
            <Button onClick={nextWalkthroughStep}>
              {isLastStep ? (
                <>
                  <Check className="h-4 w-4 mr-2" /> Finish
                </>
              ) : "Next"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
