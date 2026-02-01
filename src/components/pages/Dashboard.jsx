import { useEffect, useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { dashboardService } from "@/services/dashboardService";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import WeatherWidget from "../weather/WeatherWidget";
import WalletCard from "../farmer/WalletCard";
import {
  ListTodo,
  Sprout,
  TrendingUp,
  ShoppingBag,
  CloudRain,
  Award,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { mockNotifications, chartData as mockChartData } from "@/lib/mockData";
import { toast } from "sonner";

export function Dashboard() {
  const { currentUser } = useAppContext();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        // Fetch Stats
        const statsData = await dashboardService.getStats();
        setStats(statsData);

        // Fetch Recent Tasks
        const tasksData = await dashboardService.getRecentTasks();
        setRecentTasks(tasksData);

        // Fetch Monthly Sales (Financial Summary)
        // Default to current year (backend handles if not passed, but let's be safe)
        // Actually service handles optional year
        const salesData = await dashboardService.getMonthlySales();
        // Convert salesData map to array for Recharts
        // salesData is { "JANUARY": { "income": 100, "expense": 50 }, ... }
        // We need array: [{ month: "Jan", income: 100, expense: 50 }, ...]

        const monthsOrder = [
          "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
          "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
        ];

        // Get last 6 months or all? UI says "Last 6 Months". 
        // Let's just map all valid data returned and let the chart handle it or slice it.
        // For simplicity, map all non-zero or just map current year's data as is.
        const chartArray = monthsOrder.map(month => {
          const data = salesData[month] || { income: 0, expense: 0 };
          return {
            month: month.substring(0, 3), // "Jan"
            income: data.income || 0,
            expense: data.expense || 0
          };
        });

        // Filter out future months if needed, or just show all. 
        // Mock data showed 6 months. Let's slice last 6 non-zero? 
        // Or just show all. Let's show all for now.
        setFinancialData(chartArray);

      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Fallback to 0 if stats not loaded yet
  const s = stats || {
    totalTasks: 0,
    completedTasks: 0,
    activeCropCycles: 0,
    pendingOrders: 0,
    totalIncome: 0,
    totalExpense: 0,
    eligibleSchemes: 0
  };

  const statCards = [
    {
      title: "Total Tasks",
      value: `${s.completedTasks}/${s.totalTasks}`,
      subtitle: s.totalTasks > 0 ? `${Math.round((s.completedTasks / s.totalTasks) * 100)}% completed` : "0% completed",
      icon: ListTodo,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Active Crop Cycles",
      value: s.activeCropCycles,
      subtitle: "In progress",
      icon: Sprout,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Net Profit/Loss",
      value: `₹${((s.netProfit || (s.totalIncome - s.totalExpense)) / 1000).toFixed(1)}K`,
      subtitle: "",
      icon: TrendingUp,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Pending Orders",
      value: s.pendingOrders,
      subtitle: "Awaiting processing",
      icon: ShoppingBag,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      title: "Weather Alert",
      value: "Rain",
      subtitle: "Expected Thursday",
      icon: CloudRain,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Eligible Schemes",
      value: s.eligibleSchemes,
      subtitle: "Government programs",
      icon: Award,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  const recentNotifications = mockNotifications.slice(0, 3); // Keep mock for now as backend for notifs not ready?

  // Calculate task progress for Pie Chart
  const taskProgressData = [
    { name: "Completed", value: s.completedTasks, fill: "var(--chart-2)" },
    { name: "Pending", value: s.totalTasks - s.completedTasks, fill: "var(--chart-5)" },
  ];
  // Avoid empty chart if 0 tasks
  const finalPieData = s.totalTasks === 0 ? [{ name: "No Tasks", value: 1, fill: "#e5e7eb" }] : taskProgressData;

  if (loading) {
    return <div className="p-10 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {currentUser?.firstName || "Farmer"}! Here's your farm overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h2 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h2>
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weather Widget and Wallet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherWidget city={currentUser?.city || "Mumbai"} country="in" />
        <WalletCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Task Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={finalPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {finalPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Financial Summary (Yearly Trend)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData.length > 0 ? financialData : mockChartData.financialSummary}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F5E9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Legend />
                  <Bar dataKey="income" fill="#4CAF50" name="Income" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#EF5350" name="Expense" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent tasks.</p>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{task.title}</p>
                      <Badge variant={task.status.toLowerCase() === "completed" ? "default" : "secondary"} className="capitalize">
                        {task.status}
                      </Badge>
                      <Badge variant="outline" className="ml-1 text-[10px]">{task.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                  {task.expense > 0 && (
                    <p className="text-sm font-bold ml-4 text-nowrap">₹{task.expense.toLocaleString()}</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border border-transparent transition-colors ${notif.read ? "bg-muted/10 opacity-70" : "bg-primary/5 border-primary/10"}`}
              >
                <div className="flex items-start gap-3">
                  <Badge
                    variant={notif.type === "weather" ? "destructive" : "default"}
                    className="mt-1 shrink-0"
                  >
                    {notif.type}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-tight">{notif.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
