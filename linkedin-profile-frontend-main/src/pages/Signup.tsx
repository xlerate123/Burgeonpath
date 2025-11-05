import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, ArrowLeft, CheckCircle, Eye, EyeOff, School } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCustomToken
} from "firebase/auth";
import { app } from "../config/firebase";
import axios from "axios";
import { RouteGuard } from "@/components/common/RouteGuard";

const Signup = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    background: "College",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);

  // ✅ Store user data in localStorage
  const storeUserData = (userData: any) => {
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

  // ✅ Clear admin data to prevent conflicts
  const clearAdminData = () => {
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminLoginTime');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Navigate to student registration page
  const handleStudentRegistration = () => {
    navigate("/student-registration");
  };

  // ✅ Email Signup with unified schema
  const handleEmailSignup = async () => {
    try {
      setIsLoading(true);
      setError("");
      const { firstName, lastName, email, phone, background, password } = formData;

      // 1️⃣ Register user with backend (creates Firebase user + Firestore profile)
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        {
          firstName,
          lastName,
          email,
          phone,
          background,
          password
        }
      );

      const { user, customToken } = response.data;

      // 2️⃣ Sign in with custom token
      const userCredential = await signInWithCustomToken(auth, customToken);
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      // 3️⃣ Create secure session cookie
      await axios.post(
        "http://localhost:5000/api/v1/auth/sessionLogin",
        { idToken },
        { withCredentials: true }
      );

      // ✅ STORE USER DATA IN LOCALSTORAGE
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: `${firstName} ${lastName}`.trim(),
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        background: background,
        emailVerified: firebaseUser.emailVerified,
        loginTime: new Date().toISOString(),
        signupMethod: 'email'
      };

      storeUserData(userData);
      
      // ✅ CLEAR ANY EXISTING ADMIN DATA
      clearAdminData();

      // 4️⃣ Show success and redirect
      setShowSuccessPopup(true);
      setTimeout(() => {
        navigate("/payment");
      }, 1500);
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Google Signup with profile completion
  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const signin = await signInWithPopup(auth, provider);
      const user = signin.user;
      const idToken = await user.getIdToken();

      // 1️⃣ Send to backend for unified user creation
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/google",
        { idToken },
        { withCredentials: true }
      );

      const { user: backendUser, isNewUser, customToken } = response.data;

      // 2️⃣ Create secure session cookie
      await axios.post(
        "http://localhost:5000/api/v1/auth/sessionLogin",
        { idToken },
        { withCredentials: true }
      );

      // ✅ STORE USER DATA IN LOCALSTORAGE
      const userData = {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email?.split('@')[0] || 'User',
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        loginTime: new Date().toISOString(),
        signupMethod: 'google',
        isNewUser: isNewUser
      };

      storeUserData(userData);
      
      // ✅ CLEAR ANY EXISTING ADMIN DATA
      clearAdminData();

      // 3️⃣ If new Google user, show profile completion
      if (isNewUser) {
        setGoogleUser(backendUser);
        setShowProfileCompletion(true);
      } else {
        // Existing user, go to payment
        navigate("/payment");
      }
    } catch (error: any) {
      console.error("Google signup error:", error);
      setError(error.response?.data?.message || "Something went wrong with Google signup.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Complete profile for Google users
  const handleCompleteProfile = async () => {
    try {
      setIsLoading(true);
      
      await axios.post(
        "http://localhost:5000/api/v1/auth/complete-profile",
        {
          uid: googleUser.uid,
          phone: formData.phone,
          background: formData.background
        },
        { withCredentials: true }
      );

      // ✅ UPDATE USER DATA IN LOCALSTORAGE WITH COMPLETED PROFILE
      const existingUserData = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUserData = {
        ...existingUserData,
        phone: formData.phone,
        background: formData.background,
        profileCompleted: true,
        profileCompletionTime: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUserData));

      // Redirect to payment after profile completion
      navigate("/payment");
    } catch (error: any) {
      console.error("Profile completion error:", error);
      setError(error.response?.data?.message || "Failed to complete profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RouteGuard>
    <motion.div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="fixed top-6 left-6 z-50">
        <Link to="/">
          <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Profile Completion Modal for Google Users */}
      {showProfileCompletion && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-background/95 p-8 rounded-2xl border border-border shadow-lg max-w-md w-full mx-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-lg font-semibold mb-4">Complete Your Profile</h3>
            <p className="text-muted-foreground mb-6">
              Please provide some additional information to complete your profile.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91-0000000000"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="background">Background</Label>
                <Select
                  value={formData.background}
                  onValueChange={(value) => handleSelectChange("background", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your background" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="College">College</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm mt-4">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowProfileCompletion(false);
                  setGoogleUser(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCompleteProfile}
                disabled={isLoading}
                className="flex-1 bg-gradient-primary hover:shadow-glow"
              >
                {isLoading ? "Saving..." : "Complete Profile"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <motion.div className="w-full max-w-md">
          <Card className="bg-background/80 backdrop-blur-sm border-border shadow-soft">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>Start your free trial today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Student Registration Option */}
              <div className="text-center">
                <Button 
                  onClick={handleStudentRegistration}
                  variant="outline" 
                  className="w-full border-primary/20 hover:border-primary/40"
                >
                  <School className="w-4 h-4 mr-2" />
                  Student Registration (With Referral Code)
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  For students with institution referral codes
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <div className="h-px w-16 bg-border" />
                <span>or</span>
                <div className="h-px w-16 bg-border" />
              </div>

              {/* Google Signup */}
              <Button 
                onClick={handleGoogleSignup} 
                variant="outline" 
                className="w-full"
                disabled={isLoading}
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Continue with Google
              </Button>

              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <div className="h-px w-16 bg-border" />
                <span>or</span>
                <div className="h-px w-16 bg-border" />
              </div>

              {/* Email Signup Form */}
              <div className="space-y-3">
                <Input 
                  name="firstName" 
                  placeholder="First Name" 
                  value={formData.firstName} 
                  onChange={handleInputChange} 
                />
                <Input 
                  name="lastName" 
                  placeholder="Last Name" 
                  value={formData.lastName} 
                  onChange={handleInputChange} 
                />
                <Input 
                  name="email" 
                  type="email" 
                  placeholder="Email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                />
                <Input 
                  name="phone" 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                />
                
                <div>
                  <Label htmlFor="background">Background</Label>
                  <Select
                    value={formData.background}
                    onValueChange={(value) => handleSelectChange("background", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your background" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="College">College</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleEmailSignup}
                  disabled={isLoading}
                  className="w-full bg-gradient-primary hover:shadow-glow"
                >
                  {isLoading ? "Creating..." : "Create Account"}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ✅ Success Popup */}
      {showSuccessPopup && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-background/95 p-8 rounded-2xl border border-border text-center shadow-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Account Created Successfully!</h3>
            <p className="text-muted-foreground mt-2">Redirecting to your payment page...</p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
    </RouteGuard>
  );
};

export default Signup;