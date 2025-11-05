import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former Google AI researcher with 10+ years in natural language processing and voice recognition technologies.",
      image: "👩‍💼"
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder", 
      bio: "Ex-Microsoft engineer specializing in machine learning and scalable AI systems. Led teams building search infrastructure.",
      image: "👨‍💻"
    },
    {
      name: "Dr. Emily Watson",
      role: "Head of AI Research",
      bio: "PhD in Computer Science from Stanford. Expert in neural networks and content recommendation algorithms.",
      image: "👩‍🔬"
    },
    {
      name: "Alex Kim",
      role: "Lead Product Designer",
      bio: "Former Apple designer focused on creating intuitive user experiences for voice-powered applications.",
      image: "👨‍🎨"
    }
  ];

  const values = [
    {
      title: "Innovation First",
      description: "We're constantly pushing the boundaries of what's possible with AI and voice technology.",
      icon: "💡"
    },
    {
      title: "User-Centric Design",
      description: "Every feature we build is designed with the user experience at its core.",
      icon: "🎯"
    },
    {
      title: "Privacy & Security",
      description: "We believe in protecting user data while delivering powerful AI experiences.",
      icon: "🔒"
    },
    {
      title: "Accessibility",
      description: "Making content discovery accessible to everyone, regardless of ability or background.",
      icon: "♿"
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "Company Founded",
      description: "Started with a vision to revolutionize how people discover content online."
    },
    {
      year: "2024 Q1",
      title: "First AI Model",
      description: "Developed our proprietary natural language understanding system."
    },
    {
      year: "2024 Q2",
      title: "Voice Integration",
      description: "Successfully integrated voice recognition with our search algorithms."
    },
    {
      year: "2024 Q3",
      title: "Beta Launch",
      description: "Launched private beta with 1,000+ early adopters and 95% satisfaction rate."
    },
    {
      year: "2024 Q4",
      title: "Public Launch",
      description: "Making AI-powered article discovery available to everyone."
    }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-lavender"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        className="pt-32 pb-16 px-6"
        variants={itemVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="bg-gradient-primary bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: "200% 200%"
              }}
            >
              Why We Exist

            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >

          </motion.p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section 
        className="py-16 px-6"
        variants={itemVariants}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-3">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                The digital world is shifting fast. What you learn today shapes who discovers you tomorrow.
We built this platform to unlock the hidden playbook of social media exploration — without noise, without clutter.
A simple AI-powered journey designed to help you stand out, explore opportunities, and grow smarter in the open market.

              </p>
             
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a href="/demo">
                  <Button className="bg-gradient-primary hover:shadow-glow">
                    Try Our Demo
                  </Button>
                </a>
              </motion.div>
            </motion.div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="bg-gradient-orb rounded-3xl p-8 shadow-soft"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <motion.div 
                    className="w-32 h-32 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-4xl">🤖</span>
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">AI-Powered Discovery</h3>
                  <p className="text-muted-foreground">
                    Our advanced algorithms understand natural language and context to deliver 
                    personalized content recommendations that actually matter to you.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        className="py-16 px-6 bg-muted/30"
        variants={itemVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from product development to customer support.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
              >
                <motion.div variants={cardVariants}>
                  <Card className="text-center hover:shadow-soft transition-shadow duration-300 h-full">
                    <CardHeader>
                      <motion.div 
                        className="text-4xl mb-4"
                        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        {value.icon}
                      </motion.div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        className="py-16 px-6"
        variants={itemVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're a diverse group of engineers, designers, and researchers passionate about 
              making content discovery more intuitive and accessible.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
              >
                <motion.div variants={cardVariants}>
                  <Card className="text-center hover:shadow-soft transition-shadow duration-300 h-full">
                    <CardHeader>
                      <motion.div 
                        className="text-6xl mb-4"
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        {member.image}
                      </motion.div>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription className="text-primary font-medium">
                        {member.role}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {member.bio}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>



      {/* CTA Section */}
      <motion.section 
        className="py-16 px-6"
        variants={itemVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Experience the Future?
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Join thousands of users who are already discovering content in a whole new way.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="/demo">
                <Button className="bg-gradient-primary hover:shadow-glow px-8 py-6 text-lg">
                  Try Demo Now
                </Button>
              </a>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="/contact">
                <Button variant="outline" className="px-8 py-6 text-lg">
                  Contact Us
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
      <Footer />
    </motion.div>
  );
};

export default About;
