import { useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Search, MoreHorizontal, Edit2, Trash2, Globe, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRegistrations, updateRegistrationStatus, deleteRegistration } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import type { Registration } from "@/types";

const AdminRegistrations = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: result, isLoading } = useQuery({
        queryKey: ['admin-registrations'],
        queryFn: () => getRegistrations(),
    });

    const registrations: Registration[] = result?.data || [];

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: Registration['status'] }) =>
            updateRegistrationStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-registrations'] });
            toast({ title: "Statut mis à jour" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteRegistration,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-registrations'] });
            toast({ title: "Demande supprimée" });
        },
    });

    const filtered = registrations.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Validé": return "bg-green-500/10 text-green-600";
            case "En attente": return "bg-yellow-500/10 text-yellow-600";
            case "En cours": return "bg-blue-500/10 text-blue-600";
            case "Incomplet": return "bg-destructive/10 text-destructive";
            default: return "bg-secondary text-secondary-foreground";
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Chargement...</div>;
    }

    return (
        <div className="space-y-6 reveal-up reveal-visible">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Gestion des Demandes</h2>
                    <p className="text-muted-foreground">Suivez et gérez les demandes d'accompagnement des étudiants.</p>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Liste des demandes ({registrations.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un étudiant, pays, ID..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Globe className="w-4 h-4" />
                            Filtres
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Étudiant</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Pays</TableHead>
                                    <TableHead>Programme visé</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                            Aucune demande trouvée
                                        </TableCell>
                                    </TableRow>
                                )}
                                {filtered.map((reg) => (
                                    <TableRow key={reg.id}>
                                        <TableCell className="font-medium">{reg.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{reg.email}</TableCell>
                                        <TableCell>{reg.country}</TableCell>
                                        <TableCell>{reg.program}</TableCell>
                                        <TableCell>{new Date(reg.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={getStatusColor(reg.status)}>
                                                {reg.status}
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
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="gap-2" onClick={() => statusMutation.mutate({ id: reg.id, status: 'En cours' })}>
                                                        <Edit2 className="w-4 h-4" /> En cours
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2" onClick={() => statusMutation.mutate({ id: reg.id, status: 'Validé' })}>
                                                        <Eye className="w-4 h-4" /> Valider
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2" onClick={() => statusMutation.mutate({ id: reg.id, status: 'Incomplet' })}>
                                                        <Edit2 className="w-4 h-4" /> Incomplet
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="gap-2 text-destructive" onClick={() => deleteMutation.mutate(reg.id)}>
                                                        <Trash2 className="w-4 h-4" /> Supprimer
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
        </div>
    );
};

export default AdminRegistrations;
