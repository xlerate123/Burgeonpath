import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqCategories = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I get started with LinkedIn Analyzer?",
          answer: "Simply sign up for a free account and enter your LinkedIn profile URL. Our AI will immediately start analyzing your profile and provide detailed insights and recommendations."
        },
        {
          question: "How does the profile analysis work?",
          answer: "Our AI analyzes multiple aspects of your LinkedIn profile including your headline, summary, experience, skills, and engagement metrics. We then compare this with industry benchmarks to provide actionable insights."
        },
        {
          question: "Is there a free version available?",
          answer: "Yes! We offer a free plan that includes basic profile analysis, key metrics tracking, and essential optimization tips. Perfect for professionals looking to improve their LinkedIn presence."
        },
        {
          question: "How often should I analyze my profile?",
          answer: "We recommend running a full analysis monthly to track improvements and adapt to changing industry trends. However, you can analyze your profile as often as you'd like to monitor specific changes."
        }
      ]
    },
    {
      category: "Features & Functionality",
      questions: [
        {
          question: "How does the AI-powered analysis work?",
          answer: "Our AI uses advanced machine learning algorithms to analyze successful profiles in your industry, identify key patterns and trends, and provide personalized recommendations based on your career goals."
        },
        {
          question: "What metrics does the analyzer track?",
          answer: "We track key metrics including profile views, connection growth rate, engagement rates, keyword optimization, profile completeness score, and how you compare to industry peers."
        },
        {
          question: "How do the recommendations work?",
          answer: "Our system analyzes your profile against top performers in your industry and provides specific, actionable recommendations to improve your visibility, engagement, and professional brand."
        },
        {
          question: "Can I track my profile's improvement over time?",
          answer: "Yes! We provide detailed analytics dashboards showing your profile's performance trends, improvement metrics, and comparison with industry benchmarks over time."
        }
      ]
    },
    {
      category: "Pricing & Plans",
      questions: [
        {
          question: "What's included in the free plan?",
          answer: "The free plan includes monthly profile analysis, basic optimization recommendations, key metrics tracking, and access to our community support resources."
        },
        {
          question: "Can I upgrade or downgrade my plan anytime?",
          answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at your next billing cycle."
        },
        {
          question: "Is there a free trial for paid plans?",
          answer: "Yes! We offer a 14-day free trial for the Pro plan. No credit card required to start your trial."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise plans."
        }
      ]
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          question: "How do you protect my privacy?",
          answer: "We use end-to-end encryption for all data transmission and storage. Your voice data is processed securely and never stored permanently. We're GDPR and CCPA compliant."
        },
        {
          question: "How do you protect my LinkedIn data?",
          answer: "We only access the public information on your LinkedIn profile. All analysis is performed securely, and we never store your LinkedIn credentials or private information."
        },
        {
          question: "Can I delete my data?",
          answer: "Yes, you have full control over your data. You can delete your account and all associated data at any time through your account settings."
        },
        {
          question: "Is my search history private?",
          answer: "Your search history is private to you and is used only to improve your recommendations. We never share your personal data with third parties."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "How frequently is the analysis updated?",
          answer: "Our analysis is updated in real-time whenever you request it. We also automatically track changes in your profile metrics and notify you of significant improvements or areas needing attention."
        },
        {
          question: "How can I get help if I'm having issues?",
          answer: "You can reach our support team through email, live chat, or our help center. Pro users get priority support, and Enterprise users have dedicated support channels."
        },
        {
          question: "Do you offer team or enterprise solutions?",
          answer: "Yes! We offer enterprise solutions for recruiting teams, HR departments, and career counseling services. Contact our sales team to learn about our enterprise features and custom integrations."
        },
        {
          question: "Can I integrate Readable with other tools?",
          answer: "Yes, we offer integrations with popular tools like Slack, Notion, and Zapier. Enterprise customers can also request custom integrations."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked <span className="bg-gradient-primary bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to common questions about Readable and our AI-powered content discovery platform.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`} className="border rounded-lg px-6">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you get the most out of Readable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact">
              <Button className="bg-gradient-primary hover:shadow-glow px-8 py-6 text-lg">
                Contact Support
              </Button>
            </a>
            <a href="/demo">
              <Button variant="outline" className="px-8 py-6 text-lg">
                Try Demo
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
