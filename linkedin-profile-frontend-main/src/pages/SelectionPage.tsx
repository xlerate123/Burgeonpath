import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Upload, FileText } from "lucide-react";

const SelectionPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF8] text-[#4A4A4A]">
      <Navigation />
      <main className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#3D3D3D] mb-4">Choose Your Path</h1>
            <p className="text-xl text-gray-600 mb-12">
              How would you like to provide your information for the AI analysis?
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/profile-upload" state={{ defaultTab: 'file' }}>
                <Card className="h-full flex flex-col bg-white border-[#F0EAE1] shadow-lg rounded-xl cursor-pointer">
                  <CardHeader className="items-center">
                    <div className="flex justify-center mb-4">
                      <Upload className="w-12 h-12 text-[#C8A2C8]" />
                    </div>
                    <CardTitle className="text-[#3D3D3D]">Upload Profile PDF</CardTitle>
                    <CardDescription>
                      Upload a PDF resume for a quick and comprehensive analysis.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-end">
                    <Button className="w-full bg-gradient-to-r from-[#C8A2C8] to-[#FFB6C1] text-white font-semibold hover:filter hover:brightness-110">
                      Upload Profile
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/profile-upload" state={{ defaultTab: 'questionnaire' }}>
                <Card className="h-full flex flex-col bg-white border-[#F0EAE1] shadow-lg rounded-xl cursor-pointer">
                  <CardHeader className="items-center">
                    <div className="flex justify-center mb-4">
                      <FileText className="w-12 h-12 text-[#C8A2C8]" />
                    </div>
                    <CardTitle className="text-[#3D3D3D]">Answer Questions</CardTitle>
                    <CardDescription>
                      Answer guided questions to build a detailed profile for our AI to analyze.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-end">
                    <Button className="w-full bg-gradient-to-r from-[#C8A2C8] to-[#FFB6C1] text-white font-semibold hover:filter hover:brightness-110">
                      Start Questionnaire
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SelectionPage;