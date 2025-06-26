import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const { data: blogPosts = [], isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog?published=true"],
  });

  const featuredPost = blogPosts[0];
  const recentPosts = blogPosts.slice(1);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const blogCategories = [
    { name: "Market Trends", count: 12 },
    { name: "Buying Guide", count: 8 },
    { name: "Investment Tips", count: 15 },
    { name: "Property Law", count: 6 },
    { name: "Home Improvement", count: 10 },
    { name: "Location Guides", count: 20 },
  ];

  const recentTopics = [
    "Understanding Property Valuation in Kenya",
    "Top 10 Residential Areas in Nairobi 2024",
    "Commercial Real Estate Investment Guide",
    "First-Time Buyer's Checklist",
    "Property Management Best Practices",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Real Estate Blog</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Stay informed with the latest insights, market trends, and expert advice on Kenyan real estate.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            {isLoading ? (
              <Card className="mb-12">
                <CardContent className="p-0">
                  <Skeleton className="h-64 w-full rounded-t-lg" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </CardContent>
              </Card>
            ) : featuredPost ? (
              <Card className="mb-12">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400"
                      alt={featuredPost.title}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary">Featured</Badge>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(featuredPost.createdAt!)}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {featuredPost.author}
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <Button>
                      Read Full Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Recent Posts Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Articles</h2>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-0">
                        <Skeleton className="h-48 w-full rounded-t-lg" />
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-16 w-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Failed to load blog posts.</p>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
              ) : recentPosts.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No blog posts available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <img
                          src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="p-4">
                          <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(post.createdAt!)}
                            </div>
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {post.author}
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            Read More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Categories */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Categories</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {blogCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-700 hover:text-primary cursor-pointer transition-colors">
                        {category.name}
                      </span>
                      <Badge variant="secondary">{category.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Topics */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Popular Topics</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTopics.map((topic, index) => (
                    <div key={index} className="pb-3 border-b border-gray-100 last:border-0">
                      <a href="#" className="text-sm text-gray-700 hover:text-primary transition-colors line-clamp-2">
                        {topic}
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Stay Updated</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Subscribe to our newsletter for the latest real estate insights and market updates.
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Button className="w-full" size="sm">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact CTA */}
            <Card className="bg-primary text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Need Expert Advice?</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Get personalized guidance from our real estate experts.
                </p>
                <Link href="/contact">
                  <Button variant="secondary" size="sm">
                    Contact Us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
