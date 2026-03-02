import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { CheckCircle2, Globe, Heart, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGradientHover } from "@/hooks/useGradientHover";
import { useSEO } from "@/hooks/useSEO";

const values = [
  { icon: Heart, title: "Bienveillance", description: "Nous accompagnons chaque étudiant avec empathie et compréhension." },
  { icon: Award, title: "Excellence", description: "Nous visons la réussite totale de chaque dossier Campus France." },
  { icon: Globe, title: "Proximité", description: "Un conseiller dédié disponible pour répondre à toutes vos questions." },
];

const timeline = [
  { year: "2025", title: "Création de Maig'Up France", description: "Lancement de notre structure à Paris" },
  { year: "2025", title: "Premiers succès", description: "100 étudiants accompagnés dès la première année" },
  { year: "2026", title: "Expansion", description: "Ouverture des antennes en Afrique" },
];

import { useScrollReveal } from "@/hooks/useScrollReveal";

const About = () => {
  useSEO({ title: "À propos", description: "Découvrez Maig'Up France, notre mission, nos valeurs et notre engagement pour accompagner les étudiants africains vers la réussite en France." });
  const glow = useGradientHover();
  useScrollReveal();
  return (
    <Layout>
      <PageHeader
        badge="Notre histoire"
        title="À propos de"
        highlight="Maig'Up France"
        description="Née de la passion d'accompagner les étudiants africains dans leur rêve d'études en France, Maig'Up France est devenue la référence de l'accompagnement Campus France."
      />

      {/* Mission Section */}
      <section className="section-light py-20 reveal-up">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary font-semibold mb-2">Notre mission</p>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Rendre accessible le rêve d'étudier en France
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Maig'Up France est née d'un constat simple : trop d'étudiants africains talentueux voient leur projet d'études en France échouer faute d'accompagnement adapté.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Notre mission est de démocratiser l'accès aux études supérieures françaises en offrant un accompagnement personnalisé, humain et accessible à tous.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {["500+ étudiants accompagnés", "95% de taux de réussite", "15+ pays couverts", "Support 7j/7"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="/Assets/maigup3.jpg"
                alt="Équipe Maig'Up France"
                className="rounded-2xl shadow-xl w-full object-cover h-80 lg:h-96"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground rounded-xl p-4 shadow-lg">
                <p className="text-2xl font-bold">15+</p>
                <p className="text-sm opacity-80">Pays accompagnés</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-subtle py-20 reveal">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold mb-2">Nos valeurs</p>
            <h2 className="text-3xl font-bold text-foreground mb-4">Ce qui nous anime au quotidien</h2>
            <p className="text-muted-foreground">Chaque jour, nous mettons tout en œuvre pour garantir la réussite de nos étudiants.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-card border border-border rounded-xl p-8 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-light py-20 reveal-up">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold mb-2">Notre parcours</p>
            <h2 className="text-3xl font-bold text-foreground">L'histoire de Maig'Up France</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-8">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {item.year}
                  </div>
                  {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                </div>
                <div className="pb-8">
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`hero-gradient py-20 ${glow.className}`} onMouseMove={glow.onMouseMove}>
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-hero-foreground mb-4">Prêt à réaliser votre rêve ?</h2>
          <p className="text-hero-muted mb-8 max-w-xl mx-auto">
            Rejoignez les centaines d'étudiants qui ont concrétisé leur projet d'études en France grâce à Maig'Up.
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

export default About;
