import { MessageCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

const WhatsAppButton = () => {
  const { data: remoteContent, isLoading } = useQuery({
    queryKey: ['public-content'],
    queryFn: async () => {
      const { data } = await api.get('/content');
      return data;
    },
    staleTime: 5 * 60 * 1000 // Cache de 5 minutes
  });

  const settings = remoteContent?.settings;
  const whatsappUrl = `https://wa.me/${(settings?.phone || "33123456789").replace(/\D/g, '')}?text=${encodeURIComponent(settings?.whatsappMessage || "Bonjour, je souhaite des informations sur vos services d'accompagnement Campus France.")}`;

  if (isLoading) return null; // Ou on peut afficher un bouton inerte, mais ne pas l'afficher evt.

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 whatsapp-btn flex items-center gap-2 px-5 py-3 rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
    >
      <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="font-medium text-sm">WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
