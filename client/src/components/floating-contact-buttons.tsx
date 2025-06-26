import { Phone, MessageCircle } from "lucide-react";

export default function FloatingContactButtons() {
  const phoneNumber = "+254727390238";
  const whatsappNumber = "254727390238"; // WhatsApp format without +
  
  const handleCall = () => {
    window.open(`tel:${phoneNumber}`, '_self');
  };
  
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hello! I'm interested in your properties. Can you help me?");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="whatsapp-button text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 group"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          WhatsApp Us
        </span>
      </button>
      
      {/* Call Button */}
      <button
        onClick={handleCall}
        className="call-button text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 group"
        aria-label="Call us"
      >
        <Phone className="w-6 h-6" />
        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Call Us
        </span>
      </button>
    </div>
  );
}