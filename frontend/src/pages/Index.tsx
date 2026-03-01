import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUp, CheckCircle2, Users, Award, Star, FileText, GraduationCap, MessageSquare, Target, Clock, Heart, Shield, Zap, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

const iconMap: Record<string, React.ElementType> = {
  FileText, GraduationCap, MessageSquare, Target, Users, Award, Star, Clock, Heart, Shield, Zap, Headphones
};

const Index = () => {
  useScrollReveal();
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

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center pt-32 pb-20">
          <p className="text-muted-foreground animate-pulse text-lg">Chargement de la page d'accueil...</p>
        </div>
      </Layout>
    );
  }

  const { hero, stats, services, testimonials, whyUs, settings } = remoteContent || {};

  const heroData = hero || {
    titleLine1: "Réussissez vos",
    titleLine2: "études en France",
    titleLine3: "avec Maig'Up",
    description: "Nous accompagnons les étudiants africains dans toutes les étapes de leur projet d'études : Campus France, choix d'université, lettres de motivation et préparation aux entretiens.",
    badges: ["Accompagnement personnalisé", "Experts Campus France", "Suivi jusqu'à l'obtention du visa"]
  };

  const statsData = stats?.items || [];
  const servicesData = services?.items || [];
  const testimonialsData = testimonials?.items || [];
  const whyUsData = whyUs?.items || [];
  
  const whatsappUrl = `https://wa.me/${(settings?.phone || "33123456789").replace(/\D/g,'')}?text=${encodeURIComponent(settings?.whatsappMessage || "Bonjour, je souhaite des informations sur vos services.")}`;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20 lg:pb-28 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hero-lighter/50 border border-hero-lighter text-hero-muted text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Expert Campus France depuis 2025
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-hero-foreground leading-tight mb-6">
                {heroData.titleLine1}
                <br />
                <span className="text-primary">{heroData.titleLine2}</span>
                <br />
                {heroData.titleLine3.split(' ').map((word: string, i: number, arr: string[]) => 
                  i === arr.length - 1 ? <span key={i} className="text-gold"> {word}</span> : word + " "
                )}
              </h1>

              <p className="text-hero-muted text-lg leading-relaxed mb-8 max-w-lg">
                {heroData.description}
              </p>

              <div className="space-y-3 mb-8">
                {heroData.badges?.map((item: string) => (
                  <div key={item} className="flex items-center gap-2 text-hero-muted">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
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

            {/* Right Column - Stats Cards */}
            <div className="space-y-4 animate-slide-up">
              {statsData.map((stat: { icon?: string | React.ElementType; value: string | number; label: string }) => {
                const Icon = typeof stat.icon === 'string' ? iconMap[stat.icon] || Star : stat.icon;
                return (
                  <div key={stat.label} className="stat-card rounded-xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      {Icon && <Icon className="w-6 h-6 text-primary" />}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-hero-foreground">{stat.value}</p>
                      <p className="text-sm text-hero-muted">{stat.label}</p>
                    </div>
                  </div>
                );
              })}

              {/* Join us badge */}
              <div className="gold-gradient rounded-full px-6 py-3 inline-flex items-center gap-3 mt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gold-foreground/20 border-2 border-gold" />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-gold-foreground text-sm">Rejoignez-nous</p>
                  <p className="text-xs text-gold-foreground/70">+50 ce mois</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      {servicesData.length > 0 && (
        <section className="section-light py-20 reveal-up">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-primary font-semibold mb-2">Nos services</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Un accompagnement sur mesure
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                De la création de votre compte Campus France jusqu'à l'obtention de votre visa, nous vous guidons à chaque étape.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 mobile-horizontal-scroll">
              {servicesData.map((service: { icon?: string | React.ElementType; title: string; description: string }) => {
                const Icon = typeof service.icon === 'string' ? iconMap[service.icon] || FileText : service.icon;
                return (
                  <div
                    key={service.title}
                    className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow group"
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

            <div className="text-center">
              <Link to="/services">
                <Button variant="outline" className="rounded-full font-semibold px-8">
                  Découvrir tous nos services
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Image + Stats Banner */}
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
                  {whyUsData.map((item: { icon?: string | React.ElementType; title: string; description: string }) => {
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

      {/* Testimonials Section */}
      {testimonialsData.length > 0 && (
        <section className="section-light py-20 reveal-up">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-primary font-semibold mb-2">Témoignages</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ils ont réussi avec {settings?.siteName || "Maig'Up France"}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez les retours de nos étudiants qui ont concrétisé leur rêve d'étudier en France.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10 mobile-horizontal-scroll">
              {testimonialsData.slice(0, 3).map((t: { name: string; quote: string; avatar?: string; origin?: string }) => (
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
                      <p className="text-xs text-muted-foreground">{t.origin}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/temoignages">
                <Button variant="outline" className="rounded-full font-semibold px-8">
                  Voir tous les témoignages
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="hero-gradient py-20 reveal">
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

      {/* Back to Top Button */}
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

export default Index;
