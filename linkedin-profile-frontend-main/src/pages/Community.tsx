import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  MessageCircle,
  TrendingUp,
  Calendar,
  Globe,
  Target,
  Zap,
  Award,
  Heart
} from "lucide-react";

const Community = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const communitySpaces = [
    {
      id: 'job-seekers',
      title: 'Job Seekers Hub',
      description: 'Connect with fellow job seekers, share opportunities, and get career advice',
      members: 2847,
      icon: Target,
      color: 'bg-blue-500',
      tags: ['Networking', 'Job Search', 'Career Advice']
    },
    {
      id: 'content-creators',
      title: 'Content Creators',
      description: 'Share content strategies, collaborate on projects, and grow your personal brand',
      members: 1923,
      icon: MessageCircle,
      color: 'bg-purple-500',
      tags: ['Content Strategy', 'Personal Brand', 'Collaboration']
    },
    {
      id: 'business-owners',
      title: 'Business Owners',
      description: 'Network with entrepreneurs, share business insights, and find partnership opportunities',
      members: 1567,
      icon: TrendingUp,
      color: 'bg-green-500',
      tags: ['Entrepreneurship', 'Business Growth', 'Networking']
    },
    {
      id: 'freelancers',
      title: 'Freelancers Network',
      description: 'Connect with other freelancers, share projects, and build your client base',
      members: 2134,
      icon: Globe,
      color: 'bg-orange-500',
      tags: ['Freelancing', 'Client Acquisition', 'Skill Sharing']
    },
    {
      id: 'students',
      title: 'Student Community',
      description: 'Build your professional network early, get mentorship, and explore career paths',
      members: 3456,
      icon: Award,
      color: 'bg-pink-500',
      tags: ['Mentorship', 'Career Exploration', 'Skill Development']
    },
    {
      id: 'tech-professionals',
      title: 'Tech Professionals',
      description: 'Stay updated with tech trends, share knowledge, and advance your tech career',
      members: 4123,
      icon: Zap,
      color: 'bg-indigo-500',
      tags: ['Technology', 'Innovation', 'Career Growth']
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: 'Networking Opportunities',
      description: 'Connect with like-minded professionals in your industry'
    },
    {
      icon: MessageCircle,
      title: 'Expert Discussions',
      description: 'Participate in meaningful conversations with industry experts'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Access exclusive opportunities and career advancement tips'
    },
    {
      icon: Heart,
      title: 'Supportive Community',
      description: 'Get help and support from a welcoming professional community'
    }
  ];

  const handleSpaceSelection = (spaceId: string) => {
    setSelectedSpaces(prev => 
      prev.includes(spaceId) 
        ? prev.filter(id => id !== spaceId)
        : [...prev, spaceId]
    );
  };

  const handleJoinCommunity = () => {
    setIsRedirecting(true);
    
    // Simulate redirect to external community platform
    setTimeout(() => {
      // In a real app, this would redirect to the actual community platform
      window.open('https://burgeonpath.com/community', '_blank');
    }, 2000);
  };

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
          className="text-center space-y-4 mb-12"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Users className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold">Your Exploration Path</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of professionals who are optimizing their LinkedIn presence and advancing their careers
          </p>
        </motion.div>

        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Benefits Section */}
          <motion.div variants={itemVariants}>
            <Card className="bg-background/80 backdrop-blur-sm border-border shadow-soft">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Why Join Our Community?</CardTitle>
                <CardDescription>
                  Discover the benefits of being part of the Burgeonpath professional network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center space-y-3"
                      >
                        <motion.div
                          className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </motion.div>
                    );
                  })}
          </div>
                </CardContent>
              </Card>
          </motion.div>

          {/* Community Spaces */}
          <motion.div variants={itemVariants}>
            <Card className="bg-background/80 backdrop-blur-sm border-border shadow-soft">
                <CardHeader>
                <CardTitle className="text-2xl">Choose Your Spaces</CardTitle>
                <CardDescription>
                  Select the communities that align with your professional goals and interests
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {communitySpaces.map((space, index) => {
                    const Icon = space.icon;
                    const isSelected = selectedSpaces.includes(space.id);
                    
                    return (
                      <motion.div
                        key={space.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'border-primary bg-primary/5 shadow-glow' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleSpaceSelection(space.id)}
                        >
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className={`w-12 h-12 ${space.color} rounded-xl flex items-center justify-center`}>
                                  <Icon className="w-6 h-6 text-white" />
          </div>
                                {isSelected && (
                                  <CheckCircle className="w-6 h-6 text-primary" />
                                )}
          </div>

                              <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">{space.title}</h3>
                                <p className="text-sm text-muted-foreground">{space.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Users className="w-4 h-4" />
                                  <span>{space.members.toLocaleString()} members</span>
                    </div>
                  </div>
                              
                              <div className="flex flex-wrap gap-1">
                                {space.tags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
            ))}
          </div>
        </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                  </div>
                </CardContent>
              </Card>
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={itemVariants}>
            <Card className="bg-background/80 backdrop-blur-sm border-border shadow-soft">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="text-3xl font-bold text-primary mb-2">15,000+</div>
                    <div className="text-muted-foreground">Active Members</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-3xl font-bold text-primary mb-2">50+</div>
                    <div className="text-muted-foreground">Expert Sessions</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="text-3xl font-bold text-primary mb-2">95%</div>
                    <div className="text-muted-foreground">Success Rate</div>
                  </motion.div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {/* Join Button */}
          <motion.div
            className="text-center space-y-6"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleJoinCommunity}
                disabled={isRedirecting || selectedSpaces.length === 0}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow text-lg px-12 py-6"
              >
                {isRedirecting ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Redirecting to Community...
        </div>
                ) : (
                  <>
                    Join Burgeonpath Community
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
            
            {selectedSpaces.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-muted-foreground"
              >
                You've selected {selectedSpaces.length} space{selectedSpaces.length > 1 ? 's' : ''}
              </motion.div>
            )}
            
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You can always change your space preferences later in your community settings
            </p>
          </motion.div>
        </motion.div>
    </div>
    </motion.div>
  );
};

export default Community;