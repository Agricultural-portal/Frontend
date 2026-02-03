"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { API_BASE_URL } from "@/services/config";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    state: "",
    pincode: "",
    addresss: "",
    farmSize: "",
    farmType: "MIXED",
  });

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || farmer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddFarmer = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.farmSize) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        addresss: formData.addresss || '',
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode || '',
        farmSize: parseFloat(formData.farmSize) || 0,
        farmType: formData.farmType,
        password: formData.password
      };

      const response = await fetch(`${API_BASE_URL}/auth/signup/farmer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success("Farmer registered successfully!");
        setShowAddDialog(false);
        resetForm();
        // Refresh farmers list
        window.location.reload();
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Failed to register farmer");
      }
    } catch (error) {
      console.error("Error adding farmer:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleEditFarmer = async () => {
    if (!selectedFarmer || !formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        addresss: formData.addresss || '',
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        farmSize: parseFloat(formData.farmSize) || 0,
        farmType: formData.farmType
      };

      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedFarmer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success("Farmer updated successfully!");
        setShowEditDialog(false);
        resetForm();
        window.location.reload();
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Failed to update farmer");
      }
    } catch (error) {
      console.error("Error updating farmer:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDeleteFarmer = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          toast.success("Farmer deleted successfully!");
          window.location.reload();
        } else {
          toast.error("Failed to delete farmer");
        }
      } catch (error) {
        console.error("Error deleting farmer:", error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleStatusToggle = async (farmer) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/users/${farmer.id}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const newStatus = farmer.status === "active" ? "suspended" : "active";
        toast.success(`Farmer ${newStatus === "active" ? "activated" : "deactivated"} successfully!`);
        window.location.reload();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleViewDetails = (farmer) => {
    setSelectedFarmer(farmer);
    setShowDetailsDialog(true);
  };

  const handleEditClick = (farmer) => {
    setSelectedFarmer(farmer);
    const nameParts = farmer.name.split(' ');
    const locationParts = farmer.location ? farmer.location.split(',').map(s => s.trim()) : ['', ''];
    setFormData({
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: farmer.email,
      phone: farmer.phone,
      city: locationParts[0] || '',
      state: locationParts[1] || '',
      pincode: '',
      addresss: farmer.location || '',
      farmSize: farmer.farmSize || '',
      farmType: 'MIXED',
      password: ''
    });
    setShowEditDialog(true);
  };

  const handleViewRatings = (farmer) => {
    setSelectedFarmer(farmer);
    setShowRatingsDialog(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      city: "",
      state: "",
      pincode: "",
      addresss: "",
      farmSize: "",
      farmType: "MIXED",
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
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={farmer.profileImageUrl} alt={farmer.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {farmer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
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
        <DialogContent className="max-w-2xl border-none shadow-2xl rounded-2xl overflow-hidden p-0 max-h-[90vh] overflow-y-auto">
          <div className="bg-primary p-6 text-primary-foreground">
            <DialogTitle className="text-xl font-bold">Onboard New Farmer</DialogTitle>
            <DialogDescription className="text-primary-foreground/70">Create a verified credentials profile</DialogDescription>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">First Name *</Label>
                <Input 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                  placeholder="John" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Last Name *</Label>
                <Input 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                  placeholder="Doe" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Email Address *</Label>
                <Input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  placeholder="john@farm.com" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Phone Number *</Label>
                <Input 
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                  placeholder="+91 0000000000" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">City</Label>
                <Input 
                  value={formData.city} 
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                  placeholder="Mumbai" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">State</Label>
                <Input 
                  value={formData.state} 
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })} 
                  placeholder="Maharashtra" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Pincode</Label>
                <Input 
                  value={formData.pincode} 
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} 
                  placeholder="400001" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Farm Size (acres) *</Label>
                <Input 
                  type="number"
                  value={formData.farmSize} 
                  onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })} 
                  placeholder="e.g. 5" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase">Address</Label>
              <Input 
                value={formData.addresss} 
                onChange={(e) => setFormData({ ...formData, addresss: e.target.value })} 
                placeholder="Full address" 
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase">Password *</Label>
              <Input 
                type="password"
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                placeholder="••••••••" 
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase">Farm Type</Label>
              <Select value={formData.farmType} onValueChange={(value) => setFormData({ ...formData, farmType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select farm type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MIXED">Mixed Farming</SelectItem>
                  <SelectItem value="ORGANIC">Organic</SelectItem>
                  <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                  <SelectItem value="SUBSISTENCE">Subsistence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="p-4 bg-muted/50 flex justify-end gap-2 px-6">
            <Button variant="ghost" onClick={() => { setShowAddDialog(false); resetForm(); }}>Discard</Button>
            <Button onClick={handleAddFarmer} className="shadow-lg px-8">Register Farmer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Farmer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl border-none shadow-2xl rounded-2xl overflow-hidden p-0 max-h-[90vh] overflow-y-auto">
          <div className="bg-blue-600 p-6 text-white">
            <DialogTitle className="text-xl font-bold">Edit Farmer Profile</DialogTitle>
            <DialogDescription className="text-white/70">Update farmer information</DialogDescription>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">First Name *</Label>
                <Input 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                  placeholder="John" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Last Name *</Label>
                <Input 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                  placeholder="Doe" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Email Address *</Label>
                <Input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  placeholder="john@farm.com" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Phone Number *</Label>
                <Input 
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                  placeholder="+91 0000000000" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">City</Label>
                <Input 
                  value={formData.city} 
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                  placeholder="Mumbai" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">State</Label>
                <Input 
                  value={formData.state} 
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })} 
                  placeholder="Maharashtra" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Pincode</Label>
                <Input 
                  value={formData.pincode} 
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} 
                  placeholder="400001" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Farm Size (acres)</Label>
                <Input 
                  type="number"
                  value={formData.farmSize} 
                  onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })} 
                  placeholder="e.g. 5" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase">Address</Label>
              <Input 
                value={formData.addresss} 
                onChange={(e) => setFormData({ ...formData, addresss: e.target.value })} 
                placeholder="Full address" 
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase">Farm Type</Label>
              <Select value={formData.farmType} onValueChange={(value) => setFormData({ ...formData, farmType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select farm type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MIXED">Mixed Farming</SelectItem>
                  <SelectItem value="ORGANIC">Organic</SelectItem>
                  <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                  <SelectItem value="SUBSISTENCE">Subsistence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="p-4 bg-muted/50 flex justify-end gap-2 px-6">
            <Button variant="ghost" onClick={() => { setShowEditDialog(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEditFarmer} className="shadow-lg px-8">Update Profile</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Farmer Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl border-none shadow-2xl rounded-2xl overflow-hidden p-0">
          <div className="bg-green-600 p-6 text-white">
            <DialogTitle className="text-xl font-bold">Farmer Profile Details</DialogTitle>
            <DialogDescription className="text-white/70">Complete information about the farmer</DialogDescription>
          </div>
          {selectedFarmer && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Full Name</Label>
                  <p className="text-base font-semibold">{selectedFarmer.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Email</Label>
                  <p className="text-base font-semibold">{selectedFarmer.email}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Phone</Label>
                  <p className="text-base font-semibold">{selectedFarmer.phone}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Location</Label>
                  <p className="text-base font-semibold">{selectedFarmer.location}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Farm Size</Label>
                  <p className="text-base font-semibold">{selectedFarmer.farmSize || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Farm Type</Label>
                  <p className="text-base font-semibold">{selectedFarmer.farmType || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Status</Label>
                  <Badge className={selectedFarmer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                    {selectedFarmer.status?.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Total Products</Label>
                  <p className="text-base font-semibold">{selectedFarmer.totalProducts || 0}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Total Revenue</Label>
                  <p className="text-base font-semibold">₹{selectedFarmer.totalRevenue?.toLocaleString() || 0}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Rating</Label>
                  <p className="text-base font-semibold">{selectedFarmer.rating || getAverageRating(selectedFarmer.id)}/5</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Join Date</Label>
                  <p className="text-base font-semibold">{selectedFarmer.joinDate || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
          <div className="p-4 bg-muted/50 flex justify-end gap-2 px-6">
            <Button onClick={() => { setShowDetailsDialog(false); setSelectedFarmer(null); }}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}



