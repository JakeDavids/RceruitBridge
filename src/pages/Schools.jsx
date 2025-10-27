
import React, { useState, useEffect, useMemo } from "react";
import { School, Athlete, TargetedSchool, User } from "@/api/entities";
import { supabase } from "@/api/supabaseClient";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Target, Search, Star, CheckCircle, MapPin, Trash2, Bot, Sparkles, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PageGuide from "@/components/onboarding/PageGuide";
import useGuidedTour from "@/components/hooks/useGuidedTour";

// Academic Tier Definitions (for tooltips)
const ACADEMIC_TIERS = {
  1: {
    label: "Tier 1 – Most Competitive",
    description: "Elite academic institutions (e.g., Ivy League level)",
    color: "bg-purple-100 text-purple-800 border-purple-300"
  },
  2: {
    label: "Tier 2 – Highly Competitive",
    description: "Very selective schools with high academic rigor",
    color: "bg-blue-100 text-blue-800 border-blue-300"
  },
  3: {
    label: "Tier 3 – Competitive",
    description: "Solid academic programs with moderate selectivity",
    color: "bg-green-100 text-green-800 border-green-300"
  },
  4: {
    label: "Tier 4 – Less Competitive",
    description: "Generally accessible schools with higher acceptance rates",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300"
  },
  5: {
    label: "Tier 5 – Least Competitive",
    description: "Open enrollment or minimally selective schools",
    color: "bg-gray-100 text-gray-800 border-gray-300"
  }
};

// Central utility function for formatted school names
const getFormattedSchoolName = (schoolName) => {
  const schoolNameMappings = {
    // SEC Schools
    "University of Alabama": "Alabama Crimson Tide (University of Alabama)",
    "University of Arkansas": "Arkansas Razorbacks (University of Arkansas)",
    "Auburn University": "Auburn Tigers (Auburn University)",
    "University of Florida": "Florida Gators (University of Florida)",
    "University of Georgia": "Georgia Bulldogs (University of Georgia)",
    "University of Kentucky": "Kentucky Wildcats (University of Kentucky)",
    "Louisiana State University": "LSU Tigers (Louisiana State University)",
    "Mississippi State University": "Mississippi State Bulldogs (Mississippi State University)",
    "University of Missouri": "Missouri Tigers (University of Missouri)",
    "University of Oklahoma": "Oklahoma Sooners (University of Oklahoma)",
    "University of Mississippi": "Ole Miss Rebels (University of Mississippi)",
    "University of South Carolina": "South Carolina Gamecocks (University of South Carolina)", // Fixed typo
    "University of Tennessee": "Tennessee Volunteers (University of Tennessee)",
    "University of Texas at Austin": "Texas Longhorns (University of Texas at Austin)",
    "Texas A&M University": "Texas A&M Aggies (Texas A&M University)",
    "Vanderbilt University": "Vanderbilt Commodores (Vanderbilt University)",

    // ACC Schools
    "Boston College": "Boston College Eagles (Boston College)",
    "University of California, Berkeley": "California Golden Bears (University of California, Berkeley)",
    "Clemson University": "Clemson Tigers (Clemson University)",
    "Duke University": "Duke Blue Devils (Duke University)",
    "Florida State University": "Florida State Seminoles (Florida State University)",
    "Georgia Institute of Technology": "Georgia Tech Yellow Jackets (Georgia Institute of Technology)",
    "University of Louisville": "Louisville Cardinals (University of Louisville)",
    "University of Miami": "Miami Hurricanes (University of Miami)",
    "University of North Carolina at Chapel Hill": "North Carolina Tar Heels (University of North Carolina at Chapel Hill)",
    "North Carolina State University": "NC State Wolfpack (North Carolina State University)",
    "University of Pittsburgh": "Pittsburgh Panthers (University of Pittsburgh)",
    "Southern Methodist University": "SMU Mustangs (Southern Methodist University)",
    "Stanford University": "Stanford Cardinal (Stanford University)",
    "Syracuse University": "Syracuse Orange (Syracuse University)",
    "University of Virginia": "Virginia Cavaliers (University of Virginia)",
    "Virginia Tech": "Virginia Tech Hokies (Virginia Tech)",
    "Wake Forest University": "Wake Forest Demon Deacons (Wake Forest University)",

    // Other existing FBS Schools
    "University of North Carolina at Charlotte": "Charlotte 49ers (University of North Carolina at Charlotte)",
    
    // FCS Schools - Ivy League
    "Brown University": "Brown Bears (Brown University)",
    "Columbia University": "Columbia Lions (Columbia University)",
    "Cornell University": "Cornell Big Red (Cornell University)",
    "Dartmouth College": "Dartmouth Big Green (Dartmouth College)",
    "Harvard University": "Harvard Crimson (Harvard University)",
    "University of Pennsylvania": "Penn Quakers (University of Pennsylvania)",
    "Princeton University": "Princeton Tigers (Princeton University)",
    "Yale University": "Yale Bulldogs (Yale University)",
    
    // Patriot League
    "Bucknell University": "Bucknell Bison (Bucknell University)",
    "Colgate University": "Colgate Raiders (Colgate University)",
    "Fordham University": "Fordham Rams (Fordham University)",
    "College of the Holy Cross": "Holy Cross Crusaders (College of the Holy Cross)",
    "Lafayette College": "Lafayette Leopards (Lafayette College)",
    "Lehigh University": "Lehigh Mountain Hawks (Lehigh University)",
    "Georgetown University": "Georgetown Hoyas (Georgetown University)",
    
    // CAA Football
    "University at Albany": "Albany Great Danes (University at Albany)",
    "Bryant University": "Bryant Bulldogs (Bryant University)",
    "Campbell University": "Campbell Fighting Camels (Campbell University)",
    "University of Delaware": "Delaware Blue Hens (University of Delaware)",
    "Delaware State University": "Delaware State Hornets (Delaware State University)",
    "Elon University": "Elon Phoenix (Elon University)",
    "Hampton University": "Hampton Pirates (Hampton University)",
    "University of Maine": "Maine Black Bears (University of Maine)",
    "Monmouth University": "Monmouth Hawks (Monmouth University)",
    "University of New Hampshire": "New Hampshire Wildcats (University of New Hampshire)",
    "North Carolina A&T State University": "North Carolina A&T Aggies (North Carolina A&T State University)",
    "University of Rhode Island": "Rhode Island Rams (University of Rhode Island)",
    "University of Richmond": "Richmond Spiders (University of Richmond)",
    "Stony Brook University": "Stony Brook Seawolves (Stony Brook University)",
    "Towson University": "Towson Tigers (Towson University)",
    "Villanova University": "Villanova Wildcats (Villanova University)",
    "William & Mary": "William & Mary Tribe (William & Mary)",
    
    // NEC
    "Central Connecticut State University": "Central Connecticut Blue Devils (Central Connecticut State University)",
    "Duquesne University": "Duquesne Dukes (Duquesne University)",
    "Long Island University": "LIU Sharks (Long Island University)",
    "Merrimack College": "Merrimack Warriors (Merrimack College)",
    "Robert Morris University": "Robert Morris Colonials (Robert Morris University)",
    "Sacred Heart University": "Sacred Heart Pioneers (Sacred Heart University)",
    "Stonehill College": "Stonehill Skyhawks (Stonehill College)",
    "Wagner College": "Wagner Seahawks (Wagner College)",
    
    // Pioneer Football League
    "Butler University": "Butler Bulldogs (Butler University)",
    "Davidson College": "Davidson Wildcats (Davidson College)",
    "University of Dayton": "Dayton Flyers (University of Dayton)",
    "Drake University": "Drake Bulldogs (Drake University)",
    "Marist College": "Marist Red Foxes (Marist College)",
    "Morehead State University": "Morehead State Eagles (Morehead State University)",
    "Presbyterian College": "Presbyterian Blue Hose (Presbyterian College)",
    "University of San Diego": "San Diego Toreros (University of San Diego)",
    "University of St. Thomas": "St. Thomas Tommies (University of St. Thomas)",
    "Stetson University": "Stetson Hatters (Stetson University)",
    "Valparaiso University": "Valparaiso Beacons (Valparaiso University)",
    
    // MVFC
    "Illinois State University": "Illinois State Redbirds (Illinois State University)",
    "Indiana State University": "Indiana State Sycamores (Indiana State University)",
    "Missouri State University": "Missouri State Bears (Missouri State University)",
    "Murray State University": "Murray State Racers (Murray State University)",
    "University of North Dakota": "North Dakota Fighting Hawks (University of North Dakota)",
    "University of Northern Iowa": "Northern Iowa Panthers (University of Northern Iowa)",
    "Southern Illinois University": "Southern Illinois Salukis (Southern Illinois University)",
    "Western Illinois University": "Western Illinois Leathernecks (Western Illinois University)",
    "Youngstown State University": "Youngstown State Penguins (Youngstown State University)",
    
    // Big Sky
    "Cal Poly": "Cal Poly Mustangs (Cal Poly)",
    "Idaho State University": "Idaho State Bengals (Idaho State University)",
    "University of Idaho": "Idaho Vandals (University of Idaho)",
    "Northern Arizona University": "Northern Arizona Lumberjacks (Northern Arizona University)",
    "University of Northern Colorado": "Northern Colorado Bears (University of Northern Colorado)",
    "Portland State University": "Portland State Vikings (Portland State University)",
    "Sacramento State University": "Sacramento State Hornets (Sacramento State University)",
    "University of California, Davis": "UC Davis Aggies (University of California, Davis)",
    
    // MEAC
    "Howard University": "Howard Bison (Howard University)",
    "Morgan State University": "Morgan State Bears (Morgan State University)",
    "Norfolk State University": "Norfolk State Spartans (Norfolk State University)",
    "North Carolina Central University": "North Carolina Central Eagles (North Carolina Central University)",
    "South Carolina State University": "South Carolina State Bulldogs (South Carolina State University)",
    
    // Southland
    "Houston Christian University": "Houston Christian Huskies (Houston Christian University)",
    "Lamar University": "Lamar Cardinals (Lamar University)",
    "Nicholls State University": "Nicholls Colonels (Nicholls State University)",
    "Northwestern State University": "Northwestern State Demons (Northwestern State University)",
    "Southeastern Louisiana University": "Southeastern Louisiana Lions (Southeastern Louisiana University)",
    "Texas A&M University-Commerce": "Texas A&M-Commerce Lions (Texas A&M University-Commerce)",
    "University of the Incarnate Word": "Incarnate Word Cardinals (University of the Incarnate Word)",
    
    // OVC
    "Eastern Illinois University": "Eastern Illinois Panthers (Eastern Illinois University)",
    "University of Southern Indiana": "Southern Indiana Screaming Eagles (University of Southern Indiana)",
    "Tennessee State University": "Tennessee State Tigers (Tennessee State University)",
    "Tennessee Tech University": "Tennessee Tech Golden Eagles (Tennessee Tech University)",
    "University of Tennessee at Martin": "UT Martin Skyhawks (University of Tennessee at Martin)",
    
    // Big South-OVC
    "Charleston Southern University": "Charleston Southern Buccaneers (Charleston Southern University)",
    "Gardner-Webb University": "Gardner-Webb Runnin' Bulldogs (Gardner-Webb University)",
    
    // SWAC
    "Alabama A&M University": "Alabama A&M Bulldogs (Alabama A&M University)",
    "Alabama State University": "Alabama State Hornets (Alabama State University)",
    "Alcorn State University": "Alcorn State Braves (Alcorn State University)",
    "University of Arkansas–Pine Bluff": "Arkansas–Pine Bluff Golden Lions (University of Arkansas–Pine Bluff)",
    "Bethune-Cookman University": "Bethune-Cookman Wildcats (Bethune-Cookman University)",
    "Florida A&M University": "Florida A&M Rattlers (Florida A&M University)",
    "Grambling State University": "Grambling State Tigers (Grambling State University)",
    "Jackson State University": "Jackson State Tigers (Jackson State University)",
    "Mississippi Valley State University": "Mississippi Valley State Delta Devils (Mississippi Valley State University)",
    "Prairie View A&M University": "Prairie View A&M Panthers (Prairie View A&M University)",
    "Southern University and A&M College": "Southern Jaguars (Southern University and A&M College)",
    "Texas Southern University": "Texas Southern Tigers (Texas Southern University)",
    
    // WAC
    "Abilene Christian University": "Abilene Christian Wildcats (Abilene Christian University)",
    "Stephen F. Austin State University": "Stephen F. Austin Lumberjacks (Stephen F. Austin State University)",
    "Southern Utah University": "Southern Utah Thunderbirds (Southern Utah University)",
    "Utah Tech University": "Utah Tech Trailblazers (Utah Tech University)",
    
    // Independents (FCS)
    "University of Massachusetts Amherst": "UMass Minutemen (University of Massachusetts Amherst)",
    "Kennesaw State University": "Kennesaw State Owls (Kennesaw State University)",

    // D3 Schools
    "Amherst College": "Amherst Mammoths (Amherst College)",
    "Williams College": "Williams Ephs (Williams College)",
    "Middlebury College": "Middlebury Panthers (Middlebury College)",
    "Tufts University": "Tufts Jumbos (Tufts University)",
    "Washington University in St. Louis": "WashU Bears (Washington University in St. Louis)",
    "Carnegie Mellon University": "Carnegie Mellon Tartans (Carnegie Mellon University)",
    "Case Western Reserve University": "Case Western Reserve Spartans (Case Western Reserve University)",
    "University of Chicago": "Chicago Maroons (University of Chicago)",
    "Emory University": "Emory Eagles (Emory University)",
    "New York University": "NYU Violets (New York University)",
    "University of Rochester": "Rochester Yellowjackets (University of Rochester)",
    "University of Wisconsin-Whitewater": "UW-Whitewater Warhawks (University of Wisconsin-Whitewater)",
    "University of Wisconsin-La Crosse": "UW-La Crosse Eagles (University of Wisconsin-La Crosse)",
    "University of Wisconsin-Oshkosh": "UW-Oshkosh Titans (University of Wisconsin-Oshkosh)",
    "Washington and Lee University": "Washington and Lee Generals (Washington and Lee University)",
    "Randolph-Macon College": "Randolph-Macon Yellow Jackets (Randolph-Macon College)",
    "Johns Hopkins University": "Johns Hopkins Blue Jays (Johns Hopkins University)",
    "Franklin & Marshall College": "Franklin & Marshall Diplomats (Franklin & Marshall College)",
    "Muhlenberg College": "Muhlenberg Mules (Muhlenberg College)",
    "Union College (NY)": "Union Dutchmen (Union College (NY))",
    "Rensselaer Polytechnic Institute": "RPI Engineers (Rensselaer Polytechnic Institute)",
    "Trinity College (CT)": "Trinity Bantams (Trinity College (CT))",
    "Wesleyan University": "Wesleyan Cardinals (Wesleyan University)",
    "Chapman University": "Chapman Panthers (Chapman University)",
    "University of Mount Union": "Mount Union Purple Raiders (University of Mount Union)",
    "St. John's University (MN)": "St. John's Johnnies (St. John's University (MN))",
    "Linfield University": "Linfield Wildcats (Linfield University)",
    "Hardin-Simmons University": "Hardin-Simmons Cowboys (Hardin-Simmons University)",
  };
  
  return schoolNameMappings[schoolName] || schoolName;
};

// Divisions sorted from highest to lowest level
const divisions = ["All", "FBS", "FCS", "D2", "D3", "JUCO"];

// New Component for the Target List
function TargetList({ schools, targetedSchools, onRemove, limitReached }) {
  const myTargets = useMemo(() => {
    const targetedIds = targetedSchools.map(ts => ts.school_id);
    return schools.filter(s => targetedIds.includes(s.id));
  }, [schools, targetedSchools]);

  return (
    <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/60 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
            <Star className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            My Target List
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myTargets.length > 0 ? (
            myTargets.map(school => (
              <div key={school.id} className="p-4 bg-white rounded-xl border-2 border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-900">{getFormattedSchoolName(school.name)}</p>
                  <p className="text-sm text-slate-500 font-medium">{school.division}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onRemove(school.id)} disabled={limitReached} className="hover:bg-red-50">
                  <Trash2 className={`w-4 h-4 ${limitReached ? 'text-gray-400' : 'text-red-500 hover:text-red-600'}`} />
                </Button>
              </div>
            ))
        ) : (
            <div className="col-span-full text-center py-8 text-slate-600">
                <Star className="w-12 h-12 mx-auto mb-3 text-blue-300" />
                <p className="font-medium">Your target schools will appear here once you add them.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

function AISuggestions({ athlete, user, onTargetSchool }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const isPro = user?.plan === 'unlimited' || user?.plan === 'core';

    const getSuggestions = async () => {
        if (!athlete || !isPro) return;
        setLoading(true);
        const prompt = `
            Act as an expert college recruiting advisor. Analyze this athlete's profile and perform a web search to check for any existing recruiting buzz on platforms like 247Sports, Rivals, etc.
            
            **Athlete Profile:**
            - Name: ${athlete.first_name} ${athlete.last_name}
            - Sport: ${athlete.sport || 'N/A'}
            - Position: ${athlete.position || 'N/A'}
            - Graduation Year: ${athlete.graduation_year || 'N/A'}
            - Academics: GPA: ${athlete.gpa || 'N/A'}, SAT: ${athlete.sat_score || 'N/A'}
            - Key Metrics: Height: ${athlete.height ? `${athlete.height / 12}'${athlete.height % 12}"` : 'N/A'}, Weight: ${athlete.weight ? `${athlete.weight} lbs` : 'N/A'}, 40-time: ${athlete.forty_time ? `${athlete.forty_time}s` : 'N/A'}
            - Target Levels: ${athlete.target_levels?.join(', ') || 'Any'}
            
            Based on the web search and the athlete's academic and athletic profile, suggest 5 highly suitable schools. Provide a detailed, insightful reason for each recommendation, referencing the athlete's profile and any online data you found.
            
            Return a JSON object with a single key "schools" which is an array of objects. Each object must have "name", "division", and a detailed "reason".
        `;
        try {
            const res = await InvokeLLM({ 
                prompt, 
                add_context_from_internet: true,
                response_json_schema: { type: "object", properties: { schools: { type: "array", items: { type: "object", properties: { name: { type: "string" }, division: { type: "string" }, reason: { type: "string" } }, required: ["name", "division", "reason"] } } } } 
            });
            if (res && res.schools) {
                setSuggestions(res.schools);
            }
        } catch (error) {
            console.error("AI suggestion error:", error);
        }
        setLoading(false);
    }

    return (
        <Card className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200/60 shadow-lg overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-md">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        AI-Powered Recommendations
                      </span>
                    </div>
                    <Badge variant={isPro ? "default" : "secondary"} className={isPro ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0" : ""}>
                      {user?.plan === 'unlimited' ? "Unlimited Access" : isPro ? "Pro Feature" : "Pro Plan Required"}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!isPro ? (
                     <div className="text-center py-6 bg-purple-100/50 rounded-lg">
                        <Lock className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                        <p className="font-semibold text-purple-800">Unlock Advanced Recruiting Insights</p>
                        <p className="text-sm text-purple-600 mb-4">Upgrade to get AI-powered school suggestions based on your profile and real-time recruiting data.</p>
                        <Link to={createPageUrl("Upgrade")}>
                            <Button>Upgrade Now</Button>
                        </Link>
                    </div>
                ) : suggestions.length === 0 && !loading && (
                    <div className="text-center">
                        <p className="mb-4 text-slate-600">Get a list of schools that match your athletic and academic profile.</p>
                        <Button onClick={getSuggestions}><Sparkles className="w-4 h-4 mr-2" />Generate Suggestions</Button>
                    </div>
                )}
                {loading && <div className="text-center py-4">Analyzing your profile and searching the web...</div>}
                {isPro && suggestions.length > 0 && (
                    <div className="space-y-4">
                        {suggestions.map((school, i) => (
                            <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-sm">
                                <p className="font-semibold text-slate-900 dark:text-slate-100">{getFormattedSchoolName(school.name)} <Badge variant="secondary">{school.division}</Badge></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 italic">"{school.reason}"</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function Schools() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [targetedSchools, setTargetedSchools] = useState([]);
  const [athlete, setAthlete] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedConference, setSelectedConference] = useState("All");

  // Guided Tour
  const { isStepActive, completeCurrentStep, skipTour, TOUR_STEPS } = useGuidedTour();
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Show guide if user is on schools step
    if (isStepActive(TOUR_STEPS.SCHOOLS)) {
      setShowGuide(true);
    }
  }, [isStepActive, TOUR_STEPS.SCHOOLS]);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      const athleteData = await Athlete.filter({ created_by: currentUser.email });
      const currentAthlete = athleteData[0] || null;

      // Load ALL schools from School entity (no limit)
      const allSchoolData = await School.all();

      // Load targeted schools from Supabase with RLS
      let targetedData = [];
      if (currentAthlete) {
        const { data: supabaseUser } = await supabase.auth.getUser();
        if (supabaseUser?.user) {
          const { data, error } = await supabase
            .from('targeted_schools')
            .select('*')
            .eq('user_id', supabaseUser.user.id);

          if (error) {
            console.error('Error loading targeted schools:', error);
          } else {
            targetedData = data || [];
          }
        }
      }

      // Show all schools (no filter needed - show schools with or without academic_ranking)
      setSchools(allSchoolData);
      setAthlete(currentAthlete);
      setTargetedSchools(targetedData);

      if (currentAthlete?.target_levels?.length > 0) {
        setSelectedDivision(currentAthlete.target_levels[0]);
      }

    } catch (error) {
      console.error("Error loading schools data:", error);
    }
    setLoading(false);
  };

  const states = useMemo(() => {
    const uniqueStates = [...new Set(schools.map(s => s.state))].sort();
    return ["All", ...uniqueStates];
  }, [schools]);

  const conferences = useMemo(() => {
    const uniqueConferences = [...new Set(schools.map(s => s.conference))].sort();
    return ["All", ...uniqueConferences];
  }, [schools]);

  const filteredSchools = useMemo(() => {
    // Deduplicate schools by name before filtering
    const uniqueSchools = schools.filter((school, index, self) =>
        index === self.findIndex((s) => (
            s.name === school.name
        ))
    );
    
    return uniqueSchools.filter(school => {
      const formattedName = getFormattedSchoolName(school.name);
      const searchMatch = formattedName.toLowerCase().includes(searchTerm.toLowerCase());
      const divisionMatch = selectedDivision === "All" || school.division === selectedDivision;
      const stateMatch = selectedState === "All" || school.state === selectedState;
      const conferenceMatch = selectedConference === "All" || school.conference === selectedConference;
      return searchMatch && divisionMatch && stateMatch && conferenceMatch;
    });
  }, [schools, searchTerm, selectedDivision, selectedState, selectedConference]);

  const handleTargetSchool = async (schoolId) => {
    if (!athlete) {
        alert("Please create your athlete profile first to target schools.");
        return;
    }

    const isCurrentlyTargeted = targetedSchools.some(ts => ts.school_id === schoolId);
    const plan = user?.plan || 'free';

    try {
        if (isCurrentlyTargeted) {
            // Prevent removal if free plan is at limit (lock the 3 schools)
            if (plan === 'free' && targetedSchools.length >= 3) {
              alert(
                "🔒 Your 3 target schools are locked on the Free plan.\n\n" +
                "Upgrade to unlock the ability to change your target schools!\n\n" +
                "Click 'Upgrade Plan' in the sidebar to unlock more flexibility."
              );
              return;
            }

            // Use RPC to remove target school (server-side)
            const { data, error } = await supabase.rpc('remove_target_school', {
              p_school_id: schoolId
            });

            if (error) {
              console.error("Error removing target school:", error);
              alert(`Error removing school: ${error.message}`);
              return;
            }

            console.log('[Schools] Removed target school:', data);
        } else {
            // Use RPC to add target school (server-side limit enforcement)
            const { data, error } = await supabase.rpc('add_target_school', {
              p_school_id: schoolId
            });

            if (error) {
              console.error("Error adding target school:", error);

              // Check if limit was reached (server-side enforcement)
              if (error.message.includes('TARGET_LIMIT_REACHED')) {
                const plan = user?.plan || 'free';
                let limitMessage = "Free plan is limited to 3 target schools.";

                if (plan === 'starter') {
                  limitMessage = "Starter plan is limited to 7 target schools.";
                } else if (plan === 'core') {
                  limitMessage = "Core plan is limited to 15 target schools.";
                }

                alert(
                  `${limitMessage}\n\n` +
                  `Upgrade to add more schools!\n\n` +
                  `Click "Upgrade Plan" in the sidebar to unlock more target schools.`
                );
                return;
              }

              alert(`Error adding school: ${error.message}`);
              return;
            }

            console.log('[Schools] Added target school:', data);
        }

        // Refresh the list of targeted schools from Supabase
        const { data: supabaseUser } = await supabase.auth.getUser();
        let updatedTargetedData = [];
        if (supabaseUser?.user) {
          const { data, error } = await supabase
            .from('targeted_schools')
            .select('*')
            .eq('user_id', supabaseUser.user.id);

          if (error) {
            console.error('Error refreshing targeted schools:', error);
          } else {
            updatedTargetedData = data || [];
            setTargetedSchools(updatedTargetedData);
          }
        }

        // If in guided tour and this is the first school added, advance to next step
        if (isStepActive(TOUR_STEPS.SCHOOLS) && updatedTargetedData.length === 1 && !isCurrentlyTargeted) {
          await completeCurrentStep();
          setShowGuide(false);
          // Redirect to Coach Contacts page
          setTimeout(() => {
            navigate(createPageUrl("CoachContacts"));
          }, 1500);
        }

    } catch (error) {
        console.error("Error targeting school:", error);
        alert(`Unexpected error: ${error.message}`);
    }
  };

  const conferenceColors = {
    // FBS Conferences
    "American Athletic Conference": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    "American Athletic": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    "American": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    "SEC": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
    "ACC": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
    "Big Ten": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
    "Big 12": "bg-blue-200 text-blue-900 border-blue-300 dark:bg-blue-800/30 dark:text-blue-200 dark:border-blue-600",
    "Pac-12": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    "Pac 12": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    "Mountain West": "bg-cyan-200 text-cyan-900 border-cyan-300 dark:bg-cyan-800/30 dark:text-cyan-200 dark:border-cyan-600",
    "MWC": "bg-cyan-200 text-cyan-900 border-cyan-300 dark:bg-cyan-800/30 dark:text-cyan-200 dark:border-cyan-600",
    "Conference USA": "bg-orange-200 text-orange-900 border-orange-300 dark:bg-orange-800/30 dark:text-orange-200 dark:border-orange-600",
    "Sun Belt": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700",
    "Mid-American Conference": "bg-red-200 text-red-900 border-red-300 dark:bg-red-800/30 dark:text-red-200 dark:border-red-600",
    "Mid-American": "bg-red-200 text-red-900 border-red-300 dark:bg-red-800/30 dark:text-red-200 dark:border-red-600",
    "Mid-American (MAC)": "bg-red-200 text-red-900 border-red-300 dark:bg-red-800/30 dark:text-red-200 dark:border-red-600",
    "MAC": "bg-red-200 text-red-900 border-red-300 dark:bg-red-800/30 dark:text-red-200 dark:border-red-600",

    // FCS Conferences
    "Ivy League": "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
    "Patriot": "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700",
    "Patriot League": "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700",
    "Missouri Valley": "bg-indigo-200 text-indigo-900 border-indigo-300 dark:bg-indigo-800/30 dark:text-indigo-200 dark:border-indigo-600",
    "MVFC": "bg-indigo-200 text-indigo-900 border-indigo-300 dark:bg-indigo-800/30 dark:text-indigo-200 dark:border-indigo-600",
    "Big Sky": "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700",
    "CAA": "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700",
    "Southern Conference": "bg-yellow-200 text-yellow-900 border-yellow-300 dark:bg-yellow-800/30 dark:text-yellow-200 dark:border-yellow-600",
    "SoCon": "bg-yellow-200 text-yellow-900 border-yellow-300 dark:bg-yellow-800/30 dark:text-yellow-200 dark:border-yellow-600",
    "Southland": "bg-blue-300 text-blue-900 border-blue-400 dark:bg-blue-700/30 dark:text-blue-200 dark:border-blue-500",
    "Southland Conference": "bg-blue-300 text-blue-900 border-blue-400 dark:bg-blue-700/30 dark:text-blue-200 dark:border-blue-500",
    "Pioneer": "bg-lime-200 text-lime-900 border-lime-300 dark:bg-lime-800/30 dark:text-lime-200 dark:border-lime-600",
    "NEC": "bg-sky-300 text-sky-900 border-sky-400 dark:bg-sky-700/30 dark:text-sky-200 dark:border-sky-500",
    "Big South-OVC": "bg-rose-300 text-rose-900 border-rose-400 dark:bg-rose-700/30 dark:text-rose-200 dark:border-rose-500",
    "MEAC": "bg-amber-300 text-amber-900 border-amber-400 dark:bg-amber-700/30 dark:text-amber-200 dark:border-amber-500",
    "SWAC": "bg-green-200 text-green-900 border-green-300 dark:bg-green-800/30 dark:text-green-200 dark:border-green-600",

    // D2 Conferences
    "GLIAC": "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700",
    "Gulf South": "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
    "GSC": "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
    "PSAC": "bg-purple-200 text-purple-900 border-purple-300 dark:bg-purple-800/30 dark:text-purple-200 dark:border-purple-600",
    "RMAC": "bg-amber-200 text-amber-900 border-amber-300 dark:bg-amber-800/30 dark:text-amber-200 dark:border-amber-600",
    "Rocky Mountain Athletic Conference": "bg-amber-200 text-amber-900 border-amber-300 dark:bg-amber-800/30 dark:text-amber-200 dark:border-amber-600",
    "GAC": "bg-rose-200 text-rose-900 border-rose-300 dark:bg-rose-800/30 dark:text-rose-200 dark:border-rose-600",
    "Great American": "bg-rose-200 text-rose-900 border-rose-300 dark:bg-rose-800/30 dark:text-rose-200 dark:border-rose-600",
    "GLVC": "bg-teal-300 text-teal-900 border-teal-400 dark:bg-teal-700/30 dark:text-teal-200 dark:border-teal-500",
    "CIAA": "bg-orange-300 text-orange-900 border-orange-400 dark:bg-orange-700/30 dark:text-orange-200 dark:border-orange-500",
    "SIAC": "bg-purple-300 text-purple-900 border-purple-400 dark:bg-purple-700/30 dark:text-purple-200 dark:border-purple-500",
    "MEC": "bg-blue-400 text-blue-950 border-blue-500 dark:bg-blue-700/40 dark:text-blue-100 dark:border-blue-400",
    "SAC": "bg-red-300 text-red-900 border-red-400 dark:bg-red-700/30 dark:text-red-200 dark:border-red-500",
    "GMAC": "bg-fuchsia-200 text-fuchsia-900 border-fuchsia-300 dark:bg-fuchsia-800/30 dark:text-fuchsia-200 dark:border-fuchsia-600",
    "MIAA": "bg-violet-300 text-violet-900 border-violet-400 dark:bg-violet-700/30 dark:text-violet-200 dark:border-violet-500",
    "NSIC": "bg-indigo-300 text-indigo-900 border-indigo-400 dark:bg-indigo-700/30 dark:text-indigo-200 dark:border-indigo-500",
    "Lone Star": "bg-yellow-300 text-yellow-900 border-yellow-400 dark:bg-yellow-700/30 dark:text-yellow-200 dark:border-yellow-500",
    "GNAC": "bg-emerald-200 text-emerald-900 border-emerald-300 dark:bg-emerald-800/30 dark:text-emerald-200 dark:border-emerald-600",
    "Great Midwest": "bg-sky-400 text-sky-950 border-sky-500 dark:bg-sky-700/40 dark:text-sky-100 dark:border-sky-400",
    "Northeast-10": "bg-slate-300 text-slate-900 border-slate-400 dark:bg-slate-700/30 dark:text-slate-200 dark:border-slate-500",
    "Conference Carolinas": "bg-cyan-300 text-cyan-900 border-cyan-400 dark:bg-cyan-700/30 dark:text-cyan-200 dark:border-cyan-500",
    "SSAC*": "bg-pink-300 text-pink-900 border-pink-400 dark:bg-pink-700/30 dark:text-pink-200 dark:border-pink-500",

    // D3 Conferences
    "NESCAC": "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700",
    "OAC": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
    "WIAC": "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/30 dark:text-lime-300 dark:border-lime-700",
    "UAA": "bg-violet-200 text-violet-900 border-violet-300 dark:bg-violet-800/30 dark:text-violet-200 dark:border-violet-600",
    "ODAC": "bg-pink-200 text-pink-900 border-pink-300 dark:bg-pink-800/30 dark:text-pink-200 dark:border-pink-600",
    "CCIW": "bg-sky-200 text-sky-900 border-sky-300 dark:bg-sky-800/30 dark:text-sky-200 dark:border-sky-600",
    "MASCAC": "bg-teal-200 text-teal-900 border-teal-300 dark:bg-teal-800/30 dark:text-teal-200 dark:border-teal-600",
    "NCAC": "bg-green-300 text-green-900 border-green-400 dark:bg-green-700/30 dark:text-green-200 dark:border-green-500",
    "NEWMAC": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
    "SCAC": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
    "SAA": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    "Centennial": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700",
    "Empire 8": "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700",
    "MIAC": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
    "NWC": "bg-emerald-200 text-emerald-900 border-emerald-300 dark:bg-emerald-800/30 dark:text-emerald-200 dark:border-emerald-600",
    "HCAC": "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700",
    "PAC": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
    "UMAC": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 dark:border-fuchsia-700",
    "NACC": "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700",
    "NCFC": "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700",
    "Landmark": "bg-slate-200 text-slate-900 border-slate-300 dark:bg-slate-800/30 dark:text-slate-200 dark:border-slate-600",
    "Liberty": "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700",
    "USA South": "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700",
    "SCIAC": "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700",
    "United Athletic": "bg-lime-200 text-lime-900 border-lime-300 dark:bg-lime-800/30 dark:text-lime-200 dark:border-lime-600",
    "NJAC": "bg-orange-200 text-orange-900 border-orange-300 dark:bg-orange-800/30 dark:text-orange-200 dark:border-orange-600",
    "WSC": "bg-green-200 text-green-900 border-green-300 dark:bg-green-800/30 dark:text-green-200 dark:border-green-600",
    "GSFC": "bg-blue-200 text-blue-900 border-blue-300 dark:bg-blue-800/30 dark:text-blue-200 dark:border-blue-600",
    "NIFC": "bg-red-200 text-red-900 border-red-300 dark:bg-red-800/30 dark:text-red-200 dark:border-red-600",

    // JUCO Conferences
    "MACCC": "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700",
    "ICCAC": "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700",
    "NJCAA": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 dark:border-fuchsia-700",
    "KJCCC": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
    "SWJCFC": "bg-yellow-200 text-yellow-900 border-yellow-300 dark:bg-yellow-800/30 dark:text-yellow-200 dark:border-yellow-600",
    "MCAC": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    "WSFL": "bg-indigo-200 text-indigo-900 border-indigo-300 dark:bg-indigo-800/30 dark:text-indigo-200 dark:border-indigo-600",
    "NORCAL": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700",

    // CCCAA Conferences (California Community Colleges)
    "CCCAA-B6": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    "CCCAA-CC": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
    "CCCAA-GV": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    "CCCAA-IE": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
    "CCCAA-NC": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
    "CCCAA-SC": "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700",
    "CCCAA–B6": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    "CCCAA–GV": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    "CCCAA–NC": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
    "CCCAA–PC": "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700",
    "CCCAA–SC": "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700",

    // SCFA Conferences (Southern California Football Association)
    "SCFA-NDA": "bg-orange-200 text-orange-900 border-orange-300 dark:bg-orange-800/30 dark:text-orange-200 dark:border-orange-600",
    "SCFA-NDC": "bg-amber-200 text-amber-900 border-amber-300 dark:bg-amber-800/30 dark:text-amber-200 dark:border-amber-600",
    "SCFA–NC": "bg-rose-200 text-rose-900 border-rose-300 dark:bg-rose-800/30 dark:text-rose-200 dark:border-rose-600",
    "SCFA–SC": "bg-sky-200 text-sky-900 border-sky-300 dark:bg-sky-800/30 dark:text-sky-200 dark:border-sky-600",

    // Other Conferences
    "ARC": "bg-cyan-200 text-cyan-900 border-cyan-300 dark:bg-cyan-800/30 dark:text-cyan-200 dark:border-cyan-600",
    "ASC": "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/30 dark:text-lime-300 dark:border-lime-700",
    "B8": "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
    "CCC": "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700",
    "CNE": "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700",
    "LEC": "bg-fuchsia-200 text-fuchsia-900 border-fuchsia-300 dark:bg-fuchsia-800/30 dark:text-fuchsia-200 dark:border-fuchsia-600",

    // Special
    "Independent": "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600",
    "default": "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700/30 dark:text-slate-300 dark:border-slate-600"
  };

  const getConferenceLogo = (conference) => {
    const logoMap = {
      // FBS Conferences
      "SEC": "⚔️",
      "ACC": "🏟️",
      "American Athletic Conference": "🇺🇸",
      "American Athletic": "🇺🇸",
      "American": "🇺🇸",
      "Big Ten": "🌽",
      "Big 12": "🌟",
      "Pac-12": "🌊",
      "Pac 12": "🌊",
      "Mountain West": "⛰️",
      "MWC": "⛰️",
      "Conference USA": "🏜️",
      "Sun Belt": "☀️",
      "Mid-American Conference": "🦅",
      "Mid-American": "🦅",
      "Mid-American (MAC)": "🦅",
      "MAC": "🦅",

      // FCS Conferences
      "Ivy League": "🎓",
      "Patriot": "🦅",
      "Patriot League": "🦅",
      "Missouri Valley": "🌾",
      "MVFC": "🌾",
      "Big Sky": "🦌",
      "CAA": "🌊",
      "Southern Conference": "🌲",
      "SoCon": "🌲",
      "Southland": "🤠",
      "Southland Conference": "🤠",
      "Pioneer": "🎯",
      "NEC": "🗻",
      "Big South-OVC": "🌳",
      "MEAC": "🦁",
      "SWAC": "🏛️",

      // D2 Conferences
      "GLIAC": "⛵",
      "Gulf South": "🏖️",
      "GSC": "🏖️",
      "PSAC": "🗽",
      "RMAC": "🏔️",
      "Rocky Mountain Athletic Conference": "🏔️",
      "GAC": "🌾",
      "Great American": "🌾",
      "GLVC": "🏞️",
      "CIAA": "📚",
      "SIAC": "🦉",
      "MEC": "⛏️",
      "SAC": "🌄",
      "GMAC": "🌉",
      "MIAA": "🌻",
      "NSIC": "❄️",
      "Lone Star": "⭐",
      "GNAC": "🌲",
      "Great Midwest": "🌉",
      "Northeast-10": "🦞",
      "Conference Carolinas": "🌺",
      "SSAC*": "🦩",

      // D3 Conferences
      "NESCAC": "🌲",
      "OAC": "🌾",
      "WIAC": "🧀",
      "UAA": "📚",
      "ODAC": "🐴",
      "CCIW": "🏭",
      "MASCAC": "🦞",
      "NCAC": "🌿",
      "NEWMAC": "🎓",
      "SCAC": "🌵",
      "SAA": "🦅",
      "Centennial": "⚡",
      "Empire 8": "🏔️",
      "MIAC": "🦆",
      "NWC": "🌲",
      "HCAC": "🏛️",
      "PAC": "🌴",
      "UMAC": "🌊",
      "NACC": "🦌",
      "NCFC": "🌿",
      "Landmark": "🗿",
      "Liberty": "🗽",
      "USA South": "🌳",
      "SCIAC": "🌅",
      "United Athletic": "🎯",
      "NJAC": "🏙️",
      "WSC": "🌄",
      "GSFC": "⚓",
      "NIFC": "🌾",

      // JUCO Conferences
      "MACCC": "🎸",
      "ICCAC": "🌽",
      "NJCAA": "🎯",
      "KJCCC": "🌻",
      "SWJCFC": "🤠",
      "MCAC": "🦬",
      "WSFL": "🌊",
      "NORCAL": "🌉",

      // CCCAA Conferences (California Community Colleges)
      "CCCAA-B6": "🏖️",
      "CCCAA-CC": "🎬",
      "CCCAA-GV": "🍇",
      "CCCAA-IE": "🏜️",
      "CCCAA-NC": "🌲",
      "CCCAA-SC": "🌴",
      "CCCAA–B6": "🏖️",
      "CCCAA–GV": "🍇",
      "CCCAA–NC": "🌲",
      "CCCAA–PC": "🌊",
      "CCCAA–SC": "🌴",

      // SCFA Conferences (Southern California Football Association)
      "SCFA-NDA": "🏈",
      "SCFA-NDC": "🏈",
      "SCFA–NC": "🏈",
      "SCFA–SC": "🏈",

      // Other Conferences
      "ARC": "🏔️",
      "ASC": "🌟",
      "B8": "8️⃣",
      "CCC": "🎓",
      "CNE": "🌊",
      "LEC": "📖",

      // Special
      "Independent": "⭐"
    };
    return logoMap[conference] || "🏆";
  };

  const tierDefinitions = {
    "Tier 1 – Most Competitive": "Elite academic institutions with extremely high selectivity, rigorous academics, and prestigious reputations (e.g., Ivy League level)",
    "Tier 2 – Highly Competitive": "Very selective schools with high academic standards, strong reputations, and competitive admission processes",
    "Tier 3 – Competitive": "Solid academic programs with moderate selectivity, good reputation, and reasonable admission requirements", 
    "Tier 4 – Less Competitive": "Generally accessible schools with higher acceptance rates but still maintaining academic standards",
    "Tier 5 – Least Competitive": "Open enrollment or minimally selective schools with the most accessible admission requirements",
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 text-xl text-slate-700">Loading schools...</div>;
  }
  
  const plan = user?.plan || 'free';
  
  let limitReachedForTargetList = false;
  if (plan === 'core') {
      limitReachedForTargetList = targetedSchools.length >= 15;
  } else if (plan === 'starter') {
      limitReachedForTargetList = targetedSchools.length >= 7;
  } else if (plan === 'free') {
      limitReachedForTargetList = targetedSchools.length >= 3;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">Target Schools</h1>
              <p className="text-slate-600 text-lg">
                Find and select schools that match your goals
                {plan === 'unlimited' && <span className="ml-2 text-purple-600 font-medium">✨ Unlimited Access</span>}
              </p>
            </div>
          </div>

          {/* My Target List - Always shown at top */}
          <TargetList schools={schools} targetedSchools={targetedSchools} onRemove={handleTargetSchool} limitReached={limitReachedForTargetList} />
          
          {/* AI Suggestions */}
          <AISuggestions athlete={athlete} user={user} onTargetSchool={handleTargetSchool} />
          
          {/* Filters */}
          <Card className="mb-8">
              <CardHeader>
                  <CardTitle>Search Schools</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                          placeholder="Search by school name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                      />
                  </div>
                  <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                      <SelectTrigger>
                          <SelectValue placeholder="Filter by division..." />
                      </SelectTrigger>
                      <SelectContent>
                          {divisions.map(div => <SelectItem key={div} value={div}>{div}</SelectItem>)}
                      </SelectContent>
                  </Select>
                  <Select value={selectedConference} onValueChange={setSelectedConference}>
                      <SelectTrigger>
                          <SelectValue placeholder="Filter by conference..." />
                      </SelectTrigger>
                      <SelectContent>
                          {conferences.map(conf => <SelectItem key={conf} value={conf}>{conf}</SelectItem>)}
                      </SelectContent>
                  </Select>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger>
                          <SelectValue placeholder="Filter by state..." />
                      </SelectTrigger>
                      <SelectContent>
                          {states.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </CardContent>
          </Card>

          {/* Schools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map(school => {
                  const isTargeted = targetedSchools.some(ts => ts.school_id === school.id);
                  let limitReached = false;
                  
                  if (!isTargeted) {
                      if (plan === 'core' && targetedSchools.length >= 15) limitReached = true;
                      else if (plan === 'starter' && targetedSchools.length >= 7) limitReached = true;
                      else if (plan === 'free' && targetedSchools.length >= 3) limitReached = true;
                  }

                  return (
                      <Card key={school.id} className={`flex flex-col hover:shadow-lg transition-shadow overflow-hidden ${limitReached ? 'opacity-60' : ''}`}>
                          <CardHeader>
                              <div className="flex items-start justify-between gap-3">
                                  <div className="text-2xl pt-1 flex-shrink-0">{getConferenceLogo(school.conference)}</div>
                                  <div className="flex-1">
                                      <span className="block font-semibold">{getFormattedSchoolName(school.name)}</span>
                                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                                          <MapPin className="w-4 h-4" />
                                          <span>{school.city}, {school.state}</span>
                                      </div>
                                  </div>
                              </div>
                          </CardHeader>
                          <CardContent className="flex-grow">
                              <div className="space-y-3">
                                  <div className="flex flex-wrap gap-2">
                                      <Badge variant="secondary">{school.division}</Badge>
                                      <Badge className={conferenceColors[school.conference] || conferenceColors.default}>
                                          {school.conference?.replace("Conference", "").trim()}
                                      </Badge>
                                      {school.academic_ranking && ACADEMIC_TIERS[school.academic_ranking] && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Badge
                                                className={`cursor-help border ${ACADEMIC_TIERS[school.academic_ranking].color}`}
                                              >
                                                🎓 {ACADEMIC_TIERS[school.academic_ranking].label.split(' –')[0]}
                                              </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs">
                                              <p className="font-semibold">{ACADEMIC_TIERS[school.academic_ranking].label}</p>
                                              <p className="text-sm mt-1">{ACADEMIC_TIERS[school.academic_ranking].description}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                  </div>
                                  <div>
                                      {school.enrollment && (
                                          <p className="text-sm text-slate-600">
                                              📊 {school.enrollment.toLocaleString()} students
                                          </p>
                                      )}
                                  </div>
                              </div>
                          </CardContent>
                          <CardFooter>
                              <Button
                                  onClick={() => handleTargetSchool(school.id)}
                                  variant={isTargeted ? "secondary" : "default"}
                                  className="w-full"
                                  disabled={!athlete || limitReached}
                              >
                                  {limitReached ? <Lock className="w-4 h-4 mr-2" /> : isTargeted ? <CheckCircle className="w-4 h-4 mr-2" /> : 'Add to Target List'}
                              </Button>
                          </CardFooter>
                      </Card>
                  );
              })}
          </div>
        </div>
      </div>

      {/* Guided Tour */}
      <PageGuide
        isOpen={showGuide}
        onClose={() => {
          setShowGuide(false);
          skipTour();
        }}
        onNext={() => {
          // Scroll to search section
          document.querySelector('[class*="Search Schools"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
        title="Step 3: Add Your First Target School"
        description="Choose a school you're interested in and add it to your target list"
        steps={[
          { label: 'Complete Profile', completed: true },
          { label: 'Create Email', completed: true },
          { label: 'Add Target School', completed: false },
          { label: 'Add Coach Contact', completed: false },
          { label: 'Send First Email', completed: false },
          { label: 'View Responses', completed: false },
        ]}
        currentStep={2}
        nextButtonText="Scroll to Search"
      >
        <div className="space-y-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">How to find your target school:</p>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
            <li>🔍 <strong>Use the search bar</strong> - Type the school name to find it quickly</li>
            <li>📊 <strong>Filter by division</strong> - Choose FBS, FCS, D2, D3, or JUCO</li>
            <li>🗺️ <strong>Filter by state</strong> - Narrow down schools by location</li>
            <li>🏆 <strong>Filter by conference</strong> - Find schools in specific conferences</li>
            <li>⭐ <strong>Click "Add to Target List"</strong> - School will appear at the top</li>
          </ul>
          <div className="pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>💡 Tip:</strong> Start with schools that match your academic and athletic level. You can always add more later!
            </p>
          </div>
        </div>
      </PageGuide>
    </TooltipProvider>
  );
}
