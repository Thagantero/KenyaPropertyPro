import { 
  properties, 
  inquiries, 
  blogPosts, 
  analytics,
  users,
  type Property, 
  type InsertProperty,
  type Inquiry,
  type InsertInquiry,
  type BlogPost,
  type InsertBlogPost,
  type User,
  type InsertUser,
  type Analytics
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Property methods
  getProperties(filters?: {
    priceType?: string;
    county?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    featured?: boolean;
    popular?: boolean;
    newListing?: boolean;
  }): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;

  // Inquiry methods
  getInquiries(): Promise<Inquiry[]>;
  getInquiriesByProperty(propertyId: number): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;

  // Blog methods
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Analytics methods
  getAnalytics(date?: string): Promise<Analytics[]>;
  updateAnalytics(page: string, date: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private inquiries: Map<number, Inquiry>;
  private blogPosts: Map<number, BlogPost>;
  private analytics: Map<string, Analytics>;
  private currentUserId: number;
  private currentPropertyId: number;
  private currentInquiryId: number;
  private currentBlogId: number;
  private currentAnalyticsId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.inquiries = new Map();
    this.blogPosts = new Map();
    this.analytics = new Map();
    this.currentUserId = 1;
    this.currentPropertyId = 1;
    this.currentInquiryId = 1;
    this.currentBlogId = 1;
    this.currentAnalyticsId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample properties
    const sampleProperties: InsertProperty[] = [
      {
        title: "Luxury Family Villa",
        description: "Stunning luxury villa featuring a private swimming pool, modern finishes, and spectacular city views. Perfect for families looking for comfort and elegance.",
        price: 12500000,
        priceType: "sale",
        propertyType: "mansion",
        county: "nairobi",
        location: "Karen, Nairobi",
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        amenities: ["Swimming Pool", "Garden", "Security", "Parking"],
        images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: true,
        popular: false,
        newListing: false,
        agentName: "Sarah Mwangi",
        agentImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Modern Apartment",
        description: "Contemporary apartment with panoramic city views, premium finishes, and access to building amenities. Located in the heart of Westlands.",
        price: 45000,
        priceType: "rent",
        propertyType: "apartment",
        county: "nairobi",
        location: "Westlands, Nairobi",
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        amenities: ["Gym", "Parking", "Security", "Elevator"],
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: true,
        popular: false,
        newListing: true,
        agentName: "Grace Wanjiku",
        agentImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Executive Townhouse",
        description: "Spacious townhouse with modern architecture, perfect for executives seeking comfort and convenience in a prime location.",
        price: 8200000,
        priceType: "sale",
        propertyType: "townhouse",
        county: "nairobi",
        location: "Runda, Nairobi",
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        amenities: ["Garden", "Parking", "Security", "Modern Kitchen"],
        images: ["https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: true,
        popular: true,
        newListing: false,
        agentName: "James Kiprotich",
        agentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Beachfront Bungalow Nyali",
        description: "Stunning 3-bedroom bungalow with direct beach access and ocean views. Perfect for vacation rental or family retreat.",
        price: 18000000,
        priceType: "sale",
        propertyType: "bungalow",
        county: "mombasa",
        location: "Nyali, Mombasa",
        bedrooms: 3,
        bathrooms: 2,
        area: 180,
        amenities: ["Ocean View", "Private Beach", "Swimming Pool", "Garden", "Security"],
        images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: true,
        popular: true,
        newListing: true,
        agentName: "Grace Wanjiku",
        agentImage: "https://images.unsplash.com/photo-1494790108755-2616c843a9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Commercial Office Upper Hill",
        description: "Prime office space in Upper Hill business district. Fully furnished with modern amenities and excellent connectivity.",
        price: 150000,
        priceType: "rent",
        propertyType: "commercial",
        county: "nairobi",
        location: "Upper Hill, Nairobi",
        bedrooms: 0,
        bathrooms: 2,
        area: 250,
        amenities: ["Furnished", "Parking", "Security", "Conference Room", "High Speed Internet"],
        images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: false,
        popular: true,
        newListing: false,
        agentName: "Peter Mutua",
        agentImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Nakuru Family Home",
        description: "Charming 4-bedroom family home with large compound. Perfect for growing families seeking space and tranquility.",
        price: 12000000,
        priceType: "sale",
        propertyType: "house",
        county: "nakuru",
        location: "Nakuru Town",
        bedrooms: 4,
        bathrooms: 3,
        area: 220,
        amenities: ["Large Compound", "Garden", "Parking", "Bore Hole", "Security"],
        images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: false,
        popular: false,
        newListing: true,
        agentName: "Mary Njoroge",
        agentImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Kisumu Lakeside Apartment",
        description: "Modern 2-bedroom apartment with stunning Lake Victoria views. Features contemporary finishes and resort-style amenities.",
        price: 45000,
        priceType: "rent",
        propertyType: "apartment",
        county: "kisumu",
        location: "Milimani, Kisumu",
        bedrooms: 2,
        bathrooms: 1,
        area: 95,
        amenities: ["Lake View", "Balcony", "Parking", "Security", "Swimming Pool"],
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: false,
        popular: true,
        newListing: false,
        agentName: "David Ochieng",
        agentImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Eldoret Commercial Plot",
        description: "Prime commercial plot in Eldoret town center. Ideal for retail, office, or mixed-use development.",
        price: 8000000,
        priceType: "sale",
        propertyType: "land",
        county: "uasin gishu",
        location: "Eldoret Town",
        bedrooms: 0,
        bathrooms: 0,
        area: 500,
        amenities: ["Prime Location", "Title Deed", "Corner Plot", "Road Access"],
        images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: true,
        popular: false,
        newListing: true,
        agentName: "John Kiprop",
        agentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Nanyuki Highland Villa",
        description: "Luxury 5-bedroom villa with stunning Mount Kenya views. Features modern amenities and eco-friendly design.",
        price: 35000000,
        priceType: "sale",
        propertyType: "villa",
        county: "laikipia",
        location: "Nanyuki",
        bedrooms: 5,
        bathrooms: 4,
        area: 400,
        amenities: ["Mountain View", "Swimming Pool", "Garden", "Fireplace", "Security", "Solar Power"],
        images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: true,
        popular: true,
        newListing: true,
        agentName: "Alice Wanjiru",
        agentImage: "https://images.unsplash.com/photo-1494790108755-2616c843a9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Thika Industrial Warehouse",
        description: "Large warehouse facility with loading docks and office space. Perfect for manufacturing or distribution.",
        price: 300000,
        priceType: "rent",
        propertyType: "warehouse",
        county: "kiambu",
        location: "Thika",
        bedrooms: 0,
        bathrooms: 2,
        area: 1200,
        amenities: ["Loading Dock", "Office Space", "Security", "Parking", "High Ceiling"],
        images: ["https://images.unsplash.com/photo-1586528116493-a029325b9eb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: false,
        popular: true,
        newListing: false,
        agentName: "Samuel Mwangi",
        agentImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Westlands Premium Apartment",
        description: "Luxury 3-bedroom apartment in the heart of Westlands with stunning city views and modern finishes.",
        price: 120000,
        priceType: "rent",
        propertyType: "apartment",
        county: "nairobi",
        location: "Westlands, Nairobi",
        bedrooms: 3,
        bathrooms: 2,
        area: 140,
        amenities: ["City View", "Swimming Pool", "Gym", "Parking", "Security", "Balcony"],
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: false,
        popular: true,
        newListing: true,
        agentName: "Caroline Wanjiku",
        agentImage: "https://images.unsplash.com/photo-1494790108755-2616c843a9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Kitengela Family Estate",
        description: "Affordable 3-bedroom maisonette in a gated community with excellent amenities and family-friendly environment.",
        price: 8500000,
        priceType: "sale",
        propertyType: "maisonette",
        county: "kajiado",
        location: "Kitengela",
        bedrooms: 3,
        bathrooms: 2,
        area: 160,
        amenities: ["Gated Community", "Playground", "Security", "Parking", "Water Supply"],
        images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: false,
        popular: false,
        newListing: true,
        agentName: "Michael Kiprotich",
        agentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Machakos Shopping Center",
        description: "Prime commercial property in Machakos town center. Perfect for retail business with high foot traffic.",
        price: 480000,
        priceType: "lease",
        propertyType: "commercial",
        county: "machakos",
        location: "Machakos Town",
        bedrooms: 0,
        bathrooms: 2,
        area: 200,
        amenities: ["Prime Location", "High Traffic", "Parking", "Security", "Storage Space"],
        images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: false,
        popular: true,
        newListing: false,
        agentName: "Ruth Mutindi",
        agentImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Kilifi Beach Resort",
        description: "Stunning beachfront property with private beach access. Perfect for vacation rental or personal retreat.",
        price: 25000000,
        priceType: "sale",
        propertyType: "villa",
        county: "kilifi",
        location: "Kilifi Beach",
        bedrooms: 4,
        bathrooms: 3,
        area: 300,
        amenities: ["Beach Access", "Swimming Pool", "Ocean View", "Garden", "Security", "Boat Dock"],
        images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: true,
        popular: true,
        newListing: false,
        agentName: "Hassan Mohammed",
        agentImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Nyeri Mountain Lodge",
        description: "Cozy mountain lodge with breathtaking views of Mount Kenya. Ideal for eco-tourism or personal retreat.",
        price: 15000000,
        priceType: "sale",
        propertyType: "lodge",
        county: "nyeri",
        location: "Nyeri",
        bedrooms: 6,
        bathrooms: 4,
        area: 280,
        amenities: ["Mountain View", "Fireplace", "Garden", "Solar Power", "Water Source", "Forest Access"],
        images: ["https://images.unsplash.com/photo-1600047509358-9dc75507daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: false,
        popular: false,
        newListing: true,
        agentName: "Jane Wanjugu",
        agentImage: "https://images.unsplash.com/photo-1494790108755-2616c843a9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Isiolo Ranch Land",
        description: "Large ranch land perfect for livestock farming or agricultural investment. Good access roads and water sources.",
        price: 3500000,
        priceType: "sale",
        propertyType: "land",
        county: "isiolo",
        location: "Isiolo County",
        bedrooms: 0,
        bathrooms: 0,
        area: 2000,
        amenities: ["Water Source", "Access Road", "Fencing", "Title Deed", "Fertile Soil"],
        images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: false,
        popular: false,
        newListing: false,
        agentName: "Ibrahim Ali",
        agentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Garissa Commercial Building",
        description: "Multi-purpose commercial building suitable for offices, retail, or mixed-use. Strategic location in town center.",
        price: 720000,
        priceType: "lease",
        propertyType: "commercial",
        county: "garissa",
        location: "Garissa Town",
        bedrooms: 0,
        bathrooms: 4,
        area: 400,
        amenities: ["Multi-Purpose", "Central Location", "Parking", "Security", "Generator Backup"],
        images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: false,
        popular: false,
        newListing: true,
        agentName: "Amina Hassan",
        agentImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Malindi Beach Villa",
        description: "Exclusive beachfront villa with panoramic ocean views. Features modern amenities and tropical gardens.",
        price: 45000000,
        priceType: "sale",
        propertyType: "villa",
        county: "kilifi",
        location: "Malindi",
        bedrooms: 5,
        bathrooms: 4,
        area: 450,
        amenities: ["Beachfront", "Ocean View", "Swimming Pool", "Tropical Garden", "Security", "Garage"],
        images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: true,
        popular: true,
        newListing: false,
        agentName: "Paul Mwangi",
        agentImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Murang'a Coffee Farm",
        description: "Productive coffee farm with established trees and processing facilities. Excellent investment opportunity.",
        price: 22000000,
        priceType: "sale",
        propertyType: "farm",
        county: "murang'a",
        location: "Murang'a County",
        bedrooms: 2,
        bathrooms: 1,
        area: 800,
        amenities: ["Coffee Trees", "Processing Facility", "Farmhouse", "Water Supply", "Access Road"],
        images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: false,
        popular: true,
        newListing: false,
        agentName: "Peter Kamau",
        agentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      },
      {
        title: "Karen Executive Mansion",
        description: "Ultra-luxury 6-bedroom mansion in prestigious Karen neighborhood. Features world-class amenities and privacy.",
        price: 95000000,
        priceType: "sale",
        propertyType: "mansion",
        county: "nairobi",
        location: "Karen, Nairobi",
        bedrooms: 6,
        bathrooms: 5,
        area: 600,
        amenities: ["Swimming Pool", "Tennis Court", "Staff Quarters", "Generator", "CCTV", "Landscaped Garden"],
        images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        featured: true,
        popular: true,
        newListing: true,
        agentName: "Elizabeth Wairimu",
        agentImage: "https://images.unsplash.com/photo-1494790108755-2616c843a9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        status: "active"
      }
    ];

    sampleProperties.forEach(property => {
      const id = this.currentPropertyId++;
      const propertyWithDefaults = {
        ...property,
        id,
        createdAt: new Date(),
        area: property.area || null,
        bedrooms: property.bedrooms || null,
        bathrooms: property.bathrooms || null,
        amenities: property.amenities || null,
        images: property.images || null,
        featured: property.featured || false,
        popular: property.popular || false,
        newListing: property.newListing || false,
        agentImage: property.agentImage || null,
        status: property.status || "active"
      };
      this.properties.set(id, propertyWithDefaults);
    });

    // Sample blog posts
    const sampleBlogPosts: InsertBlogPost[] = [
      {
        title: "Kenya Real Estate Market Trends 2024",
        content: "The Kenyan real estate market continues to show strong growth potential...",
        excerpt: "Explore the latest trends and opportunities in Kenya's real estate market for 2024.",
        author: "Silai Properties Team",
        published: true
      },
      {
        title: "First-Time Buyer's Guide to Property Investment",
        content: "Buying your first property can seem daunting, but with the right guidance...",
        excerpt: "Essential tips and advice for first-time property buyers in Kenya.",
        author: "Sarah Mwangi",
        published: true
      }
    ];

    sampleBlogPosts.forEach(post => {
      const id = this.currentBlogId++;
      const postWithDefaults = {
        ...post,
        id,
        createdAt: new Date(),
        published: post.published || false
      };
      this.blogPosts.set(id, postWithDefaults);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Property methods
  async getProperties(filters?: {
    priceType?: string;
    county?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    featured?: boolean;
    popular?: boolean;
    newListing?: boolean;
  }): Promise<Property[]> {
    let result = Array.from(this.properties.values());

    if (filters) {
      if (filters.priceType) {
        result = result.filter(p => p.priceType === filters.priceType);
      }
      if (filters.county) {
        result = result.filter(p => p.county === filters.county);
      }
      if (filters.propertyType) {
        result = result.filter(p => p.propertyType === filters.propertyType);
      }
      if (filters.minPrice) {
        result = result.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        result = result.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.bedrooms) {
        result = result.filter(p => p.bedrooms && p.bedrooms >= filters.bedrooms!);
      }
      if (filters.bathrooms) {
        result = result.filter(p => p.bathrooms && p.bathrooms >= filters.bathrooms!);
      }
      if (filters.featured !== undefined) {
        result = result.filter(p => p.featured === filters.featured);
      }
      if (filters.popular !== undefined) {
        result = result.filter(p => p.popular === filters.popular);
      }
      if (filters.newListing !== undefined) {
        result = result.filter(p => p.newListing === filters.newListing);
      }
    }

    return result.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const property: Property = { 
      ...insertProperty, 
      id, 
      createdAt: new Date(),
      area: insertProperty.area || null,
      bedrooms: insertProperty.bedrooms || null,
      bathrooms: insertProperty.bathrooms || null,
      amenities: insertProperty.amenities || null,
      images: insertProperty.images || null,
      featured: insertProperty.featured || false,
      popular: insertProperty.popular || false,
      newListing: insertProperty.newListing !== undefined ? insertProperty.newListing : true,
      agentImage: insertProperty.agentImage || null,
      status: insertProperty.status || "active"
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, updateData: Partial<InsertProperty>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;

    const updatedProperty = { ...property, ...updateData };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Inquiry methods
  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getInquiriesByProperty(propertyId: number): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).filter(i => i.propertyId === propertyId);
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id, 
      createdAt: new Date(),
      propertyId: insertInquiry.propertyId || null
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  // Blog methods
  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    let result = Array.from(this.blogPosts.values());
    if (published !== undefined) {
      result = result.filter(post => post.published === published);
    }
    return result.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogId++;
    const post: BlogPost = { 
      ...insertPost, 
      id, 
      createdAt: new Date(),
      published: insertPost.published || false
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: number, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;

    const updatedPost = { ...post, ...updateData };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Analytics methods
  async getAnalytics(date?: string): Promise<Analytics[]> {
    let result = Array.from(this.analytics.values());
    if (date) {
      result = result.filter(a => a.date === date);
    }
    return result;
  }

  async updateAnalytics(page: string, date: string): Promise<void> {
    const key = `${page}-${date}`;
    const existing = this.analytics.get(key);
    
    if (existing) {
      existing.visitors = (existing.visitors ?? 0) + 1;
    } else {
      const id = this.currentAnalyticsId++;
      this.analytics.set(key, { id, page, visitors: 1, date });
    }
  }
}

export const storage = new MemStorage();
