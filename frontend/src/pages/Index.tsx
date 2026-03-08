import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUp, CheckCircle2, Star, FileText, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { iconMap } from "@/lib/icons";
import { useGradientHover } from "@/hooks/useGradientHover";
import { useSEO } from "@/hooks/useSEO";

interface HeroData {
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  description: string;
  badges: string[];
}

interface StatItem {
  icon?: string | React.ElementType;
  value: string | number;
  label: string;
}

interface ServiceItem {
  icon?: string | React.ElementType;
  title: string;
  description: string;
}

interface TestimonialItem {
  name: string;
  quote: string;
  avatar?: string;
  origin?: string;
  country?: string;
  university?: string;
  program?: string;
}

interface WhyUsItem {
  icon?: string | React.ElementType;
  title: string;
  description: string;
}

interface RemoteContent {
  hero?: HeroData;
  stats?: { items: StatItem[] };
  services?: { items: ServiceItem[] };
  testimonials?: { items: TestimonialItem[] };
  whyUs?: { items: WhyUsItem[] };
  settings?: { phone?: string; whatsappMessage?: string; siteName?: string };
}

const Index = () => {
  useSEO({ title: "Accueil", description: "Maig'Up France accompagne les étudiants africains dans leur projet d'études en France : Campus France, universités, lettres de motivation et visa." });
  useScrollReveal();
  const glow = useGradientHover();
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { data: remoteContent, isLoading } = useQuery({
    queryKey: ['public-content'],
    queryFn: async () => {
      const { data } = await api.get('/content');
      return data;
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Suppression du block isLoading bloquant pour permettre l'affichage immédiat des fallbacks (Skeleton optimiste)

  const { hero, stats, services, testimonials, whyUs, settings } = (remoteContent || {}) as RemoteContent;

  const heroData: HeroData = hero || {
    titleLine1: "Réussissez vos",
    titleLine2: "études en France",
    titleLine3: "avec Maig'Up",
    description: "Nous accompagnons les étudiants africains dans toutes les étapes de leur projet d'études : Campus France, choix d'université, lettres de motivation et préparation aux entretiens.",
    badges: ["Accompagnement personnalisé", "Experts Campus France", "Suivi jusqu'à l'obtention du visa"]
  };

  const statsData: StatItem[] = stats?.items || [];
  const servicesData: ServiceItem[] = services?.items || [];
  const testimonialsData: TestimonialItem[] = testimonials?.items || [];
  const whyUsData: WhyUsItem[] = whyUs?.items || [];

  const whatsappUrl = `https://wa.me/${(settings?.phone || "33123456789").replace(/\D/g, '')}?text=${encodeURIComponent(settings?.whatsappMessage || "Bonjour, je souhaite des informations sur vos services.")}`;

  return (
    <Layout>
      {/* Hero Section */}
      <section className={`hero-gradient pt-24 pb-16 lg:pt-32 lg:pb-28 relative overflow-hidden ${glow.className}`} onMouseMove={glow.onMouseMove}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hero-lighter/50 border border-hero-lighter text-hero-muted text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Expert Campus France depuis 2025
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-hero-foreground leading-tight mb-4 sm:mb-6">
                {heroData.titleLine1}
                <br />
                <span className="text-primary">{heroData.titleLine2}</span>
                <br />
                {heroData.titleLine3.split(' ').map((word, i, arr) =>
                  i === arr.length - 1 ? <span key={i} className="text-gold"> {word}</span> : word + " "
                )}
              </h1>

              <p className="text-hero-muted text-lg leading-relaxed mb-8 max-w-lg">
                {heroData.description}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-8">
                {heroData.badges?.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-hero-muted text-sm sm:text-base">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-primary hover:bg-cyan-dark text-primary-foreground font-semibold px-8 rounded-full gap-2">
                    Commencer <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="border-hero-lighter text-hero-foreground bg-hero-lighter/10 hover:bg-hero-lighter/30 font-semibold px-8 rounded-full">
                    Découvrir nos services
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-4 animate-slide-up mt-8 lg:mt-0">
              {statsData.map((stat) => {
                const Icon = typeof stat.icon === 'string' ? iconMap[stat.icon] || Star : stat.icon;
                return (
                  <div key={stat.label} className="stat-card rounded-xl p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-hero-foreground">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-hero-muted">{stat.label}</p>
                    </div>
                  </div>
                );
              })}

              <Link to="/contact" className="gold-gradient rounded-full px-6 py-3 inline-flex items-center gap-3 mt-4 hover:opacity-90 transition-opacity">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gold-foreground/20 border-2 border-gold" />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-gold-foreground text-sm">Rejoignez-nous</p>
                  <p className="text-xs text-gold-foreground/70">+50 ce mois</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Carousel - Manual scroll */}
      {servicesData.length > 0 && (
        <ServicesCarousel servicesData={servicesData} />
      )}

      {/* Why Choose Us */}
      {whyUsData.length > 0 && (
        <section className="section-subtle py-20 reveal">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <img
                  src="/Assets/maigup1.jpg"
                  alt="Étudiants heureux"
                  className="rounded-2xl shadow-xl w-full object-cover h-80 lg:h-96"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground rounded-xl p-4 shadow-lg">
                  <p className="text-2xl font-bold">{statsData.length > 0 ? statsData[0].value : "500+"}</p>
                  <p className="text-sm opacity-80">{statsData.length > 0 ? statsData[0].label : "Étudiants accompagnés"}</p>
                </div>
              </div>
              <div>
                <p className="text-primary font-semibold mb-2">Pourquoi nous choisir ?</p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  La différence {settings?.siteName || "Maig'Up France"}
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Nous combinons expertise, disponibilité et bienveillance pour vous offrir un accompagnement d'exception dans votre projet d'études en France.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {whyUsData.map((item) => {
                    const Icon = typeof item.icon === 'string' ? iconMap[item.icon] || Star : item.icon;
                    return (
                      <div key={item.title} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {Icon && <Icon className="w-5 h-5 text-primary" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Auto-Carousel - Last 5 */}
      {testimonialsData.length > 0 && (
        <TestimonialsCarousel
          testimonialsData={testimonialsData.slice(-5)}
          siteName={settings?.siteName}
        />
      )}

      {/* CTA Section */}
      <section className={`hero-gradient py-12 lg:py-20 reveal ${glow.className}`} onMouseMove={glow.onMouseMove}>
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-primary font-semibold mb-2">Prêt à démarrer ?</p>
          <h2 className="text-3xl md:text-4xl font-bold text-hero-foreground mb-4">
            Commencez votre projet d'études en France
          </h2>
          <p className="text-hero-muted max-w-2xl mx-auto mb-8">
            Obtenez une consultation gratuite et découvrez comment nous pouvons vous accompagner dans votre réussite.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link to="/contact">
              <Button size="lg" className="bg-primary hover:bg-cyan-dark text-primary-foreground font-semibold px-8 rounded-full">
                Prendre rendez-vous
              </Button>
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="whatsapp-btn font-semibold px-8 rounded-full">
                Discuter sur WhatsApp
              </Button>
            </a>
          </div>
          <div className="flex justify-center gap-6 text-sm text-hero-muted">
            <span>✓ Réponse sous 24h</span>
            <span>✓ Consultation gratuite</span>
          </div>
        </div>
      </section>

      <button
        onClick={scrollToTop}
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </Layout>
  );
};

// ============ Services Carousel (manual) ============

interface ServicesCarouselProps {
  servicesData: ServiceItem[];
}

function ServicesCarousel({ servicesData }: ServicesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector<HTMLElement>(':scope > div')?.offsetWidth || 320;
    const gap = 24;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap),
      behavior: 'smooth',
    });
  };

  return (
    <section className="section-light py-20 reveal-up">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary font-semibold mb-2">Nos services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Un accompagnement sur mesure
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              De la création de votre compte Campus France jusqu'à l'obtention de votre visa, nous vous guidons à chaque étape.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => scroll('left')}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => scroll('right')}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {servicesData.map((service) => {
            const Icon = typeof service.icon === 'string' ? iconMap[service.icon] || FileText : service.icon;
            return (
              <div
                key={service.title}
                className="min-w-[280px] md:min-w-[320px] snap-start bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow group flex-shrink-0"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  {Icon && <Icon className="w-6 h-6 text-primary" />}
                </div>
                <h3 className="font-bold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/services">
            <Button variant="outline" className="rounded-full font-semibold px-8">
              Découvrir tous nos services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============ Testimonials Auto-Carousel ============

interface TestimonialsCarouselProps {
  testimonialsData: TestimonialItem[];
  siteName?: string;
}

function TestimonialsCarousel({ testimonialsData, siteName }: TestimonialsCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="section-light py-20 reveal-up overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 mb-10 text-center">
        <p className="text-primary font-semibold mb-2">Témoignages</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Ils ont réussi avec {siteName || "Maig'Up France"}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Découvrez les retours de nos étudiants qui ont concrétisé leur rêve d'étudier en France.
        </p>
      </div>

      <div 
        className="relative w-full flex overflow-hidden mask-fade-sides"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`flex gap-6 animate-marquee ${isPaused ? 'paused' : ''} py-4`}>
          {[...testimonialsData, ...testimonialsData, ...testimonialsData].map((t, i) => (
            <div 
              key={`${t.name}-${i}`} 
              className="w-[280px] sm:w-[320px] bg-card border border-border rounded-xl p-5 flex-shrink-0 shadow-sm hover:shadow-md transition-all flex flex-col h-[220px]"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-1 text-gold">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <div className="text-gold text-2xl font-serif leading-none">"</div>
              </div>
              
              <div className="flex-1 overflow-hidden relative">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                  {t.quote}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent" />
              </div>

              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/50">
                <img 
                  src={t.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}`} 
                  alt={t.name} 
                  className="w-9 h-9 rounded-full object-cover shrink-0" 
                />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{t.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                    {(t.country || t.origin) && (
                      <div className="flex items-center gap-1 shrink-0">
                        <MapPin className="w-3 h-3" />
                        <span>{t.country || t.origin}</span>
                      </div>
                    )}
                    {t.program && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-border shrink-0" />
                        <span className="truncate text-primary">{t.program}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <Link to="/temoignages">
          <Button variant="outline" className="rounded-full font-semibold px-8 hover:bg-primary hover:text-primary-foreground transition-colors">
            Voir tous les témoignages
          </Button>
        </Link>
      </div>

      <style>{`
        .mask-fade-sides {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          width: max-content; 
        }
        .paused {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

export default Index;
