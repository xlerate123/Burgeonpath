import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      slug: "future-voice-powered-article-discovery",
      title: "The Future of Voice-Powered Article Discovery",
      description: "Exploring how AI and voice technology are revolutionizing how we find and consume content online.",
      date: "December 15, 2024",
      readTime: "5 min read",
      category: "Technology"
    },
    {
      id: 2,
      slug: "building-intuitive-search-experiences",
      title: "Building Intuitive Search Experiences",
      description: "Learn how to design search interfaces that understand natural language and user intent.",
      date: "December 10, 2024",
      readTime: "7 min read",
      category: "Design"
    },
    {
      id: 3,
      slug: "ai-powered-content-curation",
      title: "AI-Powered Content Curation: A Deep Dive",
      description: "Understanding the algorithms and techniques behind intelligent content recommendation systems.",
      date: "December 5, 2024",
      readTime: "10 min read",
      category: "AI"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on the future of content discovery and AI-powered search.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-soft transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary">{post.category}</span>
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                  </div>
                      <CardTitle className="text-xl mb-2">
                        <a href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </a>
                      </CardTitle>
                      <CardDescription className="text-base">
                        {post.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                        <a href={`/blog/${post.slug}`}>
                          <Button variant="outline" size="sm">
                            Read More
                          </Button>
                        </a>
                      </div>
                    </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-8">
            Get the latest articles and insights delivered to your inbox.
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-2 rounded-full border border-input bg-background"
            />
            <Button className="bg-gradient-primary hover:shadow-glow">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Blog;
