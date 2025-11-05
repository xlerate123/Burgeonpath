import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BlogPost = () => {
  const { slug } = useParams();
  
  // Sample blog posts data
  const blogPosts = {
    "future-voice-powered-article-discovery": {
      title: "The Future of Voice-Powered Article Discovery",
      excerpt: "Exploring how AI and voice technology are revolutionizing how we find and consume content online.",
      content: `
        <p>The way we discover and consume content is undergoing a revolutionary transformation. Traditional search methods, while effective, often require us to know exactly what we're looking for. But what if we could simply speak our thoughts and have AI understand not just our words, but our intent?</p>
        
        <h2>The Evolution of Search</h2>
        <p>Voice search technology has evolved from simple command recognition to sophisticated natural language understanding. Today's AI systems can interpret context, emotion, and even the unspoken needs behind our queries.</p>
        
        <p>This shift represents more than just a technological advancement—it's a fundamental change in how we interact with information. Instead of adapting to search engines, search engines are now adapting to us.</p>
        
        <h2>Understanding Intent, Not Just Keywords</h2>
        <p>Modern voice search goes beyond keyword matching. It understands:</p>
        <ul>
          <li>Context and situation</li>
          <li>Emotional state and mood</li>
          <li>Implicit preferences</li>
          <li>Learning patterns</li>
        </ul>
        
        <p>This means when you say "I want something inspiring to read," the AI doesn't just search for articles containing the word "inspiring." It understands you're looking for content that will uplift and motivate you.</p>
        
        <h2>The Impact on Content Discovery</h2>
        <p>Voice-powered discovery is changing how we find content in several key ways:</p>
        
        <h3>1. Natural Language Processing</h3>
        <p>Users can express their needs in natural, conversational language rather than crafting specific search terms.</p>
        
        <h3>2. Contextual Understanding</h3>
        <p>AI systems consider the time of day, user history, and current trends to provide more relevant results.</p>
        
        <h3>3. Serendipitous Discovery</h3>
        <p>Voice search can lead to unexpected but relevant content discoveries that traditional search might miss.</p>
        
        <h2>Looking Ahead</h2>
        <p>As voice technology continues to improve, we can expect even more sophisticated content discovery experiences. The future holds promise for:</p>
        <ul>
          <li>Multi-modal interactions combining voice, gesture, and visual cues</li>
          <li>Predictive content suggestions based on behavioral patterns</li>
          <li>Real-time content adaptation based on user feedback</li>
          <li>Seamless integration across all devices and platforms</li>
        </ul>
        
        <p>The future of content discovery is not just about finding what we're looking for—it's about discovering what we didn't know we needed.</p>
      `,
      author: "Sarah Chen",
      authorRole: "CEO & Co-Founder",
      authorAvatar: "👩‍💼",
      date: "December 15, 2024",
      readTime: "5 min read",
      category: "Technology",
      tags: ["AI", "Voice Search", "Content Discovery", "Technology"]
    },
    "building-intuitive-search-experiences": {
      title: "Building Intuitive Search Experiences",
      excerpt: "Learn how to design search interfaces that understand natural language and user intent.",
      content: `
        <p>Creating intuitive search experiences requires more than just good UI design—it demands a deep understanding of how users think, speak, and interact with technology.</p>
        
        <h2>The Psychology of Search</h2>
        <p>Users don't think in keywords. They think in concepts, emotions, and contexts. When designing search experiences, we need to bridge the gap between human thought and machine understanding.</p>
        
        <h2>Key Principles for Intuitive Search</h2>
        
        <h3>1. Natural Language Support</h3>
        <p>Allow users to express their queries in natural, conversational language. Instead of forcing users to learn specific search syntax, let them speak as they would to another person.</p>
        
        <h3>2. Context Awareness</h3>
        <p>Consider the user's current situation, previous searches, and behavioral patterns when interpreting queries and delivering results.</p>
        
        <h3>3. Progressive Disclosure</h3>
        <p>Start with broad results and allow users to refine their search through natural follow-up questions or clarifications.</p>
        
        <h3>4. Visual Feedback</h3>
        <p>Provide clear visual indicators of what the system is doing, especially during voice processing and AI analysis.</p>
        
        <h2>Designing for Voice Interaction</h2>
        <p>Voice interfaces require special consideration:</p>
        <ul>
          <li>Clear audio feedback and confirmation</li>
          <li>Visual representation of voice input</li>
          <li>Graceful handling of unclear or ambiguous queries</li>
          <li>Options for clarification and refinement</li>
        </ul>
        
        <h2>Testing and Iteration</h2>
        <p>Intuitive search experiences emerge through continuous testing and iteration. Key metrics to track include:</p>
        <ul>
          <li>Query success rate</li>
          <li>User satisfaction scores</li>
          <li>Time to find relevant content</li>
          <li>Follow-up query patterns</li>
        </ul>
        
        <p>Building intuitive search experiences is an ongoing process that requires empathy, technical expertise, and a commitment to understanding user needs.</p>
      `,
      author: "Marcus Rodriguez",
      authorRole: "CTO & Co-Founder",
      authorAvatar: "👨‍💻",
      date: "December 10, 2024",
      readTime: "7 min read",
      category: "Design",
      tags: ["UX Design", "Search", "Voice Interface", "User Experience"]
    },
    "ai-powered-content-curation": {
      title: "AI-Powered Content Curation: A Deep Dive",
      excerpt: "Understanding the algorithms and techniques behind intelligent content recommendation systems.",
      content: `
        <p>Content curation has evolved from manual selection to sophisticated AI-driven systems that can understand, categorize, and recommend content at scale.</p>
        
        <h2>The Science Behind Content Curation</h2>
        <p>Modern content curation systems use a combination of machine learning techniques to understand both content and user preferences:</p>
        
        <h3>1. Natural Language Processing (NLP)</h3>
        <p>NLP algorithms analyze text content to understand topics, sentiment, and context. This allows systems to categorize content beyond simple keyword matching.</p>
        
        <h3>2. Collaborative Filtering</h3>
        <p>By analyzing user behavior patterns, systems can identify users with similar interests and recommend content that similar users have found valuable.</p>
        
        <h3>3. Content-Based Filtering</h3>
        <p>Systems analyze the characteristics of content itself to find similar items, regardless of user behavior patterns.</p>
        
        <h3>4. Hybrid Approaches</h3>
        <p>The most effective systems combine multiple techniques to provide more accurate and diverse recommendations.</p>
        
        <h2>Challenges in AI Content Curation</h2>
        
        <h3>1. The Cold Start Problem</h3>
        <p>New users and new content present challenges because there's limited data for making recommendations.</p>
        
        <h3>2. Filter Bubbles</h3>
        <p>Over-optimization can lead to users seeing only content that confirms their existing preferences, limiting discovery.</p>
        
        <h3>3. Content Quality Assessment</h3>
        <p>Determining content quality and credibility requires sophisticated analysis beyond simple popularity metrics.</p>
        
        <h2>Future Directions</h2>
        <p>The future of AI-powered content curation includes:</p>
        <ul>
          <li>Multi-modal content understanding (text, images, video)</li>
          <li>Real-time adaptation to user feedback</li>
          <li>Cross-platform content discovery</li>
          <li>Ethical AI considerations for content diversity</li>
        </ul>
        
        <p>As AI technology continues to advance, content curation systems will become even more sophisticated, providing users with increasingly relevant and valuable content recommendations.</p>
      `,
      author: "Dr. Emily Watson",
      authorRole: "Head of AI Research",
      authorAvatar: "👩‍🔬",
      date: "December 5, 2024",
      readTime: "10 min read",
      category: "AI",
      tags: ["AI", "Machine Learning", "Content Curation", "Algorithms"]
    }
  };

  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-16 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <a href="/blog">
            <Button>Back to Blog</Button>
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Article Header */}
      <article className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <a href="/" className="hover:text-foreground transition-colors">Home</a>
              <span>/</span>
              <a href="/blog" className="hover:text-foreground transition-colors">Blog</a>
              <span>/</span>
              <span className="text-foreground">{post.title}</span>
            </div>
          </nav>

          {/* Article Meta */}
          <div className="mb-8">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
            
            {/* Author Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xl">
                {post.authorAvatar}
              </div>
              <div>
                <div className="font-semibold">{post.author}</div>
                <div className="text-sm text-muted-foreground">{post.authorRole}</div>
              </div>
            </div>
            
            {/* Article Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mb-12">
            <h3 className="font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>

          {/* Author Card */}
          <Card className="mb-12">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl">
                  {post.authorAvatar}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{post.author}</h3>
                  <p className="text-muted-foreground mb-2">{post.authorRole}</p>
                  <p className="text-sm text-muted-foreground">
                    {post.author} is a key contributor to the Readable platform, bringing expertise in AI and user experience design.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <div className="mb-12">
            <h3 className="font-semibold text-xl mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(blogPosts)
                .filter(([key]) => key !== slug)
                .slice(0, 2)
                .map(([key, relatedPost]) => (
                  <Card key={key} className="hover:shadow-soft transition-shadow duration-300">
                    <CardHeader>
                      <Badge className="w-fit mb-2">{relatedPost.category}</Badge>
                      <CardTitle className="text-lg">
                        <a href={`/blog/${key}`} className="hover:text-primary transition-colors">
                          {relatedPost.title}
                        </a>
                      </CardTitle>
                      <CardDescription>{relatedPost.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{relatedPost.date}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Back to Blog */}
          <div className="text-center">
            <a href="/blog">
              <Button variant="outline">← Back to Blog</Button>
            </a>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
