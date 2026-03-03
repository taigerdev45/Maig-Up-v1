import React from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Settings,
    FileText,
    LogOut,
    Menu,
    X,
    Bell,
    UserPlus,
    Home,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, loading, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    const handleLogout = async () => {
        await signOut();
        navigate("/login");
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
    }

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
        { icon: LayoutDashboard, label: "Accueil (Site)", path: "/admin/accueil" },
        { icon: UserPlus, label: "Demandes", path: "/admin/registrations" },
        { icon: FileText, label: "Services", path: "/admin/services" },
        { icon: Users, label: "Témoignages", path: "/admin/testimonials" },
        { icon: Settings, label: "Paramètres", path: "/admin/settings" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex overflow-hidden">
            {/* Sidebar */}
            {/* Overlay sur mobile quand la sidebar est ouverte */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <aside
                className={`bg-blue-700 border-r border-white/10 transition-transform duration-300 z-50 fixed top-0 left-0 h-screen flex flex-col w-64 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
                }`}
            >
                <div className="p-6 flex items-center justify-between shrink-0">
                    <Link to="/" className={`flex items-center gap-2 ${!isSidebarOpen && "lg:hidden"}`}>
                        <img
                            src="/Assets/logo_maigup-removebg-preview.png"
                            alt="Logo"
                            className="h-8 w-auto object-contain brightness-0 invert"
                        />
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden text-white hover:bg-white/10"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <nav className="mt-8 px-4 space-y-3 flex-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-md shadow-sm" />
                                )}
                                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className={`font-medium tracking-wide ${!isSidebarOpen && "hidden"}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800 shrink-0 space-y-3">
                    <a href="/" target="_blank" rel="noopener noreferrer" className="block">
                        <Button
                            variant="ghost"
                            className={`w-full flex items-center gap-3 px-4 py-6 rounded-xl text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all ${!isSidebarOpen && "justify-center"
                                }`}
                        >
                            <Home className="w-5 h-5 flex-shrink-0" />
                            <span className={`font-medium ${!isSidebarOpen && "hidden"}`}>
                                Voir le site
                            </span>
                            <ExternalLink className={`w-4 h-4 ml-auto opacity-70 ${!isSidebarOpen && "hidden"}`} />
                        </Button>
                    </a>
                    <Button
                        variant="ghost"
                        className={`w-full flex items-center gap-3 px-4 py-6 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all ${!isSidebarOpen && "justify-center"
                            }`}
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <span className={`font-medium ${!isSidebarOpen && "hidden"}`}>
                            Déconnexion
                        </span>
                    </Button>
                </div>
            </aside>

            {/* Spacer for fixed sidebar on large screens */}
            <div className={`shrink-0 transition-all duration-300 hidden lg:block ${isSidebarOpen ? "w-64" : "w-20"}`} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="flex"
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                        <h1 className="text-lg font-bold text-foreground truncate max-w-[200px] sm:max-w-none">
                            {menuItems.find(item => item.path === location.pathname)?.label || "Administration"}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
                        </Button>
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                            <span className="text-xs font-bold text-primary">AD</span>
                        </div>
                    </div>
                </header>

                <main className="p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
