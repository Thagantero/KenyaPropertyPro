import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertPropertySchema, insertBlogPostSchema } from "@shared/schema";
import { KENYAN_COUNTIES } from "@/lib/counties";
import { PROPERTY_TYPES } from "@/lib/property-types";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Users,
  Building,
  FileText,
  BarChart3,
  Calendar,
  Settings,
  Home,
} from "lucide-react";
import type { Property, BlogPost, Inquiry, Analytics } from "@shared/schema";
import { z } from "zod";

export default function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Queries
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: inquiries = [] } = useQuery<Inquiry[]>({
    queryKey: ["/api/inquiries"],
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const { data: analytics = [] } = useQuery<Analytics[]>({
    queryKey: ["/api/analytics"],
  });

  // Property form
  const propertyForm = useForm({
    resolver: zodResolver(insertPropertySchema.extend({
      amenities: z.string().optional(),
      images: z.string().optional(),
    })),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      priceType: "sale",
      propertyType: "apartment",
      county: "",
      location: "",
      bedrooms: 1,
      bathrooms: 1,
      area: 500,
      amenities: "",
      images: "",
      featured: false,
      popular: false,
      newListing: true,
      agentName: "Silai Properties Agent",
      agentImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      status: "active",
    },
  });

  // Blog form
  const blogForm = useForm({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      author: "Silai Properties Team",
      published: false,
    },
  });

  // Mutations
  const createPropertyMutation = useMutation({
    mutationFn: async (data: any) => {
      const processedData = {
        ...data,
        amenities: data.amenities ? data.amenities.split(",").map((a: string) => a.trim()) : [],
        images: data.images ? data.images.split(",").map((img: string) => img.trim()) : [],
      };
      return apiRequest("POST", "/api/properties", processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({ title: "Property created successfully!" });
      propertyForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createBlogPostMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/blog", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Blog post created successfully!" });
      blogForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const processedData = {
        ...data,
        amenities: data.amenities ? data.amenities.split(",").map((a: string) => a.trim()) : [],
        images: data.images ? data.images.split(",").map((img: string) => img.trim()) : [],
      };
      return apiRequest("PATCH", `/api/properties/${id}`, processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({ title: "Property updated successfully!" });
      setEditingProperty(null);
      propertyForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({ title: "Property deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Analytics calculations
  const totalProperties = properties.length;
  const featuredProperties = properties.filter(p => p.featured).length;
  const totalInquiries = inquiries.length;
  const thisMonthInquiries = inquiries.filter(i => {
    const inquiryDate = new Date(i.createdAt!);
    const now = new Date();
    return inquiryDate.getMonth() === now.getMonth() && inquiryDate.getFullYear() === now.getFullYear();
  }).length;

  const totalVisitors = analytics.reduce((sum, a) => sum + (a.visitors || 0), 0);

  // Edit property handler
  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    propertyForm.reset({
      title: property.title,
      description: property.description,
      price: property.price,
      priceType: property.priceType,
      propertyType: property.propertyType,
      county: property.county,
      location: property.location,
      bedrooms: property.bedrooms || 1,
      bathrooms: property.bathrooms || 1,
      area: property.area || 500,
      amenities: property.amenities?.join(", ") || "",
      images: property.images?.join(", ") || "",
      featured: property.featured || false,
      popular: property.popular || false,
      newListing: property.newListing || false,
      agentName: property.agentName,
      agentImage: property.agentImage || "",
      status: property.status,
    });
  };

  // Form submission handler
  const onSubmitProperty = (data: any) => {
    if (editingProperty) {
      updatePropertyMutation.mutate({ id: editingProperty.id, data });
    } else {
      createPropertyMutation.mutate(data);
    }
  };

  const statsCards = [
    {
      title: "Total Properties",
      value: totalProperties,
      icon: Building,
      color: "bg-blue-500",
    },
    {
      title: "Total Inquiries",
      value: totalInquiries,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Monthly Visitors",
      value: totalVisitors,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      title: "Blog Posts",
      value: blogPosts.length,
      icon: FileText,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your real estate properties, inquiries, and content</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full mb-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center space-x-2">
              <Building className="w-4 h-4" />
              <span>Properties</span>
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Inquiries</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Blog</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{card.title}</p>
                          <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                        </div>
                        <div className={`p-3 rounded-full ${card.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Inquiries */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inquiries.slice(0, 5).map((inquiry) => (
                      <div key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{inquiry.name}</p>
                          <p className="text-sm text-gray-600">{inquiry.email}</p>
                        </div>
                        <Badge variant="outline">
                          {new Date(inquiry.createdAt!).toLocaleDateString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Properties */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {properties.slice(0, 5).map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{property.title}</p>
                          <p className="text-sm text-gray-600">{property.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            KSh {property.price.toLocaleString()}
                          </p>
                          {property.featured && <Badge className="status-featured">Featured</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Properties */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Properties Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Property
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Property</DialogTitle>
                  </DialogHeader>
                  <Form {...propertyForm}>
                    <form onSubmit={propertyForm.handleSubmit(onSubmitProperty)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={propertyForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Property title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={propertyForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (KSh)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={propertyForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Property description" rows={3} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={propertyForm.control}
                          name="priceType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="sale">Sale</SelectItem>
                                  <SelectItem value="rent">Rent</SelectItem>
                                  <SelectItem value="lease">Lease</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={propertyForm.control}
                          name="propertyType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {PROPERTY_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={propertyForm.control}
                          name="county"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>County</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {KENYAN_COUNTIES.map((county) => (
                                    <SelectItem key={county.value} value={county.value}>
                                      {county.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={propertyForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="Specific location" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={propertyForm.control}
                          name="bedrooms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bedrooms</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={propertyForm.control}
                          name="bathrooms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bathrooms</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={propertyForm.control}
                          name="area"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Area (sq ft)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={propertyForm.control}
                        name="amenities"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amenities (comma-separated)</FormLabel>
                            <FormControl>
                              <Input placeholder="Swimming Pool, Garden, Security" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={propertyForm.control}
                        name="images"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URLs (comma-separated)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={propertyForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Available</SelectItem>
                                <SelectItem value="sold">Sold</SelectItem>
                                <SelectItem value="rented">Rented</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={createPropertyMutation.isPending}>
                        {createPropertyMutation.isPending ? "Creating..." : "List Property"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4">Property</th>
                        <th className="text-left p-4">Location</th>
                        <th className="text-left p-4">Price</th>
                        <th className="text-left p-4">Type</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <tr key={property.id} className="border-b">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{property.title}</p>
                              <p className="text-sm text-gray-600">{property.bedrooms} bed, {property.bathrooms} bath</p>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{property.location}</td>
                          <td className="p-4 font-semibold">KSh {property.price.toLocaleString()}</td>
                          <td className="p-4">
                            <Badge variant="outline" className="capitalize">
                              {property.priceType}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-1">
                              {property.featured && <Badge className="status-featured">Featured</Badge>}
                              {property.popular && <Badge className="status-popular">Popular</Badge>}
                              {property.newListing && <Badge className="status-new">New</Badge>}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => deletePropertyMutation.mutate(property.id)}
                                disabled={deletePropertyMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries */}
          <TabsContent value="inquiries" className="space-y-6">
            <h2 className="text-2xl font-bold">Property Inquiries</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4">Contact</th>
                        <th className="text-left p-4">Property</th>
                        <th className="text-left p-4">Message</th>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map((inquiry) => (
                        <tr key={inquiry.id} className="border-b">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{inquiry.name}</p>
                              <p className="text-sm text-gray-600">{inquiry.email}</p>
                              <p className="text-sm text-gray-600">{inquiry.phone}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            {inquiry.propertyId && (
                              <p className="text-sm">Property #{inquiry.propertyId}</p>
                            )}
                          </td>
                          <td className="p-4">
                            <p className="text-sm line-clamp-2">{inquiry.message}</p>
                          </td>
                          <td className="p-4 text-gray-600">
                            {new Date(inquiry.createdAt!).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Blog Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Blog Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Blog Post</DialogTitle>
                  </DialogHeader>
                  <Form {...blogForm}>
                    <form onSubmit={blogForm.handleSubmit((data) => createBlogPostMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={blogForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Blog post title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={blogForm.control}
                        name="excerpt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Excerpt</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Short description" rows={3} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={blogForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Full blog post content" rows={10} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={blogForm.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author</FormLabel>
                            <FormControl>
                              <Input placeholder="Author name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={createBlogPostMutation.isPending}>
                        {createBlogPostMutation.isPending ? "Creating..." : "Create Blog Post"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4">Title</th>
                        <th className="text-left p-4">Author</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts.map((post) => (
                        <tr key={post.id} className="border-b">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{post.title}</p>
                              <p className="text-sm text-gray-600 line-clamp-1">{post.excerpt}</p>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{post.author}</td>
                          <td className="p-4">
                            <Badge variant={post.published ? "default" : "secondary"}>
                              {post.published ? "Published" : "Draft"}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-600">
                            {new Date(post.createdAt!).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Total Page Views</h3>
                  <p className="text-3xl font-bold text-primary">{totalVisitors}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">This Month Inquiries</h3>
                  <p className="text-3xl font-bold text-secondary">{thisMonthInquiries}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Featured Properties</h3>
                  <p className="text-3xl font-bold text-orange-500">{featuredProperties}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Page Views by Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No analytics data available</p>
                  ) : (
                    analytics.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.page}</p>
                          <p className="text-sm text-gray-600">{item.date}</p>
                        </div>
                        <Badge variant="outline">{item.visitors} visitors</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
