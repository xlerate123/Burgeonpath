// src/pages/AIEvaluation.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Download, ArrowRight, CheckCircle, Lightbulb, BarChart3, Target, FileText, AlertCircle } from "lucide-react";
import ChatBotUI from "./chatbot";

const AIEvaluation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [parsedData, setParsedData] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const analysis = location.state?.analysis;

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Helper functions - MUST BE DEFINED BEFORE useEffect
  const getScoreColor = (score) =>
    score >= 80 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-red-500";
  
  const getScoreBadge = (score) =>
    score >= 80
      ? "bg-green-100 text-green-800"
      : score >= 60
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

  const handleAnalysisUpdate = (updatedReport) => {
    console.log("Analysis updated by chatbot:", updatedReport);
    // You can update the UI here if the chatbot modifies the analysis
    // For example, re-parse and update parsedData
  };

  const handleDownloadReport = () => {
    const reportData = {
      ...parsedData,
      profileData: typeof analysis === 'object' ? analysis?.profileData : null,
      rawAnalysis: typeof analysis === 'string' ? analysis : analysis?.aiAnalysis,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `AI_Profile_Report_${Date.now()}.json`;
    link.click();
  };

  useEffect(() => {
    console.log("=== EFFECT RUNNING ===");
    console.log("Analysis object:", analysis);
    console.log("Location state:", location.state);

    if (!analysis) {
      console.log("No analysis found, redirecting...");
      navigate("/profile-upload");
      return;
    }

    const timer = setTimeout(() => {
      try {
        // Handle both string and object formats
        const text = typeof analysis === 'string' ? analysis : (analysis.aiAnalysis || "");
        console.log("AI Analysis text length:", text.length);
        console.log("First 200 chars:", text.substring(0, 200));

        const data = {
          careerGoal: "",
          overallFeedback: "",
          writingStyle: "",
          skillAnalysis: "",
          sections: [],
          errors: { spelling: "", grammar: "" },
          overallScore: 0
        };

        // Extract Career Goal
        const careerMatch = text.match(/\*\*Inferred Career Goal:\*\*\s*\n([^\n]+)/);
        if (careerMatch) {
          data.careerGoal = careerMatch[1].trim();
          console.log("✓ Career Goal extracted:", data.careerGoal);
        }

        // Extract Overall Feedback
        const overallMatch = text.match(/\*\*Overall Feedback:\*\*\s*\n([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);
        if (overallMatch) {
          data.overallFeedback = overallMatch[1].trim();
          console.log("✓ Overall Feedback extracted:", data.overallFeedback.substring(0, 100));
        }

        // Extract Writing Style
        const writingMatch = text.match(/\*\*Writing Style Feedback:\*\*\s*\n([\s\S]*?)(?=\n\*\*Skill Analysis)/);
        if (writingMatch) {
          data.writingStyle = writingMatch[1].trim();
          console.log("✓ Writing Style extracted:", data.writingStyle.substring(0, 100));
        }

        // Extract Skill Analysis
        const skillMatch = text.match(/\*\*Skill Analysis:\*\*\s*\n([^\n]+(?:\n(?!---)[^\n]+)*)/);
        if (skillMatch) {
          data.skillAnalysis = skillMatch[1].trim();
          console.log("✓ Skill Analysis extracted:", data.skillAnalysis.substring(0, 100));
        }

        // Extract all section recommendations
        const sectionPattern = /\*\*([^:]+) Section:\*\*\s*\n\s*-\s*Suggestion:\s*([^\n]+)\s*\n\s*-\s*Reasoning:\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/g;
        let sectionMatch;
        const scores = [];

        while ((sectionMatch = sectionPattern.exec(text)) !== null) {
          const [, title, suggestion, reasoning] = sectionMatch;
          
          // Calculate score
          const content = (suggestion + reasoning).toLowerCase();
          let score = 60;
          
          if (content.includes('lacks') || content.includes('needs to') || content.includes('currently lacks')) {
            score = 45;
          } else if (content.includes('add') || content.includes('provide') || content.includes('expand')) {
            score = 55;
          } else if (content.includes('enhance') || content.includes('improve')) {
            score = 65;
          } else if (content.includes('consider') || content.includes('include')) {
            score = 58;
          }

          scores.push(score);
          data.sections.push({
            title: title.trim(),
            suggestion: suggestion.trim(),
            reasoning: reasoning.trim(),
            score: score
          });

          console.log(`✓ Section extracted: ${title} (Score: ${score})`);
        }

        // Extract errors
        const spellingMatch = text.match(/\*\*Spelling:\*\*\s*\n\s*-\s*([^\n]+)/);
        if (spellingMatch) {
          data.errors.spelling = spellingMatch[1].trim();
          if (data.errors.spelling.toLowerCase().includes('no')) {
            scores.push(100);
          }
          console.log("✓ Spelling extracted:", data.errors.spelling);
        }

        const grammarMatch = text.match(/\*\*Grammar:\*\*\s*\n\s*-\s*([^\n]+)/);
        if (grammarMatch) {
          data.errors.grammar = grammarMatch[1].trim();
          if (data.errors.grammar.toLowerCase().includes('no')) {
            scores.push(100);
          }
          console.log("✓ Grammar extracted:", data.errors.grammar);
        }

        // Calculate overall score
        if (scores.length > 0) {
          data.overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        } else {
          data.overallScore = 70;
        }

        console.log("=== FINAL PARSED DATA ===");
        console.log("Overall Score:", data.overallScore);
        console.log("Sections count:", data.sections.length);
        console.log("All scores:", scores);
        console.log("Full data object:", data);

        setDebugInfo(`Parsed ${data.sections.length} sections with overall score ${data.overallScore}`);
        setParsedData(data);
        
        // Store the FULL analysis text for chatbot (not just parsed data)
        const fullAnalysisText = typeof analysis === 'string' ? analysis : (analysis.aiAnalysis || "");
        setCurrentAnalysis(fullAnalysisText);
        console.log("Stored analysis for chatbot:", fullAnalysisText.substring(0, 100));
        
        setIsAnalyzing(false);

      } catch (error) {
        console.error("❌ Parsing error:", error);
        setDebugInfo(`Error: ${error.message}`);
        setParsedData({
          careerGoal: "Error parsing data",
          overallFeedback: "An error occurred while parsing the analysis",
          sections: [],
          errors: { spelling: "", grammar: "" },
          overallScore: 0,
          writingStyle: "",
          skillAnalysis: ""
        });
        setIsAnalyzing(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [analysis, navigate, location.state]);

  if (isAnalyzing) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center space-y-8" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <motion.div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <Brain className="w-12 h-12 text-white" />
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Analyzing Your Profile</h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Our AI is evaluating your profile and generating personalized insights...
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div key={i} className="w-2 h-2 bg-primary rounded-full" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">This may take a few moments</p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (!parsedData || parsedData.sections.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              Unable to Load Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We encountered an issue loading your analysis data.
            </p>
            {debugInfo && (
              <div className="bg-muted p-3 rounded text-sm font-mono">
                {debugInfo}
              </div>
            )}
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded overflow-auto max-h-40">
              <strong>Debug Info:</strong><br/>
              Analysis type: {typeof analysis}<br/>
              Analysis exists: {analysis ? 'Yes' : 'No'}<br/>
              Text length: {typeof analysis === 'string' ? analysis.length : (analysis?.aiAnalysis?.length || 0)}<br/>
              Parsed sections: {parsedData?.sections?.length || 0}<br/>
              First 100 chars: {typeof analysis === 'string' ? analysis.substring(0, 100) : (analysis?.aiAnalysis?.substring(0, 100) || 'None')}
            </div>
            <Button onClick={() => navigate("/profile-upload")} className="w-full">
              Go Back to Upload
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5" variants={pageVariants} initial="hidden" animate="visible">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div className="text-center space-y-4 mb-8" variants={itemVariants}>
          <motion.div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto" whileHover={{ scale: 1.05, rotate: 5 }} transition={{ duration: 0.3 }}>
            <BarChart3 className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold">AI Profile Analysis</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Personalized insights for your profile
          </p>
        </motion.div>

        {/* Career Goal Card */}
        {parsedData.careerGoal && (
          <motion.div variants={itemVariants} className="mb-6">
            <Card className="bg-background/80 backdrop-blur-sm border-border shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Inferred Career Goal</h3>
                    <p className="text-muted-foreground leading-relaxed">{parsedData.careerGoal}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Overall Score */}
        <motion.div variants={itemVariants} className="mb-6">
          <Card className="bg-background/80 backdrop-blur-sm border-border shadow-soft">
            <CardContent className="p-8 text-center space-y-6">
              <h2 className="text-2xl font-bold">Overall Profile Score</h2>
              <div className="flex items-center justify-center gap-4">
                <div className={`text-6xl font-bold ${getScoreColor(parsedData.overallScore)}`}>
                  {parsedData.overallScore}
                </div>
                <div className="text-2xl text-muted-foreground">/ 100</div>
              </div>
              <Badge className={`text-lg px-4 py-2 ${getScoreBadge(parsedData.overallScore)}`}>
                {parsedData.overallScore >= 80 ? "Excellent" : parsedData.overallScore >= 60 ? "Good" : "Needs Improvement"}
              </Badge>
              <Progress value={parsedData.overallScore} className="h-3 max-w-md mx-auto" />
              {parsedData.overallFeedback && (
                <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {parsedData.overallFeedback}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Writing Style & Skill Analysis */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {parsedData.writingStyle && (
            <motion.div variants={itemVariants}>
              <Card className="bg-background/80 backdrop-blur-sm border-border shadow-soft h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Writing Style Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{parsedData.writingStyle}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {parsedData.skillAnalysis && (
            <motion.div variants={itemVariants}>
              <Card className="bg-background/80 backdrop-blur-sm border-border shadow-soft h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Skill Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{parsedData.skillAnalysis}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Section Recommendations */}
        {parsedData.sections.length > 0 && (
          <motion.div variants={itemVariants} className="mb-6">
            <Card className="bg-background/80 backdrop-blur-sm border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl">Section Recommendations</CardTitle>
                <CardDescription>Detailed feedback for each profile section ({parsedData.sections.length} sections analyzed)</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="recommendations">Action Items</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4">
                    {parsedData.sections.map((section, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: index * 0.1 }} 
                        className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors bg-card/50"
                      >
                        <div className="flex items-start justify-between mb-4 gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-3">{section.title}</h3>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                <strong className="text-foreground">Suggestion:</strong> {section.suggestion}
                              </p>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                <strong className="text-foreground">Reasoning:</strong> {section.reasoning}
                              </p>
                            </div>
                          </div>
                          <div className="text-right ml-4 flex-shrink-0">
                            <div className={`text-3xl font-bold ${getScoreColor(section.score)}`}>
                              {section.score}
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">/ 100</div>
                            <Badge className={`${getScoreBadge(section.score)} text-xs`}>
                              {section.score >= 80 ? "Excellent" : section.score >= 60 ? "Good" : "Needs Work"}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={section.score} className="h-2" />
                      </motion.div>
                    ))}
                  </TabsContent>

                  {/* Recommendations Tab */}
                  <TabsContent value="recommendations" className="space-y-4">
                    {parsedData.sections.map((section, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: index * 0.1 }} 
                        className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors bg-card/50"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                              {section.suggestion}
                            </p>
                            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                              <strong>Why this matters:</strong> {section.reasoning}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quality Check */}
        {(parsedData.errors.spelling || parsedData.errors.grammar) && (
          <motion.div variants={itemVariants} className="mb-6">
            <Card className="bg-background/80 backdrop-blur-sm border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Quality Check
                </CardTitle>
                <CardDescription>Spelling and grammar analysis</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {parsedData.errors.spelling && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1 text-green-900">Spelling</h4>
                      <p className="text-sm text-green-700">{parsedData.errors.spelling}</p>
                    </div>
                  </div>
                )}
                {parsedData.errors.grammar && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1 text-green-900">Grammar</h4>
                      <p className="text-sm text-green-700">{parsedData.errors.grammar}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center mb-8" variants={itemVariants}>
          <Button onClick={handleDownloadReport} variant="outline" size="lg">
            <Download className="w-5 h-5 mr-2" /> Download Report
          </Button>
          <Button onClick={() => navigate("/profile-upload")} size="lg" className="bg-gradient-primary hover:shadow-glow">
            Back to Upload <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Chatbot */}
        {currentAnalysis && (
          <motion.div variants={itemVariants} className="mt-8">
            <Card className="bg-background/80 backdrop-blur-sm border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl">Chat with AI Assistant</CardTitle>
                <CardDescription>Ask me to modify your analysis or provide additional insights</CardDescription>
              </CardHeader>
              <CardContent>
                <ChatBotUI 
                  originalAnalysis={currentAnalysis} 
                  onAnalysisUpdate={handleAnalysisUpdate}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AIEvaluation;