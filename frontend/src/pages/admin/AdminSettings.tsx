import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    Globe,
    Mail,
    Phone,
    MapPin,
    Palette,
    ShieldCheck,
    Bell,
    MessageCircle
} from "lucide-react";

interface SettingsData {
    siteName: string;
    email: string;
    phone: string;
    address: string;
    whatsappMessage: string;
}

const AdminSettings = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch whole content to extract settings
    const { data: contentData, isLoading } = useQuery({
        queryKey: ['content'],
        queryFn: async () => {
            const res = await api.get('/content');
            return res.data;
        }
    });

    const settings = contentData?.settings;

    const { register, handleSubmit, reset } = useForm<SettingsData>({
        defaultValues: {
            siteName: "",
            email: "",
            phone: "",
            address: "",
            whatsappMessage: ""
        }
    });

    // Reset form when settings are loaded
    useEffect(() => {
        if (settings && Object.keys(settings).length > 0) {
            reset(settings);
        }
    }, [settings, reset]);

    const mutation = useMutation({
        mutationFn: async (data: SettingsData) => {
            await api.put('/content/settings', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['content'] });
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
                <Button type="submit" disabled={mutation.isPending} className="bg-primary hover:bg-cyan-dark text-primary-foreground">
                    {mutation.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
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
                            <Input id="siteName" {...register("siteName")} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email de contact</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="email" className="pl-10" {...register("email")} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Téléphone WhatsApp</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="phone" className="pl-10" {...register("phone")} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Adresse du bureau</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="address" className="pl-10" {...register("address")} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="whatsappMessage">Message WhatsApp par défaut</Label>
                            <div className="relative">
                                <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Textarea id="whatsappMessage" className="pl-10 min-h-[80px]" {...register("whatsappMessage")} />
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
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Animations de défilement</Label>
                                    <p className="text-xs text-muted-foreground">Activer les effets de "Reveal" lors du scroll.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label>Logo Principal</Label>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center border border-dashed text-muted-foreground overflow-hidden p-2">
                                    <img src="/Assets/logo_maigup-removebg-preview.png" alt="Logo preview" className="object-contain" />
                                </div>
                                <Button type="button" variant="outline" size="sm">Remplacer le logo</Button>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label>Couleurs de marque</Label>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary border" title="Primaire Blue" />
                                <div className="w-8 h-8 rounded-full bg-accent border" title="Or Royal" />
                                <div className="w-8 h-8 rounded-full bg-[#1A1F2C] border" title="Dark Sidebar" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security & Notifications */}
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
                            <Switch />
                        </div>
                        <Button type="button" variant="outline" className="w-full text-xs">Changer le mot de passe admin</Button>
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
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Résumé hebdomadaire</Label>
                                <p className="text-xs text-muted-foreground">Envoyer un rapport hebdo des activités admin.</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
};

export default AdminSettings;
