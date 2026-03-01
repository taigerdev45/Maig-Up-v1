import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Star, MapPin, Send, User, MessageSquare, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

const defaultStats = [
  { value: "500+", label: "Étudiants accompagnés" },
  { value: "95%", label: "Taux de réussite" },
  { value: "15+", label: "Pays représentés" },
  { value: "4.9/5", label: "Note moyenne" },
];

const defaultTestimonials = [
  {
    quote: "Grâce à Maig'Up France, j'ai pu constituer mon dossier Campus France sans stress. L'équipe m'a guidée à chaque étape et j'ai obtenu mon admission du premier coup ! Je recommande à tous les étudiants sénégalais.",
    name: "Aminata Diallo",
    country: "Sénégal",
    university: "Université Paris-Saclay",
    program: "Master Marketing Digital • 2025",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200",
  },
  {
    quote: "La simulation d'entretien m'a été très utile. J'étais préparé à toutes les questions et j'ai réussi mon entretien avec succès. L'équipe est très professionnelle et à l'écoute.",
    name: "Kofi Mensah",
    country: "Côte d'Ivoire",
    university: "Sciences Po Bordeaux",
    program: "Master Relations Internationales • 2025",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  },
  {
    quote: "L'accompagnement de Maig'Up France a fait toute la différence. Mes lettres de motivation étaient parfaitement adaptées à chaque formation. Un grand merci à toute l'équipe !",
    name: "Fatou Bah",
    country: "Guinée",
    university: "Université de Lyon",
    program: "Licence Économie • 2024",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  },
  {
    quote: "J'étais perdu dans les démarches Campus France avant de découvrir Maig'Up. En quelques semaines, mon dossier était complet et j'ai obtenu 3 admissions ! Service exceptionnel.",
    name: "Ibrahim Traoré",
    country: "Mali",
    university: "Université de Strasbourg",
    program: "Master Informatique • 2025",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
  },
  {
    quote: "Le pack complet m'a permis de ne me soucier de rien. Du début à la fin, l'équipe était là pour moi. J'ai obtenu mon visa et je suis maintenant en France !",
    name: "Aïcha Ouédraogo",
    country: "Burkina Faso",
    university: "Université de Toulouse",
    program: "Licence Droit • 2024",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
  },
  {
    quote: "Maig'Up France m'a aidé à choisir les meilleures universités pour mon profil. Leurs conseils stratégiques ont été déterminants dans ma réussite.",
    name: "Moussa Camara",
    country: "Guinée",
    university: "Université Paris-Cité",
    program: "Master Biologie • 2025",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
  },
];

const Testimonials = () => {
  useScrollReveal();

  const { data: remoteContent } = useQuery({
    queryKey: ['public-content'],
    queryFn: async () => {
      const { data } = await api.get('/content');
      return data;
    }
  });

  const settings = remoteContent?.settings;
  const statsList = remoteContent?.stats?.items?.length > 0 ? remoteContent.stats.items : defaultStats;
  const testimonialsList = remoteContent?.testimonials?.items?.length > 0 ? remoteContent.testimonials.items : defaultTestimonials;

  return (
    <Layout>
      <PageHeader
        badge="Témoignages"
        title="Ils ont réussi avec"
        highlight={settings?.siteName || "Maig'Up France"}
        description="Découvrez les témoignages de nos étudiants qui ont concrétisé leur rêve d'étudier en France."
        icon={<Star className="w-4 h-4 text-gold" />}
      />

      {/* Stats */}
      <section className="page-header-gradient py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {statsList.map((stat: { value: string | number; label: string }) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-hero-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="section-light py-20 reveal-up">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {testimonialsList.map((t: { quote: string; name: string; avatar?: string; country?: string; origin?: string; university?: string; program?: string }) => (
              <div key={t.name} className="bg-card border border-border rounded-xl p-6">
                <div className="text-gold text-3xl font-serif mb-3">"</div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t.quote}</p>
                <div className="flex items-center gap-2 text-gold mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <img src={t.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}`} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    {t.country && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{t.country}</span>
                      </div>
                    )}
                    {t.origin && !t.country && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{t.origin}</span>
                      </div>
                    )}
                    {t.university && <p className="text-xs text-muted-foreground">{t.university}</p>}
                    {t.program && <p className="text-xs text-primary">{t.program}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Leave a Testimonial Form */}
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 shadow-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Laissez votre témoignage</h3>
              <p className="text-muted-foreground">Partagez votre expérience avec {settings?.siteName || "Maig'Up France"} et aidez d'autres étudiants.</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success("Merci ! Votre témoignage a été envoyé pour validation.");
              (e.target as HTMLFormElement).reset();
            }} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Nom complet
                  </label>
                  <input required type="text" placeholder="Prénom Nom" className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" /> Pays d'origine
                  </label>
                  <input required type="text" placeholder="Sénégal, Côte d'Ivoire, etc." className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" /> Votre message
                </label>
                <textarea required rows={4} placeholder={`Comment ${settings?.siteName || "Maig'Up France"} vous a-t-il aidé ?`} className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"></textarea>
              </div>

              <div className="flex justify-center">
                <Button type="submit" className="bg-primary hover:bg-cyan-dark text-primary-foreground font-semibold px-10 rounded-full gap-2 transition-all hover:scale-105">
                  Envoyer mon témoignage <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient py-20 reveal">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-hero-foreground mb-4">Écrivez votre propre succès</h2>
          <p className="text-hero-muted mb-8 max-w-xl mx-auto">
            Rejoignez nos étudiants qui ont concrétisé leur rêve d'étudier en France.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-primary hover:bg-cyan-dark text-primary-foreground font-semibold px-8 rounded-full">
              Commencer
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;
