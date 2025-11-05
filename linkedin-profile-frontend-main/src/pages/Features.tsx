import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const Features = () => {
  const mainFeatures = [
    {
      title: "Profile Analysis",
      description: "Get comprehensive insights into your LinkedIn profile's performance with our advanced AI analysis engine.",
      icon: "📊",
      details: [
        "Profile strength score",
        "Keyword optimization",
        "Content quality analysis",
        "Competitive benchmarking"
      ]
    },
    {
      title: "Performance Metrics",
      description: "Track and analyze key metrics that matter for your professional growth and visibility on LinkedIn.",
      icon: "📈",
      details: [
        "Profile view analytics",
        "Engagement tracking",
        "Network growth metrics",
        "Industry comparison"
      ]
    },
    {
      title: "Optimization Engine",
      description: "Receive personalized recommendations to enhance your profile's impact and professional brand.",
      icon: "⚡",
      details: [
        "Profile optimization tips",
        "Content enhancement",
        "SEO recommendations",
        "Best practices guide"
      ]
    },
    {
      title: "Growth Insights",
      description: "Understand your professional growth trajectory and identify opportunities for improvement.",
      icon: "🚀",
      details: [
        "Career path analysis",
        "Skill gap identification",
        "Industry trend alerts",
        "Growth opportunities"
      ]
    }
  ];

  const additionalFeatures = [
    {
      title: "Real-Time Monitoring",
      description: "Track your LinkedIn profile's performance with continuous monitoring and instant alerts."
    },
    {
      title: "Competitor Analysis",
      description: "Compare your profile with industry leaders and get insights to stand out in your field."
    },
    {
      title: "Advanced Analytics",
      description: "Dive deep into your profile's performance with detailed charts and trend analysis."
    },
    {
      title: "Network Intelligence",
      description: "Understand your network's quality and get recommendations for meaningful connections."
    },
    {
      title: "Custom Reports",
      description: "Generate detailed reports about your profile's performance and improvement areas."
    },
    {
      title: "Action Plans",
      description: "Get personalized roadmaps for improving your profile and professional presence."
    }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Powerful Features for Smart Discovery
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transform your LinkedIn presence with our AI-powered profile analysis and optimization platform.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-6 text-lg rounded-full hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.href = '/signup'}
            >
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-50/30 to-transparent"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
              Core Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the powerful tools that will transform your LinkedIn presence
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-white/70 backdrop-blur-sm border border-purple-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-base mt-2 leading-relaxed text-gray-600">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {feature.details.map((detail, detailIndex) => (
                        <motion.li 
                          key={detailIndex} 
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 + detailIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-700">{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 px-6 bg-gray-100/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Additional Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need for a complete content discovery experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built with Modern Technology</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powered by cutting-edge AI and machine learning technologies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "🧠", title: "Profile Analysis", desc: "Advanced AI algorithms for comprehensive profile evaluation" },
              { icon: "🗣️", title: "Data Analytics", desc: "Real-time metrics and performance tracking" },
              { icon: "☁️", title: "Machine Learning", desc: "Continuous learning from successful profiles" },
              { icon: "🔒", title: "Privacy First", desc: "End-to-end encryption and privacy protection" },
            ].map((tech, i) => (
              <motion.div 
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{tech.icon}</span>
                </div>
                <h3 className="font-semibold mb-2">{tech.title}</h3>
                <p className="text-sm text-gray-600">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gray-100/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience These Features?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Try our demo and see how these features can transform your content discovery experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="/demo">
                <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:shadow-lg px-8 py-6 text-lg text-white">
                  Try Demo Now
                </Button>
              </a>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="/pricing">
                <Button variant="outline" className="px-8 py-6 text-lg">
                  View Pricing
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default Features;
