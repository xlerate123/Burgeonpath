import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  User, 
  Target, 
  MapPin, 
  Brain, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const UserInput = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    careerGoal: '',
    region: '',
    behaviorType: '',
    linkedinPurpose: '',
    additionalInfo: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const careerGoals = [
    { value: 'job-seeker', label: 'Job Seeker', description: 'Looking for new opportunities' },
    { value: 'career-growth', label: 'Career Growth', description: 'Advancing in current role' },
    { value: 'business-owner', label: 'Business Owner', description: 'Growing my business' },
    { value: 'content-creator', label: 'Content Creator', description: 'Building personal brand' },
    { value: 'freelancer', label: 'Freelancer', description: 'Finding clients and projects' },
    { value: 'student', label: 'Student', description: 'Building professional presence' }
  ];

  const regions = [
    { value: 'north', label: 'North India', description: 'Delhi, Punjab, Haryana, etc.' },
    { value: 'south', label: 'South India', description: 'Tamil Nadu, Karnataka, Kerala, etc.' },
    { value: 'east', label: 'East India', description: 'West Bengal, Odisha, Bihar, etc.' },
    { value: 'west', label: 'West India', description: 'Maharashtra, Gujarat, Rajasthan, etc.' },
    { value: 'central', label: 'Central India', description: 'Madhya Pradesh, Chhattisgarh, etc.' },
    { value: 'northeast', label: 'Northeast India', description: 'Assam, Manipur, Meghalaya, etc.' },
    { value: 'international', label: 'International', description: 'Outside India' }
  ];

  const behaviorTypes = [
    { value: 'hustler', label: 'Hustler', description: 'Action-oriented, results-driven' },
    { value: 'observer', label: 'Observer', description: 'Analytical, detail-focused' },
    { value: 'analyst', label: 'Analyst', description: 'Data-driven, strategic thinker' },
    { value: 'collaborator', label: 'Collaborator', description: 'Team-oriented, relationship builder' },
    { value: 'innovator', label: 'Innovator', description: 'Creative, forward-thinking' }
  ];

  const linkedinPurposes = [
    { value: 'networking', label: 'Professional Networking', description: 'Building connections' },
    { value: 'job-search', label: 'Job Search', description: 'Finding employment opportunities' },
    { value: 'business-development', label: 'Business Development', description: 'Growing business' },
    { value: 'thought-leadership', label: 'Thought Leadership', description: 'Sharing expertise' },
    { value: 'recruitment', label: 'Recruitment', description: 'Hiring talent' },
    { value: 'learning', label: 'Learning & Development', description: 'Skill building' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        break;
      case 2:
        if (!formData.careerGoal) newErrors.careerGoal = 'Career goal is required';
        break;
      case 3:
        if (!formData.region) newErrors.region = 'Region is required';
        break;
      case 4:
        if (!formData.behaviorType) newErrors.behaviorType = 'Behavior type is required';
        break;
      case 5:
        if (!formData.linkedinPurpose) newErrors.linkedinPurpose = 'LinkedIn purpose is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      navigate('/profile-upload');
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Career Goal', icon: Target },
    { number: 3, title: 'Region', icon: MapPin },
    { number: 4, title: 'Behavior', icon: Brain },
    { number: 5, title: 'LinkedIn Purpose', icon: CheckCircle }
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold">Tell Us About Yourself</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us personalize your LinkedIn optimization experience
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCompleted
                        ? 'bg-primary border-primary text-white'
                        : isActive
                        ? 'bg-primary border-primary text-white'
                        : 'bg-background border-border text-muted-foreground'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Form Content */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="bg-background/80 backdrop-blur-sm border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl">
                  Step {currentStep}: {steps[currentStep - 1].title}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Let's start with your basic information"}
                  {currentStep === 2 && "What's your primary career objective?"}
                  {currentStep === 3 && "Which region do you work in?"}
                  {currentStep === 4 && "How would you describe your work style?"}
                  {currentStep === 5 && "What's your main LinkedIn goal?"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        className="bg-background/50"
                      />
                      {errors.name && (
                        <div className="flex items-center gap-2 text-destructive text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                      <Textarea
                        id="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                        placeholder="Tell us anything else that might help personalize your experience..."
                        className="bg-background/50 min-h-[100px]"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Career Goal */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <RadioGroup
                      value={formData.careerGoal}
                      onValueChange={(value) => handleInputChange('careerGoal', value)}
                    >
                      {careerGoals.map((goal) => (
                        <motion.div
                          key={goal.value}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                        >
                          <RadioGroupItem value={goal.value} id={goal.value} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={goal.value} className="font-medium cursor-pointer">
                              {goal.label}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </RadioGroup>
                    {errors.careerGoal && (
                      <div className="flex items-center gap-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.careerGoal}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Region */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <RadioGroup
                      value={formData.region}
                      onValueChange={(value) => handleInputChange('region', value)}
                    >
                      {regions.map((region) => (
                        <motion.div
                          key={region.value}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                        >
                          <RadioGroupItem value={region.value} id={region.value} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={region.value} className="font-medium cursor-pointer">
                              {region.label}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">{region.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </RadioGroup>
                    {errors.region && (
                      <div className="flex items-center gap-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.region}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 4: Behavior Type */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <RadioGroup
                      value={formData.behaviorType}
                      onValueChange={(value) => handleInputChange('behaviorType', value)}
                    >
                      {behaviorTypes.map((behavior) => (
                        <motion.div
                          key={behavior.value}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                        >
                          <RadioGroupItem value={behavior.value} id={behavior.value} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={behavior.value} className="font-medium cursor-pointer">
                              {behavior.label}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">{behavior.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </RadioGroup>
                    {errors.behaviorType && (
                      <div className="flex items-center gap-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.behaviorType}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 5: LinkedIn Purpose */}
                {currentStep === 5 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <RadioGroup
                      value={formData.linkedinPurpose}
                      onValueChange={(value) => handleInputChange('linkedinPurpose', value)}
                    >
                      {linkedinPurposes.map((purpose) => (
                        <motion.div
                          key={purpose.value}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                        >
                          <RadioGroupItem value={purpose.value} id={purpose.value} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={purpose.value} className="font-medium cursor-pointer">
                              {purpose.label}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">{purpose.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </RadioGroup>
                    {errors.linkedinPurpose && (
                      <div className="flex items-center gap-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.linkedinPurpose}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {currentStep === 5 ? (
                      <Button
                        onClick={handleSubmit}
                        className="bg-gradient-primary hover:shadow-glow"
                      >
                        Continue to Profile Upload
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        className="bg-gradient-primary hover:shadow-glow"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserInput;
