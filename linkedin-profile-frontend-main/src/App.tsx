import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Features from "./pages/Features";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Demo from "./pages/Demo";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Payment from "./pages/Payment";
import EducationalContent from "./pages/EducationalContent";
import UserInput from "./pages/UserInput";
import ProfileUpload from "./pages/ProfileUpload";
import AIEvaluation from "./pages/AIEvaluation";
import LinkedInOptimization from "./pages/LinkedInOptimization";
import LinkedInResults from "./pages/LinkedInResults";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import ChangePassword from "./pages/ChangePassword";
import Rocket from "./pages/Rocket";
import QuickAssement from "./pages/QuickAssesment";
import AdminPanel from './pages/climbloop_admin';
import StudentSignup from './pages/Student_reg'
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-bl from-purple-100 to-purple-50 w-full overflow-x-hidden">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/educational-content" element={<EducationalContent />} />
            <Route path="/user-input" element={<UserInput />} />
            <Route path="/profile-upload" element={<ProfileUpload />} />
            <Route path="/ai-evaluation" element={<AIEvaluation />} />
            <Route path="/linkedin-optimization" element={<LinkedInOptimization />} />
            <Route path="/linkedin-results" element={<LinkedInResults />} />
            <Route path="/community" element={<Community />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/rocket" element={<Rocket />} />
            <Route path="/quiz" element={<QuickAssement />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/student-registration" element={<StudentSignup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
