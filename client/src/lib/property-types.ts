export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "mansion", label: "Mansion" },
  { value: "family-house", label: "Family House" },
  { value: "bedsitter", label: "Bedsitter" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land" },
  { value: "townhouse", label: "Townhouse" },
  { value: "villa", label: "Villa" },
  { value: "penthouse", label: "Penthouse" },
  { value: "studio", label: "Studio" },
];

// Sale price ranges (in KES)
export const SALE_PRICE_RANGES = [
  { value: "0-5000000", label: "Under KSh 5M" },
  { value: "5000000-10000000", label: "KSh 5M - 10M" },
  { value: "10000000-20000000", label: "KSh 10M - 20M" },
  { value: "20000000-50000000", label: "KSh 20M - 50M" },
  { value: "50000000+", label: "Above KSh 50M" },
];

// Rent price ranges (monthly in KES)
export const RENT_PRICE_RANGES = [
  { value: "0-10000", label: "Under KSh 10K" },
  { value: "10000-25000", label: "KSh 10K - 25K" },
  { value: "25000-50000", label: "KSh 25K - 50K" },
  { value: "50000-100000", label: "KSh 50K - 100K" },
  { value: "100000-200000", label: "KSh 100K - 200K" },
  { value: "200000+", label: "Above KSh 200K" },
];

// Lease price ranges (yearly in KES)
export const LEASE_PRICE_RANGES = [
  { value: "0-120000", label: "Under KSh 120K/year" },
  { value: "120000-300000", label: "KSh 120K - 300K/year" },
  { value: "300000-600000", label: "KSh 300K - 600K/year" },
  { value: "600000-1200000", label: "KSh 600K - 1.2M/year" },
  { value: "1200000-2400000", label: "KSh 1.2M - 2.4M/year" },
  { value: "2400000+", label: "Above KSh 2.4M/year" },
];

// Legacy export for backward compatibility
export const PRICE_RANGES = SALE_PRICE_RANGES;

export const BEDROOM_OPTIONS = [
  { value: "1", label: "1+ Beds" },
  { value: "2", label: "2+ Beds" },
  { value: "3", label: "3+ Beds" },
  { value: "4", label: "4+ Beds" },
  { value: "5", label: "5+ Beds" },
];

export const BATHROOM_OPTIONS = [
  { value: "1", label: "1+ Baths" },
  { value: "2", label: "2+ Baths" },
  { value: "3", label: "3+ Baths" },
  { value: "4", label: "4+ Baths" },
];

export const AMENITIES = [
  "Parking",
  "Security",
  "Gym",
  "Swimming Pool",
  "Garden",
  "Elevator",
  "Balcony",
  "Air Conditioning",
  "Generator",
  "CCTV",
  "Internet",
  "Playground",
  "Shopping Mall",
  "Hospital",
  "School",
];
