import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Building, Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties", hasSubmenu: true },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const propertySubmenu = [
    {
      title: "Buy Properties",
      items: [
        { name: "Houses for Sale", href: "/properties?priceType=sale&propertyType=family-house" },
        { name: "Apartments for Sale", href: "/properties?priceType=sale&propertyType=apartment" },
        { name: "Land for Sale", href: "/properties?priceType=sale&propertyType=land" },
      ],
    },
    {
      title: "Rent Properties",
      items: [
        { name: "Houses for Rent", href: "/properties?priceType=rent&propertyType=family-house" },
        { name: "Apartments for Rent", href: "/properties?priceType=rent&propertyType=apartment" },
        { name: "Commercial for Rent", href: "/properties?priceType=rent&propertyType=commercial" },
      ],
    },
    {
      title: "Lease Properties",
      items: [
        { name: "Commercial Lease", href: "/properties?priceType=lease&propertyType=commercial" },
        { name: "Industrial Lease", href: "/properties?priceType=lease" },
      ],
    },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Building className="text-primary text-2xl mr-2" />
              <span className="text-xl font-bold text-neutral-900">Silai Properties</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link href={item.href}>
                  <span
                    className={`text-neutral-900 hover:text-primary font-medium transition-colors cursor-pointer flex items-center ${
                      location === item.href ? "text-primary" : ""
                    }`}
                  >
                    {item.name}
                    {item.hasSubmenu && <span className="ml-1 text-xs">▼</span>}
                  </span>
                </Link>

                {/* Mega Menu */}
                {item.hasSubmenu && (
                  <div className="mega-menu">
                    <div className="p-6">
                      <div className="space-y-4">
                        {propertySubmenu.map((section) => (
                          <div key={section.title}>
                            <h4 className="font-semibold text-neutral-900 mb-2">{section.title}</h4>
                            <div className="space-y-2">
                              {section.items.map((subItem) => (
                                <Link key={subItem.name} href={subItem.href}>
                                  <span className="block text-sm text-neutral-600 hover:text-primary cursor-pointer">
                                    {subItem.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-sm">
              <div className="text-neutral-600">Call us</div>
              <div className="font-semibold text-neutral-900">+254 727 390238</div>
            </div>
            <Button>List Property</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-4">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <span
                        className={`text-lg font-medium cursor-pointer block ${
                          location === item.href ? "text-primary" : "text-neutral-900"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </span>
                    </Link>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="text-sm text-neutral-600 mb-2">Call us</div>
                    <div className="font-semibold text-neutral-900 mb-4">+254 727 390238</div>
                    <Button className="w-full">List Property</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
