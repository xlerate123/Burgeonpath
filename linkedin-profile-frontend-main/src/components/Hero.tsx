import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate()
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
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

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20 bg-gradient-to-b from-purple-50/50 to-white/90 overflow-hidden">
      <motion.div
        className="w-full max-w-6xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Promo Banner - Responsive */}
        <motion.div 
          className="mb-8 sm:mb-12 bg-gradient-subtle border border-accent rounded-full px-4 py-2 sm:px-6 sm:py-3 flex items-center gap-2 sm:gap-3 shadow-soft mx-auto max-w-md sm:max-w-xl"
          variants={itemVariants}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <motion.div 
            className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-white text-xs">AI</span>
          </motion.div>
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
            <span className="text-foreground font-medium text-sm sm:text-base">Exclusive Early Access</span>
            <span className="text-muted-foreground text-xs sm:text-sm hidden sm:block">
              Unlock AI-powered insights to boost your LinkedIn profile
            </span>
          </div>
        </motion.div>

        {/* Main Heading - Responsive */}
        <motion.div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8 px-4" variants={itemVariants}>
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            The Future of Professional Growth{" "}
            <motion.span 
              className="bg-gradient-primary bg-clip-text text-transparent block mt-2 sm:mt-4"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "200% 50%"], 
                scale: [1, 1.02, 1], 
                opacity: [0.9, 1, 0.9] 
              }} 
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }} 
              style={{ 
                backgroundSize: "200% 100%" 
              }}
            >
              Starts With Your LinkedIn
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            India's First AI-Powered LinkedIn Profile Analyzer — helping students, professionals, and job seekers stand out and get noticed instantly.
          </motion.p>
        </motion.div>

        {/* CTA Button - Responsive */}
<motion.div variants={itemVariants} className="flex justify-center items-center mx-auto mb-8 sm:mb-16 px-4">
  <Button
    onClick={() => {
      // Check if user is logged in
      const userData = localStorage.getItem('user');
      const userToken = localStorage.getItem('userToken');
      const adminEmail = localStorage.getItem('adminEmail');
      const isLoggedIn = !!((userData && userToken) || adminEmail);
      
      if (isLoggedIn) {
        navigate("/payment");
      } else {
        navigate("/signup");
      }
    }}
    className="w-full sm:w-auto bg-gradient-primary hover:shadow-glow transition-all duration-300 text-white px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg rounded-full shadow-soft"
    whileHover={{ 
      scale: 1.05,
      boxShadow: "0 0 40px hsl(270 60% 70% / 0.4)"
    }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.span
      animate={{ 
        x: [0, 5, 0],
        scale: [1, 1.05, 1]
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Dynamic button text based on auth status */}
      {(() => {
        const userData = localStorage.getItem('user');
        const userToken = localStorage.getItem('userToken');
        const adminEmail = localStorage.getItem('adminEmail');
        const isLoggedIn = !!((userData && userToken) || adminEmail);
        
        return isLoggedIn ? "Get AI Analysis Now" : "Get My First AI Analysis";
      })()}
    </motion.span>
    <motion.svg 
      className="ml-2 w-4 h-4 sm:w-5 sm:h-5" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </motion.svg>
  </Button>
</motion.div>

        {/* Mobile Mockup Trio - Responsive */}
        <div className="bg-gradient-to-bl from-purple-100 to-purple-50 rounded-2xl mx-2 sm:mx-4">
          <MobileMockup/>
        </div>
      </motion.div>
    </section>
  );
};

// A simple placeholder for a user profile icon
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const MobileMockup = () => {
  return (
    <div className="relative flex items-center justify-center min-h-[500px] sm:min-h-[600px] py-8 sm:py-20 overflow-hidden">
      {/* Left Screen - Keyword Analysis */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "-110%", opacity: 0.9 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute left-1/2 transform -translate-x-1/2 z-0 scale-75 sm:scale-85 rotate-[-10deg] hidden sm:block"
      >
        <div className="w-60 sm:w-72 h-[500px] sm:h-[580px] bg-white shadow-2xl rounded-[2rem] sm:rounded-[2.5rem] border border-gray-200 overflow-hidden font-sans">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-4 sm:px-6 py-2 bg-white">
            <span className="text-xs sm:text-sm font-medium text-gray-700">9:41</span>
            <div className="w-16 sm:w-20 h-4 sm:h-5 bg-gray-900 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Keyword Analysis</h2>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Your profile is optimized for these keywords. Add more from the suggestions to improve visibility.
            </p>

            {/* Top Keywords */}
            <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500">TOP KEYWORDS</p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">React</span>
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">Node.js</span>
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">TypeScript</span>
                </div>
            </div>

            {/* Keyword Suggestions */}
            <div className="mt-4 sm:mt-6">
              <h3 className="text-sm font-medium text-gray-800 mb-2 sm:mb-3">Suggestions</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs font-medium">Cloud Technologies</p>
                  <p className="text-xs text-gray-500">Add keywords like AWS, Docker, or Kubernetes.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs font-medium">Project Management</p>
                  <p className="text-xs text-gray-500">Include terms like Agile, Scrum, or JIRA.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Screen - Experience Metrics */}
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: "25%", opacity: 0.9 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute left-1/2 transform -translate-x-1/2 z-0 scale-75 sm:scale-85 rotate-[10deg] hidden sm:block"
      >
        <div className="w-60 sm:w-72 h-[500px] sm:h-[580px] bg-white shadow-2xl rounded-[2rem] sm:rounded-[2.5rem] border border-gray-200 overflow-hidden font-sans">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-4 sm:px-6 py-2 bg-white">
             <span className="text-xs sm:text-sm font-medium text-gray-700">9:41</span>
             <div className="w-16 sm:w-20 h-4 sm:h-5 bg-gray-900 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Experience Metrics</h2>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-gray-600">Quantify your achievements to showcase impact. Use numbers to tell your story.</p>

            <div className="bg-red-50 rounded-lg p-2 sm:p-3 border border-red-100">
                <p className="text-xs text-red-500 font-bold mb-1">BEFORE</p>
                <p className="text-xs text-gray-700">"Responsible for developing new features for the company's main application."</p>
            </div>

            <div className="bg-green-50 rounded-lg p-2 sm:p-3 border border-green-100">
                <p className="text-xs text-green-600 font-bold mb-1">AFTER (AI SUGGESTION)</p>
                <p className="text-xs text-gray-700">"Engineered 5+ core features for the main application, leading to a 15% increase in user engagement."</p>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed pt-3 sm:pt-4">
              Using action verbs and metrics makes your contributions more concrete and impressive to recruiters.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Center Screen - Main Profile Analysis */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        className="relative z-10"
      >
        <div className="w-72 sm:w-80 h-[520px] sm:h-[600px] bg-white/80 backdrop-blur-md shadow-2xl rounded-[2rem] sm:rounded-[2.5rem] border border-white overflow-hidden font-sans">
           {/* Status Bar */}
           <div className="flex justify-between items-center px-4 sm:px-6 py-2 sm:py-3 bg-transparent">
             <span className="text-xs sm:text-sm font-medium text-gray-700">9:41</span>
             <div className="w-16 sm:w-20 h-4 sm:h-5 bg-gray-900 rounded-full"></div>
           </div>

          {/* Main Content */}
          <div className="flex flex-col items-center justify-start h-full px-4 sm:px-6 pb-16 sm:pb-20 pt-3 sm:pt-4">

            {/* Profile Header */}
             <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-center w-full"
            >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                    <UserIcon />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Vansh Ahuja</h1>
                <p className="text-xs sm:text-sm text-gray-500">Aspiring Software Engineer</p>
            </motion.div>

            {/* Score Card */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                className="bg-white/80 rounded-2xl p-3 sm:p-4 my-4 sm:my-6 w-full text-center shadow-lg border"
            >
                <p className="font-medium text-gray-600 text-sm sm:text-base">
                  Overall Profile Score
                </p>
                <p className="text-4xl sm:text-5xl font-bold text-purple-600 my-1 sm:my-2">85<span className="text-xl sm:text-2xl text-gray-400">/100</span></p>
                 <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mt-1 sm:mt-2">
                    <div className="bg-purple-500 h-2 sm:h-2.5 rounded-full" style={{width: '85%'}}></div>
                </div>
            </motion.div>

            {/* Actionable Insights */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-left w-full"
            >
                <h3 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Top AI Suggestions</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-start gap-2 sm:gap-3 p-2 bg-gray-50 rounded-lg">
                        <span className="mt-0.5">💡</span>
                        <span>
                            <strong>Enhance Headline:</strong> Add specific skills like 'React' or 'Node.js' to attract recruiters.
                        </span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 p-2 bg-gray-50 rounded-lg">
                        <span className="mt-0.5">🚀</span>
                        <span>
                            <strong>Quantify Achievements:</strong> Use metrics in your experience section to show impact.
                        </span>
                    </li>
                     <li className="flex items-start gap-2 sm:gap-3 p-2 bg-gray-50 rounded-lg">
                        <span className="mt-0.5">✅</span>
                        <span>
                           <strong>Complete Skills Section:</strong> Add at least 5 key skills and get endorsements.
                        </span>
                    </li>
                </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Hero;