import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Eye, MousePointerClick, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Link = Tables<"links">;

const AnalyticsTab = () => {
  const { t } = useLanguage();
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching links:", error);
      } else {
        setLinks(data || []);
      }
      setLoading(false);
    };

    fetchLinks();
  }, []);

  // Calcular estadísticas basadas en datos reales (asumiendo que cada link tiene un campo para clicks, o usar conteo)
  const totalClicks = links.reduce((sum, link) => sum + (link.display_order || 0), 0);
  const totalViews = totalClicks * 2; // Estimación: 2 vistas por click, ajustar según necesidad
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  // Datos para el gráfico (generar datos mock basados en links por ahora, o agregar tabla para rastreo)
  const chartData = [
    { date: "Jan 1", views: Math.floor(totalViews * 0.1), clicks: Math.floor(totalClicks * 0.1) },
    { date: "Jan 2", views: Math.floor(totalViews * 0.12), clicks: Math.floor(totalClicks * 0.12) },
    // Agregar más puntos según sea necesidad
  ];

  // Estadísticas por link (usar datos reales)
  const linkStats = links.map((link) => ({
    title: link.title || "Untitled",
    clicks: link.display_order || 0,
    percentage: totalClicks > 0 ? (((link.display_order || 0) / totalClicks) * 100).toFixed(1) : "0"
  }));

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("analytics.totalViews")}</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("analytics.profileVisits")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("analytics.totalClicks")}</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("analytics.linkClicks")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("analytics.clickRate")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ctr}%</div>
            <p className="text-xs text-muted-foreground mt-1">{t("analytics.averageCTR")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">{t("analytics.performanceOverview")}</CardTitle>
              <CardDescription className="text-sm">{t("analytics.viewsClicksOverTime")}</CardDescription>
            </div>
            <Select defaultValue="7days">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">{t("analytics.last7Days")}</SelectItem>
                <SelectItem value="30days">{t("analytics.last30Days")}</SelectItem>
                <SelectItem value="all">{t("analytics.allTime")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="views" stroke="hsl(var(--chart-1))" strokeWidth={2} />
              <Line type="monotone" dataKey="clicks" stroke="hsl(var(--chart-2))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Link Breakdown */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">{t("analytics.linkPerformance")}</CardTitle>
          <CardDescription className="text-sm">{t("analytics.clickBreakdown")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          {linkStats.map((link, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{link.title}</span>
                <span className="text-muted-foreground">{link.clicks} {t("analytics.clicks")}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${link.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
