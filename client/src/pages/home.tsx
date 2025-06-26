import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import PropertyCard from "@/components/property-card";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Shield, Users, Clock, MapPin, Handshake, Headphones } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";

export default function Home() {
  const { data: featuredProperties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties?featured=true"],
  });

  const { data: popularProperties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties?popular=true"],
  });

  const { data: newListings = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties?newListing=true"],
  });

  const stats = [
    { value: "1,200+", label: "Properties Listed" },
    { value: "850+", label: "Happy Clients" },
    { value: "47", label: "Counties Covered" },
    { value: "5+", label: "Years Experience" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Properties",
      description: "All our properties are thoroughly verified for legal compliance and authenticity.",
    },
    {
      icon: Users,
      title: "Expert Agents",
      description: "Our experienced team provides professional guidance throughout your property journey.",
    },
    {
      icon: Clock,
      title: "Quick Transactions",
      description: "We streamline the buying, selling, and renting process for faster transactions.",
    },
    {
      icon: MapPin,
      title: "Wide Coverage",
      description: "We cover all 47 counties in Kenya with extensive local market knowledge.",
    },
    {
      icon: Handshake,
      title: "Transparent Deals",
      description: "No hidden fees or surprises. We believe in complete transparency in all transactions.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our support team is available round the clock to assist with your property needs.",
    },
  ];

  const testimonials = [
    {
      name: "Mary Njeri",
      role: "Homeowner, Karen",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b1e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      content: "Silai Properties helped me find the perfect family home in Karen. Their team was professional, responsive, and made the entire process seamless.",
      rating: 5,
    },
    {
      name: "John Kimani",
      role: "First-time Buyer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      content: "As a first-time buyer, I was nervous about the process. The Silai Properties team guided me every step of the way. Highly recommended!",
      rating: 5,
    },
    {
      name: "Grace Achieng",
      role: "Tenant, Westlands",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      content: "I needed to find a rental property quickly for my job relocation. Silai Properties found me the perfect apartment within my budget in just 3 days!",
      rating: 5,
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-yellow-400 ${i < rating ? "fas fa-star" : "far fa-star"}`}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />

      {/* Featured Properties Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Featured Properties</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties that offer exceptional value and stunning features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/properties?featured=true">
              <Button className="bg-secondary hover:bg-secondary/90">
                View All Featured Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Properties Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">Popular This Week</h2>
              <p className="text-xl text-neutral-600">Properties getting the most attention from buyers and renters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProperties.slice(0, 4).map((property) => (
              <PropertyCard key={property.id} property={property} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* New Listings Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Latest Listings</h2>
            <p className="text-xl text-neutral-600">Fresh properties just added to our portfolio</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {newListings.slice(0, 2).map((property) => (
              <PropertyCard key={property.id} property={property} variant="featured" />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/properties?newListing=true">
              <Button variant="outline" className="border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white">
                View All New Listings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Why Choose Silai Properties</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              We're committed to providing exceptional real estate services across Kenya with integrity and professionalism.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-primary text-2xl w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-neutral-600">Hear from satisfied customers who found their dream properties with us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <p className="text-neutral-600 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                    <div className="text-sm text-neutral-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 cta-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Find Your Dream Property?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let our expert team help you buy, sell, or rent the perfect property. Get started today with a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <Button className="bg-white text-primary hover:bg-neutral-100">
                Browse Properties
              </Button>
            </Link>
            <Button className="bg-secondary hover:bg-secondary/90">
              Call +254 727 390238
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
