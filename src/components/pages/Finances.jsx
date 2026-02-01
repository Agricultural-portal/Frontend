import { useState, useEffect } from "react";
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
import { financeService } from "@/services/financeService";
import { useAppContext } from "@/lib/AppContext";

export function Finances() {
  const { currentUser } = useAppContext();
  const farmerId = currentUser?.id || 1;
  const [selectedTab, setSelectedTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const [financialSummary, setFinancialSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
    status: "Break-even"
  });

  const [transactions, setTransactions] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Financial Summary
        const summary = await financeService.getFinancialSummary();
        setFinancialSummary({
          totalIncome: summary.totalIncome || 0,
          totalExpense: summary.totalExpense || 0,
          netProfit: summary.netProfit || 0,
          status: summary.status
        });

        // Fetch Monthly Trend
        const currentYear = new Date().getFullYear();
        const trend = await financeService.getMonthlyTrend(currentYear);
        const formattedTrend = Object.keys(trend).map(month => ({
          month: month.substring(0, 3), // JAN, FEB etc
          income: trend[month].income || 0,
          expense: trend[month].expense || 0
        }));
        setTrendData(formattedTrend);

        // Fetch Recent Transactions based on tab
        const type = selectedTab === "overview" ? "all" : selectedTab === "income" ? "INCOME" : "EXPENSE";
        const txs = await financeService.getRecentTransactions(type, 20); // Fetch last 20?

        const mappedTxs = txs.map(t => ({
          id: t.id,
          date: t.transactionDate,
          type: t.type.toLowerCase(), // 'income' or 'expense'
          category: t.category,
          description: t.description,
          amount: t.amount,
          relatedTo: t.cropName || (t.orderId ? `Order #${t.orderId}` : 'General')
        }));
        setTransactions(mappedTxs);

        // Prepare Pie Chart Data
        setMonthlySummary([
          { name: "Income", value: summary.totalIncome || 0, fill: "#4CAF50" },
          { name: "Expense", value: summary.totalExpense || 0, fill: "#EF5350" }
        ]);

      } catch (error) {
        console.error("Error fetching finance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [farmerId, selectedTab]);

  const netProfit = financialSummary.netProfit;
  const isProfitable = netProfit >= 0;

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
                <h2 className="text-xl font-bold text-chart-1">₹{(financialSummary.totalIncome || 0).toLocaleString()}</h2>
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
                <h2 className="text-xl font-bold text-chart-5">₹{(financialSummary.totalExpense || 0).toLocaleString()}</h2>
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
                  {isProfitable ? "+" : "-"}₹{Math.abs(netProfit || 0).toLocaleString()}
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
                <h2 className="text-xl font-bold">₹{(netProfit || 0).toLocaleString()}</h2>
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
              <BarChart data={trendData}>
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
                  data={monthlySummary}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {monthlySummary.map((entry, index) => (
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
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          {loading ? "Loading transactions..." : "No transactions found"}
                        </TableCell>
                      </TableRow>
                    )}
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
