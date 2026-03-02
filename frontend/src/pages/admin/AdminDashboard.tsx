import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    FileText, MessageSquare, Eye, TrendingUp, BarChart3, UserPlus
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    LineChart, Line
} from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getVisitStats, getEvolutionData, type VisitStats, type EvolutionData } from "@/services/api";
import type { DashboardStats } from "@/types";

const COLORS = ['#D4AF37', '#1A1F2C', '#3b82f6', '#ef4444'];
const PAGE_COLORS: Record<string, string> = {
    'Accueil': '#D4AF37',
    'Services': '#3b82f6',
    'Témoignages': '#10b981',
    'Contact': '#f59e0b',
    'À propos': '#8b5cf6',
    'Connexion': '#6b7280',
};

const periodOptions = [
    { value: '24h', label: '24h' },
    { value: '7d', label: '7 jours' },
    { value: '30d', label: '30 jours' },
    { value: '90d', label: '90 jours' },
];

const evolutionPeriodOptions = [
    { value: '7d', label: '7 jours' },
    { value: '30d', label: '30 jours' },
    { value: '90d', label: '90 jours' },
    { value: '12m', label: '12 mois' },
];

const AdminDashboard = () => {
    const [visitPeriod, setVisitPeriod] = useState('7d');
    const [evoPeriod, setEvoPeriod] = useState('30d');

    const { data: dashboardData, isLoading: loadingStats } = useQuery<DashboardStats>({
        queryKey: ['admin-dashboard'],
        queryFn: getDashboardStats,
    });

    const { data: visitData, isLoading: loadingVisits } = useQuery<VisitStats>({
        queryKey: ['admin-visits', visitPeriod],
        queryFn: () => getVisitStats(visitPeriod),
    });

    const { data: evoData, isLoading: loadingEvo } = useQuery<EvolutionData>({
        queryKey: ['admin-evolution', evoPeriod],
        queryFn: () => getEvolutionData(evoPeriod),
    });

    const stats = dashboardData ? [
        { label: "Total Contacts", value: dashboardData.totalContacts.toString(), icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Demandes", value: dashboardData.totalRegistrations.toString(), icon: FileText, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Témoignages", value: dashboardData.totalTestimonials.toString(), icon: Eye, color: "text-green-500", bg: "bg-green-500/10" },
    ] : [];

    const statusData = dashboardData ? Object.entries(dashboardData.registrationsByStatus).map(([name, value]) => ({ name, value })) : [];

    if (loadingStats) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Chargement du tableau de bord...</div>;
    }

    const formatDateLabel = (v: string) => {
        if (evoPeriod === '12m') {
            const [y, m] = v.split('-');
            const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
            return months[parseInt(m) - 1] || v;
        }
        const d = new Date(v);
        return `${d.getDate()}/${d.getMonth() + 1}`;
    };

    return (
        <div className="space-y-6 reveal-up reveal-visible">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Evolution Chart - Contacts & Registrations */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-primary" />
                            Évolution Contacts & Demandes
                        </CardTitle>
                        <div className="flex gap-1">
                            {evolutionPeriodOptions.map(opt => (
                                <Button
                                    key={opt.value}
                                    variant={evoPeriod === opt.value ? "default" : "outline"}
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => setEvoPeriod(opt.value)}
                                >
                                    {opt.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingEvo ? (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground animate-pulse">
                            Chargement...
                        </div>
                    ) : evoData && evoData.timeline.length > 0 ? (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={evoData.timeline}>
                                    <defs>
                                        <linearGradient id="grad-contacts" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="grad-registrations" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748B', fontSize: 11 }}
                                        tickFormatter={formatDateLabel}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        labelFormatter={(v: string) => {
                                            if (evoPeriod === '12m') {
                                                const [y, m] = v.split('-');
                                                return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
                                            }
                                            return new Date(v).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="contacts"
                                        name="Contacts"
                                        stroke="#3b82f6"
                                        strokeWidth={2.5}
                                        dot={{ r: 3, fill: '#3b82f6' }}
                                        activeDot={{ r: 5 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="registrations"
                                        name="Demandes"
                                        stroke="#f59e0b"
                                        strokeWidth={2.5}
                                        dot={{ r: 3, fill: '#f59e0b' }}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            Aucune donnée sur cette période
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Visits Chart */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Visites par page
                            {visitData && (
                                <span className="text-sm font-normal text-muted-foreground ml-2">
                                    ({visitData.total} total)
                                </span>
                            )}
                        </CardTitle>
                        <div className="flex gap-1">
                            {periodOptions.map(opt => (
                                <Button
                                    key={opt.value}
                                    variant={visitPeriod === opt.value ? "default" : "outline"}
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => setVisitPeriod(opt.value)}
                                >
                                    {opt.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingVisits ? (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground animate-pulse">
                            Chargement des visites...
                        </div>
                    ) : visitData && visitData.timeline.length > 0 ? (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={visitData.timeline}>
                                    <defs>
                                        {visitData.pages.map((page, i) => (
                                            <linearGradient key={page} id={`color-${i}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={PAGE_COLORS[page] || COLORS[i % COLORS.length]} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={PAGE_COLORS[page] || COLORS[i % COLORS.length]} stopOpacity={0} />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748B', fontSize: 11 }}
                                        tickFormatter={(v: string) => {
                                            const d = new Date(v);
                                            return `${d.getDate()}/${d.getMonth() + 1}`;
                                        }}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        labelFormatter={(v: string) => {
                                            const d = new Date(v);
                                            return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
                                        }}
                                    />
                                    <Legend />
                                    {visitData.pages.map((page, i) => (
                                        <Area
                                            key={page}
                                            type="monotone"
                                            dataKey={page}
                                            name={page}
                                            stroke={PAGE_COLORS[page] || COLORS[i % COLORS.length]}
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill={`url(#color-${i})`}
                                        />
                                    ))}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            Aucune visite enregistrée sur cette période
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Bottom cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Visites par page
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {visitData && Object.keys(visitData.byPage).length > 0 ? (
                            <div className="space-y-3">
                                {Object.entries(visitData.byPage)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([page, count]) => (
                                        <div key={page}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm text-muted-foreground">{page}</span>
                                                <span className="text-sm font-bold">{count}</span>
                                            </div>
                                            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${(count / visitData.total) * 100}%`,
                                                        backgroundColor: PAGE_COLORS[page] || '#D4AF37',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Aucune donnée</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Répartition des Demandes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {statusData.map((item, index) => (
                                <div key={item.name} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="text-sm text-muted-foreground">{item.name}</span>
                                    </div>
                                    <span className="font-bold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Contacts par statut
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {dashboardData?.contactsByStatus && (
                            <div className="space-y-3">
                                {Object.entries(dashboardData.contactsByStatus).map(([status, count]) => (
                                    <div key={status} className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{status === 'new' ? 'Nouveaux' : status === 'read' ? 'Lus' : 'Traités'}</span>
                                        <span className="font-bold">{count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
