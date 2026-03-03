import { Settings } from "lucide-react";

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 rotate-animation">
          <Settings className="w-12 h-12 text-primary animate-spin-slow" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Nous mettons à jour notre site
        </h1>
        
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          Le site Maig'Up France est actuellement en cours de maintenance pour vous offrir une meilleure expérience. Nous serons de retour très rapidement !
        </p>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-foreground mb-2">Besoin d'aide urgente ?</p>
          <a 
            href="#" // Pour l'instant on laisse un placeholder, ou on peut lire le n° de la BDD si besoin.
            className="text-primary hover:underline transition-all"
          >
            Contactez notre support : contact@maigup.com
          </a>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Maintenance;
