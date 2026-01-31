"use client";

import { useState, useEffect } from "react";
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
  Package,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import adminService from "@/services/adminService";

export function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
    TOTAL: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await adminService.getOrderStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch =
      order.id?.toString().includes(searchString) ||
      order.user?.email?.toLowerCase().includes(searchString) ||
      order.user?.first_name?.toLowerCase().includes(searchString) ||
      order.user?.Last_name?.toLowerCase().includes(searchString) ||
      order.shippingAddress?.toLowerCase().includes(searchString);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  const handleChangeStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusDialog(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      setUpdating(true);
      await adminService.updateOrderStatus(selectedOrder.id, newStatus);
      toast.success("Order status updated successfully!");
      setShowStatusDialog(false);
      fetchOrders();
      fetchStats();
    } catch (error) {
      toast.error(error.message || "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
      APPROVED: { color: "bg-blue-100 text-blue-700", icon: CheckCircle },
      REJECTED: { color: "bg-red-100 text-red-700", icon: XCircle },
      DELIVERED: { color: "bg-green-100 text-green-700", icon: Package },
      CANCELLED: { color: "bg-gray-100 text-gray-700", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border-none px-3 font-bold flex items-center gap-1 w-fit`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    return (
      <Badge
        className={
          paymentStatus?.toLowerCase() === "paid"
            ? "bg-green-100 text-green-700 border-none"
            : "bg-orange-100 text-orange-700 border-none"
        }
      >
        {paymentStatus || "N/A"}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Orders</h1>
          <p className="text-muted-foreground font-medium">
            Manage and track all orders in the system
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: "Total Orders", value: stats.TOTAL, color: "text-primary", status: "all" },
          { label: "Pending", value: stats.PENDING, color: "text-yellow-600", status: "PENDING" },
          { label: "Approved", value: stats.APPROVED, color: "text-blue-600", status: "APPROVED" },
          { label: "Delivered", value: stats.DELIVERED, color: "text-green-600", status: "DELIVERED" },
          { label: "Rejected", value: stats.REJECTED, color: "text-red-600", status: "REJECTED" },
          { label: "Cancelled", value: stats.CANCELLED, color: "text-gray-600", status: "CANCELLED" },
        ].map((stat, i) => (
          <Card 
            key={i} 
            className="border-none shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setStatusFilter(stat.status)}
          >
            <CardContent className="p-4 relative">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Package className="w-8 h-8" />
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <h2 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders Table */}
      <Card className="border-none shadow-lg overflow-hidden ring-1 ring-border/50">
        <CardHeader className="bg-muted/30 pb-4 border-b">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold">Orders Management</CardTitle>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, customer, address..."
                  className="pl-10 bg-background/50 border-none shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] border-none bg-background shadow-sm">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent className="border-none shadow-xl">
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4 font-bold">Order ID</TableHead>
                  <TableHead className="font-bold">Customer</TableHead>
                  <TableHead className="font-bold">Items</TableHead>
                  <TableHead className="font-bold">Total Amount</TableHead>
                  <TableHead className="font-bold">Payment</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Order Date</TableHead>
                  <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="cursor-default hover:bg-muted/5 transition-colors"
                    >
                      <TableCell className="py-4 font-bold">#{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold">
                            {order.user?.first_name} {order.user?.Last_name}
                          </p>
                          <p className="text-xs text-muted-foreground italic">
                            {order.user?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-bold border-muted-foreground/20">
                          {order.items?.length || 0} items
                        </Badge>
                      </TableCell>
                      <TableCell className="font-black text-chart-1">
                        ₹{order.totalAmount?.toLocaleString()}
                      </TableCell>
                      <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-sm">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            onClick={() => handleViewDetails(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
                            onClick={() => handleChangeStatus(order)}
                          >
                            <Truck className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl border-none shadow-2xl rounded-2xl overflow-hidden p-0 max-h-[90vh] overflow-y-auto">
          <div className="bg-primary p-6 text-primary-foreground">
            <DialogTitle className="text-xl font-bold">Order Details</DialogTitle>
          </div>
          {selectedOrder && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Order ID</p>
                  <p className="font-bold text-lg">#{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Customer</p>
                  <p className="font-medium">
                    {selectedOrder.user?.first_name} {selectedOrder.user?.Last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Phone</p>
                  <p className="font-medium">{selectedOrder.user?.phone || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase">
                    Shipping Address
                  </p>
                  <p className="font-medium">{selectedOrder.shippingAddress}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Total Amount</p>
                  <p className="font-black text-xl text-chart-1">
                    ₹{selectedOrder.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Payment Status</p>
                  {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Order Date</p>
                  <p className="font-medium">
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Last Updated</p>
                  <p className="font-medium">
                    {selectedOrder.updatedAt
                      ? new Date(selectedOrder.updatedAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <p className="text-sm font-bold text-muted-foreground uppercase mb-3">
                  Order Items ({selectedOrder.items?.length || 0})
                </p>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                      >
                        <div>
                          <p className="font-bold">{item.product?.name || "Product"}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold">₹{item.priceAtPurchase?.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No items available</p>
                )}
              </div>
            </div>
          )}
          <div className="p-4 bg-muted/50 flex justify-end px-6">
            <Button variant="ghost" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="max-w-md border-none shadow-2xl rounded-2xl overflow-hidden p-0">
          <div className="bg-primary p-6 text-primary-foreground">
            <DialogTitle className="text-xl font-bold">Change Order Status</DialogTitle>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Order ID: #{selectedOrder?.id}</p>
              <p className="text-xs text-muted-foreground mb-4">
                Customer: {selectedOrder?.user?.first_name} {selectedOrder?.user?.Last_name}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase">Select New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="p-4 bg-muted/50 flex justify-end gap-2 px-6">
            <Button
              variant="ghost"
              onClick={() => {
                setShowStatusDialog(false);
                setNewStatus("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={updating} className="shadow-lg px-6">
              {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Update Status
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
