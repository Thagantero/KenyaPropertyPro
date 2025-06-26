import { Heart, MapPin, Bed, Bath, Square, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Property } from "@shared/schema";
import { Link } from "wouter";

interface PropertyCardProps {
  property: Property;
  variant?: "default" | "compact" | "featured";
}

export default function PropertyCard({ property, variant = "default" }: PropertyCardProps) {
  const formatPrice = (price: number, priceType: string) => {
    if (priceType === "rent" || priceType === "lease") {
      return `KSh ${price.toLocaleString()}/month`;
    }
    return `KSh ${(price / 1000000).toFixed(1)}M`;
  };

  const getStatusBadge = () => {
    if (property.featured) return <Badge className="status-featured">Featured</Badge>;
    if (property.newListing) return <Badge className="status-new">New</Badge>;
    if (property.popular) return <Badge className="status-popular">Popular</Badge>;
    return null;
  };

  const compactCard = (
    <Card className="property-card">
      <div className="relative">
        <img
          src={property.images?.[0] || "/placeholder-property.jpg"}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          {getStatusBadge()}
        </div>
      </div>
      <CardContent className="p-4">
        <h4 className="font-semibold text-neutral-900 mb-1">{property.title}</h4>
        <p className="text-sm text-neutral-600 mb-2 flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          {property.location}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPrice(property.price, property.priceType)}
          </span>
          <span className="text-xs text-neutral-500">
            {property.bedrooms && `${property.bedrooms} bed`}
            {property.bedrooms && property.bathrooms && ", "}
            {property.bathrooms && `${property.bathrooms} bath`}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  const featuredCard = (
    <Card className="property-card">
      <div className="md:flex">
        <div className="md:w-1/2">
          <img
            src={property.images?.[0] || "/placeholder-property.jpg"}
            alt={property.title}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-6">
          <div className="flex items-center justify-between mb-3">
            {getStatusBadge()}
            <span className="text-2xl font-bold text-primary">
              {formatPrice(property.price, property.priceType)}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">{property.title}</h3>
          <p className="text-neutral-600 mb-4 flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            {property.location}
          </p>
          <div className="grid grid-cols-3 gap-4 text-sm text-neutral-600 mb-4">
            {property.bedrooms && (
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                {property.bedrooms} Beds
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                {property.bathrooms} Baths
              </div>
            )}
            {property.area && (
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                {property.area} sqft
              </div>
            )}
          </div>
          <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
            {property.description}
          </p>
          <Link href={`/property/${property.id}`}>
            <Button className="w-full">Schedule Viewing</Button>
          </Link>
        </div>
      </div>
    </Card>
  );

  const defaultCard = (
    <Card className="property-card">
      <div className="relative">
        <img
          src={property.images?.[0] || "/placeholder-property.jpg"}
          alt={property.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 left-4">
          {getStatusBadge()}
        </div>
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="icon" className="bg-white/90 text-neutral-600 hover:bg-white">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-neutral-900">{property.title}</h3>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(property.price, property.priceType)}
          </span>
        </div>
        <p className="text-neutral-600 mb-4 flex items-center">
          <MapPin className="w-4 h-4 mr-1 text-primary" />
          {property.location}
        </p>
        <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-4">
          {property.bedrooms && (
            <span className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              {property.bedrooms} Beds
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              {property.bathrooms} Baths
            </span>
          )}
          {property.area && (
            <span className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              {property.area} sqft
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="w-8 h-8 mr-2">
              <AvatarImage src={property.agentImage} alt={property.agentName} />
              <AvatarFallback>{property.agentName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-neutral-600">{property.agentName}</span>
          </div>
          <Link href={`/property/${property.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  if (variant === "compact") return compactCard;
  if (variant === "featured") return featuredCard;
  return defaultCard;
}
