import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, MapPin, Send } from "lucide-react";

const ReportIssue = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reportType: "",
    title: "",
    description: "",
    locationName: "",
    latitude: "",
    longitude: "",
  });

  const reportTypes = [
    { value: "leak", label: "Water Leak" },
    { value: "contamination", label: "Water Contamination" },
    { value: "dry_source", label: "Dry Water Source" },
    { value: "poor_quality", label: "Poor Water Quality" },
    { value: "other", label: "Other Issue" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reportType || !formData.title || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("water_reports").insert({
        report_type: formData.reportType,
        title: formData.title,
        description: formData.description,
        location_name: formData.locationName || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      });

      if (error) throw error;

      toast({
        title: "Report Submitted!",
        description: "Thank you for helping improve water access in your community.",
      });

      // Reset form
      setFormData({
        reportType: "",
        title: "",
        description: "",
        locationName: "",
        latitude: "",
        longitude: "",
      });
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          });
          toast({
            title: "Location Found",
            description: "Your current location has been added to the report.",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter it manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-block p-3 bg-gradient-to-br from-destructive/10 to-destructive/20 rounded-full">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold">Report a Water Issue</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help your community by reporting water problems. Your report helps track and resolve issues faster.
          </p>
        </div>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
            <CardDescription>
              Provide as much information as possible to help resolve the issue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reportType">Issue Type *</Label>
                <Select value={formData.reportType} onValueChange={(value) => setFormData({ ...formData, reportType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the water issue..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Location Information (Optional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Use Current Location
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locationName">Location Name</Label>
                  <Input
                    id="locationName"
                    placeholder="e.g., Main Street Water Point"
                    value={formData.locationName}
                    onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="0.000000"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="0.000000"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportIssue;