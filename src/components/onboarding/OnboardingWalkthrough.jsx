import React, { useState, useEffect } from 'react';
import { User, Athlete, TargetedSchool, School } from '@/api/entities';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ArrowRight, Mail, UserCircle, GraduationCap, School as SchoolIcon, MessageSquare } from 'lucide-react';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to RecruitBridge!',
    description: 'Let\'s get you set up in just a few steps. This tour will show you how to connect with college coaches.',
    icon: CheckCircle2,
  },
  {
    id: 'profile',
    title: 'Create Your Profile',
    description: 'Tell us about yourself so coaches know who you are.',
    icon: UserCircle,
  },
  {
    id: 'school',
    title: 'Add Your First Target School',
    description: 'Choose a school you\'re interested in. You can add more later!',
    icon: SchoolIcon,
  },
  {
    id: 'demo-email',
    title: 'Send Your First Email',
    description: 'Let\'s send a practice email to Coach Sir to see how outreach works.',
    icon: Mail,
  },
  {
    id: 'response',
    title: 'Check Your Responses',
    description: 'See how the Response Center works when coaches reply to you.',
    icon: MessageSquare,
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Great job! You\'re ready to start reaching out to real coaches.',
    icon: GraduationCap,
  },
];

export default function OnboardingWalkthrough({ isOpen, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [classYear, setClassYear] = useState('');

  // School selection state
  const [schools, setSchools] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');

  // Demo email state
  const [demoEmailSent, setDemoEmailSent] = useState(false);
  const [demoResponseGenerated, setDemoResponseGenerated] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };

    if (isOpen) {
      loadUser();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load schools when we reach the school selection step
    if (currentStep === 2 && schools.length === 0) {
      loadSchools();
    }
  }, [currentStep, schools.length]);

  const loadSchools = async () => {
    try {
      const allSchools = await School.list();
      // Get first 50 schools for demo
      setSchools(allSchools.slice(0, 50));
    } catch (error) {
      console.error('Error loading schools:', error);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // Save profile before moving on
      await saveProfile();
    } else if (currentStep === 2) {
      // Save target school before moving on
      await saveTargetSchool();
    } else if (currentStep === 3) {
      // Send demo email
      await sendDemoEmail();
    } else if (currentStep === 4) {
      // Generate demo response
      await generateDemoResponse();
    }

    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as complete
      await completeOnboarding();
    }
  };

  const saveProfile = async () => {
    if (!firstName || !lastName || !classYear) {
      alert('Please fill out all fields');
      return;
    }

    setLoading(true);
    try {
      // Check if athlete profile already exists
      const existingAthletes = await Athlete.filter({ created_by: user.email });

      if (existingAthletes.length > 0) {
        // Update existing profile
        await Athlete.update(existingAthletes[0].id, {
          first_name: firstName,
          last_name: lastName,
          class_year: classYear,
        });
      } else {
        // Create new profile
        await Athlete.create({
          first_name: firstName,
          last_name: lastName,
          class_year: classYear,
          created_by: user.email,
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    }
    setLoading(false);
  };

  const saveTargetSchool = async () => {
    if (!selectedSchoolId) {
      alert('Please select a school');
      return;
    }

    setLoading(true);
    try {
      const athleteData = await Athlete.filter({ created_by: user.email });
      const athlete = athleteData[0];

      await TargetedSchool.create({
        athlete_id: athlete.id,
        school_id: selectedSchoolId,
        status: 'active',
      });
    } catch (error) {
      console.error('Error saving target school:', error);
      alert('Error saving school. Please try again.');
    }
    setLoading(false);
  };

  const sendDemoEmail = async () => {
    setLoading(true);
    try {
      // Simulate sending email (not actually sending)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDemoEmailSent(true);
    } catch (error) {
      console.error('Error sending demo email:', error);
    }
    setLoading(false);
  };

  const generateDemoResponse = async () => {
    setLoading(true);
    try {
      // Create a demo thread and message in the database
      // This will appear in the Response Center
      const athleteData = await Athlete.filter({ created_by: user.email });
      const athlete = athleteData[0];

      // Create demo data (you'll need to implement this in your backend)
      // For now, just simulate
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDemoResponseGenerated(true);
    } catch (error) {
      console.error('Error generating demo response:', error);
    }
    setLoading(false);
  };

  const completeOnboarding = async () => {
    try {
      // Mark onboarding as complete in user profile
      await User.update(user.id, {
        onboarding_completed: true,
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return firstName && lastName && classYear;
      case 2:
        return selectedSchoolId;
      case 3:
        return demoEmailSent;
      case 4:
        return demoResponseGenerated;
      default:
        return true;
    }
  };

  const step = ONBOARDING_STEPS[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{step.title}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                {step.description}
              </DialogDescription>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-slate-500 mt-2">
            Step {currentStep + 1} of {ONBOARDING_STEPS.length}
          </p>
        </DialogHeader>

        <div className="py-6">
          {/* Welcome Step */}
          {currentStep === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <p className="text-lg">
                    RecruitBridge helps you connect with college coaches through professional email outreach.
                  </p>
                  <p className="text-slate-600">
                    In the next few steps, you'll:
                  </p>
                  <ul className="text-left space-y-2 max-w-md mx-auto">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>Set up your athlete profile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>Add your first target school</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>Send a practice email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>See how responses work</span>
                    </li>
                  </ul>
                  <p className="text-sm text-slate-500">
                    This will only take about 2 minutes!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Step */}
          {currentStep === 1 && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Smith"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="classYear">Class Year *</Label>
                  <Select value={classYear} onValueChange={setClassYear}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your graduation year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">Class of 2025</SelectItem>
                      <SelectItem value="2026">Class of 2026</SelectItem>
                      <SelectItem value="2027">Class of 2027</SelectItem>
                      <SelectItem value="2028">Class of 2028</SelectItem>
                      <SelectItem value="2029">Class of 2029</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* School Selection Step */}
          {currentStep === 2 && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="school">Select Your First Target School *</Label>
                  <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose a school you're interested in" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map(school => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.school_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-2">
                    Don't worry, you can add more schools later!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Demo Email Step */}
          {currentStep === 3 && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Practice Email</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Let's send a practice email to Coach Sir (coachsir@recruitbridge.net). This is just for practice - no real coach will receive this!
                  </p>
                  <div className="bg-white rounded border p-3 text-sm">
                    <p className="font-semibold">To: coachsir@recruitbridge.net</p>
                    <p className="font-semibold mt-2">Subject: Introduction - {firstName} {lastName}</p>
                    <p className="mt-3 text-slate-700">
                      Dear Coach Sir,<br/><br/>
                      My name is {firstName} {lastName}, and I'm a Class of {classYear} athlete interested in your program...<br/><br/>
                      Looking forward to hearing from you!<br/><br/>
                      Best regards,<br/>
                      {firstName} {lastName}
                    </p>
                  </div>
                </div>
                {!demoEmailSent ? (
                  <p className="text-center text-slate-600">
                    Click "Send Email" below to send your practice email
                  </p>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-green-900">Email Sent!</p>
                    <p className="text-sm text-green-800">Check your Response Center next</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Response Center Step */}
          {currentStep === 4 && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">You've Got Mail!</h4>
                  <p className="text-sm text-green-800 mb-3">
                    Coach Sir just replied to your email! Let's see what they said.
                  </p>
                  <div className="bg-white rounded border p-3 text-sm">
                    <p className="font-semibold">From: Coach Sir &lt;coachsir@recruitbridge.net&gt;</p>
                    <p className="font-semibold mt-2">Re: Introduction - {firstName} {lastName}</p>
                    <p className="mt-3 text-slate-700">
                      Hi {firstName},<br/><br/>
                      Thanks for reaching out! I'd love to learn more about your athletic background and academic interests.
                      Please feel free to send me your highlight video and transcripts.<br/><br/>
                      Looking forward to staying in touch!<br/><br/>
                      Coach Sir
                    </p>
                  </div>
                </div>
                {!demoResponseGenerated && (
                  <p className="text-center text-slate-600">
                    Click "Next" to see this in your Response Center
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Complete Step */}
          {currentStep === 5 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold">Congratulations!</h3>
                  <p className="text-lg text-slate-700">
                    You've completed the walkthrough!
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                    <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>✅ Add more target schools</li>
                      <li>✅ Start sending real emails to coaches</li>
                      <li>✅ Track your responses</li>
                      <li>✅ Build your recruiting pipeline</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-slate-500">
            {currentStep === ONBOARDING_STEPS.length - 1 ? 'Ready to get started!' : 'Fill out the form to continue'}
          </div>
          <Button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            size="lg"
            className="min-w-[140px]"
          >
            {loading ? (
              'Processing...'
            ) : currentStep === ONBOARDING_STEPS.length - 1 ? (
              'Finish & Start'
            ) : currentStep === 3 ? (
              'Send Email'
            ) : (
              <>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
