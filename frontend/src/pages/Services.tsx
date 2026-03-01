import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { CheckCircle2, FileText, ClipboardList, GraduationCap, MessageSquare, Target, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

const defaultServicesData = [
  {
    icon: FileText,
    color: "bg-primary",
    title: "Création de compte Campus France",
    description: "Nous vous guidons pas à pas dans la création et la configuration de votre espace Campus France. Vérification des informations, upload des documents, tout est pris en charge.",
    features: ["Création du compte étudiant", "Configuration du profil", "Vérification des données", "Assistance technique"],
  },
  {
    icon: ClipboardList,
    color: "bg-green",
    title: "Constitution du dossier",
    description: "Nous vous aidons à rassembler, organiser et présenter l'ensemble des pièces requises pour constituer un dossier complet et sans erreur.",
    features: ["Liste des documents requis", "Vérification et relecture", "Organisation du dossier", "Suivi des validations"],
  },
  {
    icon: GraduationCap,
    color: "bg-green",
    title: "Choix des universités",
    description: "Bénéficiez de conseils stratégiques pour sélectionner les formations et universités les mieux adaptées à votre profil et vos objectifs professionnels.",
    features: ["Analyse de votre profil", "Recherche de formations", "Stratégie de candidature", "Choix optimisés"],
  },
  {
    icon: MessageSquare,
    color: "bg-gold",
    title: "Lettres de motivation",
    description: "Nos experts rédigent des lettres de motivation percutantes et personnalisées pour chaque formation que vous visez.",
    features: ["Rédaction sur mesure", "Adaptation par formation", "Relecture et correction", "Optimisation du contenu"],
  },
  {
    icon: Target,
    color: "bg-destructive",
    title: "Simulation d'entretien",
    description: "Préparez-vous avec des simulations d'entretien réalistes basées sur les questions fréquemment posées lors des entretiens Campus France.",
    features: ["Mise en situation réelle", "Questions fréquentes", "Feedback personnalisé", "Coaching en confiance"],
  },
  {
    icon: Briefcase,
    color: "bg-primary",
    title: "Pack complet",
    description: "Un accompagnement de A à Z qui inclut tous nos services pour une prise en charge totale de votre projet d'études.",
    features: ["Tous les services inclus", "Conseiller dédié", "Suivi prioritaire", "Garantie satisfaction"],
  },
];

const iconMap: Record<string, React.ElementType> = {
  FileText, ClipboardList, GraduationCap, MessageSquare, Target, Briefcase
};

const colors = ["bg-primary", "bg-green", "bg-gold", "bg-destructive"];

const Services = () => {
  useScrollReveal();

  const { data: remoteContent } = useQuery({
    queryKey: ['public-content'],
    queryFn: async () => {
      const { data } = await api.get('/content');
      return data;
    }
  });

  const servicesList = remoteContent?.services?.items?.length > 0 
    ? remoteContent.services.items.map((s: { icon?: string | React.ElementType; title: string; description: string; features?: string[] }, idx: number) => ({
        ...s,
        features: s.features || [],
        color: colors[idx % colors.length]
      }))
    : defaultServicesData;

  return (
    <Layout>
      <PageHeader
        badge="Nos services"
        title="Un accompagnement"
        highlight="complet"
        description="De la création de votre compte Campus France à l'obtention de votre visa, nous vous accompagnons à chaque étape de votre projet."
      />

      <section className="section-light py-20 reveal-up">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service: { title: string; icon?: string | React.ElementType; color: string; description: string; features?: string[] }) => {
              const Icon = typeof service.icon === 'string' ? iconMap[service.icon] || FileText : service.icon || FileText;
              return (
                <div
                  key={service.title}
                  className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-14 h-14 rounded-xl ${service.color}/15 flex items-center justify-center mb-5`}>
                    {Icon && <Icon className={`w-7 h-7 text-primary`} />}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{service.description}</p>
                  <div className="space-y-2">
                    {service.features?.map((feature: string) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient py-20 reveal">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-hero-foreground mb-4">Prêt à démarrer votre projet ?</h2>
          <p className="text-hero-muted mb-8 max-w-xl mx-auto">
            Contactez-nous pour une consultation gratuite et découvrez la formule adaptée à vos besoins.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-primary hover:bg-cyan-dark text-primary-foreground font-semibold px-8 rounded-full">
              Contactez-nous
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
