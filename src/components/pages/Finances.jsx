"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TrendingUp, TrendingDown, Wallet as WalletIcon } from "lucide-react";
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
import { mockStats, mockTransactions, chartData } from "@/lib/mockData";

export function Finances() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const netProfit = mockStats.totalIncome - mockStats.totalExpense;
  const isProfitable = netProfit > 0;

  const incomeExpenseData = [
    { name: "Income", value: mockStats.totalIncome, fill: "#4CAF50" },
    { name: "Expense", value: mockStats.totalExpense, fill: "#EF5350" },
  ];

  const filterTransactions = (type) => {
    if (type === "overview") return mockTransactions;
    if (type === "income") return mockTransactions.filter((t) => t.type === "income");
    if (type === "expenses") return mockTransactions.filter((t) => t.type === "expense");
    return mockTransactions;
  };

  const transactions = filterTransactions(selectedTab);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finances</h1>
          <p className="text-muted-foreground">Track your farm income and expenses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Income</p>
                <h2 className="text-xl font-bold text-chart-1">₹{mockStats.totalIncome.toLocaleString()}</h2>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
              <div className="p-3 rounded-xl bg-chart-1/10">
                <TrendingUp className="w-6 h-6 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Expense</p>
                <h2 className="text-xl font-bold text-chart-5">₹{mockStats.totalExpense.toLocaleString()}</h2>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
              <div className="p-3 rounded-xl bg-chart-5/10">
                <TrendingDown className="w-6 h-6 text-chart-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Net Profit/Loss</p>
                <h2 className={`text-xl font-bold ${isProfitable ? "text-chart-1" : "text-chart-5"}`}>
                  {isProfitable ? "+" : ""}₹{netProfit.toLocaleString()}
                </h2>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
              <div className={`p-3 rounded-xl ${isProfitable ? "bg-chart-1/10" : "bg-chart-5/10"}`}>
                <TrendingUp
                  className={`w-6 h-6 ${isProfitable ? "text-chart-1" : "text-chart-5"}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <h2 className="text-xl font-bold">₹{mockStats.walletBalance.toLocaleString()}</h2>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" className="text-[10px] h-7 px-2">
                    Add Income
                  </Button>
                  <Button size="sm" variant="outline" className="text-[10px] h-7 px-2">
                    Add Expense
                  </Button>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <WalletIcon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Income vs Expense Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.financialSummary}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#4CAF50" name="Income" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" fill="#EF5350" name="Expense" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>This Month Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeExpenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {incomeExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="overview">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Related To</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={transaction.type === "income" ? "default" : "destructive"}
                            className="capitalize"
                          >
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {transaction.relatedTo}
                        </TableCell>
                        <TableCell
                          className={`text-right font-bold ${transaction.type === "income" ? "text-chart-1" : "text-chart-5"
                            }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}₹
                          {transaction.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
