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
