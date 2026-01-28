"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Search,
  UserPlus,
  Eye,
  Ban,
  CheckCircle,
  ShoppingBag,
  Edit,
  Trash2,
  Star,
  User,
} from "lucide-react";
import { toast } from "sonner";

export function ManageBuyers() {
  const { buyers, addBuyer, updateBuyer, deleteBuyer, buyerRatings } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRatingsDialog, setShowRatingsDialog] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    status: "active",
  });

  const filteredBuyers = buyers.filter((buyer) => {
    const matchesSearch =
      buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || buyer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddBuyer = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.location) {
      toast.error("Please fill all required fields");
      return;
    }

    addBuyer({
      ...formData,
      joinedDate: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpent: 0,
    });

    toast.success("Buyer account created!");
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditBuyer = () => {
    if (!selectedBuyer || !formData.name || !formData.email || !formData.phone || !formData.location) {
      toast.error("Please fill all required fields");
      return;
    }

    updateBuyer(selectedBuyer.id, formData);
    toast.success("Buyer details updated!");
    setShowEditDialog(false);
    resetForm();
  };

  const handleDeleteBuyer = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      deleteBuyer(id);
      toast.success("Buyer removed from system");
    }
  };

  const handleStatusToggle = (buyer) => {
    const newStatus = buyer.status === "active" ? "inactive" : "active";
    updateBuyer(buyer.id, { status: newStatus });
    toast.success(`Account ${newStatus === "active" ? "activated" : "suspended"}`);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", location: "", status: "active" });
    setSelectedBuyer(null);
  };

  const getBuyerRatings = (buyerId) => {
    const buyerName = buyers.find((b) => b.id === buyerId)?.name;
    return buyerRatings.filter((r) => r.buyerName && buyerName === r.buyerName);
  };

  const getAverageRating = (buyerId) => {
    const ratings = getBuyerRatings(buyerId);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const activeBuyers = buyers.filter((b) => b.status === "active").length;
  const totalOrders = buyers.reduce((sum, b) => sum + b.totalOrders, 0);
  const totalRevenue = buyers.reduce((sum, b) => sum + b.totalSpent, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Buyers</h1>
          <p className="text-muted-foreground font-medium">Control purchasing agent accounts and procurement cycles</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="shadow-lg shadow-primary/20 scale-105 transition-transform hover:scale-110">
          <UserPlus className="w-4 h-4 mr-2" />
          Register New Buyer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Procuement Agents", value: buyers.length, color: "text-primary" },
          { label: "Verified Buyers", value: activeBuyers, color: "text-chart-1" },
          { label: "Total POs Issued", value: totalOrders, color: "text-accent" },
          { label: "Total GMV Contribution", value: `₹${totalRevenue.toLocaleString()}`, color: "text-chart-4" }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden group">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShoppingBag className="w-12 h-12" />
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
              <h2 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-lg overflow-hidden ring-1 ring-border/50">
        <CardHeader className="bg-muted/30 pb-4 border-b">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <CardTitle className="text-lg font-bold flex-1">Buyer Directory</CardTitle>
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-none shadow-inner"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 border-none bg-background shadow-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="border-none shadow-xl">
                <SelectItem value="all">Every Agent</SelectItem>
                <SelectItem value="active">Active Tenders</SelectItem>
                <SelectItem value="inactive">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4 font-bold">Buyer Representative</TableHead>
                  <TableHead className="font-bold">Region</TableHead>
                  <TableHead className="font-bold">Orders</TableHead>
                  <TableHead className="font-bold">Contribution</TableHead>
                  <TableHead className="font-bold">Market Rating</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold pr-6">Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBuyers.map((buyer) => (
                  <TableRow key={buyer.id} className="cursor-default hover:bg-muted/5 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold shadow-inner">
                          {buyer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{buyer.name}</p>
                          <p className="text-xs text-muted-foreground italic">{buyer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{buyer.location}</TableCell>
                    <TableCell className="font-bold">{buyer.totalOrders}</TableCell>
                    <TableCell className="font-black text-chart-1">₹{buyer.totalSpent.toLocaleString()}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => { setSelectedBuyer(buyer); setShowRatingsDialog(true); }}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-400/10 hover:bg-yellow-400/20 transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-bold text-yellow-700">{getAverageRating(buyer.id)}</span>
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          buyer.status === "active"
                            ? "bg-green-100 text-green-700 border-none px-3 font-bold"
                            : "bg-red-100 text-red-700 border-none px-3 font-bold"
                        }
                      >
                        {buyer.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => { setSelectedBuyer(buyer); setShowDetailsDialog(true); }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600" onClick={() => { setSelectedBuyer(buyer); setFormData(buyer); setShowEditDialog(true); }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className={`h-8 w-8 ${buyer.status === 'active' ? 'hover:bg-red-100 hover:text-red-500' : 'hover:bg-green-100 hover:text-green-500'}`} onClick={() => handleStatusToggle(buyer)}>
                          {buyer.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive hover:text-white" onClick={() => handleDeleteBuyer(buyer.id, buyer.name)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
