import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit2,
    Trash2,
    CheckCircle2,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AdminServices = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState<any>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: content, isLoading } = useQuery({
        queryKey: ['admin-content'],
        queryFn: async () => {
            const { data } = await api.get('/content');
            return data;
        }
    });

    const updateContentMutation = useMutation({
        mutationFn: async (newServices: any[]) => {
            return api.put('/content/services', { items: newServices });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-content'] });
            toast({ title: "Succès", description: "Les services ont été mis à jour." });
            setIsEditing(false);
        },
        onError: (error: any) => {
            toast({ 
                variant: "destructive", 
                title: "Erreur", 
                description: error.response?.data?.error || "Échec de la mise à jour." 
            });
        }
    });

    const services = content?.services?.items || [];

    const handleEdit = (service: any) => {
        setCurrentService({ ...service });
        setIsEditing(true);
    };

    const handleSave = () => {
        const newServices = [...services];
        const index = newServices.findIndex((s: any) => (s.id || s.title) === (currentService.id || currentService.title));
        
        if (index > -1) {
            newServices[index] = currentService;
        } else {
            newServices.push(currentService);
        }

        updateContentMutation.mutate(newServices);
    };

    const handleDelete = (serviceTitle: string) => {
        if (window.confirm("Voulez-vous vraiment retirer ce service ?")) {
            const newServices = services.filter((s: any) => s.title !== serviceTitle);
            updateContentMutation.mutate(newServices);
        }
    };

    const filtered = services.filter((s: any) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <h2 className="text-2xl font-bold tracking-tight">Gestion des Services</h2>
                    <p className="text-muted-foreground">Modifiez les services affichés sur le site public.</p>
                </div>
                <Button 
                    onClick={() => {
                        setCurrentService({ title: "", description: "", icon: "FileText" });
                        setIsEditing(true);
                    }}
                    className="bg-primary hover:bg-cyan-dark text-primary-foreground gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter un service
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3 text-foreground">
                    <CardTitle>Services Actifs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un service..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom du service</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((service: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{service.title}</TableCell>
                                        <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-green-500/10 text-green-600 flex items-center gap-1 w-fit">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Actif
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEdit(service)} className="gap-2">
                                                        <Edit2 className="w-4 h-4" /> Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleDelete(service.title)} className="gap-2 text-destructive">
                                                        <Trash2 className="w-4 h-4" /> Retirer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{currentService?.title ? "Modifier Service" : "Nouveau Service"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Titre</Label>
                            <Input 
                                id="title" 
                                value={currentService?.title || ""} 
                                onChange={(e) => setCurrentService({...currentService, title: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                                id="description" 
                                value={currentService?.description || ""} 
                                onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="icon">Icône (Nom Lucide)</Label>
                            <Input 
                                id="icon" 
                                value={currentService?.icon || ""} 
                                onChange={(e) => setCurrentService({...currentService, icon: e.target.value})}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                        <Button onClick={handleSave} disabled={updateContentMutation.isPending}>
                            {updateContentMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminServices;
