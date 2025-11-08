import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mail, ArrowLeft, Shield } from "lucide-react";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../config/firebase";
import axios from "axios";
import { RouteGuard } from "@/components/common/RouteGuard";

const Login = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // ✅ Store user data in localStorage
  const storeUserData = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userToken', userData.token || 'user-authenticated');
    localStorage.setItem('userLoginTime', new Date().toISOString());
  };

  // ✅ Clear user data from localStorage
  const clearUserData = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userLoginTime');
  };

  // ✅ Admin Login
  const handleAdminLogin = async () => {
    try {
      setIsLoading(true);
      const { email, password } = formData;

      const response = await axios.post(
        `${process.env.VITE_API_URL}/api/v1/admin/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Store admin info
        localStorage.setItem('adminEmail', response.data.admin.email);
        localStorage.setItem('adminName', response.data.admin.name);
        localStorage.setItem('adminRole', response.data.admin.role);
        localStorage.setItem('adminLoginTime', new Date().toISOString());
        
        // Clear any existing user data (to prevent conflicts)
        clearUserData();
        
        navigate("/admin");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      setError(error.response?.data?.error || "Invalid admin credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ User Email Login
  const handleEmailLogin = async () => {
    try {
      setIsLoading(true);
      const { email, password } = formData;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // Create session with backend
      await axios.post(
        `${process.env.VITE_API_URL}/api/v1/auth/sessionLogin`,
        { idToken },
        { withCredentials: true }
      );

      // ✅ Store user data in localStorage
      const userData = {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        loginTime: new Date().toISOString()
      };

      storeUserData(userData);

      // Clear any existing admin data (to prevent conflicts)
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminName');
      localStorage.removeItem('adminRole');
      localStorage.removeItem('adminLoginTime');

      navigate("/payment");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid credentials or account not found.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Google Login (User only)
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const signin = await signInWithPopup(auth, provider);
      const user = signin.user;
      const idToken = await user.getIdToken();

      // Create session with backend
      await axios.post(
        `${process.env.VITE_API_URL}/api/v1/auth/sessionLogin`,
        { idToken },
        { withCredentials: true }
      );

      // ✅ Store user data in localStorage
      const userData = {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        loginTime: new Date().toISOString(),
        isGoogleUser: true
      };

      storeUserData(userData);

      // Clear any existing admin data (to prevent conflicts)
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminName');
      localStorage.removeItem('adminRole');
      localStorage.removeItem('adminLoginTime');

      navigate("/payment");
    } catch (error) {
      console.error("Google login error:", error);
      setError("Something went wrong during Google login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (isAdminMode) {
      handleAdminLogin();
    } else {
      handleEmailLogin();
    }
  };

  return (
    <RouteGuard>
    <motion.div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
      <Card className="bg-background/80 backdrop-blur-sm border-border shadow-soft w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {isAdminMode && <Shield className="w-6 h-6 text-primary" />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isAdminMode ? "Admin Login" : "Welcome Back"}
          </CardTitle>
          <CardDescription>
            {isAdminMode ? "Login to Admin Panel" : "Login with Email or Google"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Toggle Admin/User Mode */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setError("");
                setFormData({ email: "", password: "" });
              }}
              className="text-sm text-primary hover:underline flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              {isAdminMode ? "Switch to User Login" : "Admin Login"}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-background/50"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:shadow-glow"
            >
              {isLoading ? "Signing in..." : isAdminMode ? "Login as Admin" : "Login"}
            </Button>

            {/* Google Login - Only for regular users */}
            {!isAdminMode && (
              <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Continue with Google
              </Button>
            )}
          </div>

          {/* Sign up link - Only for regular users */}
          {!isAdminMode && (
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Create one
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
    </RouteGuard>
  );
};

export default Login;