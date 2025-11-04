import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Droplet, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface WaterReport {
  id: string;
  report_type: string;
  title: string;
  description: string;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  created_at: string;
}

const WaterMap = () => {
  const [reports, setReports] = useState<WaterReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("water_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      case "in_progress":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "in_progress":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-red-500/10 text-red-700 dark:text-red-400";
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      leak: "Water Leak",
      contamination: "Contamination",
      dry_source: "Dry Source",
      poor_quality: "Poor Quality",
      other: "Other",
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-6 flex items-center justify-center">
        <div className="text-center">
          <Droplet className="w-12 h-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading water reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-block p-3 bg-gradient-to-br from-primary to-secondary rounded-full">
            <MapPin className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold">Water Point Map</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            View all reported water issues in the community. Track their status and help resolve them.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">{reports.filter(r => r.status === 'pending').length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{reports.filter(r => r.status === 'in_progress').length}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{reports.filter(r => r.status === 'resolved').length}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Reports Yet</h3>
                <p className="text-muted-foreground">Be the first to report a water issue in your community.</p>
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => (
              <Card key={report.id} className="hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{getTypeLabel(report.report_type)}</Badge>
                        <Badge className={getStatusColor(report.status)}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1 capitalize">{report.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{report.title}</CardTitle>
                      <CardDescription className="mt-2">{report.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {report.location_name && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{report.location_name}</span>
                      </div>
                    )}
                    {report.latitude && report.longitude && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterMap;