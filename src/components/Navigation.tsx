import { Link, useLocation, useNavigate } from "react-router-dom";
import { Droplets, Home, BookOpen, Calculator, TestTube, LogOut, User, MessageSquare, MapPin, AlertTriangle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
      navigate("/auth");
    }
  };

  const links = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/water-quality", icon: TestTube, label: "Water Quality" },
    { to: "/education", icon: BookOpen, label: "Education" },
    { to: "/water-usage", icon: Calculator, label: "Usage" },
    { to: "/report-issue", icon: AlertTriangle, label: "Report Issue" },
    { to: "/water-map", icon: MapPin, label: "Water Map" },
    { to: "/water-tips", icon: Lightbulb, label: "Tips" },
    { to: "/chatbot", icon: MessageSquare, label: "AI Chatbot" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:inline font-impact bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Clean Water & Sanitation Web
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                  location.pathname === link.to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <link.icon className="w-4 h-4" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            ))}
            
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="ml-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="ml-2"
              >
                <User className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
