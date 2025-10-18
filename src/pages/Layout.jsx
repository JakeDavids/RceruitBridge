
import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { User } from "@/api/entities";
import { Athlete } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
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
  BookOpen
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
  SidebarTrigger,
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
  "/pricing"
]);

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

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        // Check if user is authenticated via Supabase
        const currentUser = await User.me();

        if (currentUser) {
          setUser(currentUser);

          // Load athlete profile if exists
          try {
            const athleteData = await Athlete.filter({ created_by: currentUser.email });
            if (athleteData.length > 0) {
              setAthlete(athleteData[0]);
            }
          } catch (error) {
            console.log('No athlete profile yet:', error);
          }
        } else {
          setUser(null);
          setAthlete(null);
        }
      } catch (error) {
        console.log('Auth check error:', error);
        setUser(null);
        setAthlete(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await User.logout();
    } catch (error) {
      console.error("Error logging out:", error);
      window.location.href = "/";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  // Check if current path is public
  const isPublicPath = PUBLIC_PATHS.has(location.pathname);

  // If not authenticated and not on public page, redirect to login
  if (!user && !isPublicPath) {
    return <Navigate to="/login" replace />;
  }

  // If not authenticated and on public page, show without sidebar
  if (!user && isPublicPath) {
    return children;
  }

  // If authenticated and on login/signup page, check onboarding first
  if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
    // If no onboarding completed, go to Profile
    if (!user.onboarding_completed) {
      return <Navigate to="/Profile" replace />;
    }
    // Otherwise go to Dashboard
    return <Navigate to="/Dashboard" replace />;
  }

  // If authenticated but no onboarding completed and not on Profile, redirect to Profile
  if (user && !user.onboarding_completed && location.pathname !== '/Profile') {
    return <Navigate to="/Profile" replace />;
  }

  // ✅ Authenticated routes with sidebar
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6875a318a0b2d879d617363b/202797ade_recruitbrigdelogo.png"
                alt="RecruitBridge Logo"
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-slate-800 tracking-tighter">RecruitBridge</span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="p-3">
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
                      <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
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
                      <ChevronUp className="w-4 h-4 text-slate-400" />
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

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
                <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2">
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6875a318a0b2d879d617363b/202797ade_recruitbrigdelogo.png"
                    alt="RecruitBridge"
                    className="h-8 w-auto"
                  />
                  <span className="font-semibold text-slate-700">RecruitBridge</span>
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
