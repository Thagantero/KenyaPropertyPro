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
import { db } from "./db";
import { eq, and, gte, lte, desc, or, like } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

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
    let query = db.select().from(properties);
    
    const conditions = [];
    
    if (filters?.priceType) {
      conditions.push(eq(properties.priceType, filters.priceType));
    }
    if (filters?.county) {
      conditions.push(eq(properties.county, filters.county));
    }
    if (filters?.propertyType) {
      conditions.push(eq(properties.propertyType, filters.propertyType));
    }
    if (filters?.minPrice) {
      conditions.push(gte(properties.price, filters.minPrice));
    }
    if (filters?.maxPrice) {
      conditions.push(lte(properties.price, filters.maxPrice));
    }
    if (filters?.bedrooms) {
      conditions.push(gte(properties.bedrooms, filters.bedrooms));
    }
    if (filters?.bathrooms) {
      conditions.push(gte(properties.bathrooms, filters.bathrooms));
    }
    if (filters?.featured !== undefined) {
      conditions.push(eq(properties.featured, filters.featured));
    }
    if (filters?.popular !== undefined) {
      conditions.push(eq(properties.popular, filters.popular));
    }
    if (filters?.newListing !== undefined) {
      conditions.push(eq(properties.newListing, filters.newListing));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return await (query as any).orderBy(desc(properties.createdAt));
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await db.insert(properties).values(insertProperty).returning();
    return property;
  }

  async updateProperty(id: number, updateData: Partial<InsertProperty>): Promise<Property | undefined> {
    const [property] = await db.update(properties)
      .set(updateData)
      .where(eq(properties.id, id))
      .returning();
    return property || undefined;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  async getInquiriesByProperty(propertyId: number): Promise<Inquiry[]> {
    return await db.select()
      .from(inquiries)
      .where(eq(inquiries.propertyId, propertyId))
      .orderBy(desc(inquiries.createdAt));
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db.insert(inquiries).values(insertInquiry).returning();
    return inquiry;
  }

  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);
    
    if (published !== undefined) {
      query = query.where(eq(blogPosts.published, published)) as any;
    }

    return await (query as any).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(insertPost).returning();
    return post;
  }

  async updateBlogPost(id: number, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db.update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();
    return post || undefined;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAnalytics(date?: string): Promise<Analytics[]> {
    let query = db.select().from(analytics);
    
    if (date) {
      query = query.where(eq(analytics.date, date)) as any;
    }

    return await (query as any).orderBy(desc(analytics.date));
  }

  async updateAnalytics(page: string, date: string): Promise<void> {
    const [existing] = await db.select()
      .from(analytics)
      .where(and(eq(analytics.page, page), eq(analytics.date, date)));

    if (existing) {
      await db.update(analytics)
        .set({ visitors: (existing.visitors || 0) + 1 })
        .where(and(eq(analytics.page, page), eq(analytics.date, date)));
    } else {
      await db.insert(analytics).values({
        page,
        date,
        visitors: 1
      });
    }
  }
}

export const storage = new DatabaseStorage();