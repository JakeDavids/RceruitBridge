import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Users, Target, BarChart3, Mail, UserPlus, TrendingUp, Search, ChevronDown, ChevronLeft, ChevronRight, Play, Facebook, Twitter, Instagram, Linkedin, Clock, Zap, Star, Sparkles, Shield, Heart, Award, HeadphonesIcon, Send, Eye } from 'lucide-react';
const logoImage = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6875a318a0b2d879d617363b/202797ade_recruitbrigdelogo.png';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion } from 'framer-motion';

export default function NewLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showCompetitorPlans, setShowCompetitorPlans] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element && element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    window.location.href = 'https://www.recruitbridge.app';
  };

  const testimonials = [
    {
      quote: "RecruitBridge helped me connect with coaches at programs I never thought I'd have a shot at. The AI emails made me sound professional and the tracking showed me exactly who was interested.",
      name: "Aiden Martinez",
      position: "Wide Receiver",
      school: "UNC Charlotte",
      image: "/src/assets/renderedImage.jpeg"
    },
    {
      quote: "The platform saved me so much time. I was able to reach out to 50+ coaches in a few hours instead of weeks. Got responses from programs across all divisions.",
      name: "Caleb Irving",
      position: "Defensive Back",
      school: "Purdue / UNC Charlotte",
      image: "/src/assets/IMG_6180.JPG"
    },
    {
      quote: "As a parent, I loved being able to see the analytics and know exactly which coaches were opening emails and responding. It gave us confidence in the process.",
      name: "Marcus Johnson",
      position: "Linebacker",
      school: "Class of 2025",
      image: null
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 transition-all duration-300 ${scrolled ? 'shadow-lg border-b-4 border-[#FF6B24]' : 'border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img
                src={logoImage}
                alt="RecruitBridge"
                className="h-10 w-auto"
              />
              <span className="ml-3 text-2xl font-bold text-[#005BEA]">
                RecruitBridge
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 hover:text-[#005BEA] transition-colors font-medium"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-[#005BEA] transition-colors font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-700 hover:text-[#005BEA] transition-colors font-medium"
              >
                Pricing
              </button>
              <Button
                onClick={handleGetStarted}
                className="bg-[#005BEA] hover:bg-[#0046AD] text-white px-6 py-2 rounded-xl font-semibold shadow-lg"
              >
                Get Started
              </Button>
            </nav>

            <div className="md:hidden">
              <Button
                onClick={handleGetStarted}
                className="bg-[#005BEA] hover:bg-[#0046AD] text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#005BEA] via-[#0046AD] to-[#1C1F26] relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-[#FF6B24] rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], x: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Get seen by college coaches faster — with AI that writes, sends, and tracks every message for you.
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            RecruitBridge connects under-recruited athletes with college coaches through automated outreach and analytics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={handleGetStarted}
              className="bg-[#FF6B24] hover:bg-[#FF6B24]/90 text-white px-10 py-6 rounded-xl text-xl font-bold shadow-2xl hover:scale-105 transition-transform"
            >
              Get Started Free
            </Button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            className="mt-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-white">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-[#FF6B24]" />
                <div>
                  <div className="text-2xl font-bold">1,200+</div>
                  <div className="text-sm text-blue-200">Active Athletes</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-[#FF6B24]" />
                <div>
                  <div className="text-2xl font-bold">87%</div>
                  <div className="text-sm text-blue-200">Response Rate</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-[#FF6B24]" />
                <div>
                  <div className="text-2xl font-bold">350+</div>
                  <div className="text-sm text-blue-200">Offers Extended</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - 3 Steps */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center text-[#1C1F26] mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Three simple steps to get in front of college coaches
          </p>

          <div className="space-y-0">
            {/* Step 1: Build */}
            <div className="grid md:grid-cols-2 gap-12 items-center py-16">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#005BEA] rounded-2xl mb-6">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#1C1F26] mb-4">Build</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Create your athlete profile in minutes with your stats, highlights, and goals—our system optimizes everything to catch coach attention.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Search className="w-20 h-20 mx-auto mb-4 text-[#005BEA]" />
                  <p className="font-semibold">Profile Builder Preview</p>
                </div>
              </div>
            </div>

            {/* Step 2: Reach - Dark Background */}
            <div className="bg-[#1C1F26] rounded-3xl">
              <div className="grid md:grid-cols-2 gap-12 items-center py-16 px-8">
                <div className="order-2 md:order-1 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Send className="w-20 h-20 mx-auto mb-4 text-[#FF6B24]" />
                    <p className="font-semibold">Email Automation Preview</p>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF6B24] rounded-2xl mb-6">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Reach</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    AI writes personalized emails to your target coaches and sends them automatically—no copy-paste, no stress.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Track */}
            <div className="grid md:grid-cols-2 gap-12 items-center py-16">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#005BEA] rounded-2xl mb-6">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#1C1F26] mb-4">Track</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  See who opened your emails, who replied, and which programs are most interested—so you know exactly where to focus.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-20 h-20 mx-auto mb-4 text-[#005BEA]" />
                  <p className="font-semibold">Analytics Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Athletes Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center text-[#1C1F26] mb-4">
            No more being overlooked
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            You've put in the work. Let AI get you in front of the right coaches — faster.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Feature 1 */}
            <Card className="p-8 hover:shadow-xl transition-shadow border-2 border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-[#005BEA]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1C1F26] mb-3">
                Smart Coach Matching
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Find coaches who need your position and fit your academic goals—we filter through thousands of programs for you.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 hover:shadow-xl transition-shadow border-2 border-gray-100">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-[#FF6B24]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1C1F26] mb-3">
                AI Email Generation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Personalized outreach emails written by AI based on your profile, stats, and goals—sounds like you, works like magic.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 hover:shadow-xl transition-shadow border-2 border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-[#005BEA]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1C1F26] mb-3">
                Professional Templates
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Proven email templates optimized for coach response rates—no more wondering if your message sounds right.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-8 hover:shadow-xl transition-shadow border-2 border-gray-100">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-[#FF6B24]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1C1F26] mb-3">
                Recruiting Dashboard
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Track opens, replies, and interest levels in real-time—see exactly which programs want you most.
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={handleGetStarted}
              className="bg-[#005BEA] hover:bg-[#0046AD] text-white px-8 py-6 rounded-xl text-lg font-bold shadow-lg"
            >
              Start Building Your Profile
            </Button>
          </div>
        </div>
      </section>

      {/* For Parents Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-[#1C1F26]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1F26]/95 via-[#1C1F26]/90 to-[#1C1F26]/95"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-center text-white mb-4">
            A recruiting system families can trust
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            Built with transparency, safety, and your athlete's success in mind
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Trust Card 1 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-[#FF6B24] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Verified & Transparent
              </h3>
              <p className="text-gray-300 text-sm">
                Real coach data, verified contact info, full visibility into every email sent
              </p>
            </div>

            {/* Trust Card 2 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
              <Shield className="w-12 h-12 text-[#FF6B24] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Safe & Secure
              </h3>
              <p className="text-gray-300 text-sm">
                Enterprise-grade security protects your athlete's personal information
              </p>
            </div>

            {/* Trust Card 3 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
              <Award className="w-12 h-12 text-[#FF6B24] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Built by Experts
              </h3>
              <p className="text-gray-300 text-sm">
                Created by a former athlete who navigated the recruiting process firsthand
              </p>
            </div>

            {/* Trust Card 4 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
              <HeadphonesIcon className="w-12 h-12 text-[#FF6B24] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Family-Focused Support
              </h3>
              <p className="text-gray-300 text-sm">
                Dedicated support team helps families navigate every step
              </p>
            </div>
          </div>

          {/* Parent Testimonial */}
          <div className="bg-white/5 backdrop-blur-md border-2 border-[#FF6B24] rounded-3xl p-10 max-w-4xl mx-auto">
            <div className="flex items-start gap-2 mb-4">
              <Star className="w-6 h-6 text-[#FF6B24] fill-current" />
              <Star className="w-6 h-6 text-[#FF6B24] fill-current" />
              <Star className="w-6 h-6 text-[#FF6B24] fill-current" />
              <Star className="w-6 h-6 text-[#FF6B24] fill-current" />
              <Star className="w-6 h-6 text-[#FF6B24] fill-current" />
            </div>
            <p className="text-2xl text-white italic mb-6 leading-relaxed">
              "As a parent, I was skeptical of recruiting platforms—but RecruitBridge changed everything. Being able to see exactly which coaches opened emails and responded gave us total confidence. My son got offers from schools we didn't even know were watching."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#FF6B24] rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-lg">Jennifer Martinez</div>
                <div className="text-gray-400">Parent of D1 Athlete</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center text-[#1C1F26] mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            Start free or upgrade for $19/month. No credit card required.
          </p>

          <div className="max-w-md mx-auto mb-8">
            {/* RecruitBridge Plan - Best Value */}
            <Card className="border-4 border-[#FF6B24] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#FF6B24] text-white px-6 py-2 text-sm font-bold rounded-bl-2xl">
                BEST VALUE
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black text-[#1C1F26] mb-2">RecruitBridge</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-black text-[#005BEA]">$19</span>
                  <span className="text-xl text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#005BEA] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Unlimited AI-generated emails</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#005BEA] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Smart coach matching & targeting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#005BEA] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Real-time analytics & tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#005BEA] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Professional athlete profile</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#005BEA] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                </ul>
                <Button
                  onClick={handleGetStarted}
                  className="w-full bg-[#005BEA] hover:bg-[#0046AD] text-white py-6 rounded-xl text-lg font-bold"
                >
                  Start Free Trial
                </Button>
              </div>
            </Card>
          </div>

          {/* Compare Plans Toggle */}
          <div className="text-center">
            <button
              onClick={() => setShowCompetitorPlans(!showCompetitorPlans)}
              className="inline-flex items-center gap-2 text-[#005BEA] font-semibold hover:underline"
            >
              {showCompetitorPlans ? 'Hide' : 'Compare'} plans
              <ChevronDown className={`w-5 h-5 transition-transform ${showCompetitorPlans ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Competitor Plans (Hidden by Default) */}
          {showCompetitorPlans && (
            <motion.div
              className="mt-12 grid md:grid-cols-2 gap-6 opacity-60"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 0.6, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 border-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-600 mb-2">Other Platform A</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-gray-600">$199</span>
                  <span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-sm text-gray-500">Basic email tools, limited tracking, no AI features</p>
              </Card>

              <Card className="p-8 border-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-600 mb-2">Other Platform B</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-gray-600">$299</span>
                  <span className="text-lg text-gray-500">/year</span>
                </div>
                <p className="text-sm text-gray-500">Manual outreach only, outdated coach data</p>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center text-[#1C1F26] mb-16">
            Athletes getting real results
          </h2>

          <div className="relative">
            {/* Carousel */}
            <Card className="border-4 border-[#005BEA] p-10 min-h-[400px] flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-[#FF6B24] fill-current" />
                  ))}
                </div>
                <p className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                  "{testimonials[currentTestimonial].quote}"
                </p>
              </div>

              <div className="flex items-center gap-4">
                {testimonials[currentTestimonial].image ? (
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-[#005BEA]"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#005BEA] flex items-center justify-center text-white font-bold text-2xl">
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-lg text-[#1C1F26]">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentTestimonial].position}
                  </div>
                  <div className="text-[#005BEA] font-semibold">
                    {testimonials[currentTestimonial].school}
                  </div>
                </div>
              </div>
            </Card>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 bg-[#005BEA] text-white rounded-full flex items-center justify-center hover:bg-[#0046AD] transition-colors shadow-lg"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 bg-[#005BEA] text-white rounded-full flex items-center justify-center hover:bg-[#0046AD] transition-colors shadow-lg"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'bg-[#005BEA] w-8'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={handleGetStarted}
              className="bg-white border-2 border-[#005BEA] text-[#005BEA] hover:bg-[#005BEA] hover:text-white px-8 py-4 rounded-xl font-bold transition-colors"
            >
              Watch Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#005BEA] via-[#0046AD] to-[#1C1F26]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Your recruiting journey starts here. Join hundreds of athletes getting offers in weeks, not months.
          </h2>
          <Button
            onClick={handleGetStarted}
            className="bg-[#FF6B24] hover:bg-[#FF6B24]/90 text-white px-12 py-6 rounded-xl text-xl font-bold shadow-2xl hover:scale-105 transition-transform"
          >
            Join RecruitBridge Free
          </Button>

          <div className="flex flex-wrap justify-center gap-8 mt-12 text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#FF6B24]" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#FF6B24]" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#FF6B24]" />
              <span>Setup in 2 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1F26] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={logoImage} alt="RecruitBridge" className="h-10 w-auto" />
                <span className="text-2xl font-bold">RecruitBridge</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                AI-powered recruiting platform connecting student-athletes with college coaches through automated outreach and analytics.
              </p>
              {/* Social Icons */}
              <div className="flex gap-4">
                <a
                  href="https://www.linkedin.com/company/recruitbridge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-[#005BEA] rounded-full flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/recruitbridge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-[#005BEA] rounded-full flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/recruitbridge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-[#005BEA] rounded-full flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="font-bold text-lg mb-4">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#FF6B24] transition-colors">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-[#FF6B24] transition-colors">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('pricing')} className="hover:text-[#FF6B24] transition-colors">
                    Pricing
                  </button>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="https://www.recruitbridge.app" className="hover:text-[#FF6B24] transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="https://www.recruitbridge.app" className="hover:text-[#FF6B24] transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="https://www.recruitbridge.app" className="hover:text-[#FF6B24] transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>&copy; 2025 RecruitBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
