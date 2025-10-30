import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Droplet, Thermometer, Eye, Zap, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const WaterQuality = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    ph: "",
    temperature: "",
    turbidity: "",
    conductivity: "",
  });
  const [result, setResult] = useState<{
    status: string;
    color: string;
    message: string;
  } | null>(null);

  const analyzeWaterQuality = (ph: number, temp: number, turbidity: number, conductivity: number) => {
    let issues = [];
    
    if (ph < 6.5 || ph > 8.5) issues.push("pH out of safe range");
    if (temp > 30) issues.push("temperature too high");
    if (turbidity > 5) issues.push("water too cloudy");
    if (conductivity < 50 || conductivity > 1500) issues.push("unusual mineral content");

    if (issues.length === 0) {
      return {
        status: "Excellent",
        color: "text-green-600",
        message: "Water quality is excellent! All parameters are within safe ranges."
      };
    } else if (issues.length <= 1) {
      return {
        status: "Good",
        color: "text-blue-600",
        message: `Water quality is acceptable but ${issues.join(", ")}. Consider treatment.`
      };
    } else if (issues.length === 2) {
      return {
        status: "Fair",
        color: "text-yellow-600",
        message: `Water quality needs attention: ${issues.join(", ")}. Treatment recommended.`
      };
    } else {
      return {
        status: "Poor",
        color: "text-red-600",
        message: `Water quality is poor: ${issues.join(", ")}. Treatment required before use.`
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const ph = parseFloat(formData.ph);
    const temperature = parseFloat(formData.temperature);
    const turbidity = parseFloat(formData.turbidity);
    const conductivity = parseFloat(formData.conductivity);

    if (!ph || !temperature || !turbidity || !conductivity) {
      toast({
        title: "Error",
        description: "Please fill in all fields with valid numbers",
        variant: "destructive",
      });
      return;
    }

    const analysis = analyzeWaterQuality(ph, temperature, turbidity, conductivity);
    setResult(analysis);

    const { error } = await supabase.from("water_quality_readings").insert({
      ph,
      temperature,
      turbidity,
      conductivity,
      quality_status: analysis.status,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save reading",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Water quality reading saved successfully",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Water Quality Checker
          </h1>
          <p className="text-muted-foreground">Test your water parameters and get instant quality analysis</p>
        </div>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Enter Water Parameters</CardTitle>
            <CardDescription>Fill in the measurements from your water test</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ph" className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-primary" />
                    pH Level (0-14)
                  </Label>
                  <Input
                    id="ph"
                    type="number"
                    step="0.01"
                    min="0"
                    max="14"
                    value={formData.ph}
                    onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                    placeholder="e.g., 7.2"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Ideal range: 6.5 - 8.5</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature" className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-secondary" />
                    Temperature (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    placeholder="e.g., 25.0"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Should be below 30°C</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="turbidity" className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-accent" />
                    Turbidity (NTU)
                  </Label>
                  <Input
                    id="turbidity"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.turbidity}
                    onChange={(e) => setFormData({ ...formData, turbidity: e.target.value })}
                    placeholder="e.g., 2.5"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Lower is clearer (ideal &lt; 5)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conductivity" className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    Conductivity (µS/cm)
                  </Label>
                  <Input
                    id="conductivity"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.conductivity}
                    onChange={(e) => setFormData({ ...formData, conductivity: e.target.value })}
                    placeholder="e.g., 500"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Range: 50 - 1500 µS/cm</p>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Analyze Water Quality
              </Button>
            </form>

            {result && (
              <Alert className="mt-6 border-2">
                <div className="flex items-start gap-3">
                  {result.status === "Excellent" || result.status === "Good" ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <h3 className={`font-semibold text-lg ${result.color}`}>
                      Quality Status: {result.status}
                    </h3>
                    <AlertDescription>{result.message}</AlertDescription>
                  </div>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaterQuality;
