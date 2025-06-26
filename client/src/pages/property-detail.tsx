import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, MapPin, Bed, Bath, Square, Calendar, User, Phone, Mail, Heart, Share2, Eye } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PropertyGallery from "@/components/property-gallery";
import InquiryForm from "@/components/inquiry-form";
import PropertyCard from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { Property } from "@shared/schema";

export default function PropertyDetail() {
  const [match, params] = useRoute("/property/:id");
  const { toast } = useToast();
  const propertyId = params?.id ? parseInt(params.id) : 0;

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  const { data: similarProperties = [] } = useQuery<Property[]>({
    queryKey: [`/api/properties?county=${property?.county}&propertyType=${property?.propertyType}`],
    enabled: !!property,
  });

  const formatPrice = (price: number, priceType: string) => {
    if (priceType === "rent" || priceType === "lease") {
      return `KSh ${price.toLocaleString()}/month`;
    }
    return `KSh ${(price / 1000000).toFixed(1)}M`;
  };

  const getStatusBadge = () => {
    if (!property) return null;
    if (property.featured) return <Badge className="status-featured">Featured</Badge>;
    if (property.newListing) return <Badge className="status-new">New</Badge>;
    if (property.popular) return <Badge className="status-popular">Popular</Badge>;
    return null;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Property link has been copied to clipboard",
      });
    }
  };

  if (!match) {
    return <div>Property not found</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
            <Link href="/properties">
              <Button>Back to Properties</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredSimilarProperties = similarProperties
    .filter(p => p.id !== property.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/properties">Properties</Link>
          <span>/</span>
          <span className="text-gray-900">{property.title}</span>
        </div>

        {/* Back Button */}
        <Link href="/properties">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <PropertyGallery images={property.images || []} title={property.title} />

            {/* Property Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusBadge()}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {formatPrice(property.price, property.priceType)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Property Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  {property.bedrooms && (
                    <div className="text-center">
                      <Bed className="w-6 h-6 mx-auto mb-1 text-primary" />
                      <div className="font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center">
                      <Bath className="w-6 h-6 mx-auto mb-1 text-primary" />
                      <div className="font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  )}
                  {property.area && (
                    <div className="text-center">
                      <Square className="w-6 h-6 mx-auto mb-1 text-primary" />
                      <div className="font-semibold">{property.area}</div>
                      <div className="text-sm text-gray-600">Sq Ft</div>
                    </div>
                  )}
                  <div className="text-center">
                    <Eye className="w-6 h-6 mx-auto mb-1 text-primary" />
                    <div className="font-semibold">{property.priceType === "sale" ? "Sale" : property.priceType === "rent" ? "Rent" : "Lease"}</div>
                    <div className="text-sm text-gray-600">Type</div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Property Details */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Property Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Type:</span>
                        <span className="font-medium capitalize">{property.propertyType.replace("-", " ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">County:</span>
                        <span className="font-medium capitalize">{property.county}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium capitalize">{property.status}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {property.createdAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Listed:</span>
                          <span className="font-medium">{new Date(property.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property ID:</span>
                        <span className="font-medium">#{property.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
                <div className="flex items-center mb-4">
                  <Avatar className="w-16 h-16 mr-4">
                    <AvatarImage src={property.agentImage} alt={property.agentName} />
                    <AvatarFallback>{property.agentName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">{property.agentName}</div>
                    <div className="text-sm text-gray-600">Licensed Real Estate Agent</div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>+254 727 390238</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>info@silaiproperties.co.ke</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Agent
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Inquiry Form */}
            <InquiryForm propertyId={property.id} propertyTitle={property.title} />

            {/* Schedule Viewing */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Schedule a Viewing</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Book a private viewing of this property at your convenience.
                </p>
                <Button className="w-full bg-secondary hover:bg-secondary/90">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Viewing
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Properties */}
        {filteredSimilarProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSimilarProperties.map((similarProperty) => (
                <PropertyCard key={similarProperty.id} property={similarProperty} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
