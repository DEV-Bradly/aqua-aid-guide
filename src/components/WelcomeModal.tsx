import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Droplets, Target, Users, BookOpen, AlertTriangle } from "lucide-react";

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome modal
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-full">
              <Droplets className="w-12 h-12 text-white" />
            </div>
          </div>
          <DialogTitle className="text-3xl text-center">Welcome to AquaAid Guide</DialogTitle>
          <DialogDescription className="text-center text-base">
            Your comprehensive tool for achieving SDG 6: Clean Water & Sanitation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex gap-4 items-start p-4 rounded-lg bg-primary/5 border border-primary/10">
              <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">What is SDG 6?</h3>
                <p className="text-sm text-muted-foreground">
                  Sustainable Development Goal 6 aims to ensure access to safe water and sanitation for all by 2030. 
                  Currently, 2.2 billion people lack access to safe drinking water.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-lg bg-secondary/5 border border-secondary/10">
              <BookOpen className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">How to Use This App</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Test Water Quality:</strong> Check pH, temperature, turbidity & conductivity</li>
                  <li>• <strong>Report Issues:</strong> Submit water problems in your community</li>
                  <li>• <strong>Track Usage:</strong> Monitor and calculate your water consumption</li>
                  <li>• <strong>Learn:</strong> Access educational resources about water treatment</li>
                  <li>• <strong>Get Help:</strong> Use our AI chatbot for water-related questions</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-lg bg-accent/5 border border-accent/10">
              <AlertTriangle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Report Water Issues</h3>
                <p className="text-sm text-muted-foreground">
                  Help your community by reporting leaks, contamination, or dry water sources. 
                  Together we can make a difference!
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-lg bg-muted/30 border border-border">
              <Users className="w-6 h-6 text-foreground flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Join the Movement</h3>
                <p className="text-sm text-muted-foreground">
                  Share this app with your community, friends, and family. Every action counts 
                  toward achieving clean water for all.
                </p>
              </div>
            </div>
          </div>

          <Button onClick={handleClose} size="lg" className="w-full">
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;