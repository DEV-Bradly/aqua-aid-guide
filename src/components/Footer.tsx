import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-1">Clean Water & Sanitation Web</h3>
            <p className="text-sm text-muted-foreground">
              Supporting SDG 6 - Ensuring clean water and sanitation for all
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Benmwas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
              <span>Benmwas</span>
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 SDG 6 Water Management Platform. Built for sustainable development.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
