import { useState } from "react";
import {
    Plus,
    Search,
    MoreHorizontal,
    Trash2,
    CheckCircle2,
    XCircle,
    User,
    Quote,
    Star,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPendingTestimonials, updateTestimonialStatus, deleteTestimonialSubmission } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface TestimonialItem {
    id: string;
    name?: string;
    origin?: string;
    country?: string;
    quote?: string;
    message?: string;
    avatar?: string;
    status?: string;
    date?: string;
}

const AdminTestimonials = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: testimonialsData, isLoading } = useQuery({
        queryKey: ['pending-testimonials'],
        queryFn: getPendingTestimonials
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            return updateTestimonialStatus(id, status);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] });
            toast({ title: "Succès", description: "Le statut du témoignage a été mis à jour." });
        },
        onError: (error: Error | { response?: { data?: { error?: string } } }) => {
            const err = error as { response?: { data?: { error?: string } } };
            toast({ 
                variant: "destructive", 
                title: "Erreur", 
                description: err.response?.data?.error || "Échec de la mise à jour." 
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return deleteTestimonialSubmission(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] });
            toast({ title: "Succès", description: "La soumission a été supprimée." });
        },
        onError: () => {
            toast({ variant: "destructive", title: "Erreur", description: "Échec de la suppression." });
        }
    });

    const testimonials = Array.isArray(testimonialsData) ? testimonialsData : [];

    const handleUpdateStatus = (id: string, newStatus: string) => {
        updateStatusMutation.mutate({ id, status: newStatus });
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Voulez-vous vraiment supprimer définitivement cette soumission ?")) {
            deleteMutation.mutate(id);
        }
    };

    const filtered = testimonials.filter((t: TestimonialItem) =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.origin?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Publié": return "bg-green-500/10 text-green-600";
            case "En attente": return "bg-yellow-500/10 text-yellow-600";
            case "Rejeté": return "bg-destructive/10 text-destructive";
            default: return "bg-secondary text-secondary-foreground";
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 reveal-up reveal-visible">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Gestion des Témoignages</h2>
                    <p className="text-muted-foreground">Approuvez ou rejetez les témoignages affichés sur le site.</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un témoin..."
                        className="pl-10 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {filtered.map((t: TestimonialItem, index: number) => (
                    <Card key={index} className="border-border/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col h-full">
                        <div className={`absolute top-0 left-0 w-1 h-full ${t.status === 'Publié' ? 'bg-green-500' : t.status === 'En attente' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                                        {t.avatar ? <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-primary" />}
                                    </div>
                                    <div className="min-w-0">
                                        <CardTitle className="text-sm font-bold line-clamp-1 truncate">{t.name}</CardTitle>
                                        <p className="text-xs text-muted-foreground line-clamp-1 truncate">{t.origin || t.country}</p>
                                    </div>
                                </div>
                                <Badge className={`shrink-0 ${getStatusColor(t.status || "En attente")}`}>
                                    {t.status || "En attente"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    < Star key={s} className="w-3 h-3 fill-gold text-gold" />
                                ))}
                            </div>
                            <div className="relative h-full">
                                <Quote className="w-8 h-8 text-primary/5 absolute -top-2 -left-2 rotate-180" />
                                <p className="text-sm text-muted-foreground leading-relaxed italic relative z-10 line-clamp-4">
                                    "{t.quote || t.message}"
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-4 mt-auto border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                            <span>{t.date || "Date non spécifiée"}</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(t.id, "Publié")} className="gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Publier
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(t.id, "Rejeté")} className="gap-2">
                                        <XCircle className="w-4 h-4 text-destructive" /> Rejeter
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleDelete(t.id)} className="gap-2 text-destructive">
                                        <Trash2 className="w-4 h-4" /> Supprimer
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminTestimonials;
