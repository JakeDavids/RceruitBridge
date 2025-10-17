import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Athlete } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User as UserIcon, 
  MapPin, 
  GraduationCap, 
  Trophy, 
  TrendingUp,
  Mail,
  ExternalLink
} from "lucide-react";

export default function PublicProfile() {
  const { slug } = useParams();
  const [athlete, setAthlete] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadPublicProfile();
  }, [slug]);

  const loadPublicProfile = async () => {
    try {
      // Find user by profile slug
      const users = await User.filter({ profile_slug: slug });
      
      if (users.length === 0) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const foundUser = users[0];
      
      // Check if public profile is enabled
      if (!foundUser.public_profile_enabled) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setUser(foundUser);

      // Load athlete data
      const athleteData = await Athlete.filter({ created_by: foundUser.email });
      if (athleteData.length > 0) {
        setAthlete(athleteData[0]);
      }

    } catch (error) {
      console.error("Error loading public profile:", error);
      setNotFound(true);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (notFound || !athlete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <UserIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
            <p className="text-slate-600 mb-6">
              This athlete profile doesn't exist or isn't public yet.
            </p>
            <a href="/">
              <Button>Go to RecruitBridge</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profileCompletion = calculateProfileCompletion(athlete);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <CardContent className="relative pt-16 pb-6">
            <div className="absolute -top-16 left-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg">
                {user?.profile_picture_url ? (
                  <img src={user.profile_picture_url} alt={athlete.first_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="w-16 h-16 text-slate-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="ml-40">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {athlete.first_name} {athlete.last_name}
                  </h1>
                  <p className="text-lg text-slate-600">{athlete.position} • Class of {athlete.graduation_year}</p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {profileCompletion}% Complete
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                {athlete.height && athlete.weight && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <UserIcon className="w-4 h-4" />
                    {athlete.height} • {athlete.weight} lbs
                  </div>
                )}
                {athlete.gpa && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <GraduationCap className="w-4 h-4" />
                    {athlete.gpa} GPA
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        {athlete.bio && (
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">{athlete.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Athletic Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                Athletic Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {athlete.forty_time && (
                <div className="flex justify-between">
                  <span className="text-slate-600">40-Yard Dash</span>
                  <span className="font-semibold">{athlete.forty_time}s</span>
                </div>
              )}
              {athlete.bench_press && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Bench Press</span>
                  <span className="font-semibold">{athlete.bench_press} lbs</span>
                </div>
              )}
              {athlete.squat && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Squat</span>
                  <span className="font-semibold">{athlete.squat} lbs</span>
                </div>
              )}
              {athlete.vertical_jump && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Vertical Jump</span>
                  <span className="font-semibold">{athlete.vertical_jump}"</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Academic Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Academic Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {athlete.gpa && (
                <div className="flex justify-between">
                  <span className="text-slate-600">GPA</span>
                  <span className="font-semibold">{athlete.gpa}</span>
                </div>
              )}
              {athlete.sat_score && (
                <div className="flex justify-between">
                  <span className="text-slate-600">SAT Score</span>
                  <span className="font-semibold">{athlete.sat_score}</span>
                </div>
              )}
              {athlete.act_score && (
                <div className="flex justify-between">
                  <span className="text-slate-600">ACT Score</span>
                  <span className="font-semibold">{athlete.act_score}</span>
                </div>
              )}
              {athlete.graduation_year && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Graduation Year</span>
                  <span className="font-semibold">{athlete.graduation_year}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Highlight Video */}
        {athlete.highlights_url && (
          <Card>
            <CardHeader>
              <CardTitle>Highlight Reel</CardTitle>
            </CardHeader>
            <CardContent>
              <a 
                href={athlete.highlights_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="w-4 h-4" />
                View Highlights
              </a>
            </CardContent>
          </Card>
        )}

        {/* Achievements */}
        {athlete.athletic_achievements && (
          <Card>
            <CardHeader>
              <CardTitle>Athletic Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-wrap">{athlete.athletic_achievements}</p>
            </CardContent>
          </Card>
        )}

        {/* Powered by RecruitBridge */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">This profile powered by</p>
                <p className="text-2xl font-bold">RecruitBridge</p>
                <p className="text-sm opacity-90 mt-1">AI-powered recruiting platform for student athletes</p>
              </div>
              <a href="/">
                <Button variant="secondary">
                  Create Your Profile
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function
function calculateProfileCompletion(athlete) {
  const fields = [
    'first_name', 'last_name', 'email', 'phone', 'date_of_birth',
    'height', 'weight', 'position', 'graduation_year', 'gpa',
    'sat_score', 'act_score', 'forty_time', 'bench_press', 'squat',
    'highlights_url', 'bio', 'coach_references',
    'preferred_regions', 'target_levels', 'academic_achievements', 'athletic_achievements'
  ];
  
  let filledCount = 0;
  fields.forEach(field => {
    const value = athlete[field];
    if (Array.isArray(value)) {
      if (value.length > 0) filledCount++;
    } else if (value !== null && value !== undefined && value !== '') {
      filledCount++;
    }
  });
  
  return Math.round((filledCount / fields.length) * 100);
}