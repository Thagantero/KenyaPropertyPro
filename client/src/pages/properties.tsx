import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PropertyCard from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { KENYAN_COUNTIES } from "@/lib/counties";
import { PROPERTY_TYPES, PRICE_RANGES, BEDROOM_OPTIONS, BATHROOM_OPTIONS } from "@/lib/property-types";
import type { Property } from "@shared/schema";

export default function Properties() {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState(new URLSearchParams(location.split("?")[1] || ""));
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    priceType: searchParams.get("priceType") || "",
    county: searchParams.get("county") || "",
    propertyType: searchParams.get("propertyType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    featured: searchParams.get("featured") || "",
    popular: searchParams.get("popular") || "",
    newListing: searchParams.get("newListing") || "",
  });

  const buildQueryString = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });
    return params.toString();
  };

  const { data: properties = [], isLoading, error } = useQuery<Property[]>({
    queryKey: [`/api/properties?${buildQueryString()}`],
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      priceType: "",
      county: "",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      featured: "",
      popular: "",
      newListing: "",
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value && value !== "").length;
  };

  const formatPrice = (price: string) => {
    if (!price) return "";
    return `KSh ${(parseInt(price) / 1000000).toFixed(1)}M`;
  };

  const getPriceTypeLabel = (type: string) => {
    const labels = { sale: "Buy", rent: "Rent", lease: "Lease" };
    return labels[type as keyof typeof labels] || type;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1] || "");
    setSearchParams(params);
    setFilters({
      keyword: params.get("keyword") || "",
      priceType: params.get("priceType") || "",
      county: params.get("county") || "",
      propertyType: params.get("propertyType") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      bedrooms: params.get("bedrooms") || "",
      bathrooms: params.get("bathrooms") || "",
      featured: params.get("featured") || "",
      popular: params.get("popular") || "",
      newListing: params.get("newListing") || "",
    });
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Properties</h1>
          <p className="text-neutral-600">
            {properties.length} properties found
            {filters.county && ` in ${KENYAN_COUNTIES.find(c => c.value === filters.county)?.label}`}
            {filters.priceType && ` for ${getPriceTypeLabel(filters.priceType)}`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                  {getActiveFiltersCount() > 0 && (
                    <Badge variant="secondary" className="ml-2">{getActiveFiltersCount()}</Badge>
                  )}
                </h3>
                {getActiveFiltersCount() > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Keyword Search */}
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">Keyword</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      placeholder="Search properties..."
                      className="pl-10"
                      value={filters.keyword}
                      onChange={(e) => handleFilterChange("keyword", e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Price Type */}
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">Transaction Type</label>
                  <Select value={filters.priceType} onValueChange={(value) => handleFilterChange("priceType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Buy</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="lease">Lease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* County */}
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">County</label>
                  <Select value={filters.county} onValueChange={(value) => handleFilterChange("county", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {KENYAN_COUNTIES.map((county) => (
                        <SelectItem key={county.value} value={county.value}>
                          {county.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">Property Type</label>
                  <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange("propertyType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">Bedrooms</label>
                  <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange("bedrooms", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      {BEDROOM_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">Bathrooms</label>
                  <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange("bathrooms", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      {BATHROOM_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min price"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    />
                    <Input
                      placeholder="Max price"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:w-3/4">
            {/* View Controls */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="featured">Featured First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-neutral-600">Failed to load properties. Please try again.</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            )}

            {/* Properties List */}
            {!isLoading && !error && (
              <>
                {properties.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-neutral-600 mb-4">No properties found matching your criteria.</p>
                    <Button onClick={clearFilters}>Clear Filters</Button>
                  </div>
                ) : (
                  <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        variant={viewMode === "list" ? "featured" : "default"}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
