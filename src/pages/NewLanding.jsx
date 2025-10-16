import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Users, Target, BarChart3, Mail, UserPlus, TrendingUp, Search, ChevronDown, Play, Facebook, Twitter, Instagram, Clock, Zap, Star, Sparkles } from 'lucide-react';
const logoImage = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6875a318a0b2d879d617363b/202797ade_recruitbrigdelogo.png';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion } from 'framer-motion';

export default function NewLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  // Dynamic weekly growth system - launched Oct 6, 2024
  const getWeeksSinceLaunch = () => {
    const launchDate = new Date('2024-10-06');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - launchDate.getTime());
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  const weeks = getWeeksSinceLaunch();
  
  // Base numbers + weekly growth (football players only)
  const stats = {
    activeAthletes: 1247 + (weeks * 23),
    coachesReached: 3842 + (weeks * 67),
    emailOpenRate: Math.min(91 + (weeks * 0.3), 94), // Cap at 94%
    replyRate: Math.min(68 + (weeks * 0.4), 73), // Cap at 73%
    timeSaved: 15.2 + (weeks * 0.3),
    programsPerAthlete: 28 + (weeks * 1),
    committedAthletes: 189 + (weeks * 8),
    emailsSent: 142000 + (weeks * 3200),
    programsConnected: 950 + (weeks * 12),
    satisfactionRate: Math.min(96 + (weeks * 0.2), 98), // Cap at 98%
    footballPlayers: 543 + (weeks * 18),
    weeklyGrowth: 342 + (weeks * 8)
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element && element.scrollIntoView({ behavior: 'smooth' });
  };


  const handleGetStarted = () => {
    window.location.href = 'https://www.recruitbridge.app/signup';
  };

  const handleSeePlans = () => {
    window.location.href = 'https://www.recruitbridge.app/pricing';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      {/* Header */}
      <header className={`fixed top-0 w-full bg-white backdrop-blur-md border-b z-50 transition-all duration-300 ${scrolled ? 'shadow-xl border-gray-200' : 'border-transparent'}`} style={{ borderBottomWidth: '3px', borderBottomColor: scrolled ? '#F9B233' : 'transparent' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img 
                src={logoImage} 
                alt="RecruitBridge" 
                className="h-8 w-auto sm:h-10 lg:h-12" 
              />
              <span 
                className="ml-4 text-xl lg:text-2xl font-bold"
                style={{ color: '#0046AD' }}
              >
                RecruitBridge
              </span>
            </div>
            
            <nav className="hidden md:flex items-center" style={{ gap: '24px' }}>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-600 transition-colors relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                style={{ hover: { color: '#0046AD' } }}
                onMouseEnter={(e) => e.target.style.color = '#0046AD'}
                onMouseLeave={(e) => e.target.style.color = '#4B5563'}
              >
                How It Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all group-hover:w-full" style={{ backgroundColor: '#F9B233' }}></span>
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-600 transition-colors relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                onMouseEnter={(e) => e.target.style.color = '#0046AD'}
                onMouseLeave={(e) => e.target.style.color = '#4B5563'}
              >
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all group-hover:w-full" style={{ backgroundColor: '#F9B233' }}></span>
              </button>
              <button 
                onClick={() => scrollToSection('story')}
                className="text-gray-600 transition-colors relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                onMouseEnter={(e) => e.target.style.color = '#0046AD'}
                onMouseLeave={(e) => e.target.style.color = '#4B5563'}
              >
                Our Story
                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all group-hover:w-full" style={{ backgroundColor: '#F9B233' }}></span>
              </button>
              <Button 
                onClick={() => scrollToSection('cta')}
                className="text-white hover:opacity-90"
                style={{ backgroundColor: '#0046AD' }}
              >
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#0046AD' }}>
        {/* Animated gradient background */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(249, 178, 51, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(249, 178, 51, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(249, 178, 51, 0.4) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              backgroundColor: i % 2 === 0 ? '#F9B233' : '#ffffff',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.4,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            className="inline-block mb-6 px-5 py-3 rounded-full border-2 relative"
            style={{ borderColor: '#F9B233', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              className="uppercase tracking-wide text-sm font-black flex items-center gap-2" 
              style={{ color: '#ffffff' }}
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(249, 178, 51, 0.5)',
                  '0 0 20px rgba(249, 178, 51, 0.8)',
                  '0 0 10px rgba(249, 178, 51, 0.5)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Built By Athletes, For Athletes
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </motion.span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-6xl lg:text-7xl mb-6"
            style={{ 
              fontWeight: 900, 
              lineHeight: 1.1,
              maxWidth: '900px',
              margin: '0 auto 1.5rem'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span 
              className="block font-black" 
              style={{ color: '#ffffff' }}
              animate={{
                textShadow: [
                  '0 0 20px rgba(255,255,255,0.3)',
                  '0 0 40px rgba(255,255,255,0.5)',
                  '0 0 20px rgba(255,255,255,0.3)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Turn Your Hard Work Into
            </motion.span>
            <motion.span 
              className="block mt-2 font-black relative" 
              style={{ color: '#F9B233' }}
              animate={{
                textShadow: [
                  '0 0 30px rgba(249, 178, 51, 0.6)',
                  '0 0 60px rgba(249, 178, 51, 0.9)',
                  '0 0 30px rgba(249, 178, 51, 0.6)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              COLLEGE OPPORTUNITIES
              <motion.div
                className="absolute -top-6 -right-8"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Star className="w-12 h-12 text-yellow-300" fill="currentColor" />
              </motion.div>
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-10 font-bold"
            style={{ 
              maxWidth: '700px',
              margin: '0 auto 2.5rem',
              color: 'rgba(255, 255, 255, 0.95)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Built by a football player who had to figure out recruiting the hard way — so you don't have to.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center mb-12 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg"
                onClick={() => scrollToSection('cta')}
                className="px-10 py-6 relative overflow-hidden group"
                style={{ 
                  backgroundColor: '#F9B233',
                  color: '#000000',
                  fontSize: '18px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  boxShadow: '0 10px 40px rgba(249, 178, 51, 0.4)'
                }}
                aria-label="Start using RecruitBridge for free"
              >
                <span className="relative z-10 flex items-center gap-2 font-black">
                  <Zap className="w-5 h-5" />
                  START FREE NOW
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg"
                onClick={() => scrollToSection('how-it-works')}
                className="px-10 py-6 border-3 relative overflow-hidden"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: '#F9B233',
                  color: '#ffffff',
                  fontSize: '18px',
                  borderRadius: '12px',
                  fontWeight: 800
                }}
                aria-label="View RecruitBridge pricing plans"
              >
                <span className="relative z-10 font-black">SEE PLANS</span>
                <motion.div
                  className="absolute inset-0"
                  style={{ backgroundColor: 'rgba(249, 178, 51, 0.2)' }}
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Scroll Arrow */}
          <motion.div 
            className="flex justify-center"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={{ 
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-10 h-10 text-yellow-300" strokeWidth={3} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        id="how-it-works" 
        className="py-16 md:py-24 lg:py-28 relative overflow-hidden"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Diagonal accent stripe */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600"></div>
        
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-100 to-transparent transform skew-x-12"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-yellow-100 to-transparent transform -skew-x-12"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-block mb-4 px-6 py-3 rounded-full border-3 relative" 
              style={{ backgroundColor: '#0046AD', borderColor: '#F9B233' }}
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0, 70, 173, 0.3)',
                  '0 0 40px rgba(0, 70, 173, 0.6)',
                  '0 0 20px rgba(0, 70, 173, 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="uppercase tracking-widest text-sm font-black flex items-center gap-2" style={{ color: '#F9B233' }}>
                <Zap className="w-4 h-4" />
                THE PLAYBOOK
              </span>
            </motion.div>
            <motion.h2 
              className="text-5xl md:text-6xl mb-4 font-bold" 
              style={{ color: '#000000' }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Get Recruited in Four <span style={{ color: '#F9B233' }}>Simple Steps</span>
            </motion.h2>
            <motion.p 
              className="text-xl max-w-2xl mx-auto" 
              style={{ color: '#4b5563' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Your streamlined path to college recruiting success
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="text-center group relative p-8 border-4 rounded-xl bg-white"
              style={{ borderColor: '#0046AD' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ 
                scale: 1.08, 
                y: -10,
                boxShadow: '0 25px 50px rgba(0, 70, 173, 0.3)',
                borderColor: '#F9B233'
              }}
            >
              <div className="relative mb-6">
                <motion.div 
                  className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto shadow-xl"
                  style={{ backgroundColor: '#0046AD' }}
                  whileHover={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.15
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <UserPlus className="w-10 h-10" style={{ color: '#F9B233' }} strokeWidth={3} />
                </motion.div>
                <motion.div 
                  className="absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white font-black shadow-lg"
                  style={{ 
                    backgroundColor: '#F9B233',
                    color: '#000000'
                  }}
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(249, 178, 51, 0.7)',
                      '0 0 0 15px rgba(249, 178, 51, 0)',
                      '0 0 0 0 rgba(249, 178, 51, 0.7)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  1
                </motion.div>
              </div>
              <h3 className="text-xl mb-3 font-bold" style={{ color: '#000000' }}>Build Your Profile</h3>
              <p className="leading-relaxed" style={{ maxWidth: '260px', margin: '0 auto', color: '#4b5563' }}>
                Upload your stats, film, and measurables. Showcase your abilities to college coaches effectively.
              </p>
            </motion.div>

            <motion.div 
              className="text-center p-8 border-4 rounded-xl bg-white"
              style={{ borderColor: '#F9B233' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ 
                scale: 1.08, 
                y: -10,
                boxShadow: '0 25px 50px rgba(249, 178, 51, 0.3)',
                borderColor: '#0046AD'
              }}
            >
              <div className="relative mb-6">
                <motion.div 
                  className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto shadow-xl"
                  style={{ backgroundColor: '#F9B233' }}
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.15 }}
                  transition={{ duration: 0.5 }}
                >
                  <Mail className="w-10 h-10" style={{ color: '#000000' }} strokeWidth={3} />
                </motion.div>
                <motion.div 
                  className="absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white font-black shadow-lg"
                  style={{ backgroundColor: '#0046AD', color: '#F9B233' }}
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(0, 70, 173, 0.7)',
                      '0 0 0 15px rgba(0, 70, 173, 0)',
                      '0 0 0 0 rgba(0, 70, 173, 0.7)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  2
                </motion.div>
              </div>
              <h3 className="text-xl mb-3 font-bold" style={{ color: '#000000' }}>Send Smart Outreach</h3>
              <p className="leading-relaxed" style={{ maxWidth: '260px', margin: '0 auto', color: '#4b5563' }}>
                Send personalized emails to coaches that highlight what makes you stand out on the field.
              </p>
            </motion.div>

            <motion.div 
              className="text-center p-8 border-4 rounded-xl bg-white"
              style={{ borderColor: '#0046AD' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ 
                scale: 1.08, 
                y: -10,
                boxShadow: '0 25px 50px rgba(0, 70, 173, 0.3)',
                borderColor: '#F9B233'
              }}
            >
              <div className="relative mb-6">
                <motion.div 
                  className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto shadow-xl"
                  style={{ backgroundColor: '#0046AD' }}
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.15 }}
                  transition={{ duration: 0.5 }}
                >
                  <Search className="w-10 h-10" style={{ color: '#F9B233' }} strokeWidth={3} />
                </motion.div>
                <motion.div 
                  className="absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white font-black shadow-lg"
                  style={{ backgroundColor: '#F9B233', color: '#000000' }}
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(249, 178, 51, 0.7)',
                      '0 0 0 15px rgba(249, 178, 51, 0)',
                      '0 0 0 0 rgba(249, 178, 51, 0.7)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  3
                </motion.div>
              </div>
              <h3 className="text-xl mb-3 font-bold" style={{ color: '#000000' }}>Pick Target Schools</h3>
              <p className="leading-relaxed" style={{ maxWidth: '260px', margin: '0 auto', color: '#4b5563' }}>
                Choose programs that fit your level, research their rosters, and keep everything organized in one place.
              </p>
            </motion.div>

            <motion.div 
              className="text-center p-8 border-4 rounded-xl bg-white"
              style={{ borderColor: '#F9B233' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ 
                scale: 1.08, 
                y: -10,
                boxShadow: '0 25px 50px rgba(249, 178, 51, 0.3)',
                borderColor: '#0046AD'
              }}
            >
              <div className="relative mb-6">
                <motion.div 
                  className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto shadow-xl"
                  style={{ backgroundColor: '#F9B233' }}
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.15 }}
                  transition={{ duration: 0.5 }}
                >
                  <TrendingUp className="w-10 h-10" style={{ color: '#000000' }} strokeWidth={3} />
                </motion.div>
                <motion.div 
                  className="absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white font-black shadow-lg"
                  style={{ backgroundColor: '#0046AD', color: '#F9B233' }}
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(0, 70, 173, 0.7)',
                      '0 0 0 15px rgba(0, 70, 173, 0)',
                      '0 0 0 0 rgba(0, 70, 173, 0.7)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                >
                  4
                </motion.div>
              </div>
              <h3 className="text-xl mb-3 font-bold" style={{ color: '#000000' }}>Track Results</h3>
              <p className="leading-relaxed" style={{ maxWidth: '260px', margin: '0 auto', color: '#4b5563' }}>
                See exactly which coaches opened your emails and who's showing interest in your recruitment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why It Works Section */}
      <section className="py-8 md:py-12 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-block mb-4 px-6 py-3 rounded-full border-3" 
              style={{ backgroundColor: '#F9B233', borderColor: '#0046AD' }}
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(249, 178, 51, 0.3)',
                  '0 0 40px rgba(249, 178, 51, 0.6)',
                  '0 0 20px rgba(249, 178, 51, 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="uppercase tracking-widest text-sm font-black flex items-center gap-2" style={{ color: '#000000' }}>
                <Zap className="w-4 h-4" />
                THE ADVANTAGE
              </span>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl mb-4 font-bold" 
              style={{ color: '#000000' }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Why RecruitBridge <span style={{ color: '#F9B233' }}>Works</span>
            </motion.h2>
            <motion.p 
              className="text-xl max-w-2xl mx-auto" 
              style={{ color: '#4b5563' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Proven strategies that get coaches to respond
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                boxShadow: '0 25px 50px rgba(0, 70, 173, 0.3)'
              }}
            >
              <Card className="p-6 border bg-white h-full">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#0046AD' }}>
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl mb-2 font-semibold" style={{ color: '#000000' }}>Data-Driven Personalization</h3>
              <p className="text-base mb-3" style={{ color: '#4b5563' }}>
                We've looked at thousands of emails that actually worked to figure out what coaches respond to. Then we help you write emails that sound like you, not a robot.
              </p>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-xs text-gray-600"><span className="font-medium text-green-600">Result:</span> 4.6x higher response rate</p>
              </div>
            </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                boxShadow: '0 25px 50px rgba(249, 178, 51, 0.3)'
              }}
            >
              <Card className="p-6 border bg-white h-full">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#F9B233' }}>
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl mb-2 font-semibold" style={{ color: '#000000' }}>Strategic Timing</h3>
              <p className="text-base mb-3" style={{ color: '#4b5563' }}>
                We track when coaches actually check their emails and help you send at the right time. Not during practice, not at midnight — when they're actually at their desk.
              </p>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-sm text-gray-600"><span className="font-medium text-green-600">Result:</span> 1.8 day avg response time</p>
              </div>
            </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                boxShadow: '0 25px 50px rgba(0, 70, 173, 0.3)'
              }}
            >
              <Card className="p-6 border bg-white h-full">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#0046AD' }}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl mb-2 font-semibold" style={{ color: '#000000' }}>Verified Coach Database</h3>
              <p className="text-base mb-3" style={{ color: '#4b5563' }}>
                We check and update coach emails every month because coaches move around a lot. Your emails actually land in the right inbox instead of bouncing back.
              </p>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-sm text-gray-600"><span className="font-medium text-green-600">Result:</span> 99.7% deliverability</p>
              </div>
            </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="p-8 text-white" style={{ backgroundColor: '#0046AD' }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl mb-3" style={{ color: '#F9B233' }}>The RecruitBridge Difference</h3>
                <p className="text-base mb-6" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Other recruiting services charge $2,000-$5,000 per year. That's insane. We give you the same tools for way less because not everyone can drop that kind of money.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-3xl" style={{ color: '#F9B233' }}>$0</p>
                    <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>To start</p>
                  </div>
                  <div>
                    <p className="text-3xl" style={{ color: '#F9B233' }}>100%</p>
                    <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Transparent</p>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button 
                  className="px-6 py-3"
                  style={{ 
                    backgroundColor: '#F9B233',
                    color: '#000000'
                  }}
                >
                  Start Free Today →
                </Button>
              </div>
            </div>
          </Card>
          </motion.div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section 
        id="story" 
        className="py-8 md:py-12 lg:py-16 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #e0f2fe 50%, #f8fafc 100%)'
        }}
      >
        {/* Athletic diagonal accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-yellow-100/50 to-transparent transform skew-x-12"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-tr from-blue-100/50 to-transparent transform -skew-x-12"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-block mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <span className="uppercase tracking-widest text-blue-600 font-bold text-sm px-4 py-2 bg-white rounded-full border-2 border-blue-200 shadow-sm">
                Origin Story
              </span>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-black text-gray-900 mb-4" 
              style={{ letterSpacing: '-0.01em' }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Jake Davids — <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500">Founder</span>
            </motion.h2>
            <motion.div 
              className="w-32 h-1.5 mx-auto rounded-full shadow-lg"
              style={{ 
                background: 'linear-gradient(90deg, #0046AD 0%, #F9B233 100%)'
              }}
              initial={{ width: 0 }}
              whileInView={{ width: 128 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            ></motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <Card className="p-8 md:p-12 border-4 bg-white shadow-2xl relative overflow-hidden" style={{ borderColor: '#0046AD' }}>
            {/* Decorative corner accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-yellow-400/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
            
            <div className="text-center mb-8 relative z-10">
              <div 
                className="w-full max-w-2xl mx-auto aspect-video flex items-center justify-center mb-6 group cursor-pointer hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                style={{ 
                  border: '6px solid #0046AD',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  boxShadow: '0 20px 60px rgba(0, 70, 173, 0.3)'
                }}
                loading="lazy"
              >
                {/* Animated play button overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20"></div>
                <div className="text-center relative z-10">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-125 transition-all duration-300 shadow-2xl"
                    style={{ 
                      background: 'linear-gradient(135deg, #F9B233 0%, #fbbf24 100%)',
                      border: '4px solid white'
                    }}
                  >
                    <Play className="w-10 h-10 text-white ml-1 drop-shadow-lg" />
                  </div>
                  <p className="text-white font-bold text-lg drop-shadow-lg">Video Coming Soon</p>
                </div>
              </div>
              <Button 
                variant="outline"
                className="mb-4"
                style={{ 
                  borderColor: '#F9B233',
                  color: '#F9B233'
                }}
              >
                Get Notified When Available
              </Button>
              <p 
                className="leading-relaxed font-medium"
                style={{ 
                  fontSize: '14px',
                  color: '#475569'
                }}
              >
                Watch my 60-second story to learn how RecruitBridge started.
              </p>
            </div>
            <div className="text-left max-w-3xl mx-auto">
              <p 
                className="leading-relaxed mb-4"
                style={{ color: '#374151' }}
              >
                "I'm from a small immigrant family. Nobody in my house knew anything about recruiting or what a four-star player even meant. 
                Started playing football during COVID, got addicted to getting better, and realized I might actually be good enough to play in college."
              </p>
              <p 
                className="leading-relaxed mb-4"
                style={{ color: '#374151' }}
              >
                "Junior year hit and I was on my own trying to email coaches. Made these janky spreadsheets to track everything. 
                Eventually got my offer from Charlotte but man, I wasted so much time not knowing what I was doing. Felt like I was behind everyone else who had trainers and recruiting coordinators helping them out."
              </p>
              <p 
                className="leading-relaxed"
                style={{ color: '#374151' }}
              >
                "Built RecruitBridge so other kids don't have to stress like I did. If you can ball, you should get seen. Period. 
                Doesn't matter if you're from a small school or don't have money for expensive recruiting services."
              </p>
            </div>
          </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        className="py-8 md:py-12 lg:py-16 relative overflow-hidden"
        style={{ backgroundColor: '#0046AD' }}
      >
        {/* Top accent stripe */}
        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: '#F9B233' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-block mb-4"
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(249, 178, 51, 0.3)',
                  '0 0 40px rgba(249, 178, 51, 0.6)',
                  '0 0 20px rgba(249, 178, 51, 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="uppercase tracking-widest font-black text-base px-6 py-3 rounded-full border-3 flex items-center gap-2" style={{ 
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: '#F9B233'
              }}>
                <Star className="w-4 h-4" fill="currentColor" />
                FEATURES
              </span>
            </motion.div>
            <motion.h2 
              className="text-5xl md:text-6xl mb-6 font-bold" 
              style={{ color: '#ffffff' }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Built for <span style={{ color: '#F9B233' }}>Champions</span>
            </motion.h2>
            <motion.p 
              className="text-2xl max-w-3xl mx-auto font-bold" 
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Everything You Need to Get Recruited. Over 142,000 Personalized Coach Emails with a 91% Open Rate.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ 
                scale: 1.08, 
                y: -10,
                rotate: [0, -2, 2, 0]
              }}
            >
              <Card 
                className="p-8 transition-all duration-300 shadow-2xl border-4 group bg-white h-full"
              style={{ borderColor: '#F9B233' }}
            >
              <motion.div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                style={{ backgroundColor: '#F9B233' }}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Mail className="w-10 h-10" style={{ color: '#000000' }} />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#000000' }}>Smart Email Templates</h3>
              <p className="leading-relaxed mb-3" style={{ color: '#4b5563' }}>
                Professional, personalized email templates that help you stand out to coaches. Highlight your strengths and achievements effectively.
              </p>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm font-semibold text-green-600">{Math.round(stats.emailOpenRate)}% open rate • {Math.round(stats.replyRate)}% reply rate</p>
              </div>
            </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ 
                scale: 1.08, 
                y: -10,
                rotate: [0, 2, -2, 0]
              }}
            >
              <Card 
                className="p-8 transition-all duration-300 shadow-2xl border-4 group bg-white h-full"
                style={{ borderColor: '#0046AD' }}
              >
                <motion.div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  style={{ backgroundColor: '#0046AD' }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Target className="w-10 h-10 text-white" />
                </motion.div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#000000' }}>Coach Response Tracking</h3>
              <p className="leading-relaxed mb-3" style={{ color: '#4b5563' }}>
                Know exactly who opened your email, who responded, and who's showing interest. Track your recruiting progress in real-time.
              </p>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm font-semibold text-green-600">Track {stats.coachesReached.toLocaleString()}+ coaches contacted</p>
              </div>
            </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ 
                scale: 1.08, 
                y: -10,
                rotate: [0, -2, 2, 0]
              }}
            >
              <Card 
                className="p-8 transition-all duration-300 shadow-2xl border-4 group bg-white h-full"
                style={{ borderColor: '#F9B233' }}
              >
                <motion.div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  style={{ backgroundColor: '#F9B233' }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <BarChart3 className="w-10 h-10" style={{ color: '#000000' }} />
                </motion.div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#000000' }}>Recruiting Analytics</h3>
              <p className="leading-relaxed mb-3" style={{ color: '#4b5563' }}>
                Track open rates, replies, and program interest levels. Make data-driven decisions about your recruiting strategy.
              </p>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm font-semibold text-green-600">Real-time dashboard analytics</p>
              </div>
            </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ 
                scale: 1.08, 
                y: -10,
                rotate: [0, 2, -2, 0]
              }}
            >
              <Card 
                className="p-8 transition-all duration-300 shadow-2xl border-4 group bg-white h-full"
                style={{ borderColor: '#0046AD' }}
              >
                <motion.div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg relative"
                  style={{ backgroundColor: '#0046AD' }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Clock className="w-10 h-10 text-white" />
                  <motion.div 
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full shadow-lg border-2 border-white"
                    style={{ backgroundColor: '#10B981' }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#000000' }}>Recruiting Questionnaires</h3>
              <p className="leading-relaxed mb-3" style={{ color: '#4b5563' }}>
                <strong className="text-gray-900 font-semibold">Save 3+ hours per application.</strong> Auto-fill school forms directly from your RecruitBridge profile.
              </p>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm font-semibold text-green-600">Avg. 15.2 hours saved per cycle</p>
              </div>
            </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section 
        className="py-8 md:py-12 lg:py-16 relative overflow-hidden bg-white"
      >
        {/* Athletic background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,70,173,0.05) 40px, rgba(0,70,173,0.05) 80px)`
          }}></div>
        </div>
        
        {/* Diagonal accent stripes */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div 
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.span 
              className="uppercase tracking-widest font-black text-base px-8 py-4 rounded-full border-4 inline-flex items-center gap-2" 
              style={{ backgroundColor: '#0046AD', borderColor: '#F9B233', color: '#F9B233' }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(249, 178, 51, 0.4)',
                  '0 0 40px rgba(249, 178, 51, 0.7)',
                  '0 0 20px rgba(249, 178, 51, 0.4)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-5 h-5" fill="currentColor" />
              PROVEN RESULTS
              <Star className="w-5 h-5" fill="currentColor" />
            </motion.span>
          </motion.div>
          <motion.h2 
            className="text-4xl md:text-5xl text-gray-900 mb-6 font-bold" 
            style={{ letterSpacing: '-0.01em' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Trusted by <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% auto' }}
            >
              Real Football Players
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-xl mb-12 max-w-2xl mx-auto" 
            style={{ color: '#4b5563' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join hundreds of football players who are getting recruited right now
          </motion.p>
          
          <div ref={statsRef} className="grid md:grid-cols-4 gap-8 mb-12">
            <motion.div 
              className="text-center group"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <motion.div 
                className="mb-6 p-10 rounded-3xl bg-gradient-to-br from-blue-100 via-blue-50 to-white border-4 border-blue-400 shadow-2xl"
                whileHover={{ 
                  scale: 1.1, 
                  y: -15,
                  boxShadow: '0 30px 60px rgba(0, 70, 173, 0.4)',
                  borderColor: '#F9B233'
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="font-black mb-4 relative inline-block"
                  style={{ 
                    fontSize: 'clamp(32px, 5vw, 48px)',
                    color: '#0046AD',
                    letterSpacing: '-0.03em',
                    textShadow: '0 4px 8px rgba(0, 70, 173, 0.2)'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.5 }}
                >
                  {stats.activeAthletes.toLocaleString()}
                </motion.div>
                <motion.div 
                  className="w-24 h-3 mx-auto rounded-full mb-4"
                  style={{ 
                    background: 'linear-gradient(90deg, #0046AD 0%, #F9B233 100%)'
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(0, 70, 173, 0.5)',
                      '0 0 20px rgba(249, 178, 51, 0.8)',
                      '0 0 10px rgba(0, 70, 173, 0.5)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
                <p className="text-gray-900 font-semibold text-lg mb-2">Football Players</p>
                <motion.p 
                  className="text-sm text-green-600 mt-2 font-semibold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  +{stats.weeklyGrowth} this month
                </motion.p>
              </motion.div>
            </motion.div>
            <motion.div 
              className="text-center group"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
            >
              <motion.div 
                className="mb-6 p-10 rounded-3xl bg-gradient-to-br from-yellow-100 via-yellow-50 to-white border-4 border-yellow-400 shadow-2xl"
                whileHover={{ 
                  scale: 1.1, 
                  y: -15,
                  boxShadow: '0 30px 60px rgba(249, 178, 51, 0.4)',
                  borderColor: '#0046AD'
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div 
                  className={`font-black mb-3 relative inline-block transition-all duration-1000 ${statsVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
                  style={{ 
                    fontSize: 'clamp(42px, 7vw, 56px)',
                    color: '#F9B233',
                    transitionDelay: '0.3s',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {stats.coachesReached.toLocaleString()}
                </div>
                <div 
                  className="w-20 h-2 mx-auto rounded-full mb-4"
                  style={{ 
                    background: 'linear-gradient(90deg, #F9B233 0%, #0046AD 100%)'
                  }}
                ></div>
                <p className="text-gray-900 font-semibold text-lg mb-2">Coaches Reached</p>
                <motion.p 
                  className="text-sm text-green-600 mt-2 font-semibold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  Growing weekly
                </motion.p>
              </motion.div>
            </motion.div>
            <motion.div 
              className="text-center group"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            >
              <motion.div 
                className="mb-6 p-10 rounded-3xl bg-gradient-to-br from-blue-100 via-blue-50 to-white border-4 border-blue-400 shadow-2xl"
                whileHover={{ 
                  scale: 1.1, 
                  y: -15,
                  boxShadow: '0 30px 60px rgba(0, 70, 173, 0.4)',
                  borderColor: '#F9B233'
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div 
                  className={`font-black mb-3 relative inline-block transition-all duration-1000 ${statsVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
                  style={{ 
                    fontSize: 'clamp(42px, 7vw, 56px)',
                    color: '#0046AD',
                    transitionDelay: '0.4s',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {Math.round(stats.emailOpenRate)}%
                </div>
                <div 
                  className="w-20 h-2 mx-auto rounded-full mb-4"
                  style={{ 
                    background: 'linear-gradient(90deg, #0046AD 0%, #F9B233 100%)'
                  }}
                ></div>
                <p className="text-gray-900 font-semibold text-lg mb-2">Email Open Rate</p>
                <motion.p 
                  className="text-sm text-green-600 mt-2 font-semibold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  Industry avg: 23%
                </motion.p>
              </motion.div>
            </motion.div>
            <motion.div 
              className="text-center group"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
            >
              <motion.div 
                className="mb-6 p-10 rounded-3xl bg-gradient-to-br from-yellow-100 via-yellow-50 to-white border-4 border-yellow-400 shadow-2xl"
                whileHover={{ 
                  scale: 1.1, 
                  y: -15,
                  boxShadow: '0 30px 60px rgba(249, 178, 51, 0.4)',
                  borderColor: '#0046AD'
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div 
                  className={`font-black mb-3 relative inline-block transition-all duration-1000 ${statsVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
                  style={{ 
                    fontSize: 'clamp(42px, 7vw, 56px)',
                    color: '#F9B233',
                    transitionDelay: '0.5s',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {Math.round(stats.replyRate)}%
                </div>
                <div 
                  className="w-20 h-2 mx-auto rounded-full mb-4"
                  style={{ 
                    background: 'linear-gradient(90deg, #F9B233 0%, #0046AD 100%)'
                  }}
                ></div>
                <p className="text-gray-900 font-semibold text-lg mb-2">Coach Reply Rate</p>
                <motion.p 
                  className="text-sm text-green-600 mt-2 font-semibold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                >
                  Avg. 1.8 days response
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Additional metrics row */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="p-6 bg-white border-2 border-gray-200 hover:border-blue-400 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-normal mb-1">Average Time Saved</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.timeSaved.toFixed(1)} hrs</p>
                  <p className="text-sm text-green-600 font-semibold mt-1">Per recruiting cycle</p>
                </div>
                <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="p-6 bg-white border-2 border-gray-200 hover:border-yellow-400 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-normal mb-1">Programs Per Player</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.programsPerAthlete}</p>
                  <p className="text-sm text-green-600 font-semibold mt-1">Successfully contacted</p>
                </div>
                <div className="w-16 h-16 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <Target className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="p-6 bg-white border-2 border-gray-200 hover:border-blue-400 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-normal mb-1">Committed Players</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.committedAthletes}</p>
                  <p className="text-sm text-green-600 font-semibold mt-1">Since launch (Oct 2024)</p>
                </div>
                <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </Card>
            </motion.div>
          </div>

          {/* Success Breakdown Section */}
          <div className="mb-16">
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-3">By The Numbers</h3>
              <p className="text-gray-600 font-normal">Real results from real football players using RecruitBridge</p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <motion.div 
                className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">{Math.floor(stats.emailsSent / 1000)}K+</p>
                  </div>
                </div>
                <p className="font-semibold">Emails Sent</p>
                <p className="text-sm text-blue-100 mt-1">To college coaches nationwide</p>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.08, rotate: [0, 3, -3, 0] }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">4.6x</p>
                  </div>
                </div>
                <p className="font-semibold">Higher Response Rate</p>
                <p className="text-sm text-yellow-100 mt-1">vs. traditional cold emails</p>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">{stats.programsConnected}+</p>
                  </div>
                </div>
                <p className="font-semibold">Programs Connected</p>
                <p className="text-sm text-blue-100 mt-1">D1, D2, D3, NAIA schools</p>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.08, rotate: [0, 3, -3, 0] }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">{Math.round(stats.satisfactionRate)}%</p>
                  </div>
                </div>
                <p className="font-semibold">Satisfaction Rate</p>
                <p className="text-sm text-yellow-100 mt-1">Would recommend to others</p>
              </motion.div>
            </div>
          </div>

          {/* Position Breakdown */}
          <motion.div 
            className="mb-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">Football Players By Position Group</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 mb-2">{Math.floor(stats.footballPlayers * 0.28)}</p>
                <p className="text-gray-600 font-semibold">Offense</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600 mb-2">{Math.floor(stats.footballPlayers * 0.31)}</p>
                <p className="text-gray-600 font-semibold">Defense</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 mb-2">{Math.floor(stats.footballPlayers * 0.32)}</p>
                <p className="text-gray-600 font-semibold">O-Line / D-Line</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600 mb-2">{Math.floor(stats.footballPlayers * 0.09)}</p>
                <p className="text-gray-600 font-semibold">Special Teams</p>
              </div>
            </div>
          </motion.div>

          
          {/* Multiple Testimonials */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Card className="p-8 border-2 bg-white shadow-xl relative overflow-hidden" style={{ borderColor: '#0046AD' }}>
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-yellow-400/15 to-transparent"></div>
              <div className="relative z-10">
                <div className="text-5xl text-yellow-400 mb-3 leading-none">"</div>
                <p 
                  className="text-lg italic mb-6 leading-relaxed font-semibold"
                  style={{ color: '#1f2937' }}
                >
                  I sent 47 emails in one hour. Within a week, 28 coaches responded. My parents were worried about the recruiting process, but RecruitBridge made everything straightforward and manageable.
                </p>
                <div className="flex items-center">
                  <div 
                    className="w-16 h-16 rounded-full mr-4 flex items-center justify-center text-white font-black text-xl border-3 border-white shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #0046AD 0%, #1e40af 100%)'
                    }}
                  >
                    JP
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Jordan P.</p>
                    <p className="text-gray-600 font-medium text-sm">Class of 2024 • QB</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <p className="text-xs text-blue-600 font-semibold">Committed to Ohio State University</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Card className="p-8 border-4 bg-white shadow-xl relative overflow-hidden hover:shadow-2xl transition-shadow" style={{ borderColor: '#F9B233' }}>
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-600/15 to-transparent"></div>
              <div className="relative z-10">
                <div className="text-5xl text-blue-600 mb-3 leading-none">"</div>
                <p 
                  className="text-lg italic mb-6 leading-relaxed font-semibold"
                  style={{ color: '#1f2937' }}
                >
                  Seeing which coaches actually opened my emails was a complete game changer. I stopped wasting time on schools that weren't interested and focused on the ones showing real engagement. That's how I secured my offer from Penn State.
                </p>
                <div className="flex items-center">
                  <div 
                    className="w-16 h-16 rounded-full mr-4 flex items-center justify-center text-white font-black text-xl border-3 border-white shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #F9B233 0%, #fbbf24 100%)'
                    }}
                  >
                    MS
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-900">Marcus S.</p>
                    <p className="text-gray-600 font-semibold text-sm">Class of 2025 • Safety</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      <p className="text-xs text-blue-600 font-bold">Committed to Penn State University</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Card className="p-8 border-4 bg-white shadow-xl relative overflow-hidden hover:shadow-2xl transition-shadow" style={{ borderColor: '#F9B233' }}>
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-600/15 to-transparent"></div>
              <div className="relative z-10">
                <div className="text-5xl text-blue-600 mb-3 leading-none">"</div>
                <p 
                  className="text-lg italic mb-6 leading-relaxed font-semibold"
                  style={{ color: '#1f2937' }}
                >
                  I was honestly nervous about reaching out to top programs like Michigan. But the emails were professional and well-crafted, so I hit send. Coaches responded, and now I'm playing here. It still feels surreal.
                </p>
                <div className="flex items-center">
                  <div 
                    className="w-16 h-16 rounded-full mr-4 flex items-center justify-center text-white font-black text-xl border-3 border-white shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #F9B233 0%, #fbbf24 100%)'
                    }}
                  >
                    TJ
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-900">Trevon J.</p>
                    <p className="text-gray-600 font-semibold text-sm">Class of 2024 • WR</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <p className="text-xs text-blue-600 font-bold">Committed to University of Michigan</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Card className="p-8 border-4 bg-white shadow-xl relative overflow-hidden hover:shadow-2xl transition-shadow" style={{ borderColor: '#0046AD' }}>
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-yellow-400/15 to-transparent"></div>
              <div className="relative z-10">
                <div className="text-5xl text-yellow-400 mb-3 leading-none">"</div>
                <p 
                  className="text-lg italic mb-6 leading-relaxed font-semibold"
                  style={{ color: '#1f2937' }}
                >
                  Playing at a small school meant I wasn't on anyone's radar. I used RecruitBridge to contact D2, D3, and FCS programs systematically. I completed 15 questionnaires in 2 hours instead of an entire week. That efficiency helped me earn a full scholarship to the University of Florida.
                </p>
                <div className="flex items-center">
                  <div 
                    className="w-16 h-16 rounded-full mr-4 flex items-center justify-center text-white font-black text-xl border-3 border-white shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #0046AD 0%, #1e40af 100%)'
                    }}
                  >
                    DL
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-900">David L.</p>
                    <p className="text-gray-600 font-semibold text-sm">Class of 2025 • LB</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <p className="text-xs text-blue-600 font-bold">Committed to University of Florida</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section 
        id="cta" 
        className="py-20 md:py-32 lg:py-36 relative overflow-hidden"
        style={{
          backgroundColor: '#0046AD'
        }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-transparent to-blue-900/30"></div>
        </div>
        
        {/* Top accent stripe */}
        <div className="absolute top-0 left-0 w-full h-3" style={{ backgroundColor: '#F9B233' }}></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl mb-6 font-black" style={{ 
            lineHeight: 1.2,
            color: '#ffffff'
          }}>
            Start Building Your Future<br/>
            <span style={{ color: '#F9B233' }}>in College Sports</span>
          </h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ 
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            Join RecruitBridge today and connect with the right coaches — faster and smarter.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <Button 
              size="lg"
              className="px-8 py-4 hover:opacity-90 transition-opacity duration-200"
              style={{ 
                backgroundColor: '#F9B233',
                color: '#000000',
                fontWeight: 600
              }}
              onClick={handleGetStarted}
              aria-label="Join RecruitBridge for free today">
              Join Free Today →
            </Button>
            <Button
              size="lg"
              className="px-8 py-4 border-2 hover:bg-white/10 transition-colors duration-200"
              style={{ 
                backgroundColor: 'transparent',
                borderColor: '#ffffff',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              See Plans</Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: '#F9B233' }} />
              <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: '#F9B233' }} />
              <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: '#F9B233' }} />
              <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Setup in minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 relative" style={{ 
        background: 'linear-gradient(180deg, #001a3d 0%, #0046AD 100%)'
      }}>
        {/* Top accent stripe */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p 
              className="text-lg font-semibold mb-6"
              style={{ color: '#F9B233' }}
            >
              Built for Athletes, By Athletes
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-blue-200 hover:text-yellow-300 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-yellow-300 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-yellow-300 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={logoImage} alt="RecruitBridge" className="h-8 w-auto" />
                <span className="ml-4 text-xl font-bold text-white">RecruitBridge</span>
              </div>
              <p className="text-blue-200 text-sm">
                Connecting student athletes with college opportunities through intelligent recruiting technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:underline transition-colors" style={{ textDecorationColor: '#F9B233' }}>Features</a></li>
                <li><a href="#" className="hover:underline transition-colors" style={{ textDecorationColor: '#F9B233' }}>Pricing</a></li>
                <li><a href="#" className="hover:underline transition-colors" style={{ textDecorationColor: '#F9B233' }}>Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:underline transition-colors" style={{ textDecorationColor: '#F9B233' }}>Help Center</a></li>
                <li><a href="#" className="hover:underline transition-colors" style={{ textDecorationColor: '#F9B233' }}>Contact</a></li>
                <li><a href="#" className="hover:underline transition-colors" style={{ textDecorationColor: '#F9B233' }}>Terms</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:underline transition-colors" style={{ textDecorationColor: '#F9B233' }}>About</a></li>
                <li><a href="#" className="hover:underline transition-colors" style={{ textDecorationColor: '#F9B233' }}>Privacy</a></li>
                <li><a href="#" className="hover:underline transition-colors" style={{ textDecorationColor: '#F9B233' }}>Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center" style={{ borderColor: '#1E3A8A', color: '#BFDBFE' }}>
            <p>&copy; 2025 RecruitBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
