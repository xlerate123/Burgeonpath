"use client"

import { motion } from "framer-motion"
import type React from "react"
import { Upload, BarChart, MessagesSquare, Star, Trophy, LayoutTemplate, TrendingUp } from "lucide-react"


import {  useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState } from "react"

const Counter = ({ from = 0, to, duration = 2 }: { from?: number; to: number; duration?: number }) => {
  const count = useMotionValue(from)
  const rounded = useTransform(count, (latest) => Math.floor(latest))
  const [display, setDisplay] = useState(from)

  useEffect(() => {
    const controls = animate(count, to, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.floor(latest)),
    })
    return controls.stop
  }, [to, duration, count])

  return <span>{display}</span>
}


// TypeScript interfaces for data structures
interface Step {
  number: string
  title: string
  description: string
  icon: React.ReactNode
  tags: string[]
}

// Updated Feature interface (description removed, icon type changed)
interface Feature {
  number: string
  title: string
  icon: React.ReactNode
}

// Updated FeatureStyle interface to include layout configuration
interface FeatureStyle {
  color: string
  iconBg: string
  numberBg: string
  layout: {
    top: string
    left: string
    rotate: number
    zIndex: number
  }
}

// Data for the "How It Works" section (unchanged)
const steps: Step[] = [
  {
    number: "01",
    title: "Securely Link Your Profile",
    description: "Simply provide your public LinkedIn profile URL. No passwords, no hassle—just a quick and secure connection.",
    icon: <Upload className="w-12 h-12" />,
    tags: ["Quick", "Secure", "Easy"],
  },
  {
    number: "02",
    title: "Get Your AI-Powered Audit",
    description: "Our AI performs a deep-dive analysis of your headline, summary, skills, and activity against top-performing profiles.",
    icon: <BarChart className="w-12 h-12" />,
    tags: ["Data-Driven", "Comprehensive", "Instant"],
  },
  {
    number: "03",
    title: "Receive Actionable Insights",
    description: "Get a profile score and personalized, step-by-step recommendations to boost your visibility and professional brand.",
    icon: <MessagesSquare className="w-12 h-12" />,
    tags: ["Improve", "Optimize", "Succeed"],
  },
];
// **Updated data and icons for the new Features UI**
const features: Feature[] = [
  {
    number: "01",
    title: "Headline & Summary Crafting",
    icon: <Star className="w-6 h-6" />,
  },
  {
    number: "02",
    title: "Keyword & Skill Targeting",
    icon: <Trophy className="w-6 h-6" />,
  },
  {
    number: "03",
    title: "Instant Profile Score",
    icon: <LayoutTemplate className="w-6 h-6" />,
  },
  {
    number: "04",
    title: "Content Strategy Suggestions",
    icon: <TrendingUp className="w-6 h-6" />,
  },
]

const featureStyles: FeatureStyle[] = [
  {
    color: "bg-gradient-to-r from-pink-100 to-purple-100",
    iconBg: "bg-white/80",
    numberBg: "bg-white/90",
    layout: { top: "4%", left: "4%", rotate: -10, zIndex: 10 },
  },
  {
    color: "bg-gradient-to-r from-blue-100 to-cyan-100",
    iconBg: "bg-white/80",
    numberBg: "bg-white/90",
    layout: { top: "24%", left: "52%", rotate: 7, zIndex: 20 },
  },
  {
    color: "bg-gradient-to-r from-purple-100 to-pink-100",
    iconBg: "bg-white/80",
    numberBg: "bg-white/90",
    layout: { top: "48%", left: "12%", rotate: -5, zIndex: 30 },
  },
  {
    color: "bg-gradient-to-r from-violet-100 to-purple-100",
    iconBg: "bg-white/80",
    numberBg: "bg-white/90",
    layout: { top: "68%", left: "50%", rotate: 9, zIndex: 40 },
  },
]

const stats = [
  { value: 55, suffix: "M+", label: "Profiles Improved" },
  { value: 96, suffix: "%", label: "Customer Retention" },
  { value: 85, suffix: "%", label: "Better Matches" },
  { value: 100, suffix: "%", label: "Time Saved" },
]

const HowItWorks: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      
      {/* How it Works Section */}
      <motion.section
        className="py-24 px-6 "
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
            <p className="text-primary font-medium mb-4">How it works</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Unlock Your Profile's Full Potential</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              In three simple steps, our AI provides actionable insights to elevate your professional brand on LinkedIn.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`relative p-8 rounded-3xl ${
                  index === 0 ? "bg-blue-100/80" : index === 1 ? "bg-purple-100/80" : "bg-violet-100/80"
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="text-2xl font-bold mb-8 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/80 shadow-sm"
                  whileHover={{ scale: 1.1, color: "hsl(var(--primary))" }}
                  transition={{ duration: 0.2 }}
                >
                  {step.number}
                </motion.div>

                <motion.div
                  className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-gray-800 mb-6 shadow-sm mx-auto"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {step.icon}
                </motion.div>

                <h3 className="text-2xl font-bold mb-4 text-center">{step.title}</h3>
                <p className="text-muted-foreground text-base mb-8 leading-relaxed text-center">{step.description}</p>

                <div className="flex flex-wrap gap-3 justify-center">
                  {step.tags.map((tag, tagIndex) => (
                    <motion.div
                      key={tagIndex}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.2 + tagIndex * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      viewport={{ once: true }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: tagIndex * 0.5 }}
                      ></motion.div>
                      <span className="text-sm font-medium">{tag}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* **NEW Features Section UI** */}
      <motion.section
        className="py-24 px-6 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Why Choose Us?</h2>
          </motion.div>

          <div className="relative max-w-2xl mx-auto h-96 hidden md:block">
            {features.map((feature, index) => {
              const style = featureStyles[index % featureStyles.length]
              return (
                <motion.div
                  key={index}
                  className={`absolute w-80 md:w-[26rem] flex items-center justify-between px-6 py-4  rounded-full shadow-lg backdrop-blur-sm border border-white/20 ${style.color}`}
                  style={{
                    top: style.layout.top,
                    left: style.layout.left,
                    zIndex: style.layout.zIndex,
                  }}
                  initial={{ opacity: 0, scale: 0.8, y: 50, rotate: style.layout.rotate }}
                  whileInView={{ opacity: 1, scale: 1, y: 0, rotate: style.layout.rotate }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    type: "spring",
                    bounce: 0.4,
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotate: 0,
                    transition: { duration: 0.3 },
                  }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-4 ">
                    <div
                      className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl ${style.iconBg} shadow-sm`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-800 text-pretty">{feature.title}</h3>
                  </div>
                  <div
                    className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full font-bold text-gray-700 ${style.numberBg} shadow-sm`}
                  >
                    {feature.number}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

       {/* Mobile layout */}
<div className="md:hidden space-y-6 mt-8">
  {features.map((feature, index) => {
    const style = featureStyles[index % featureStyles.length] 
    return(
    <motion.div
      key={index}
      className="w-full flex items-center justify-between px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm border border-white/20 bg-gradient-to-r from-purple-100 to-pink-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-center gap-4 ">
                    <div
                      className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl ${style.iconBg} shadow-sm`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-800 text-pretty">{feature.title}</h3>
                  </div>
                  <div
                    className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full font-bold text-gray-700 ${style.numberBg} shadow-sm`}
                  >
                    {feature.number}
                  </div>
    </motion.div>
    )
})}
</div>

<motion.section
  className="py-24 px-6 "
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, amount: 0.2 }}
>
  <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
    {stats.map((stat, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-center gap-2 mb-3 text-3xl md:text-4xl font-bold text-gray-900">
          <span className="text-primary">↑</span>
          <Counter to={stat.value} duration={2} />
          {stat.suffix}
        </div>
        <p className="text-gray-500 text-base">{stat.label}</p>
      </motion.div>
    ))}
  </div>
</motion.section>
</div>
  ) 
}

export default HowItWorks
