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
    Globe,
    GraduationCap,
    FileText,
    Eye
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

const initialRegistrations = [
    { id: "REG-001", name: "Jean Soro", country: "Côte d'Ivoire", program: "Master Informatique", status: "En attente", date: "2024-03-24" },
    { id: "REG-002", name: "Moussa Laye", country: "Sénégal", program: "Licence Économie", status: "Validé", date: "2024-03-23" },
    { id: "REG-003", name: "Aminata Koné", country: "Mali", program: "Master Droit", status: "En cours", date: "2024-03-22" },
    { id: "REG-004", name: "Thomas Dubois", country: "Cameroun", program: "Prépa Ingénieur", status: "Incomplet", date: "2024-03-21" },
    { id: "REG-005", name: "Fatou Diop", country: "Sénégal", program: "Master Marketing", status: "En attente", date: "2024-03-20" },
];

const AdminRegistrations = () => {
    const [registrations] = useState(initialRegistrations);
    const [searchTerm, setSearchTerm] = useState("");

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
                    <CardTitle>Liste des demandes</CardTitle>
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
                                    <TableHead>ID</TableHead>
                                    <TableHead>Étudiant</TableHead>
                                    <TableHead>Pays</TableHead>
                                    <TableHead>Programme visé</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((reg) => (
                                    <TableRow key={reg.id}>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{reg.id}</TableCell>
                                        <TableCell className="font-medium">{reg.name}</TableCell>
                                        <TableCell>{reg.country}</TableCell>
                                        <TableCell>{reg.program}</TableCell>
                                        <TableCell>{reg.date}</TableCell>
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
                                                    <DropdownMenuItem className="gap-2">
                                                        <Eye className="w-4 h-4" /> Voir le dossier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2">
                                                        <Edit2 className="w-4 h-4" /> Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="gap-2 text-destructive">
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
