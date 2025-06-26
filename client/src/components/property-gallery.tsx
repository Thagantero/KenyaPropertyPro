import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validImages = images.filter(img => img && img.trim() !== "");
  const displayImages = validImages.length > 0 ? validImages : [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <>
      <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
        {/* Main Image */}
        <div className="relative aspect-[16/10] cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <img
            src={displayImages[currentImage]}
            alt={`${title} - Image ${currentImage + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImage + 1} / {displayImages.length}
          </div>

          {/* View All Photos Button */}
          <Button
            className="absolute bottom-4 right-4"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
          >
            View All Photos
          </Button>
        </div>

        {/* Thumbnail Strip */}
        {displayImages.length > 1 && (
          <div className="p-4">
            <div className="flex space-x-2 overflow-x-auto">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImage ? "border-primary" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${title} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Gallery Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <img
              src={displayImages[currentImage]}
              alt={`${title} - Image ${currentImage + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Navigation */}
            {displayImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white hover:bg-white/30"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white hover:bg-white/30"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/20 text-white hover:bg-white/30"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 text-white px-4 py-2 rounded-full">
              {currentImage + 1} of {displayImages.length}
            </div>

            {/* Thumbnail Strip */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-center space-x-2 overflow-x-auto max-w-full">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                        index === currentImage ? "border-white" : "border-white/30"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
