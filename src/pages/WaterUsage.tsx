import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Droplets, Clock, Gauge, TrendingUp, Calendar } from "lucide-react";

const WaterUsage = () => {
  const { toast } = useToast();
  const [activityType, setActivityType] = useState("");
  const [liters, setLiters] = useState("");
  const [duration, setDuration] = useState("");
  const [totalUsage, setTotalUsage] = useState<number | null>(null);
  
  // Meter reading states
  const [meterBefore, setMeterBefore] = useState("");
  const [meterAfter, setMeterAfter] = useState("");
  const [meterUsage, setMeterUsage] = useState<number | null>(null);
  
  // Monthly tracking
  const [dailyLiters, setDailyLiters] = useState("");
  const [monthlyUsage, setMonthlyUsage] = useState<number | null>(null);

  const activityRates = {
    shower: 9,
    bath: 80,
    toilet: 6,
    washing_machine: 50,
    dishwasher: 20,
    brushing_teeth: 2,
    washing_hands: 1.5,
    cooking: 5,
    drinking: 2,
    garden: 10,
  };

  const calculateUsage = () => {
    if (liters) {
      setTotalUsage(parseFloat(liters));
    } else if (activityType && duration) {
      const rate = activityRates[activityType as keyof typeof activityRates];
      const calculated = rate * parseFloat(duration);
      setTotalUsage(calculated);
    }
  };

  const calculateMeterUsage = () => {
    if (meterBefore && meterAfter) {
      const before = parseFloat(meterBefore);
      const after = parseFloat(meterAfter);
      
      if (after < before) {
        toast({
          title: "Error",
          description: "After reading must be greater than before reading",
          variant: "destructive",
        });
        return;
      }
      
      // Convert cubic meters to liters (1 m³ = 1000 L)
      const usage = (after - before) * 1000;
      setMeterUsage(usage);
    }
  };

  const calculateMonthly = () => {
    if (dailyLiters) {
      const daily = parseFloat(dailyLiters);
      const monthly = daily * 30;
      setMonthlyUsage(monthly);
    }
  };

  const handleSubmit = async (usageValue: number, sourceType: string) => {
    if (!usageValue) {
      toast({
        title: "Error",
        description: "Please calculate water usage first",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("water_usage_records").insert({
      usage_liters: usageValue,
      activity_type: sourceType,
      duration_minutes: duration ? parseInt(duration) : null,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save usage record",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Recorded ${usageValue.toFixed(2)} liters of water usage`,
      });
      
      // Reset relevant form
      if (sourceType === "Meter Reading") {
        setMeterBefore("");
        setMeterAfter("");
        setMeterUsage(null);
      } else if (sourceType === "Monthly Calculation") {
        setDailyLiters("");
        setMonthlyUsage(null);
      } else {
        setActivityType("");
        setLiters("");
        setDuration("");
        setTotalUsage(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-impact bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Water Usage Calculator & Tracker
          </h1>
          <p className="text-muted-foreground">Track and calculate your water consumption with multiple methods</p>
        </div>

        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">Activity Based</TabsTrigger>
            <TabsTrigger value="meter">Meter Reading</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Tracker</TabsTrigger>
          </TabsList>

          {/* Activity Based Calculation */}
          <TabsContent value="activity">
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Activity Based Calculation
                </CardTitle>
                <CardDescription>Calculate based on specific activities or direct input</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(totalUsage!, activityType || "Manual Entry"); }} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="liters" className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-primary" />
                        Direct Entry (Liters)
                      </Label>
                      <Input
                        id="liters"
                        type="number"
                        step="0.01"
                        min="0"
                        value={liters}
                        onChange={(e) => {
                          setLiters(e.target.value);
                          setActivityType("");
                          setDuration("");
                        }}
                        placeholder="Enter liters directly"
                      />
                    </div>

                    <div className="text-center text-muted-foreground font-medium">OR</div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="activity">Activity Type</Label>
                        <Select
                          value={activityType}
                          onValueChange={(value) => {
                            setActivityType(value);
                            setLiters("");
                          }}
                        >
                          <SelectTrigger id="activity">
                            <SelectValue placeholder="Select activity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shower">Shower (9 L/min)</SelectItem>
                            <SelectItem value="bath">Bath (80 L)</SelectItem>
                            <SelectItem value="toilet">Toilet Flush (6 L)</SelectItem>
                            <SelectItem value="washing_machine">Washing Machine (50 L)</SelectItem>
                            <SelectItem value="dishwasher">Dishwasher (20 L)</SelectItem>
                            <SelectItem value="brushing_teeth">Brushing Teeth (2 L/min)</SelectItem>
                            <SelectItem value="washing_hands">Washing Hands (1.5 L/min)</SelectItem>
                            <SelectItem value="cooking">Cooking (5 L/min)</SelectItem>
                            <SelectItem value="drinking">Drinking (2 L)</SelectItem>
                            <SelectItem value="garden">Watering Garden (10 L/min)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration" className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-secondary" />
                          Duration (minutes)
                        </Label>
                        <Input
                          id="duration"
                          type="number"
                          min="0"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          placeholder="Enter duration"
                          disabled={!activityType}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={calculateUsage}
                    disabled={!liters && (!activityType || !duration)}
                  >
                    Calculate Usage
                  </Button>

                  {totalUsage !== null && (
                    <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                          <p className="text-sm text-muted-foreground">Total Water Usage</p>
                          <p className="text-4xl font-bold text-primary">
                            {totalUsage.toFixed(2)} <span className="text-2xl">L</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Equivalent to {(totalUsage / 1000).toFixed(3)} cubic meters
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Button type="submit" className="w-full" disabled={totalUsage === null}>
                    Save Usage Record
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meter Reading */}
          <TabsContent value="meter">
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-primary" />
                  Meter Reading Calculator
                </CardTitle>
                <CardDescription>Calculate usage based on meter readings (in cubic meters)</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(meterUsage!, "Meter Reading"); }} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="meter-before">Meter Reading Before (m³)</Label>
                      <Input
                        id="meter-before"
                        type="number"
                        step="0.001"
                        min="0"
                        value={meterBefore}
                        onChange={(e) => setMeterBefore(e.target.value)}
                        placeholder="e.g., 1234.567"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meter-after">Meter Reading After (m³)</Label>
                      <Input
                        id="meter-after"
                        type="number"
                        step="0.001"
                        min="0"
                        value={meterAfter}
                        onChange={(e) => setMeterAfter(e.target.value)}
                        placeholder="e.g., 1235.123"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={calculateMeterUsage}
                    disabled={!meterBefore || !meterAfter}
                  >
                    Calculate from Meter
                  </Button>

                  {meterUsage !== null && (
                    <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                          <p className="text-sm text-muted-foreground">Water Usage</p>
                          <p className="text-4xl font-bold text-primary">
                            {meterUsage.toFixed(2)} <span className="text-2xl">L</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Difference: {((parseFloat(meterAfter) - parseFloat(meterBefore))).toFixed(3)} m³
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Button type="submit" className="w-full" disabled={meterUsage === null}>
                    Save Meter Reading
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monthly Tracker */}
          <TabsContent value="monthly">
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Monthly Usage Tracker
                </CardTitle>
                <CardDescription>Estimate monthly usage based on daily consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(monthlyUsage!, "Monthly Calculation"); }} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="daily-liters" className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Daily Water Usage (Liters)
                    </Label>
                    <Input
                      id="daily-liters"
                      type="number"
                      step="0.01"
                      min="0"
                      value={dailyLiters}
                      onChange={(e) => setDailyLiters(e.target.value)}
                      placeholder="Enter daily liters"
                    />
                    <p className="text-xs text-muted-foreground">
                      Average household uses 150-300 liters per person per day
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={calculateMonthly}
                    disabled={!dailyLiters}
                  >
                    Calculate Monthly Usage
                  </Button>

                  {monthlyUsage !== null && (
                    <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Daily Usage</p>
                            <p className="text-2xl font-bold text-secondary">
                              {parseFloat(dailyLiters).toFixed(2)} <span className="text-lg">L</span>
                            </p>
                          </div>
                          
                          <div className="h-px bg-border" />
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Estimated Monthly Usage (30 days)</p>
                            <p className="text-4xl font-bold text-primary">
                              {monthlyUsage.toFixed(2)} <span className="text-2xl">L</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Approximately {(monthlyUsage / 1000).toFixed(2)} m³
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Button type="submit" className="w-full" disabled={monthlyUsage === null}>
                    Save Monthly Record
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Water Conservation Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">💧</span>
                <span>Turn off tap while brushing teeth - saves up to 6 liters per minute</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">🚿</span>
                <span>Take shorter showers (5 minutes or less) - saves about 45 liters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">🔧</span>
                <span>Fix leaky taps immediately - a dripping tap wastes 15 liters per day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">🌱</span>
                <span>Water plants in the evening to reduce evaporation</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaterUsage;
