import { ReactNode } from "react";

interface PageHeaderProps {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  icon?: ReactNode;
}

const PageHeader = ({ badge, title, highlight, description, icon }: PageHeaderProps) => {
  return (
    <section className="page-header-gradient pt-32 pb-20 relative overflow-hidden">
      {/* Background overlay pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c476?w=1200&q=30')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hero-lighter/50 border border-hero-lighter text-hero-muted text-sm mb-6">
          {icon}
          <span>{badge}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-hero-foreground mb-4">
          {title} <span className="text-gold">{highlight}</span>
        </h1>
        <p className="text-hero-muted text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
};

export default PageHeader;
