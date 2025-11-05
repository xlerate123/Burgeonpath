"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { CheckCircle, Stars } from "lucide-react"

// A helper component for a single scrolling column
const TestimonialColumn = ({
  testimonials,
  duration = 30,
  direction = "down",
}: {
  testimonials: any[]
  duration?: number
  direction?: "up" | "down"
}) => {
  return (
    <motion.div
      className="flex flex-col gap-6"
      animate={{ y: direction === "down" ? ["0%", "-50%"] : ["-50%", "0%"] }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "linear",
      }}
    >
      {/* Duplicate testimonials for a seamless loop */}
      {[...testimonials, ...testimonials].map((testimonial, index) => (
        <Card
          key={index}
          className="w-full flex-shrink-0 rounded-2xl border-purple-100/80 bg-white/80 p-6 shadow-soft backdrop-blur-md"
        >
          <CardContent className="p-0">
            <blockquote className="text-muted-foreground mb-6 leading-relaxed">
              "{testimonial.content}"
            </blockquote>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  {testimonial.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                </div>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/48x48/6366f1/ffffff?text=${testimonial.name.charAt(0)}`
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  )
}

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Content Creator",
      content:
        "The AI insights are spot-on. My profile views shot up by 150% in just two weeks after implementing the suggestions!",
      avatar: "https://i.pravatar.cc/48?u=1",
      verified: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Research Analyst",
      content:
        "Finally, no more guessing. The detailed analytics and actionable recommendations were game-changing for my job search.",
      avatar: "https://i.pravatar.cc/48?u=2",
      verified: true,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Marketing Director",
      content:
        "As a hiring manager, I recommend this tool to all candidates. It helps them create impactful profiles that truly showcase their potential.",
      avatar: "https://i.pravatar.cc/48?u=3",
      verified: false,
    },
    {
      id: 4,
      name: "David Park",
      role: "Product Manager",
      content:
        "The competitive analysis feature is brilliant. It showed me exactly how I stacked up against industry leaders and helped me land multiple offers.",
      avatar: "https://i.pravatar.cc/48?u=4",
      verified: true,
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Journalist",
      content:
        "The keyword suggestions helped me rank higher in recruiter searches almost immediately. It's an essential tool for visibility.",
      avatar: "https://i.pravatar.cc/48?u=5",
      verified: true,
    },
    {
      id: 6,
      name: "Alex Kumar",
      role: "Startup Founder",
      content:
        "The engagement analytics helped me understand what was resonating with my network. My connection requests have doubled.",
      avatar: "https://i.pravatar.cc/48?u=6",
      verified: true,
    },
  ]

  // Split testimonials into three columns
  const col1 = testimonials.filter((_, i) => i % 3 === 0)
  const col2 = testimonials.filter((_, i) => i % 3 === 1)
  const col3 = testimonials.filter((_, i) => i % 3 === 2)

  return (
    <section className="py-24 px-6 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6">
            <h2 className="text-4xl md:text-5xl font-bold">What Our Users Are Saying</h2>
          </div>
        </div>

        {/* --- Testimonials Grid --- */}
        <div className="relative p-8 lg:p-12 rounded-3xl bg-purple-50/50 border border-purple-100 overflow-hidden">
          {/* Mobile View: Static single column */}
          <div className="flex flex-col gap-6 md:hidden">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="w-full flex-shrink-0 rounded-2xl border-purple-100/80 bg-white/80 p-6 shadow-soft backdrop-blur-md"
              >
                <CardContent className="p-0">
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        {testimonial.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/48x48/6366f1/ffffff?text=${testimonial.name.charAt(0)}`
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop View: 3-column scrolling animation */}
          <div className="hidden md:grid grid-cols-3 gap-6 h-[700px] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            <TestimonialColumn testimonials={col1} direction="down" duration={40} />
            <TestimonialColumn testimonials={col2} direction="up" duration={35} />
            <TestimonialColumn testimonials={col3} direction="down" duration={45} />
          </div>

          {/* Mobile static grid */}
          <div className="md:hidden grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="w-full rounded-2xl border-purple-100/80 bg-white/80 p-6 shadow-soft">
                <CardContent className="p-0">
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        {testimonial.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/48x48/6366f1/ffffff?text=${testimonial.name.charAt(0)}`
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-transparent w-1/4 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-purple-50/50 to-transparent w-1/4 right-0 pointer-events-none"></div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials

