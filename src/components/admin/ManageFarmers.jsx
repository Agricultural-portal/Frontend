"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search, Eye, Edit, Ban, CheckCircle, UserPlus, Star, Trash2, Mail, Phone, MapPin, User } from "lucide-react";
import { toast } from "sonner";

export function ManageFarmers() {
  const { farmers, addFarmer, updateFarmer, deleteFarmer, farmerRatings } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRatingsDialog, setShowRatingsDialog] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    farmSize: "",
    status: "active",
  });

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || farmer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddFarmer = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.location || !formData.farmSize) {
      toast.error("Please fill all required fields");
      return;
    }

    addFarmer({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      farmSize: formData.farmSize,
      joinedDate: new Date().toISOString().split("T")[0],
      totalProducts: 0,
      totalRevenue: 0,
      status: formData.status,
    });

    toast.success("Farmer added successfully!");
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditFarmer = () => {
    if (!selectedFarmer || !formData.name || !formData.email || !formData.phone || !formData.location || !formData.farmSize) {
      toast.error("Please fill all required fields");
      return;
    }

    updateFarmer(selectedFarmer.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      farmSize: formData.farmSize,
      status: formData.status,
    });

    toast.success("Farmer updated successfully!");
    setShowEditDialog(false);
    resetForm();
  };

  const handleDeleteFarmer = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteFarmer(id);
      toast.success("Farmer deleted successfully!");
    }
  };

  const handleStatusToggle = (farmer) => {
    const newStatus = farmer.status === "active" ? "inactive" : "active";
    updateFarmer(farmer.id, { status: newStatus });
    toast.success(`Farmer ${newStatus === "active" ? "activated" : "deactivated"} successfully!`);
  };

  const handleViewDetails = (farmer) => {
    setSelectedFarmer(farmer);
    setShowDetailsDialog(true);
  };

  const handleEditClick = (farmer) => {
    setSelectedFarmer(farmer);
    setFormData({
      name: farmer.name,
      email: farmer.email,
      phone: farmer.phone,
      location: farmer.location,
      farmSize: farmer.farmSize,
      status: farmer.status,
    });
    setShowEditDialog(true);
  };

  const handleViewRatings = (farmer) => {
    setSelectedFarmer(farmer);
    setShowRatingsDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      farmSize: "",
      status: "active",
    });
    setSelectedFarmer(null);
  };

  const activeFarmers = farmers.filter((f) => f.status === "active").length;
  const inactiveFarmers = farmers.filter((f) => f.status === "inactive").length;
  const thisMonthFarmers = farmers.filter((f) => {
    const joinedDate = new Date(f.joinedDate);
    const now = new Date();
    return joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear();
  }).length;

  const getFarmerRatings = (farmerId) => {
    const farmerName = farmers.find(f => f.id === farmerId)?.name;
    return farmerRatings.filter((r) => r.farmerName && farmerName === r.farmerName);
  };

  const getAverageRating = (farmerId) => {
    const ratings = getFarmerRatings(farmerId);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Farmers</h1>
          <p className="text-muted-foreground font-medium">Verify credentials and manage platform access for farmers</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="shadow-lg shadow-primary/20 scale-105 transition-transform hover:scale-110">
          <UserPlus className="w-4 h-4 mr-2" />
          Onboard New Farmer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Farmers", value: farmers.length, color: "text-primary" },
          { label: "Active Farmers", value: activeFarmers, color: "text-chart-1" },
          { label: "Deactivated", value: inactiveFarmers, color: "text-muted-foreground" },
          { label: "New Joinees", value: thisMonthFarmers, color: "text-chart-4" }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden group">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <User className="w-12 h-12" />
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
              <h2 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-lg overflow-hidden ring-1 ring-border/50">
        <CardHeader className="bg-muted/30 pb-4 border-b">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold">Registration Directory</CardTitle>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email or location..."
                  className="pl-10 bg-background/50 border-none shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] border-none bg-background shadow-sm">
                  <SelectValue placeholder="Status Filter" />
                </SelectTrigger>
                <SelectContent className="border-none shadow-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Accounts</SelectItem>
                  <SelectItem value="inactive">Deactivated</SelectItem>
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
                  <TableHead className="py-4 font-bold">Profile</TableHead>
                  <TableHead className="font-bold">Location</TableHead>
                  <TableHead className="font-bold">Inventory</TableHead>
                  <TableHead className="font-bold">Revenue</TableHead>
                  <TableHead className="font-bold">Rating</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarmers.map((farmer) => (
                  <TableRow key={farmer.id} className="cursor-default hover:bg-muted/5 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
                          {farmer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{farmer.name}</p>
                          <p className="text-xs text-muted-foreground italic">{farmer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{farmer.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-bold border-muted-foreground/20">
                        {farmer.totalProducts} SKU units
                      </Badge>
                    </TableCell>
                    <TableCell className="font-black text-chart-1">₹{farmer.totalRevenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleViewRatings(farmer)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-400/10 hover:bg-yellow-400/20 transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-bold text-yellow-700">{getAverageRating(farmer.id)}</span>
                        <span className="text-[10px] text-muted-foreground">({getFarmerRatings(farmer.id).length})</span>
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          farmer.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-200 border-none px-3 font-bold"
                            : "bg-red-100 text-red-700 hover:bg-red-200 border-none px-3 font-bold"
                        }
                      >
                        {farmer.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => handleViewDetails(farmer)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600" onClick={() => handleEditClick(farmer)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        {farmer.status === "active" ? (
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100 hover:text-red-500" onClick={() => handleStatusToggle(farmer)}>
                            <Ban className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-green-100 hover:text-green-500" onClick={() => handleStatusToggle(farmer)}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive hover:text-white"
                          onClick={() => handleDeleteFarmer(farmer.id, farmer.name)}
                        >
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

      {/* Dialogs updated to avoid TS types */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md border-none shadow-2xl rounded-2xl overflow-hidden p-0">
          <div className="bg-primary p-6 text-primary-foreground">
            <DialogTitle className="text-xl font-bold">Onboard New Farmer</DialogTitle>
            <DialogDescription className="text-primary-foreground/70">Create a verified credentials profile</DialogDescription>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs font-bold uppercase">Full Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" /></div>
              <div className="space-y-1.5"><Label className="text-xs font-bold uppercase">Email Address</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@farm.com" /></div>
              <div className="space-y-1.5"><Label className="text-xs font-bold uppercase">Phone Number</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91..." /></div>
              <div className="space-y-1.5"><Label className="text-xs font-bold uppercase">Physical Location</Label><Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="City, State" /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs font-bold uppercase">Total Farm Area</Label><Input value={formData.farmSize} onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })} placeholder="e.g. 15 acres" /></div>
          </div>
          <div className="p-4 bg-muted/50 flex justify-end gap-2 px-6">
            <Button variant="ghost" onClick={() => setShowAddDialog(false)}>Discard</Button>
            <Button onClick={handleAddFarmer} className="shadow-lg px-8">Save Profile</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
