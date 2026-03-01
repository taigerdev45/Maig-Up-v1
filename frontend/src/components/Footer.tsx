import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

const Footer = () => {
  const { data: remoteContent } = useQuery({
    queryKey: ['public-content'],
    queryFn: async () => {
      const { data } = await api.get('/content');
      return data;
    }
  });

  const { settings, services } = remoteContent || {};
  const servicesData = services?.items || [];

  return (
    <footer className="hero-gradient text-hero-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/Assets/logo_maigup-removebg-preview.png"
                alt="Maig'Up France Logo"
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-hero-muted text-sm leading-relaxed">
              Votre partenaire de confiance pour réussir vos études en France. Accompagnement Campus France personnalisé.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <div className="space-y-2">
              {[
                { label: "Accueil", path: "/" },
                { label: "À propos", path: "/a-propos" },
                { label: "Services", path: "/services" },
                { label: "Témoignages", path: "/temoignages" },
                { label: "Contact", path: "/contact" },
                { label: "Connexion Admin", path: "/login" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm text-hero-muted hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <div className="space-y-2 text-sm text-hero-muted">
              {servicesData.length > 0 ? (
                servicesData.slice(0, 4).map((service: { title: string }) => (
                  <p key={service.title}>{service.title}</p>
                ))
              ) : (
                <>
                  <p>Dossier Campus France</p>
                  <p>Choix des universités</p>
                  <p>Lettres de motivation</p>
                  <p>Simulation d'entretien</p>
                </>
              )}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-hero-muted">
                <Mail className="w-4 h-4 text-primary" />
                <span>{settings?.email || "contact@maigup-france.com"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-hero-muted">
                <Phone className="w-4 h-4 text-primary" />
                <span>{settings?.phone || "+33 1 23 45 67 89"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-hero-muted">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{settings?.address || "Paris, France"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-hero-lighter/30 mt-12 pt-8 text-center text-sm text-hero-muted">
          <p>© {new Date().getFullYear()} {settings?.siteName || "Maig'Up France"}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
