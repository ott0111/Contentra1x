import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider } from "@/lib/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public pages
import Landing from "@/pages/Landing";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";
import Legal from "@/pages/Legal";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Onboarding from "@/pages/Onboarding";

// App shell + pages
import AppLayout from "@/components/AppLayout";
import CommandCenter from "@/pages/app/CommandCenter";
import Ideas from "@/pages/app/Ideas";
import IdeaDetail from "@/pages/app/IdeaDetail";
import ContentStudio from "@/pages/app/ContentStudio";
import ContentDetail from "@/pages/app/ContentDetail";
import Calendar from "@/pages/app/Calendar";
import Library from "@/pages/app/Library";
import Templates from "@/pages/app/Templates";
import ContentraAI from "@/pages/app/ContentraAI";
import Repurpose from "@/pages/app/Repurpose";
import AIStrategy from "@/pages/app/AIStrategy";
import Analytics from "@/pages/app/Analytics";
import GrowthIntelligence from "@/pages/app/GrowthIntelligence";
import Trends from "@/pages/app/Trends";
import Competitors from "@/pages/app/Competitors";
import Goals from "@/pages/app/Goals";
import BrandDeals from "@/pages/app/BrandDeals";
import Revenue from "@/pages/app/Revenue";
import Campaigns from "@/pages/app/Campaigns";
import Team from "@/pages/app/Team";
import Clients from "@/pages/app/Clients";
import Notifications from "@/pages/app/Notifications";
import Settings from "@/pages/app/Settings";
import Billing from "@/pages/app/Billing";

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Legal kind="terms" />} />
            <Route path="/privacy" element={<Legal kind="privacy" />} />
            <Route path="/cookies" element={<Legal kind="cookies" />} />
            <Route path="/refund" element={<Legal kind="refund" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
              <Route element={<AppLayout />}>
                <Route path="/app" element={<CommandCenter />} />
                <Route path="/app/ideas" element={<Ideas />} />
                <Route path="/app/ideas/:id" element={<IdeaDetail />} />
                <Route path="/app/content" element={<ContentStudio />} />
                <Route path="/app/content/:id" element={<ContentDetail />} />
                <Route path="/app/calendar" element={<Calendar />} />
                <Route path="/app/library" element={<Library />} />
                <Route path="/app/templates" element={<Templates />} />
                <Route path="/app/ai" element={<ContentraAI />} />
                <Route path="/app/repurpose" element={<Repurpose />} />
                <Route path="/app/strategy" element={<AIStrategy />} />
                <Route path="/app/analytics" element={<Analytics />} />
                <Route path="/app/growth" element={<GrowthIntelligence />} />
                <Route path="/app/trends" element={<Trends />} />
                <Route path="/app/competitors" element={<Competitors />} />
                <Route path="/app/goals" element={<Goals />} />
                <Route path="/app/brand-deals" element={<BrandDeals />} />
                <Route path="/app/revenue" element={<Revenue />} />
                <Route path="/app/campaigns" element={<Campaigns />} />
                <Route path="/app/team" element={<Team />} />
                <Route path="/app/clients" element={<Clients />} />
                <Route path="/app/notifications" element={<Notifications />} />
                <Route path="/app/settings" element={<Settings />} />
                <Route path="/app/billing" element={<Billing />} />
              </Route>
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
