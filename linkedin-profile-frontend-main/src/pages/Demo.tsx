import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Demo = () => {
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleQueries = [
    "Find articles about artificial intelligence",
    "Show me recent tech news",
    "I want to read about climate change",
    "Find articles about space exploration",
    "Show me business and finance articles"
  ];

  const sampleResults = [
    {
      id: 1,
      title: "The Future of AI: How Machine Learning is Transforming Industries",
      description: "An in-depth look at how artificial intelligence is revolutionizing various sectors from healthcare to finance.",
      source: "Tech Weekly",
      readTime: "8 min read",
      category: "Technology",
      date: "2 hours ago"
    },
    {
      id: 2,
      title: "Understanding Neural Networks: A Beginner's Guide",
      description: "Learn the fundamentals of neural networks and how they power modern AI applications.",
      source: "AI Today",
      readTime: "12 min read",
      category: "Education",
      date: "1 day ago"
    },
    {
      id: 3,
      title: "Ethics in Artificial Intelligence: Balancing Innovation and Responsibility",
      description: "Exploring the ethical considerations and challenges in developing responsible AI systems.",
      source: "Ethics in Tech",
      readTime: "15 min read",
      category: "Philosophy",
      date: "3 days ago"
    }
  ];

  const handleVoiceSearch = () => {
    setIsListening(true);
    setIsProcessing(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      setQuery(randomQuery);
      setIsListening(false);
      
      // Simulate processing
      setTimeout(() => {
        setResults(sampleResults);
        setIsProcessing(false);
      }, 1500);
    }, 2000);
  };

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsProcessing(true);
    setResults([]);
    
    // Simulate processing
    setTimeout(() => {
      setResults(sampleResults);
      setIsProcessing(false);
    }, 1000);
  };

  const clearResults = () => {
    setQuery("");
    setResults([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Try Our <span className="bg-gradient-primary bg-clip-text text-transparent">Voice Search</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience the power of AI-powered article discovery. Speak your interests or type your query to find relevant content instantly.
          </p>
        </div>
      </section>

      {/* Demo Interface */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search Interface</CardTitle>
              <CardDescription>
                Try our voice search or type your query below to discover relevant articles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voice Search Button */}
              <div className="text-center">
                <Button
                  onClick={handleVoiceSearch}
                  disabled={isListening || isProcessing}
                  className={`w-32 h-32 rounded-full bg-gradient-primary hover:shadow-glow transition-all duration-300 ${
                    isListening ? 'animate-pulse' : ''
                  }`}
                >
                  {isListening ? (
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Listening...</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      <span className="text-sm">Tap to Speak</span>
                    </div>
                  )}
                </Button>
              </div>

              {/* Text Search */}
              <form onSubmit={handleTextSearch} className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Or type your search query here..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isProcessing || !query.trim()}>
                  {isProcessing ? "Searching..." : "Search"}
                </Button>
              </form>

              {/* Current Query Display */}
              {query && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Your query:</p>
                  <p className="font-medium">"{query}"</p>
                </div>
              )}

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="text-center py-8">
                  <div className="w-8 h-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-muted-foreground">Finding the best articles for you...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Search Results</h2>
                <Button variant="outline" onClick={clearResults}>
                  Clear Results
                </Button>
              </div>
              
              <div className="space-y-4">
                {results.map((result) => (
                  <Card key={result.id} className="hover:shadow-soft transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-primary">{result.category}</span>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{result.readTime}</span>
                          <span>{result.date}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">{result.title}</CardTitle>
                      <CardDescription className="text-base">
                        {result.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Source: {result.source}</span>
                        <Button variant="outline" size="sm">
                          Read Article
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Sample Queries */}
          {!query && results.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Try These Sample Queries</CardTitle>
                <CardDescription>
                  Click on any of these examples to see how our search works.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {sampleQueries.map((sampleQuery, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start text-left h-auto p-4"
                      onClick={() => setQuery(sampleQuery)}
                    >
                      <span className="text-sm">{sampleQuery}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the future of content discovery with our advanced AI-powered search technology.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <CardTitle>Voice Search</CardTitle>
                <CardDescription>
                  Simply speak your interests and let our AI find the perfect articles for you.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <CardTitle>Smart AI</CardTitle>
                <CardDescription>
                  Advanced natural language processing understands context and intent.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle>Instant Results</CardTitle>
                <CardDescription>
                  Get relevant articles in seconds, not minutes of scrolling.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Demo;
