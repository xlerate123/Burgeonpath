// src/pages/ProfileUpload.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, ArrowRight, ArrowLeft, X, AlertCircle } from "lucide-react";
import { getAuth } from "firebase/auth";

const API_BASE_URL = "http://localhost:5000/api/v1/profiles";

const ProfileUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState(location.state?.defaultTab || "file");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [profileData, setProfileData] = useState({
    name: "",
    headline: "",
    about: "",
    experience: "",
    education: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleAddSkill = () => {
    const skillValue = skillInput.trim();
    if (skillValue && skills.length < 10 && !skills.includes(skillValue)) {
      setSkills([...skills, skillValue]);
      setSkillInput("");
      if (errors["skills"]) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated["skills"];
          return updated;
        });
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!profileData.name.trim()) newErrors["name"] = "Full name is required";
    if (!profileData.headline.trim()) newErrors["headline"] = "Profile headline is required";
    if (!profileData.about.trim()) newErrors["about"] = "About section is required";
    if (!profileData.experience.trim()) newErrors["experience"] = "Experience summary is required";
    if (!profileData.education.trim()) newErrors["education"] = "Education details are required";
    if (skills.length === 0) newErrors["skills"] = "Please add at least one skill";
    return newErrors;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" || file.size > 5 * 1024 * 1024) {
        setErrors({ file: "Please upload a PDF file under 5MB." });
        return;
      }
      setUploadedFile(file);
      setErrors({});
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrors({});
  };

  const getAuthToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  };

  const handleAnalyze = async () => {
    const formErrors = activeTab === "questionnaire" ? validateForm() : {};
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    if (activeTab === "file" && !uploadedFile) {
      setErrors({ file: "Please upload a PDF file to proceed" });
      return;
    }

    setErrors({});
    setIsAnalyzing(true);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error("No Firebase user found. Please login first.");

const response = await fetch(`${API_BASE_URL}/analyze-profile`, {
  method: "POST",
  credentials: "include", // ✅ important! sends session cookie automatically
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    ...profileData,
    skills,
    fileUploaded: !!uploadedFile,
  }),
});
      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      console.log("AI Response:", data);
      setTimeout(() => {
        navigate("/ai-evaluation", {
          state: { analysis: data.aiAnalysis },
        });
      }, 500);
    } catch (err: any) {
      console.error("Error:", err);
      setErrors({ general: err.message });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isFormValid =
    Object.values(profileData).every((field) => field.trim() !== "") && skills.length > 0;

  return (
    <div className="min-h-screen bg-[#FDFBF8] text-[#4A4A4A] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#3D3D3D]">
            Provide Your Profile Data
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Upload your resume or fill out our form for AI-powered analysis.
          </p>
        </motion.div>

        <Card className="bg-white border-[#F0EAE1] shadow-lg rounded-xl p-4 md:p-8">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-[#F0EAE1]">
                <TabsTrigger
                  value="file"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#C8A2C8]"
                >
                  PDF Upload
                </TabsTrigger>
                <TabsTrigger
                  value="questionnaire"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#C8A2C8]"
                >
                  Questionnaire
                </TabsTrigger>
              </TabsList>

              {/* === File Upload === */}
              <TabsContent value="file" className="mt-6 space-y-4">
                <div className="border-2 border-dashed border-[#DCD7CF] rounded-lg p-8 text-center hover:border-[#C8A2C8] transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="font-semibold text-gray-700">
                      {uploadedFile ? uploadedFile.name : "Click to upload PDF"}
                    </p>
                    <p className="text-sm text-muted-foreground">PDF files only, max 5MB</p>
                  </label>
                </div>
                {errors["file"] && (
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors["file"]}
                  </p>
                )}
              </TabsContent>

              {/* === Questionnaire === */}
              <TabsContent value="questionnaire" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {["name", "headline", "about", "experience", "education"].map((field) => (
                    <div
                      key={field}
                      className={["about", "experience", "education"].includes(field) ? "md:col-span-2" : ""}
                    >
                      <Label htmlFor={field} className="font-semibold text-[#333] capitalize">
                        {field}
                      </Label>
                      {["about", "experience", "education"].includes(field) ? (
                        <Textarea
                          id={field}
                          name={field}
                          value={(profileData as any)[field]}
                          onChange={handleInputChange}
                          className="mt-1 border-2 border-[#DCD7CF] focus:border-[#C8A2C8]"
                        />
                      ) : (
                        <Input
                          id={field}
                          name={field}
                          value={(profileData as any)[field]}
                          onChange={handleInputChange}
                          className="mt-1 border-2 border-[#DCD7CF] focus:border-[#C8A2C8]"
                        />
                      )}
                      {errors[field] && (
                        <p className="text-red-600 text-sm">{errors[field]}</p>
                      )}
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <Label htmlFor="skill-input" className="font-semibold text-[#333]">
                      Top Skills
                    </Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="skill-input"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                      />
                      <Button onClick={handleAddSkill}>Add</Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <div
                          key={skill}
                          className="bg-[#F0EAE1] text-[#8E735C] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                        >
                          {skill}
                          <button onClick={() => handleRemoveSkill(skill)}>x</button>
                        </div>
                      ))}
                    </div>
                    {errors["skills"] && (
                      <p className="text-red-600 text-sm">{errors["skills"]}</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#F0EAE1]">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="border-[#A68A6F] text-[#A68A6F]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (activeTab === "file" ? !uploadedFile : !isFormValid)}
                className="bg-gradient-to-r from-[#C8A2C8] to-[#FFB6C1] text-white font-semibold"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileUpload;
