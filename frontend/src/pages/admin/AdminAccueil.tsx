import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LayoutDashboard, Plus, Trash2 } from "lucide-react";

const AdminAccueil = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: contentData, isLoading } = useQuery({
        queryKey: ['content'],
        queryFn: async () => {
            const res = await api.get('/content');
            return res.data;
        }
    });

    const { register: registerHero, handleSubmit: handleSubmitHero, reset: resetHero } = useForm();
    const { register: registerStats, handleSubmit: handleSubmitStats, control: controlStats, reset: resetStats } = useForm();
    const { fields: statsFields, append: appendStat, remove: removeStat } = useFieldArray({
        control: controlStats,
        name: "items" as never
    });

    const { register: registerWhyUs, handleSubmit: handleSubmitWhyUs, control: controlWhyUs, reset: resetWhyUs } = useForm();
    const { fields: whyUsFields, append: appendWhyUs, remove: removeWhyUs } = useFieldArray({
        control: controlWhyUs,
        name: "items" as never
    });

    useEffect(() => {
        if (contentData) {
            if (contentData.hero) resetHero(contentData.hero);
            if (contentData.stats) resetStats(contentData.stats);
            if (contentData.whyUs) resetWhyUs(contentData.whyUs);
        }
    }, [contentData, resetHero, resetStats, resetWhyUs]);

    const mutation = useMutation({
        mutationFn: async ({ section, data }: { section: string, data: any }) => {
            await api.put(`/content/${section}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['content'] });
            toast({
                title: "Section mise à jour",
                description: "Les modifications ont été enregistrées.",
            });
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible d'enregistrer les modifications.",
            });
        }
    });

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Chargement...</div>;
    }

    return (
        <div className="space-y-6 reveal-up reveal-visible">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Gestion de l'Accueil</h2>
                <p className="text-muted-foreground">Modifiez le contenu affiché sur la page principale.</p>
            </div>

            {/* SECTION HERO */}
            <Card className="border-border/50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-primary" />
                        <CardTitle>Section Principale (Hero)</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmitHero((data) => mutation.mutate({ section: 'hero', data }))} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Titre ligne 1</Label>
                                <Input {...registerHero("titleLine1")} />
                            </div>
                            <div className="space-y-2">
                                <Label>Titre ligne 2 (Bleu)</Label>
                                <Input {...registerHero("titleLine2")} />
                            </div>
                            <div className="space-y-2">
                                <Label>Titre ligne 3 (Or)</Label>
                                <Input {...registerHero("titleLine3")} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea {...registerHero("description")} className="min-h-[100px]" />
                        </div>
                        <Button type="submit" disabled={mutation.isPending}>Enregistrer Hero</Button>
                    </form>
                </CardContent>
            </Card>

            {/* SECTION STATS */}
            <Card className="border-border/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Statistiques Clés</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => appendStat({ icon: "Star", value: "", label: "" })}>
                            <Plus className="w-4 h-4 mr-2" /> Ajouter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmitStats((data) => mutation.mutate({ section: 'stats', data }))} className="space-y-4">
                        {statsFields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-end bg-secondary/20 p-4 rounded-lg">
                                <div className="space-y-2 flex-col flex-1">
                                    <Label>Valeur</Label>
                                    <Input {...registerStats(`items.${index}.value` as const)} placeholder="ex: 500+" />
                                </div>
                                <div className="space-y-2 flex-col flex-1">
                                    <Label>Libellé</Label>
                                    <Input {...registerStats(`items.${index}.label` as const)} placeholder="ex: Étudiants accompagnés" />
                                </div>
                                <div className="space-y-2 flex-col flex-1">
                                    <Label>Nom d'icône (lucide-react)</Label>
                                    <Input {...registerStats(`items.${index}.icon` as const)} placeholder="ex: Users" />
                                </div>
                                <Button type="button" variant="ghost" size="icon" className="text-destructive mb-0.5" onClick={() => removeStat(index)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="submit" disabled={mutation.isPending}>Enregistrer Statistiques</Button>
                    </form>
                </CardContent>
            </Card>

            {/* SECTION POURQUOI NOUS CHOISIR */}
            <Card className="border-border/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Pourquoi Nous Choisir</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => appendWhyUs({ icon: "Star", title: "", description: "" })}>
                            <Plus className="w-4 h-4 mr-2" /> Ajouter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmitWhyUs((data) => mutation.mutate({ section: 'whyUs', data }))} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {whyUsFields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-start bg-secondary/20 p-4 rounded-lg">
                                    <div className="space-y-3 flex-1">
                                        <Input {...registerWhyUs(`items.${index}.title` as const)} placeholder="Titre (ex: Gain de temps)" className="font-semibold" />
                                        <Textarea {...registerWhyUs(`items.${index}.description` as const)} placeholder="Description" className="text-sm min-h-[80px]" />
                                        <Input {...registerWhyUs(`items.${index}.icon` as const)} placeholder="Icône (ex: Clock)" className="text-sm" />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive mt-1" onClick={() => removeWhyUs(index)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button type="submit" disabled={mutation.isPending}>Enregistrer Stratégie</Button>
                    </form>
                </CardContent>
            </Card>

        </div>
    );
};

export default AdminAccueil;
