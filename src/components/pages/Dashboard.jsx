"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
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
import { mockStats, mockTasks, chartData, mockNotifications } from "@/lib/mockData";

const statCards = [
  {
    title: "Total Tasks",
    value: `${mockStats.completedTasks}/${mockStats.totalTasks}`,
    subtitle: `${Math.round((mockStats.completedTasks / mockStats.totalTasks) * 100)}% completed`,
    icon: ListTodo,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    title: "Active Crop Cycles",
    value: mockStats.activeCropCycles,
    subtitle: "In progress",
    icon: Sprout,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    title: "Net Profit (This Month)",
    value: `₹${((mockStats.totalIncome - mockStats.totalExpense) / 1000).toFixed(0)}K`,
    subtitle: `Income: ₹${(mockStats.totalIncome / 1000).toFixed(0)}K`,
    icon: TrendingUp,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    title: "Pending Orders",
    value: mockStats.pendingOrders,
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
    value: mockStats.eligibleSchemes,
    subtitle: "Government programs",
    icon: Award,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

export function Dashboard() {
  const recentTasks = mockTasks.slice(0, 5);
  const recentNotifications = mockNotifications.slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your farm overview</p>
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
                    data={chartData.taskProgress}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.taskProgress.map((entry, index) => (
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
            <CardTitle>Financial Summary (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.financialSummary}>
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
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-start justify-between p-4 bg-muted/30 rounded-xl">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{task.title}</p>
                    <Badge variant={task.status === "completed" ? "default" : "secondary"} className="capitalize">
                      {task.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                  {task.status !== "completed" && (
                    <Progress value={task.progress} className="h-1.5" />
                  )}
                </div>
                <p className="text-sm font-bold ml-4 text-nowrap">₹{task.cost.toLocaleString()}</p>
              </div>
            ))}
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
