import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";

const LinkedInResults = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Static data for demonstration
  const optimizationData = {
    overallScore: 78,
    profileCompleteness: 85,
    keywordOptimization: 72,
    networkStrength: 80,
    contentEngagement: 75,
    recommendations: [
      {
        category: "Profile Optimization",
        priority: "high",
        title: "Add a Professional Headline",
        description: "Your current headline is generic. Create a compelling headline that includes your key skills and value proposition.",
        impact: "High",
        effort: "Low",
        status: "pending"
      },
      {
        category: "Profile Optimization",
        priority: "high",
        title: "Optimize Your About Section",
        description: "Expand your summary to include more keywords and tell a compelling story about your professional journey.",
        impact: "High",
        effort: "Medium",
        status: "pending"
      },
      {
        category: "Content Strategy",
        priority: "medium",
        title: "Increase Posting Frequency",
        description: "Post at least 2-3 times per week to maintain visibility and engagement with your network.",
        impact: "Medium",
        effort: "Medium",
        status: "pending"
      },
      {
        category: "Network Building",
        priority: "medium",
        title: "Connect with Industry Leaders",
        description: "Send personalized connection requests to 10-15 industry professionals this week.",
        impact: "Medium",
        effort: "Low",
        status: "pending"
      },
      {
        category: "Skills & Endorsements",
        priority: "low",
        title: "Add More Relevant Skills",
        description: "Add 3-5 more skills that are trending in your industry to improve discoverability.",
        impact: "Low",
        effort: "Low",
        status: "pending"
      }
    ],
    metrics: {
      profileViews: 245,
      connectionRequests: 18,
      postEngagement: 12.5,
      searchAppearances: 89
    },
    strengths: [
      "Strong professional photo",
      "Complete work experience",
      "Good network size",
      "Regular content posting"
    ],
    weaknesses: [
      "Generic headline",
      "Incomplete about section",
      "Low engagement rate",
      "Missing key skills"
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-orb rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-orb rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-orb rounded-full opacity-5 blur-2xl"></div>
      </div>

      <div className="min-h-screen px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">LinkedIn Optimization Report</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your personalized LinkedIn optimization analysis is ready! Here's how to maximize your professional impact.
            </p>
          </div>

          {/* Overall Score Card */}
          <Card className="shadow-soft border-0 bg-card/50 backdrop-blur-sm mb-8">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft">
                    <span className={`text-4xl font-bold text-white ${getScoreColor(optimizationData.overallScore)}`}>
                      {optimizationData.overallScore}
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Overall Optimization Score</h2>
                <p className="text-muted-foreground mb-6">
                  {optimizationData.overallScore >= 80 
                    ? "Excellent! Your LinkedIn profile is well-optimized and performing great."
                    : optimizationData.overallScore >= 60
                    ? "Good progress! There are several areas where you can improve your profile."
                    : "There's significant room for improvement. Follow our recommendations to boost your profile."
                  }
                </p>
                <div className="flex justify-center gap-4">
                  <Button className="bg-gradient-primary hover:shadow-glow text-white">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Download Report
                  </Button>
                  <Button variant="outline">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-muted/50 rounded-xl p-1">
              {[
                { id: "overview", label: "Overview", icon: "📊" },
                { id: "suggestions", label: "Suggestions", icon: "💡" },
                { id: "report", label: "Detailed Report", icon: "📋" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Score Breakdown */}
              <Card className="shadow-soft border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Score Breakdown</CardTitle>
                  <CardDescription>Detailed analysis of each optimization area</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { label: "Profile Completeness", score: optimizationData.profileCompleteness, color: "bg-green-500" },
                    { label: "Keyword Optimization", score: optimizationData.keywordOptimization, color: "bg-yellow-500" },
                    { label: "Network Strength", score: optimizationData.networkStrength, color: "bg-blue-500" },
                    { label: "Content Engagement", score: optimizationData.contentEngagement, color: "bg-purple-500" }
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                        <span className="text-sm font-bold text-foreground">{item.score}%</span>
                      </div>
                      <Progress value={item.score} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card className="shadow-soft border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Key Metrics</CardTitle>
                  <CardDescription>Your LinkedIn performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-gradient-subtle rounded-xl">
                      <div className="text-2xl font-bold text-foreground mb-1">{optimizationData.metrics.profileViews}</div>
                      <div className="text-sm text-muted-foreground">Profile Views</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-subtle rounded-xl">
                      <div className="text-2xl font-bold text-foreground mb-1">{optimizationData.metrics.connectionRequests}</div>
                      <div className="text-sm text-muted-foreground">Connection Requests</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-subtle rounded-xl">
                      <div className="text-2xl font-bold text-foreground mb-1">{optimizationData.metrics.postEngagement}%</div>
                      <div className="text-sm text-muted-foreground">Post Engagement</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-subtle rounded-xl">
                      <div className="text-2xl font-bold text-foreground mb-1">{optimizationData.metrics.searchAppearances}</div>
                      <div className="text-sm text-muted-foreground">Search Appearances</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Strengths & Weaknesses */}
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                <Card className="shadow-soft border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-600">Strengths</CardTitle>
                    <CardDescription>What you're doing well</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {optimizationData.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm text-foreground">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-soft border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-red-600">Areas for Improvement</CardTitle>
                    <CardDescription>Focus areas to boost your score</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {optimizationData.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <span className="text-sm text-foreground">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "suggestions" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Optimization Suggestions</h2>
                <p className="text-muted-foreground">Prioritized recommendations to improve your LinkedIn presence</p>
              </div>

              <div className="space-y-4">
                {optimizationData.recommendations.map((rec, index) => (
                  <Card key={index} className="shadow-soft border-0 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{rec.title}</h3>
                            <Badge className={getPriorityColor(rec.priority)}>
                              {rec.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">{rec.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Impact:</span>
                              <span className={`font-medium ${getImpactColor(rec.impact)}`}>{rec.impact}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Effort:</span>
                              <span className="font-medium text-foreground">{rec.effort}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Category:</span>
                              <span className="font-medium text-foreground">{rec.category}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          Implement
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "report" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Detailed Analysis Report</h2>
                <p className="text-muted-foreground">Comprehensive breakdown of your LinkedIn optimization</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 shadow-soft border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Optimization Timeline</CardTitle>
                    <CardDescription>Recommended implementation schedule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        { week: "Week 1", tasks: ["Update headline", "Optimize about section", "Add 5 key skills"] },
                        { week: "Week 2", tasks: ["Connect with 20 industry professionals", "Post 3 engaging updates"] },
                        { week: "Week 3", tasks: ["Request 5 recommendations", "Join 3 relevant groups"] },
                        { week: "Week 4", tasks: ["Publish 1 article", "Engage with 50 posts", "Review and adjust"] }
                      ].map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="w-20 h-20 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {item.week}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-2">{item.week}</h4>
                            <ul className="space-y-1">
                              {item.tasks.map((task, taskIndex) => (
                                <li key={taskIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Quick Actions</CardTitle>
                    <CardDescription>Start implementing changes now</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start" variant="outline">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Post
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Find Connections
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Write Article
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-12">
            <Link to="/linkedin-optimization">
              <Button variant="outline" className="px-8 h-12 rounded-xl">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Form
              </Button>
            </Link>
            <Button className="px-8 h-12 bg-gradient-primary hover:shadow-glow text-white rounded-xl">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Download Full Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInResults;