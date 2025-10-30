import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Droplets, BookOpen, Calculator, BarChart3, Target, Users, Leaf } from "lucide-react";

const Index = () => {
  const features = [
    {
      title: "Water Quality Checker",
      description: "Test pH, temperature, turbidity, and conductivity to assess water safety",
      icon: Droplets,
      link: "/water-quality",
      color: "text-primary",
    },
    {
      title: "Education Hub",
      description: "Learn about SDG 6 and water treatment methods with available resources",
      icon: BookOpen,
      link: "/education",
      color: "text-secondary",
    },
    {
      title: "Usage Calculator",
      description: "Track and calculate your daily water consumption in liters",
      icon: Calculator,
      link: "/water-usage",
      color: "text-accent",
    },
  ];

  const stats = [
    { icon: Target, label: "SDG 6 Target", value: "Clean Water for All" },
    { icon: Users, label: "Global Impact", value: "2.2B People Affected" },
    { icon: Leaf, label: "Sustainable Goal", value: "By 2030" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-accent py-20 px-6 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-block p-3 bg-white/10 rounded-2xl backdrop-blur-sm mb-4">
            <Droplets className="w-16 h-16" />
          </div>
          <h1 className="text-5xl md:text-6xl font-impact leading-tight">
            Clean Water & Sanitation Web
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Monitor water quality, learn treatment methods, and track your water usage to contribute
            to sustainable development
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button asChild size="lg" variant="secondary" className="shadow-lg">
              <Link to="/water-quality">Start Testing Water</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link to="/education">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-none shadow-soft">
                <CardContent className="pt-6">
                  <stat.icon className="w-10 h-10 mx-auto mb-3 text-primary" />
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Powerful Tools for Water Management</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to monitor, learn, and manage water resources effectively
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={feature.link}>Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About SDG 6 Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-primary" />
                About Sustainable Development Goal 6
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                SDG 6 aims to <strong className="text-foreground">ensure availability and sustainable management of water
                and sanitation for all</strong> by 2030. Despite progress, billions of people still lack access to safe
                water and sanitation.
              </p>
              <p>
                This app helps you understand water quality parameters, learn practical treatment
                methods using available resources, and track water consumption to promote conservation.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <h4 className="font-semibold text-foreground mb-2">Key Targets</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Universal access to safe water</li>
                    <li>• Adequate sanitation facilities</li>
                    <li>• Improved water quality</li>
                    <li>• Water-use efficiency</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                  <h4 className="font-semibold text-foreground mb-2">How You Can Help</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Test local water sources</li>
                    <li>• Share treatment methods</li>
                    <li>• Conserve water daily</li>
                    <li>• Spread awareness</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
