import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    Globe, Mail, Phone, MapPin, Palette, ShieldCheck, Bell, MessageCircle, Save, RotateCcw
} from "lucide-react";

interface SettingsData {
    siteName: string;
    email: string;
    phone: string;
    address: string;
    whatsappMessage: string;
    darkModeAuto: boolean;
    scrollAnimations: boolean;
    maintenanceMode: boolean;
    notifyNewRegistration: boolean;
    notifyWeeklySummary: boolean;
}

const defaultSettings: SettingsData = {
    siteName: "",
    email: "",
    phone: "",
    address: "",
    whatsappMessage: "",
    darkModeAuto: true,
    scrollAnimations: true,
    maintenanceMode: false,
    notifyNewRegistration: true,
    notifyWeeklySummary: false,
};

const AdminSettings = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: contentData, isLoading } = useQuery({
        queryKey: ['content'],
        queryFn: async () => {
            const res = await api.get('/content');
            return res.data;
        }
    });

    const settings = contentData?.settings;

    const { register, handleSubmit, reset, setValue, watch } = useForm<SettingsData>({
        defaultValues: defaultSettings,
    });

    const darkModeAuto = watch("darkModeAuto");
    const scrollAnimations = watch("scrollAnimations");
    const maintenanceMode = watch("maintenanceMode");
    const notifyNewRegistration = watch("notifyNewRegistration");
    const notifyWeeklySummary = watch("notifyWeeklySummary");

    useEffect(() => {
        if (settings && Object.keys(settings).length > 0) {
            reset({ ...defaultSettings, ...settings });
        }
    }, [settings, reset]);

    const mutation = useMutation({
        mutationFn: async (data: SettingsData) => {
            await api.put('/content/settings', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['content'] });
            queryClient.invalidateQueries({ queryKey: ['public-content'] });
            toast({
                title: "Paramètres mis à jour",
                description: "Les informations globales ont été enregistrées avec succès.",
            });
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible d'enregistrer les paramètres.",
            });
        }
    });

    const onSubmit = (data: SettingsData) => {
        mutation.mutate(data);
    };

    const handleReset = () => {
        if (settings) {
            reset({ ...defaultSettings, ...settings });
            toast({ title: "Formulaire réinitialisé" });
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Chargement des paramètres...</div>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 reveal-up reveal-visible">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Paramètres du Site</h2>
                    <p className="text-muted-foreground">Configurez les informations globales et l'apparence de la plateforme.</p>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={handleReset} className="gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Réinitialiser
                    </Button>
                    <Button type="submit" disabled={mutation.isPending} className="bg-primary hover:bg-cyan-dark text-primary-foreground gap-2">
                        <Save className="w-4 h-4" />
                        {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Info Contact */}
                <Card className="border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            <CardTitle>Informations Générales</CardTitle>
                        </div>
                        <CardDescription>Coordonnées affichées sur le site et le pied de page.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="siteName">Nom du site</Label>
                            <Input id="siteName" {...register("siteName")} placeholder="Maig'Up France" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email de contact</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="email" type="email" className="pl-10" {...register("email")} placeholder="contact@maigup.com" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Téléphone WhatsApp</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="phone" className="pl-10" {...register("phone")} placeholder="+33 1 23 45 67 89" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Adresse du bureau</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="address" className="pl-10" {...register("address")} placeholder="Paris, France" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="whatsappMessage">Message WhatsApp par défaut</Label>
                            <div className="relative">
                                <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Textarea id="whatsappMessage" className="pl-10 min-h-[80px]" {...register("whatsappMessage")} placeholder="Bonjour, je souhaite des informations..." />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance */}
                <Card className="border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Palette className="w-5 h-5 text-primary" />
                            <CardTitle>Apparence & Thème</CardTitle>
                        </div>
                        <CardDescription>Personnalisez les couleurs et le style visuel.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Mode Sombre Automatique</Label>
                                    <p className="text-xs text-muted-foreground">Active le thème sombre selon les préférences système.</p>
                                </div>
                                <Switch
                                    checked={darkModeAuto}
                                    onCheckedChange={(checked) => setValue("darkModeAuto", checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Animations de défilement</Label>
                                    <p className="text-xs text-muted-foreground">Activer les effets de "Reveal" lors du scroll.</p>
                                </div>
                                <Switch
                                    checked={scrollAnimations}
                                    onCheckedChange={(checked) => setValue("scrollAnimations", checked)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label>Logo Principal</Label>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center border border-dashed text-muted-foreground overflow-hidden p-2">
                                    <img src="/Assets/logo_maigup-removebg-preview.png" alt="Logo preview" className="object-contain" />
                                </div>
                                <p className="text-xs text-muted-foreground">Le logo se trouve dans <code>public/Assets/</code></p>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label>Couleurs de marque</Label>
                            <div className="flex gap-3">
                                <div className="text-center">
                                    <div className="w-10 h-10 rounded-full bg-primary border-2 border-primary/30 mb-1" />
                                    <span className="text-[10px] text-muted-foreground">Primaire</span>
                                </div>
                                <div className="text-center">
                                    <div className="w-10 h-10 rounded-full bg-accent border-2 border-accent/30 mb-1" />
                                    <span className="text-[10px] text-muted-foreground">Or</span>
                                </div>
                                <div className="text-center">
                                    <div className="w-10 h-10 rounded-full admin-gradient border-2 border-white/10 mb-1" />
                                    <span className="text-[10px] text-muted-foreground">Sidebar</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security & Maintenance */}
                <Card className="border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <CardTitle>Sécurité & Maintenance</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Mode Maintenance</Label>
                                <p className="text-xs text-muted-foreground">Afficher une page d'attente aux visiteurs.</p>
                            </div>
                            <Switch
                                checked={maintenanceMode}
                                onCheckedChange={(checked) => setValue("maintenanceMode", checked)}
                            />
                        </div>
                        {maintenanceMode && (
                            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <p className="text-xs text-orange-600 font-medium">Le mode maintenance est activé. Les visiteurs verront une page d'attente.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" />
                            <CardTitle>Notifications</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Alertes nouvelles inscriptions</Label>
                                <p className="text-xs text-muted-foreground">Recevoir un email pour chaque nouvelle demande.</p>
                            </div>
                            <Switch
                                checked={notifyNewRegistration}
                                onCheckedChange={(checked) => setValue("notifyNewRegistration", checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Résumé hebdomadaire</Label>
                                <p className="text-xs text-muted-foreground">Envoyer un rapport hebdo des activités admin.</p>
                            </div>
                            <Switch
                                checked={notifyWeeklySummary}
                                onCheckedChange={(checked) => setValue("notifyWeeklySummary", checked)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
};

export default AdminSettings;
