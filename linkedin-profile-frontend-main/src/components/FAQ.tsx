"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PlusCircle, MinusCircle } from "lucide-react"

const faqs = [
  {
    question: "How do I get started with the LinkedIn Analyzer?",
    answer:
      "Simply sign up and provide your public LinkedIn profile URL. Our AI will instantly begin its analysis, delivering detailed insights and actionable recommendations directly to your dashboard.",
  },
  {
    question: "How does the AI-powered analysis work?",
    answer:
      "Our AI leverages machine learning to benchmark your profile against thousands of top-performers in your industry. It identifies patterns for success and provides personalized advice based on your specific career goals.",
  },
  {
    question: "Is there a free version available?",
    answer:
      "Yes! Our free plan offers a comprehensive basic analysis, including a profile score and essential optimization tips. It's the perfect way to start improving your professional brand.",
  },
  {
    question: "How do you protect my LinkedIn data?",
    answer:
      "Your privacy is our top priority. We only access your public profile information and never ask for your password. All data is processed securely and is not shared with third parties.",
  },
]

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0)

  return (
    <motion.section
      className="py-24 px-6 bg-slate-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">Have questions? We've got answers.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left Column: Questions */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setActiveIndex(index)}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${activeIndex === index
                    ? "bg-white shadow-lg border-purple-200"
                    : "bg-white/70 hover:bg-white hover:shadow-md"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-semibold text-lg ${activeIndex === index ? "text-primary" : "text-gray-800"
                      }`}
                  >
                    {faq.question}
                  </h3>
                  {activeIndex === index ? (
                    <MinusCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  ) : (
                    <PlusCircle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Answers */}
          <div className="hidden md:block relative h-80 md:h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 h-full flex items-center justify-center"
              >
                <p className="text-xl text-center text-purple-900/80 leading-relaxed">
                  {faqs[activeIndex].answer}
                </p>
              </motion.div>
            </AnimatePresence>
            {/* Mobile answer display */}
            <div className="md:hidden mt-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100">
                <p className="text-lg text-purple-900/80 leading-relaxed">
                  {faqs[activeIndex].answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default FAQ
