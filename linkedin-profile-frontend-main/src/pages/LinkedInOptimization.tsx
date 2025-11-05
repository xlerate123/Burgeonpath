import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";

const LinkedInOptimization = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Goal Selection
    goal: "",
    specificGoal: "",
    
    // Step 2: Region & Location
    region: "",
    country: "",
    timezone: "",
    languages: [] as string[],
    
    // Step 3: Behavior & Preferences
    industry: "",
    experienceLevel: "",
    networkingStyle: "",
    contentPreferences: [] as string[],
    postingFrequency: "",
    engagementStyle: "",
    
    // Step 4: LinkedIn Information
    linkedinUrl: "",
    currentTitle: "",
    company: "",
    summary: "",
    skills: [] as string[],
    achievements: "",
    
    // Step 5: File Upload
    linkedinPdf: null as File | null,
    additionalFiles: [] as File[],
  });

  const totalSteps = 5;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field as keyof typeof prev] as string[], value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (files) {
      if (field === 'linkedinPdf') {
        setFormData(prev => ({ ...prev, [field]: files[0] }));
      } else {
        setFormData(prev => ({ 
          ...prev, 
          [field]: [...prev[field as keyof typeof prev] as File[], ...Array.from(files)]
        }));
      }
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Handle successful submission
    }, 3000);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">What's Your Goal?</h2>
        <p className="text-muted-foreground">Help us understand what you want to achieve with LinkedIn optimization</p>
      </div>

      <RadioGroup value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
        <div className="grid gap-4">
          <div className="flex items-center space-x-3 p-4 border border-input rounded-xl hover:border-primary/50 transition-colors">
            <RadioGroupItem value="job" id="job" />
            <Label htmlFor="job" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Find a Job</h3>
                  <p className="text-sm text-muted-foreground">Optimize your profile to attract recruiters and land your dream job</p>
                </div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-4 border border-input rounded-xl hover:border-primary/50 transition-colors">
            <RadioGroupItem value="business" id="business" />
            <Label htmlFor="business" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Grow Your Business</h3>
                  <p className="text-sm text-muted-foreground">Build authority, generate leads, and expand your professional network</p>
                </div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-4 border border-input rounded-xl hover:border-primary/50 transition-colors">
            <RadioGroupItem value="creator" id="creator" />
            <Label htmlFor="creator" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h2m0 0h8M9 8h6m-6 4h6m-6 4h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Build Personal Brand</h3>
                  <p className="text-sm text-muted-foreground">Establish yourself as a thought leader and content creator</p>
                </div>
              </div>
            </Label>
          </div>
        </div>
      </RadioGroup>

      {formData.goal && (
        <div className="space-y-2">
          <Label htmlFor="specificGoal" className="text-sm font-medium text-foreground">
            Tell us more about your specific goal
          </Label>
          <Textarea
            id="specificGoal"
            placeholder="e.g., I want to transition from marketing to product management in the tech industry..."
            value={formData.specificGoal}
            onChange={(e) => handleInputChange('specificGoal', e.target.value)}
            className="min-h-[100px] rounded-xl border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Location & Region</h2>
        <p className="text-muted-foreground">Help us understand your target market and location preferences</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="region" className="text-sm font-medium text-foreground">Primary Region</Label>
          <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
            <SelectTrigger className="h-12 rounded-xl border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select your region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north-america">North America</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
              <SelectItem value="latin-america">Latin America</SelectItem>
              <SelectItem value="middle-east-africa">Middle East & Africa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-medium text-foreground">Country</Label>
          <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
            <SelectTrigger className="h-12 rounded-xl border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="fr">France</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="in">India</SelectItem>
              <SelectItem value="sg">Singapore</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone" className="text-sm font-medium text-foreground">Timezone</Label>
        <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
          <SelectTrigger className="h-12 rounded-xl border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20">
            <SelectValue placeholder="Select your timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
            <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
            <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
            <SelectItem value="cet">Central European Time (CET)</SelectItem>
            <SelectItem value="ist">Indian Standard Time (IST)</SelectItem>
            <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Languages (Select all that apply)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian'].map((language) => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox
                id={language}
                checked={formData.languages.includes(language)}
                onCheckedChange={(checked) => handleArrayChange('languages', language, checked as boolean)}
              />
              <Label htmlFor={language} className="text-sm text-muted-foreground">{language}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Behavior & Preferences</h2>
        <p className="text-muted-foreground">Tell us about your professional behavior and content preferences</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="industry" className="text-sm font-medium text-foreground">Industry</Label>
          <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
            <SelectTrigger className="h-12 rounded-xl border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="real-estate">Real Estate</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experienceLevel" className="text-sm font-medium text-foreground">Experience Level</Label>
          <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
            <SelectTrigger className="h-12 rounded-xl border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
              <SelectItem value="mid">Mid Level (3-7 years)</SelectItem>
              <SelectItem value="senior">Senior Level (8-15 years)</SelectItem>
              <SelectItem value="executive">Executive Level (15+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="networkingStyle" className="text-sm font-medium text-foreground">Networking Style</Label>
        <RadioGroup value={formData.networkingStyle} onValueChange={(value) => handleInputChange('networkingStyle', value)}>
          <div className="grid gap-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="active" id="active" />
              <Label htmlFor="active">Active - I regularly engage and post content</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="moderate" />
              <Label htmlFor="moderate">Moderate - I engage occasionally and selectively</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="passive" id="passive" />
              <Label htmlFor="passive">Passive - I mostly consume content and respond when needed</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Content Preferences (Select all that apply)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Industry News', 'Professional Tips', 'Company Updates', 'Personal Stories', 'Educational Content', 'Thought Leadership', 'Job Opportunities', 'Networking Events', 'Case Studies', 'Trends & Insights'].map((preference) => (
            <div key={preference} className="flex items-center space-x-2">
              <Checkbox
                id={preference}
                checked={formData.contentPreferences.includes(preference)}
                onCheckedChange={(checked) => handleArrayChange('contentPreferences', preference, checked as boolean)}
              />
              <Label htmlFor={preference} className="text-sm text-muted-foreground">{preference}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="postingFrequency" className="text-sm font-medium text-foreground">Posting Frequency</Label>
          <Select value={formData.postingFrequency} onValueChange={(value) => handleInputChange('postingFrequency', value)}>
            <SelectTrigger className="h-12 rounded-xl border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="How often do you post?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="rarely">Rarely</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="engagementStyle" className="text-sm font-medium text-foreground">Engagement Style</Label>
          <Select value={formData.engagementStyle} onValueChange={(value) => handleInputChange('engagementStyle', value)}>
            <SelectTrigger className="h-12 rounded-xl border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="How do you engage?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="likes">Mostly likes and reactions</SelectItem>
              <SelectItem value="comments">Comments and discussions</SelectItem>
              <SelectItem value="shares">Shares and reposts</SelectItem>
              <SelectItem value="mixed">Mixed engagement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">LinkedIn Information</h2>
        <p className="text-muted-foreground">Provide your current LinkedIn profile details</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedinUrl" className="text-sm font-medium text-foreground">LinkedIn Profile URL</Label>
        <Input
          id="linkedinUrl"
          type="url"
          placeholder="https://linkedin.com/in/yourprofile"
          value={formData.linkedinUrl}
          onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
          className="h-12 rounded-xl border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="currentTitle" className="text-sm font-medium text-foreground">Current Job Title</Label>
          <Input
            id="currentTitle"
            placeholder="e.g., Senior Marketing Manager"
            value={formData.currentTitle}
            onChange={(e) => handleInputChange('currentTitle', e.target.value)}
            className="h-12 rounded-xl border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-sm font-medium text-foreground">Current Company</Label>
          <Input
            id="company"
            placeholder="e.g., Tech Corp Inc."
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="h-12 rounded-xl border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary" className="text-sm font-medium text-foreground">Professional Summary</Label>
        <Textarea
          id="summary"
          placeholder="Tell us about your professional background, expertise, and career goals..."
          value={formData.summary}
          onChange={(e) => handleInputChange('summary', e.target.value)}
          className="min-h-[120px] rounded-xl border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Key Skills (Select your top skills)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Project Management', 'Digital Marketing', 'Data Analysis', 'Leadership', 'Sales', 'Design', 'Programming', 'Communication', 'Strategy', 'Customer Service', 'Research', 'Training'].map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={skill}
                checked={formData.skills.includes(skill)}
                onCheckedChange={(checked) => handleArrayChange('skills', skill, checked as boolean)}
              />
              <Label htmlFor={skill} className="text-sm text-muted-foreground">{skill}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="achievements" className="text-sm font-medium text-foreground">Key Achievements</Label>
        <Textarea
          id="achievements"
          placeholder="List your major professional achievements, awards, or notable projects..."
          value={formData.achievements}
          onChange={(e) => handleInputChange('achievements', e.target.value)}
          className="min-h-[100px] rounded-xl border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Upload Your LinkedIn Data</h2>
        <p className="text-muted-foreground">Upload your LinkedIn profile data to help us create a personalized optimization plan</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="linkedinPdf" className="text-sm font-medium text-foreground">
            LinkedIn Profile PDF (Required)
          </Label>
          <div className="border-2 border-dashed border-input rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {formData.linkedinPdf ? formData.linkedinPdf.name : 'Click to upload or drag and drop your LinkedIn profile PDF'}
            </p>
            <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
            <input
              id="linkedinPdf"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload('linkedinPdf', e.target.files)}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => document.getElementById('linkedinPdf')?.click()}
            >
              Choose File
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalFiles" className="text-sm font-medium text-foreground">
            Additional Files (Optional)
          </Label>
          <div className="border-2 border-dashed border-input rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Upload resume, portfolio, or other relevant documents
            </p>
            <input
              id="additionalFiles"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => handleFileUpload('additionalFiles', e.target.files)}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('additionalFiles')?.click()}
            >
              Choose Files
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-orb rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-orb rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-orb rounded-full opacity-5 blur-2xl"></div>
      </div>

      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">LinkedIn Profile Optimization</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Let's create a personalized optimization strategy that will transform your LinkedIn presence
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-gradient-primary h-3 rounded-full transition-all duration-500 shadow-soft"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    i + 1 <= currentStep 
                      ? 'bg-gradient-primary text-white shadow-soft' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                      i + 1 < currentStep ? 'bg-gradient-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Form Card */}
          <Card className="shadow-soft border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
                {currentStep === 5 && renderStep5()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-12 pt-8 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-8 h-12 rounded-xl"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Button>
                  
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="px-8 h-12 bg-gradient-primary hover:shadow-glow text-white rounded-xl font-medium"
                    >
                      Next Step
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 h-12 bg-gradient-primary hover:shadow-glow text-white rounded-xl font-medium"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating Your Strategy...
                        </div>
                      ) : (
                        <>
                          Complete Optimization
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Need help? Our team is here to assist you
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Live Chat
              </Button>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInOptimization;