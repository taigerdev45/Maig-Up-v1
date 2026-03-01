import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    FileText,
    MessageSquare,
    TrendingUp,
    UserPlus,
    ArrowUpRight,
    Settings,
    Eye,
    MousePointer2,
    Clock
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';

const visitData = [
    { name: 'Lun', visits: 400, inquiries: 240 },
    { name: 'Mar', visits: 300, inquiries: 139 },
    { name: 'Mer', visits: 200, inquiries: 980 },
    { name: 'Jeu', visits: 278, inquiries: 390 },
    { name: 'Ven', visits: 189, inquiries: 480 },
    { name: 'Sam', visits: 239, inquiries: 380 },
    { name: 'Dim', visits: 349, inquiries: 430 },
];

const statusData = [
    { name: 'Validés', value: 450 },
    { name: 'En attente', value: 300 },
    { name: 'En cours', value: 240 },
    { name: 'Incomplets', value: 120 },
];

const COLORS = ['#D4AF37', '#1A1F2C', '#3b82f6', '#ef4444'];

const AdminDashboard = () => {
    const stats = [
        { label: "Total Étudiants", value: "1,280", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", change: "+12%" },
        { label: "Dossiers Actifs", value: "450", icon: FileText, color: "text-orange-500", bg: "bg-orange-500/10", change: "+5%" },
        { label: "Témoignages", value: "85", icon: MessageSquare, color: "text-green-500", bg: "bg-green-500/10", change: "+2%" },
        { label: "Visites Site", value: "3.2k", icon: Eye, color: "text-purple-500", bg: "bg-purple-500/10", change: "+18%" },
    ];

    return (
        <div className="space-y-6 reveal-up reveal-visible">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <span className="text-green-500 font-medium flex items-center mr-1">
                                    {stat.change}
                                    <TrendingUp className="w-3 h-3 ml-1" />
                                </span>
                                vs mois dernier
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <Card className="lg:col-span-2 border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Trafic et Demandes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={visitData}>
                                    <defs>
                                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1A1F2C" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#1A1F2C" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="visits" name="Visites" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                                    <Area type="monotone" dataKey="inquiries" name="Demandes" stroke="#1A1F2C" strokeWidth={3} fillOpacity={1} fill="url(#colorInquiries)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Breakdown (Pie Chart) */}
                <Card className="border-border/50 shadow-sm overflow-hidden flex flex-col">
                    <CardHeader className="shrink-0">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            État des Demandes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center min-h-[300px] p-0 pb-6">
                        <div className="h-[220px] w-full shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={75}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="px-6 grid grid-cols-2 gap-x-2 gap-y-2 text-xs shrink-0">
                            {statusData.map((item, index) => (
                                <div key={item.name} className="flex items-center gap-2 min-w-0">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index] }} />
                                    <span className="text-muted-foreground truncate">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-md flex items-center gap-2 text-foreground">
                            <Clock className="w-4 h-4 text-primary" />
                            Vitesse de traitement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <div className="text-3xl font-bold">1.8</div>
                            <div className="text-sm text-muted-foreground pb-1">jours en moyenne</div>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full mt-4 overflow-hidden">
                            <div className="bg-primary h-full w-[75%] rounded-full" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Réduction de 24% depuis le mois dernier</p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-md flex items-center gap-2 text-foreground">
                            <MousePointer2 className="w-4 h-4 text-primary" />
                            Taux de conversion
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <div className="text-3xl font-bold">64.2%</div>
                            <div className="text-sm text-green-500 font-medium pb-1 flex items-center">
                                +4.5% <TrendingUp className="w-3 h-3 ml-1" />
                            </div>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full mt-4 overflow-hidden">
                            <div className="bg-accent h-full w-[64.2%] rounded-full" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Conversion visiteur vers demande d'info</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
