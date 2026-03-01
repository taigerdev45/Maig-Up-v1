import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/33123456789?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20vos%20services%20d%27accompagnement%20Campus%20France."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 whatsapp-btn flex items-center gap-2 px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all group"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="font-medium text-sm">WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
