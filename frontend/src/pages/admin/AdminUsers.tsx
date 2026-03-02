import { useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Plus, Search, MoreHorizontal, Edit2, Trash2, Shield, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, deleteUser, updateUserRole } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types";

const roleLabels: Record<string, string> = {
    ADMIN: "Super Admin",
    EDITOR: "Éditeur",
    READER: "Lecteur",
};

const AdminUsers = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: getUsers,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast({ title: "Utilisateur supprimé" });
        },
        onError: () => {
            toast({ variant: "destructive", title: "Erreur", description: "Impossible de supprimer l'utilisateur." });
        },
    });

    const roleMutation = useMutation({
        mutationFn: ({ id, role }: { id: string; role: User['role'] }) => updateUserRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast({ title: "Rôle mis à jour" });
        },
    });

    const filtered = users.filter((u: User) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Chargement...</div>;
    }

    return (
        <div className="space-y-6 reveal-up reveal-visible">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Utilisateurs & Accès</h2>
                    <p className="text-muted-foreground">Gérez les membres de l'équipe et leurs niveaux de permissions.</p>
                </div>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle>Membres de l'équipe ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom ou email..."
                                className="pl-10 shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border border-border/50 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-secondary/50">
                                <TableRow>
                                    <TableHead>Utilisateur</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Rôle</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                            Aucun utilisateur trouvé
                                        </TableCell>
                                    </TableRow>
                                )}
                                {filtered.map((u: User) => (
                                    <TableRow key={u.id} className="hover:bg-secondary/20 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                                                    {u.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="font-medium">{u.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="gap-1 border-primary/20 text-primary bg-primary/5">
                                                <Shield className="w-3 h-3" />
                                                {roleLabels[u.role] || u.role}
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
                                                    <DropdownMenuItem className="gap-2" onClick={() => roleMutation.mutate({ id: u.id, role: 'ADMIN' })}>
                                                        <Shield className="w-4 h-4" /> Passer Admin
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2" onClick={() => roleMutation.mutate({ id: u.id, role: 'EDITOR' })}>
                                                        <Edit2 className="w-4 h-4" /> Passer Éditeur
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2" onClick={() => roleMutation.mutate({ id: u.id, role: 'READER' })}>
                                                        <Lock className="w-4 h-4" /> Passer Lecteur
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="gap-2 text-destructive" onClick={() => deleteMutation.mutate(u.id)}>
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

export default AdminUsers;
