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
    Shield,
    UserCheck,
    Mail,
    Lock
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

const initialUsers = [
    { id: 1, name: "Admin Principal", email: "admin@maigup.com", role: "Super Admin", lastLogin: "Il y a 1 heure" },
    { id: 2, name: "Consultant 1", email: "consultant@maigup.com", role: "Éditeur", lastLogin: "Hier" },
    { id: 3, name: "Support Client", email: "support@maigup.com", role: "Lecteur", lastLogin: "3 jours" },
];

const AdminUsers = () => {
    const [users] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 reveal-up reveal-visible">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Utilisateurs & Accès</h2>
                    <p className="text-muted-foreground">Gérez les membres de l'équipe et leurs niveaux de permissions.</p>
                </div>
                <Button className="bg-primary hover:bg-cyan-dark text-primary-foreground gap-2">
                    <Plus className="w-4 h-4" />
                    Nouvel utilisateur
                </Button>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle>Membres de l'équipe</CardTitle>
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
                                    <TableHead>Dernière connexion</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((u) => (
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
                                            <Badge variant="outline" className={`gap-1 border-primary/20 text-primary bg-primary/5`}>
                                                <Shield className="w-3 h-3" />
                                                {u.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{u.lastLogin}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                                                    <DropdownMenuItem className="gap-2">
                                                        <Edit2 className="w-4 h-4 font-bold" /> Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2">
                                                        <Lock className="w-4 h-4" /> Réinitialiser MP
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="gap-2 text-destructive">
                                                        <Trash2 className="w-4 h-4" /> Désactiver
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
