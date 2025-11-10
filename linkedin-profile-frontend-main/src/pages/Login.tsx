import { useState, useEffect } from "react";
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

  const storeUserData = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userToken', userData.token || 'user-authenticated');
    localStorage.setItem('userLoginTime', new Date().toISOString());
  };

  const clearUserData = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userLoginTime');
  };

  const handleAdminLogin = async () => {
    try {
      setIsLoading(true);
      const { email, password } = formData;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem('adminEmail', response.data.admin.email);
        localStorage.setItem('adminName', response.data.admin.name);
        localStorage.setItem('adminRole', response.data.admin.role);
        localStorage.setItem('adminLoginTime', new Date().toISOString());
        clearUserData();
        navigate("/admin");
      } else {
        setError(response.data.error || "Admin login failed.");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError(err.response?.data?.error || "Invalid admin credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    try {
      setIsLoading(true);
      const { email, password } = formData;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/sessionLogin`,
        { idToken },
        { withCredentials: true } // <--- ensure cookie is set by backend
      );

      const userData = {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        loginTime: new Date().toISOString()
      };

      storeUserData(userData);
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminName');
      localStorage.removeItem('adminRole');
      localStorage.removeItem('adminLoginTime');

      navigate("/payment");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials or account not found.");
    } finally {
      setIsLoading(false);
    }
  };

const handleGoogleLogin = async () => {
  try {
    setIsLoading(true);
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user) {
      throw new Error("Google sign-in failed: No user returned.");
    }

    // Get the Firebase ID token
    const idToken = await user.getIdToken(true);

    // Send token to backend to create a secure session
    const resp = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/auth/sessionLogin`,
      { idToken },
      { withCredentials: true } // important for setting cookies
    );

    console.log("Backend session created:", resp.data);

    // Save user locally
    const userData = {
      id: user.uid,
      email: user.email,
      name: user.displayName || (user.email ? user.email.split("@")[0] : ""),
      photoURL: user.photoURL || null,
      emailVerified: user.emailVerified,
      loginTime: new Date().toISOString(),
      isGoogleUser: true,
    };

    storeUserData(userData);
    // clear admin data (just like your existing flow)
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminLoginTime");

    navigate("/payment");
  } catch (err) {
    console.error("Google login error:", err);
    setError(err?.response?.data?.error || err.message || "Google login failed.");
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