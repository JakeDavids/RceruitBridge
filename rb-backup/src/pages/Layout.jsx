
import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { User } from "@/api/entities";
import { Athlete } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ErrorBoundary from "@/components/ErrorBoundary";
import { motion, AnimatePresence } from "framer-motion";
import { GlobalWalkthroughProvider } from "@/components/onboarding/GlobalWalkthroughContext";
import {
  LayoutDashboard,
  User as UserIcon,
  Target,
  Send,
  Users,
  Calendar,
  ClipboardList,
  MessageSquare,
  LogOut,
  ChevronUp,
  Settings as SettingsIcon,
  Users2,
  TrendingUp,
  GraduationCap,
  BookOpen,
  Menu,
  X as XIcon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const PUBLIC_PATHS = new Set([
  "/login",
  "/signup",
  "/pricing",
  "/Landing"
]);

const navigationItems = [
  // Dashboard - Blue
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
    colorClass: "from-blue-500 to-indigo-600"
  },
  
  // Core Recruiting Flow - Purple-Indigo
  {
    title: "Target Schools",
    url: createPageUrl("Schools"),
    icon: Target,
    colorClass: "from-purple-500 to-indigo-600"
  },
  {
    title: "Coach Contacts",
    url: createPageUrl("CoachContacts"),
    icon: Users,
    colorClass: "from-purple-500 to-indigo-600"
  },
  {
    title: "Outreach Center",
    url: createPageUrl("OutreachCompose"),
    icon: Send,
    colorClass: "from-purple-500 to-indigo-600"
  },
  {
    title: "Response Center",
    url: createPageUrl("ResponseCenter"),
    icon: MessageSquare,
    colorClass: "from-purple-500 to-indigo-600"
  },
  
  // Tracking & Analytics - Cyan-Blue
  {
    title: "Coach Tracking",
    url: createPageUrl("Tracking"),
    icon: Users,
    colorClass: "from-cyan-500 to-blue-600"
  },
  {
    title: "Coach Analytics",
    url: createPageUrl("CoachAnalytics"),
    icon: TrendingUp,
    colorClass: "from-cyan-500 to-blue-600"
  },
  {
    title: "Action Plan",
    url: createPageUrl("Timeline"),
    icon: Calendar,
    colorClass: "from-cyan-500 to-blue-600"
  },
  {
    title: "Questionnaires",
    url: createPageUrl("Questionnaires"),
    icon: ClipboardList,
    colorClass: "from-cyan-500 to-blue-600"
  },
  
  // Profile - Blue-Purple
  {
    title: "Profile",
    url: createPageUrl("Profile"),
    icon: UserIcon,
    colorClass: "from-blue-500 to-purple-600"
  },
  
  // 1-on-1 Counseling - Purple-Pink
  {
    title: "1-on-1 Counseling",
    url: createPageUrl("RecruitingCounseling"),
    icon: Users2,
    colorClass: "from-purple-500 to-pink-600"
  },
  
  // Feedback - Indigo-Purple
  {
    title: "Feedback",
    url: createPageUrl("Feedback"),
    icon: MessageSquare,
    colorClass: "from-indigo-500 to-purple-600"
  },
];

const bottomNavigationItems = [
  // Resources - Blue-Cyan
  {
    title: "Email Guide",
    url: createPageUrl("EmailGuide"),
    icon: MessageSquare,
    colorClass: "from-blue-500 to-cyan-600"
  },
  {
    title: "Scholarships & NIL",
    url: createPageUrl("ScholarshipsNIL"),
    icon: GraduationCap,
    colorClass: "from-blue-500 to-cyan-600"
  },
  {
    title: "My Recruiting Journey",
    url: createPageUrl("MyRecruitingJourney"),
    icon: BookOpen,
    colorClass: "from-blue-500 to-cyan-600"
  }
];

export default function Layout({ children }) {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [athlete, setAthlete] = React.useState(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false); // Default closed on mobile

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        if (currentUser) {
          const athleteData = await Athlete.filter({ created_by: currentUser.email });
          if (athleteData.length > 0) {
            setAthlete(athleteData[0]);
          }
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [location.pathname]);

  // Close sidebar on route change (mobile)
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await User.logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
      window.location.href = "/login";
    }
  };

  const getPlanName = (plan) => {
    if (!plan) return 'Free Plan';
    return `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`;
  };

  const getPlanStyling = (plan) => {
    switch (plan) {
      case 'unlimited':
        return {
          badgeClass: "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25",
          nameClass: "text-slate-900 font-bold",
          containerClass: "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200",
          icon: "👑"
        };
      case 'core':
        return {
          badgeClass: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0",
          nameClass: "text-slate-900 font-semibold",
          containerClass: "bg-blue-50 border border-blue-200",
          icon: "⚡"
        };
      case 'starter':
        return {
          badgeClass: "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0",
          nameClass: "text-slate-900 font-medium",
          containerClass: "bg-green-50 border border-green-200",
          icon: "🌟"
        };
      default:
        return {
          badgeClass: "bg-gray-100 text-gray-800 border-gray-200",
          nameClass: "text-slate-900",
          containerClass: "bg-white",
          icon: "📋"
        };
    }
  };

  const planStyling = getPlanStyling(user?.plan);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  const path = location.pathname;

  // Public routes
  if (PUBLIC_PATHS.has(path)) {
    if (user && path === "/") {
      return <Navigate to={createPageUrl("Dashboard")} replace />;
    }
    return <>{children}</>;
  }

  // Protected routes
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated routes with sidebar
  return (
    <ErrorBoundary>
      <GlobalWalkthroughProvider>
        <SidebarProvider defaultOpen={false} onOpenChange={setSidebarOpen}>
          <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
            
            {/* Mobile Overlay Background */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
              )}
            </AnimatePresence>

            {/* Sidebar - Slides in from left on mobile */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="fixed top-0 left-0 h-full z-50 lg:relative lg:z-auto"
                >
                  <Sidebar className="border-r border-slate-200/60 bg-white shadow-2xl lg:shadow-none h-full">
                    <SidebarHeader className="border-b border-slate-200/60 p-4 flex flex-row items-center justify-between">
                      <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3">
                        <img
                          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6875a318a0b2d879d617363b/202797ade_recruitbrigdelogo.png"
                          alt="RecruitBridge Logo"
                          className="h-8 w-auto"
                        />
                        <span className="text-lg font-bold text-slate-800 tracking-tighter">RecruitBridge</span>
                      </Link>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
                        aria-label="Close sidebar"
                      >
                        <XIcon className="w-5 h-5 text-slate-600" />
                      </button>
                    </SidebarHeader>

                    <SidebarContent className="p-3 overflow-y-auto">
                      <SidebarGroup>
                        <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                          Navigation
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                          <SidebarMenu className="space-y-1">
                            {navigationItems.map((item) => (
                              <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                  asChild
                                  className={`hover:bg-slate-50 transition-all duration-200 rounded-xl group ${
                                    location.pathname === item.url
                                      ? 'bg-gradient-to-r ' + item.colorClass + ' text-white shadow-lg'
                                      : 'text-slate-600'
                                  }`}
                                >
                                  <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                                    <div className={location.pathname === item.url ? "" : `bg-gradient-to-br ${item.colorClass} p-1.5 rounded-lg`}>
                                      <item.icon className={`w-4 h-4 ${location.pathname === item.url ? 'text-white' : 'text-white'}`} />
                                    </div>
                                    <span className="font-medium">{item.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </SidebarGroup>

                      <SidebarGroup className="mt-6">
                        <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                          Resources
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                          <SidebarMenu className="space-y-1">
                            {bottomNavigationItems.map((item) => (
                              <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                  asChild
                                  className={`hover:bg-slate-50 transition-all duration-200 rounded-xl group ${
                                    location.pathname === item.url
                                      ? 'bg-gradient-to-r ' + item.colorClass + ' text-white shadow-lg'
                                      : 'text-slate-600'
                                  }`}
                                >
                                  <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                                    <div className={location.pathname === item.url ? "" : `bg-gradient-to-br ${item.colorClass} p-1.5 rounded-lg`}>
                                      <item.icon className={`w-4 h-4 ${location.pathname === item.url ? 'text-white' : 'text-white'}`} />
                                    </div>
                                    <span className="font-medium">{item.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </SidebarGroup>
                    </SidebarContent>

                    <SidebarFooter className="border-t border-slate-200/60 p-4">
                      <div className="space-y-3">
                        {(!user?.plan || user?.plan === 'free') && (
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-3 text-white text-center">
                            <p className="text-xs font-medium mb-2">🔥 Limited Time</p>
                            <p className="text-sm font-bold mb-2">Upgrade to Unlimited</p>
                            <Link to={createPageUrl("Upgrade")}>
                              <Button size="sm" variant="secondary" className="w-full text-xs">
                                Get 17% Off Today
                              </Button>
                            </Link>
                          </div>
                        )}

                        {user?.plan && user?.plan !== 'free' && (
                          <div className={`rounded-lg p-3 text-center ${planStyling.containerClass}`}>
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <span className="text-lg">{planStyling.icon}</span>
                              <Badge className={planStyling.badgeClass}>
                                {getPlanName(user.plan)}
                              </Badge>
                            </div>
                            {user.plan === 'unlimited' && (
                              <p className="text-xs text-purple-700 font-medium">All features unlocked!</p>
                            )}
                          </div>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-full p-0 h-auto">
                              <div className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                  {user?.profile_picture_url ? (
                                    <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-slate-500 font-semibold text-sm">
                                      {athlete?.first_name ? athlete.first_name[0].toUpperCase() : 'A'}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                  <p className={`text-sm truncate ${planStyling.nameClass}`}>
                                    {athlete ? `${athlete.first_name} ${athlete.last_name}` : 'Athlete'}
                                  </p>
                                  <p className="text-xs text-slate-500 truncate">
                                    {getPlanName(user?.plan)}
                                  </p>
                                </div>
                                <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                              </div>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" side="top" className="w-56">
                            <DropdownMenuItem asChild>
                              <Link to={createPageUrl("Profile")} className="flex items-center gap-2 cursor-pointer">
                                <UserIcon className="w-4 h-4" />
                                <span>Edit Profile</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={createPageUrl("Settings")} className="flex items-center gap-2 cursor-pointer">
                                <SettingsIcon className="w-4 h-4" />
                                <span>Settings</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-600">
                              <LogOut className="w-4 h-4" />
                              <span>Sign Out</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </SidebarFooter>
                  </Sidebar>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main content area */}
            <main className="flex-1 flex flex-col relative">
              {/* Hamburger Menu Button - Always visible on mobile */}
              <motion.button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-4 left-4 z-30 bg-white hover:bg-slate-50 shadow-lg border border-slate-200/60 p-2.5 rounded-lg transition-all duration-200 hover:shadow-xl lg:hidden"
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </motion.button>

              <div className="flex-1 overflow-auto">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </GlobalWalkthroughProvider>
    </ErrorBoundary>
  );
}
