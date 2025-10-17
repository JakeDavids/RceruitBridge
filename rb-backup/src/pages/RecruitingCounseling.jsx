import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users2, Calendar, CheckCircle, Sparkles, Star, Target, TrendingUp, Award } from "lucide-react";

export default function RecruitingCounseling() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consultationForm, setConsultationForm] = useState({
    name: "",
    email: "",
    phone: "",
    gradYear: "",
    position: "",
    goals: ""
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser) {
        setConsultationForm(prev => ({
          ...prev,
          name: currentUser.full_name || "",
          email: currentUser.email || ""
        }));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setLoading(false);
  };

  const getUserPricing = () => {
    const plan = user?.plan || 'free';
    const hasUsedFree = user?.counselingFreeSessionUsed || false;
    
    if (plan === 'unlimited' && !hasUsedFree) {
      return { tier: 'free', badge: '👑 FREE for Unlimited Users' };
    }
    if (plan === 'core' && !hasUsedFree) {
      return { tier: 'free', badge: '⚡ FREE for Core Users' };
    }
    return { tier: 'standard', badge: null };
  };

  const pricing = getUserPricing();

  const tiers = [
    {
      name: "Standard Session",
      price: "$129",
      duration: "45 minutes",
      description: "Perfect for athletes just starting their recruiting journey",
      features: [
        "1-on-1 video consultation",
        "Personalized recruiting roadmap",
        "Email template review",
        "Q&A session"
      ],
      highlight: false,
      current: pricing.tier === 'standard'
    },
    {
      name: "Premium Package",
      price: "$299",
      duration: "3 sessions",
      description: "Best value - comprehensive guidance throughout your process",
      features: [
        "Three 45-minute sessions",
        "Profile & highlight video review",
        "Email campaign strategy",
        "Follow-up support between sessions",
        "Priority scheduling"
      ],
      highlight: true,
      badge: "MOST POPULAR",
      current: false
    },
    {
      name: "Ultimate Package",
      price: "$499",
      duration: "6 sessions",
      description: "Complete recruiting support from start to commitment",
      features: [
        "Six 45-minute sessions",
        "Everything in Premium, plus:",
        "Ongoing email & text support",
        "College list building assistance",
        "Visit preparation guidance",
        "Commitment decision support"
      ],
      highlight: false,
      current: false
    }
  ];

  const handleConsultationSubmit = (e) => {
    e.preventDefault();
    window.open('https://calendly.com/recruitbridge/15min-consultation', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4">
            <Users2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            1-on-1 Recruiting Counseling
          </h1>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            Get personalized guidance from experienced recruiting professionals who have helped hundreds of athletes secure college opportunities.
          </p>
          {pricing.badge && (
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm px-4 py-2">
              {pricing.badge}
            </Badge>
          )}
          
          {/* Special Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              ⚡ Guaranteed Session with D1 Player
            </Badge>
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              🔥 Former D1 athlete with real recruiting & transfer portal experience
            </Badge>
            <Badge className="bg-red-100 text-red-800 px-4 py-2">
              💰 Limited Time: Save up to $200
            </Badge>
          </div>
        </div>

        <Separator className="bg-purple-200" />

        {/* Three-Tier Pricing */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <Card 
              key={idx}
              className={`relative ${
                tier.highlight 
                  ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 shadow-2xl scale-105' 
                  : 'bg-white/80 backdrop-blur shadow-lg'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 text-xs font-bold">
                    {tier.badge}
                  </Badge>
                </div>
              )}
              
              {tier.current && !tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 text-xs font-bold">
                    YOUR PRICE: FREE
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-slate-900">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-purple-900">
                    {tier.current ? 'FREE' : tier.price}
                  </span>
                  {tier.current && (
                    <span className="block text-sm text-slate-500 line-through mt-1">
                      {tier.price}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 mt-2">{tier.duration}</p>
                <p className="text-sm text-slate-700 mt-3">{tier.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full mt-6 ${
                    tier.highlight
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                  onClick={() => window.open('https://calendly.com/recruitbridge/recruiting-counseling', '_blank')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="bg-purple-200" />

        {/* Free Consultation Form */}
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-2xl border-0">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <Calendar className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Schedule Your FREE 15-Minute Consultation</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Not sure which package is right? Let's chat! We'll assess your situation and recommend the best path forward.
              </p>
            </div>

            <form onSubmit={handleConsultationSubmit} className="max-w-2xl mx-auto space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="consult-name" className="text-white">Full Name</Label>
                  <Input
                    id="consult-name"
                    value={consultationForm.name}
                    onChange={(e) => setConsultationForm({...consultationForm, name: e.target.value})}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consult-email" className="text-white">Email</Label>
                  <Input
                    id="consult-email"
                    type="email"
                    value={consultationForm.email}
                    onChange={(e) => setConsultationForm({...consultationForm, email: e.target.value})}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="consult-phone" className="text-white">Phone Number</Label>
                  <Input
                    id="consult-phone"
                    type="tel"
                    value={consultationForm.phone}
                    onChange={(e) => setConsultationForm({...consultationForm, phone: e.target.value})}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consult-grad" className="text-white">Graduation Year</Label>
                  <Input
                    id="consult-grad"
                    value={consultationForm.gradYear}
                    onChange={(e) => setConsultationForm({...consultationForm, gradYear: e.target.value})}
                    placeholder="2025"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consult-position" className="text-white">Sport & Position</Label>
                <Input
                  id="consult-position"
                  value={consultationForm.position}
                  onChange={(e) => setConsultationForm({...consultationForm, position: e.target.value})}
                  placeholder="e.g., Football - QB"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consult-goals" className="text-white">Your Recruiting Goals</Label>
                <Textarea
                  id="consult-goals"
                  value={consultationForm.goals}
                  onChange={(e) => setConsultationForm({...consultationForm, goals: e.target.value})}
                  placeholder="Tell us about your recruiting situation and what you're looking for..."
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-24"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                variant="secondary"
                className="w-full bg-white text-blue-700 hover:bg-gray-100 shadow-xl text-lg"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Free Call
              </Button>

              <p className="text-center text-sm opacity-75 mt-4">
                No commitment • No credit card required • 100% free
              </p>
            </form>
          </CardContent>
        </Card>

        <Separator className="bg-purple-200" />

        {/* What You'll Get */}
        <Card className="bg-white/80 backdrop-blur shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-purple-600" />
              What You'll Get in Every Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Personalized Strategy</h3>
                  <p className="text-sm text-slate-600">Custom recruiting plan based on your goals, sport, and academic profile</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Expert Guidance</h3>
                  <p className="text-sm text-slate-600">Learn from former D1 athletes who've been through the process</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Actionable Steps</h3>
                  <p className="text-sm text-slate-600">Walk away with specific tasks to move your recruiting forward</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Proven Results</h3>
                  <p className="text-sm text-slate-600">Methods that have helped hundreds of athletes get recruited</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="bg-purple-200" />

        {/* Why Our Athletes Choose Our Counseling */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Why Our Athletes Choose Our Counseling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Real Experience</h3>
                <p className="text-sm text-slate-600">Our advisors are former D1 athletes who've lived through recruiting and the transfer portal</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💡</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Insider Knowledge</h3>
                <p className="text-sm text-slate-600">Learn what coaches actually look for and how to stand out from thousands of other recruits</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📈</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Proven Results</h3>
                <p className="text-sm text-slate-600">Our athletes have secured scholarships worth millions of dollars across all division levels</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="bg-purple-200" />

        {/* Final CTA */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl border-0">
          <CardContent className="pt-8 pb-8 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Recruiting Journey?</h2>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Don't navigate the recruiting process alone. Get expert guidance and take control of your future.
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-purple-700 hover:bg-gray-100 shadow-xl text-lg px-8"
              onClick={() => window.open('https://calendly.com/recruitbridge/recruiting-counseling', '_blank')}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Your Session
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}