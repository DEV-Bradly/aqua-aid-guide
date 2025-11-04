import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Lightbulb, Share2, Home, Bath, Droplet, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WaterTips = () => {
  const { toast } = useToast();

  const tips = [
    {
      category: "Daily Habits",
      icon: Home,
      color: "text-primary",
      bgColor: "bg-primary/10",
      items: [
        "Turn off the tap while brushing teeth - saves up to 8 liters per minute",
        "Fix leaky faucets immediately - a drip can waste 20 liters per day",
        "Use a bowl to wash vegetables instead of running water",
        "Reuse water from washing vegetables to water plants",
        "Keep a jug of drinking water in the fridge instead of running the tap until cold",
      ],
    },
    {
      category: "Kitchen",
      icon: Droplet,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      items: [
        "Run dishwashers only when full - saves up to 15 liters per cycle",
        "Soak pots and pans before washing instead of letting water run",
        "Use minimal water when cooking - steam vegetables instead of boiling",
        "Collect cold water while waiting for hot water and use it for plants",
        "Install aerators on kitchen taps to reduce water flow by up to 50%",
      ],
    },
    {
      category: "Bathroom",
      icon: Bath,
      color: "text-accent",
      bgColor: "bg-accent/10",
      items: [
        "Take shorter showers (5 minutes or less) - saves up to 70 liters per shower",
        "Install low-flow showerheads to reduce water use by 40%",
        "Put a bucket in the shower to catch water while it heats up",
        "Check toilet for leaks - add food coloring to tank, if it appears in bowl without flushing, you have a leak",
        "Consider installing a dual-flush toilet system",
      ],
    },
    {
      category: "Outdoor & Garden",
      icon: Leaf,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
      items: [
        "Water plants early morning or evening to reduce evaporation",
        "Use mulch around plants to retain moisture and reduce watering needs",
        "Collect rainwater in barrels for garden irrigation",
        "Choose native, drought-resistant plants that require less water",
        "Use a broom instead of a hose to clean driveways and sidewalks",
      ],
    },
  ];

  const handleShare = async () => {
    const shareData = {
      title: "Water Conservation Tips - AquaAid Guide",
      text: "Check out these water conservation tips to help achieve SDG 6: Clean Water & Sanitation for all!",
      url: window.location.origin + "/water-tips",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Thanks for sharing!",
          description: "Help spread awareness about water conservation.",
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.origin + "/water-tips");
        toast({
          title: "Link Copied!",
          description: "Share this link with others to spread awareness.",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-block p-3 bg-gradient-to-br from-primary to-accent rounded-full">
            <Lightbulb className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold">Water Conservation Tips</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple daily actions can make a huge difference. Every drop counts toward SDG 6!
          </p>
          <Button onClick={handleShare} size="lg" variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share These Tips
          </Button>
        </div>

        <Card className="shadow-elevated bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Droplets className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Did You Know?</h3>
                <p className="text-muted-foreground">
                  The average person uses 142 liters of water per day. By following these tips, 
                  you can reduce your consumption by up to 30%, saving both water and money while 
                  contributing to sustainable water management.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {tips.map((category, index) => (
            <Card key={index} className="hover:shadow-elevated transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${category.bgColor}`}>
                    <category.icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <CardTitle>{category.category}</CardTitle>
                </div>
                <CardDescription>
                  Practical tips for everyday water conservation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.items.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-sm text-muted-foreground leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-elevated bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-6 h-6 text-accent" />
              Spread the Word
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Water conservation is a community effort. Share these tips with your family, friends, 
              and neighbors to multiply the impact. Together, we can work toward achieving 
              universal access to safe water by 2030.
            </p>
            <div className="flex gap-4">
              <Button onClick={handleShare} className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share This Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaterTips;