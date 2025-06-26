import { useState } from "react";
import { Search, Home, Key, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KENYAN_COUNTIES } from "@/lib/counties";
import { PROPERTY_TYPES, PRICE_RANGES, BEDROOM_OPTIONS, BATHROOM_OPTIONS } from "@/lib/property-types";
import { useLocation } from "wouter";

interface SearchFilters {
  keyword: string;
  priceType: string;
  county: string;
  propertyType: string;
  priceRange: string;
  bedrooms: string;
  bathrooms: string;
  minArea: string;
}

export default function PropertySearch() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("buy");
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: "",
    priceType: "sale",
    county: "",
    propertyType: "",
    priceRange: "",
    bedrooms: "",
    bathrooms: "",
    minArea: "",
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const priceTypeMap = {
      buy: "sale",
      rent: "rent",
      lease: "lease",
    };
    setFilters(prev => ({ ...prev, priceType: priceTypeMap[tab as keyof typeof priceTypeMap] }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        if (key === "priceRange") {
          const [min, max] = value.split("-");
          if (min !== "25000000+") {
            params.append("minPrice", min);
            if (max) params.append("maxPrice", max);
          } else {
            params.append("minPrice", "25000000");
          }
        } else {
          params.append(key, value);
        }
      }
    });

    setLocation(`/properties?${params.toString()}`);
  };

  const tabs = [
    { id: "buy", label: "Buy", icon: Home },
    { id: "rent", label: "Rent", icon: Key },
    { id: "lease", label: "Lease", icon: Handshake },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto">
      {/* Search Tabs */}
      <div className="search-tabs flex space-x-1 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`search-tab flex-1 py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center ${
                activeTab === tab.id
                  ? "active"
                  : "text-neutral-600 hover:bg-white"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Form */}
      <div className="space-y-4">
        {/* Keyword Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by keyword, location, or property ID..."
            className="pl-12 pr-4 py-4 text-lg h-auto"
            value={filters.keyword}
            onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* County Dropdown */}
          <Select value={filters.county} onValueChange={(value) => setFilters(prev => ({ ...prev, county: value }))}>
            <SelectTrigger className="py-4 text-lg h-auto">
              <SelectValue placeholder="Select County" />
            </SelectTrigger>
            <SelectContent>
              {KENYAN_COUNTIES.map((county) => (
                <SelectItem key={county.value} value={county.value}>
                  {county.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Property Type */}
          <Select value={filters.propertyType} onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}>
            <SelectTrigger className="py-4 text-lg h-auto">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Price Range */}
          <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
            <SelectTrigger className="py-4 text-lg h-auto">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Select value={filters.bedrooms} onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value }))}>
            <SelectTrigger className="py-3 h-auto">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              {BEDROOM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.bathrooms} onValueChange={(value) => setFilters(prev => ({ ...prev, bathrooms: value }))}>
            <SelectTrigger className="py-3 h-auto">
              <SelectValue placeholder="Bathrooms" />
            </SelectTrigger>
            <SelectContent>
              {BATHROOM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.minArea} onValueChange={(value) => setFilters(prev => ({ ...prev, minArea: value }))}>
            <SelectTrigger className="py-3 h-auto">
              <SelectValue placeholder="Min Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="500">500+ sqft</SelectItem>
              <SelectItem value="1000">1000+ sqft</SelectItem>
              <SelectItem value="1500">1500+ sqft</SelectItem>
              <SelectItem value="2000">2000+ sqft</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="py-3 h-auto">
              <SelectValue placeholder="Amenities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="parking">Parking</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="gym">Gym</SelectItem>
              <SelectItem value="pool">Swimming Pool</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} className="w-full py-4 text-lg h-auto">
          <Search className="w-5 h-5 mr-2" />
          Search Properties
        </Button>
      </div>
    </div>
  );
}
