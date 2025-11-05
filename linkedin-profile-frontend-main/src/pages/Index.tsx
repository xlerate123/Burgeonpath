import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { motion, Variants } from "framer-motion";

const Index = () => {
  const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-bl from-purple-100 to-purple-50"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <Navigation />
      <Hero />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Footer />
    </motion.div>
  );
};

export default Index;
