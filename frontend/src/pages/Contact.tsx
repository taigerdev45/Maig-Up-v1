import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Mail, Phone, MapPin, MessageCircle, User, Globe, FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

const countries = ["Sénégal", "Côte d'Ivoire", "Mali", "Guinée", "Burkina Faso", "Cameroun", "Gabon", "Congo", "Togo", "Bénin", "Niger", "Mauritanie", "Autre"];
const staticServicesList = ["Dossier Campus France", "Lettres de motivation", "Simulation d'entretien", "Pack complet", "Autre demande"];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", country: "", service: "", message: "",
  });

  const { data: remoteContent } = useQuery({
    queryKey: ['public-content'],
    queryFn: async () => {
      const { data } = await api.get('/content');
      return data;
    }
  });

  const { settings, services } = remoteContent || {};
  const servicesList = services?.items?.length > 0 
    ? [...services.items.map((s: { title: string }) => s.title), "Pack complet", "Autre demande"] 
    : staticServicesList;

  const whatsappUrl = `https://wa.me/${(settings?.phone || "33123456789").replace(/\D/g,'')}?text=${encodeURIComponent(settings?.whatsappMessage || "Bonjour, je souhaite des informations sur vos services.")}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message envoyé !", description: "Nous vous répondrons dans les 24h." });
    setFormData({ firstName: "", lastName: "", email: "", phone: "", country: "", service: "", message: "" });
  };

  return (
    <Layout>
      <PageHeader
        badge="Contact"
        title="Parlons de votre"
        highlight="projet"
        description="Remplissez le formulaire ci-dessous et notre équipe vous contactera rapidement pour discuter de votre projet d'études."
        icon={<Mail className="w-4 h-4" />}
      />

      <section className="section-light py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl font-bold text-foreground">Informations de contact</h2>
              
              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", value: settings?.email || "contact@maigup-france.com" },
                  { icon: Phone, label: "Téléphone", value: settings?.phone || "+33 1 23 45 67 89" },
                  { icon: MapPin, label: "Adresse", value: settings?.address || "Paris, France" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp card */}
              <div className="whatsapp-btn rounded-xl p-6">
                <MessageCircle className="w-10 h-10 mb-3 opacity-90" />
                <h3 className="font-bold text-lg mb-1">Réponse rapide sur WhatsApp</h3>
                <p className="text-sm opacity-80 mb-4">Besoin d'une réponse immédiate ? Contactez-nous sur WhatsApp.</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="bg-background text-foreground hover:bg-muted font-semibold rounded-full">
                    Ouvrir WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="flex items-center gap-1 text-sm font-medium text-foreground mb-2">
                        <User className="w-4 h-4 text-muted-foreground" /> Prénom *
                      </label>
                      <Input
                        required
                        placeholder="Votre prénom"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-sm font-medium text-foreground mb-2">
                        <User className="w-4 h-4 text-muted-foreground" /> Nom *
                      </label>
                      <Input
                        required
                        placeholder="Votre nom"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="flex items-center gap-1 text-sm font-medium text-foreground mb-2">
                        <Mail className="w-4 h-4 text-muted-foreground" /> Email *
                      </label>
                      <Input
                        type="email"
                        required
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-sm font-medium text-foreground mb-2">
                        <Phone className="w-4 h-4 text-muted-foreground" /> Téléphone
                      </label>
                      <Input
                        placeholder="+221 XX XXX XX XX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="flex items-center gap-1 text-sm font-medium text-foreground mb-2">
                        <Globe className="w-4 h-4 text-muted-foreground" /> Pays d'origine
                      </label>
                      <Select value={formData.country} onValueChange={(v) => setFormData({ ...formData, country: v })}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner votre pays" /></SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-sm font-medium text-foreground mb-2">
                        <FileText className="w-4 h-4 text-muted-foreground" /> Service souhaité
                      </label>
                      <Select value={formData.service} onValueChange={(v) => setFormData({ ...formData, service: v })}>
                        <SelectTrigger><SelectValue placeholder="Choisir un service" /></SelectTrigger>
                        <SelectContent>
                          {servicesList.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1 text-sm font-medium text-foreground mb-2">
                      <MessageCircle className="w-4 h-4 text-muted-foreground" /> Votre message *
                    </label>
                    <Textarea
                      required
                      placeholder="Décrivez votre projet d'études, votre niveau actuel, la formation visée..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-cyan-dark text-primary-foreground font-semibold rounded-full gap-2">
                    <Send className="w-4 h-4" /> Envoyer le message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
