"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Search,
  Eye,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
} from "lucide-react";

const mockOrders = [
  {
    id: "ORD-001",
    buyerId: "B001",
    buyerName: "Fresh Mart Store",
    farmerId: "F001",
    farmerName: "John's Organic Farm",
    products: [
      { name: "Tomatoes", quantity: "50 kg", price: 150 },
      { name: "Cucumbers", quantity: "30 kg", price: 90 },
    ],
    totalAmount: 240,
    status: "delivered",
    orderDate: "2024-12-01",
    deliveryDate: "2024-12-05",
    paymentStatus: "paid",
  },
  {
    id: "ORD-002",
    buyerId: "B002",
    buyerName: "Green Valley Restaurant",
    farmerId: "F003",
    farmerName: "Green Valley Organics",
    products: [
      { name: "Lettuce", quantity: "20 kg", price: 100 },
      { name: "Carrots", quantity: "25 kg", price: 75 },
    ],
    totalAmount: 175,
    status: "shipped",
    orderDate: "2024-12-05",
    deliveryDate: "2024-12-10",
    paymentStatus: "paid",
  },
  {
    id: "ORD-003",
    buyerId: "B003",
    buyerName: "Organic Wholesalers Inc",
    farmerId: "F002",
    farmerName: "Sunrise Agriculture",
    products: [
      { name: "Wheat", quantity: "500 kg", price: 1500 },
      { name: "Rice", quantity: "300 kg", price: 900 },
    ],
    totalAmount: 2400,
    status: "confirmed",
    orderDate: "2024-12-07",
    paymentStatus: "paid",
  },
  {
    id: "ORD-004",
    buyerId: "B004",
    buyerName: "John Smith",
    farmerId: "F001",
    farmerName: "John's Organic Farm",
    products: [{ name: "Mixed Vegetables", quantity: "10 kg", price: 80 }],
    totalAmount: 80,
    status: "pending",
    orderDate: "2024-12-08",
    paymentStatus: "pending",
  },
  {
    id: "ORD-005",
    buyerId: "B001",
    buyerName: "Fresh Mart Store",
    farmerId: "F004",
    farmerName: "Miller's Dairy Farm",
    products: [
      { name: "Fresh Milk", quantity: "100 L", price: 300 },
      { name: "Cheese", quantity: "20 kg", price: 400 },
    ],
    totalAmount: 700,
    status: "cancelled",
    orderDate: "2024-12-03",
    paymentStatus: "failed",
  },
];

export function AllOrders() {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700";
      case "shipped": return "bg-blue-100 text-blue-700";
      case "confirmed": return "bg-yellow-100 text-yellow-700";
      case "pending": return "bg-orange-100 text-orange-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Orders</h1>
          <p className="text-muted-foreground font-medium">Monitoring all farm-to-buyer transactions across the network</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Gross GMV", value: `₹${totalRevenue.toLocaleString()}`, color: "text-chart-1", icon: DollarSign },
          { label: "Active Orders", value: orders.filter(o => o.status !== 'cancelled').length, color: "text-primary", icon: ShoppingCart },
          { label: "Pending Review", value: orders.filter(o => o.status === 'pending').length, color: "text-orange-600", icon: Package },
          { label: "Global Fulfillment", value: `${(orders.filter(o => o.status === 'delivered').length / orders.length * 100).toFixed(0)}%`, color: "text-accent", icon: TrendingUp }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden group">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform"><stat.icon className="w-12 h-12" /></div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
              <h2 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-lg overflow-hidden ring-1 ring-border/50">
        <CardHeader className="bg-muted/30 pb-4 border-b">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search global order vault..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-none bg-background shadow-inner"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-56 border-none bg-background shadow-sm">
                <SelectValue placeholder="Manifest Filter" />
              </SelectTrigger>
              <SelectContent className="border-none shadow-2xl rounded-xl">
                <SelectItem value="all">Complete History</SelectItem>
                <SelectItem value="pending">Escrow Awaiting</SelectItem>
                <SelectItem value="confirmed">Processor Assigned</SelectItem>
                <SelectItem value="shipped">Logistics Active</SelectItem>
                <SelectItem value="delivered">Confirmed Receipt</SelectItem>
                <SelectItem value="cancelled">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow>
                  <TableHead className="font-bold py-4">Manifest ID</TableHead>
                  <TableHead className="font-bold">Sourcing Party</TableHead>
                  <TableHead className="font-bold">Producer</TableHead>
                  <TableHead className="font-bold text-right">Settlement</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right pr-6 font-bold">Audit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/5">
                    <TableCell className="font-black text-xs">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col"><span className="font-bold">{order.buyerName}</span><span className="text-[10px] text-muted-foreground">{order.buyerId}</span></div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col"><span className="font-bold">{order.farmerName}</span><span className="text-[10px] text-muted-foreground">{order.farmerId}</span></div>
                    </TableCell>
                    <TableCell className="text-right font-black text-chart-1">₹{order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status)} border-none px-3 font-bold`}>{order.status.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary rounded-full" onClick={() => { setSelectedOrder(order); setShowDetailsDialog(true); }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
