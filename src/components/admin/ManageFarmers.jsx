"use client";

import { useState, useEffect } from "react";
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
import { Search, Eye, Edit, Ban, CheckCircle, UserPlus, Trash2, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import adminService from "@/services/adminService";

export function ManageFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    password: "",
    confirmPassword: "",
    farmSize: "",
    farmType: "",
  });

  // Fetch farmers on component mount
  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllFarmers();
      setFarmers(data);
    } catch (error) {
      toast.error(error.message || "Failed to load farmers");
    } finally {
      setLoading(false);
    }
  };

  const filteredFarmers = farmers.filter((farmer) => {
    const fullName = `${farmer.first_name || ""} ${farmer.Last_name || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      (farmer.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (farmer.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (farmer.state || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && farmer.status === "ACTIVE") ||
      (statusFilter === "inactive" && farmer.status !== "ACTIVE");
    
    return matchesSearch && matchesStatus;
  });

  const handleAddFarmer = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
        !formData.address || !formData.city || !formData.state || !formData.pincode || 
        !formData.password || !formData.farmSize || !formData.farmType) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setSubmitting(true);
      await adminService.createFarmer(formData);
      toast.success("Farmer added successfully!");
      setShowAddDialog(false);
      resetForm();
      fetchFarmers();
    } catch (error) {
      toast.error(error.message || "Failed to add farmer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditFarmer = async () => {
    if (!selectedFarmer || !formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await adminService.updateUser(selectedFarmer.id, formData);
      toast.success("Farmer updated successfully!");
      setShowEditDialog(false);
      resetForm();
      fetchFarmers();
    } catch (error) {
      toast.error(error.message || "Failed to update farmer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFarmer = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await adminService.deleteUser(id);
        toast.success("Farmer deleted successfully!");
        fetchFarmers();
      } catch (error) {
        toast.error(error.message || "Failed to delete farmer");
      }
    }
  };

  const handleStatusToggle = async (farmer) => {
    try {
      await adminService.toggleUserStatus(farmer.id);
      const newStatus = farmer.status === "ACTIVE" ? "suspended" : "activated";
      toast.success(`Farmer ${newStatus} successfully!`);
      fetchFarmers();
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleViewDetails = (farmer) => {
    setSelectedFarmer(farmer);
    setShowDetailsDialog(true);
  };

  const handleEditClick = (farmer) => {
    setSelectedFarmer(farmer);
    setFormData({
      firstName: farmer.first_name || "",
      lastName: farmer.Last_name || "",
      email: farmer.email || "",
      phone: farmer.phone || "",
      address: farmer.addresss || "",
      city: farmer.city || "",
      state: farmer.state || "",
      pincode: farmer.pincode || "",
      password: "",
      confirmPassword: "",
      farmSize: "",
      farmType: "",
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      password: "",
      confirmPassword: "",
      farmSize: "",
      farmType: "",
    });
    setSelectedFarmer(null);
  };

  const activeFarmers = farmers.filter((f) => f.status === "ACTIVE").length;
  const inactiveFarmers = farmers.filter((f) => f.status !== "ACTIVE").length;
  const thisMonthFarmers = farmers.filter((f) => {
    if (!f.createdAt) return false;
    const joinedDate = new Date(f.createdAt);
    const now = new Date();
    return joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear();
  }).length;

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
                  <TableHead className="font-bold">Phone</TableHead>
                  <TableHead className="font-bold">Location</TableHead>
                  <TableHead className="font-bold">Joined</TableHead>
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
                          {(farmer.first_name || "F").charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{farmer.first_name} {farmer.Last_name}</p>
                          <p className="text-xs text-muted-foreground italic">{farmer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{farmer.phone || "N/A"}</TableCell>
                    <TableCell className="text-sm font-medium">{farmer.city && farmer.state ? `${farmer.city}, ${farmer.state}` : "N/A"}</TableCell>
                    <TableCell className="text-sm">
                      {farmer.createdAt ? new Date(farmer.createdAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          farmer.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 hover:bg-green-200 border-none px-3 font-bold"
                            : farmer.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none px-3 font-bold"
                            : "bg-red-100 text-red-700 hover:bg-red-200 border-none px-3 font-bold"
                        }
                      >
                        {farmer.status}
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
                        {farmer.status === "ACTIVE" ? (
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
                          onClick={() => handleDeleteFarmer(farmer.id, `${farmer.first_name} ${farmer.Last_name}`)}
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

      {/* Add Farmer Dialog */}
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
                <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder="John" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Last Name *</Label>
                <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Doe" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Email Address *</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@farm.com" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Phone Number *</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91..." />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-bold uppercase">Address *</Label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Street Address" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">City *</Label>
                <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Mumbai" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">State *</Label>
                <Input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="Maharashtra" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Pincode *</Label>
                <Input value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} placeholder="400001" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Farm Size *</Label>
                <Input value={formData.farmSize} onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })} placeholder="e.g. 15 acres" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Farm Type *</Label>
                <Input value={formData.farmType} onChange={(e) => setFormData({ ...formData, farmType: e.target.value })} placeholder="e.g. Organic" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Password *</Label>
                <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Min 6 characters" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Confirm Password *</Label>
                <Input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Re-enter password" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-muted/50 flex justify-end gap-2 px-6">
            <Button variant="ghost" onClick={() => { setShowAddDialog(false); resetForm(); }}>Discard</Button>
            <Button onClick={handleAddFarmer} disabled={submitting} className="shadow-lg px-8">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Farmer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl border-none shadow-2xl rounded-2xl overflow-hidden p-0 max-h-[90vh] overflow-y-auto">
          <div className="bg-primary p-6 text-primary-foreground">
            <DialogTitle className="text-xl font-bold">Edit Farmer Details</DialogTitle>
            <DialogDescription className="text-primary-foreground/70">Update farmer information</DialogDescription>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">First Name *</Label>
                <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Last Name *</Label>
                <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Email Address *</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Phone Number *</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-bold uppercase">Address *</Label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">City *</Label>
                <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">State *</Label>
                <Input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Pincode *</Label>
                <Input value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
              </div>
            </div>
          </div>
          <div className="p-4 bg-muted/50 flex justify-end gap-2 px-6">
            <Button variant="ghost" onClick={() => { setShowEditDialog(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEditFarmer} disabled={submitting} className="shadow-lg px-8">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-lg border-none shadow-2xl rounded-2xl overflow-hidden p-0">
          <div className="bg-primary p-6 text-primary-foreground">
            <DialogTitle className="text-xl font-bold">Farmer Details</DialogTitle>
          </div>
          {selectedFarmer && (
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                  {(selectedFarmer.first_name || "F").charAt(0)}
                </div>
                <div>
                  <p className="text-xl font-bold">{selectedFarmer.first_name} {selectedFarmer.Last_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedFarmer.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Phone</p>
                  <p className="font-medium">{selectedFarmer.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Status</p>
                  <Badge className={selectedFarmer.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                    {selectedFarmer.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Address</p>
                  <p className="font-medium">{selectedFarmer.addresss || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">City</p>
                  <p className="font-medium">{selectedFarmer.city || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">State</p>
                  <p className="font-medium">{selectedFarmer.state || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Pincode</p>
                  <p className="font-medium">{selectedFarmer.pincode || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Joined Date</p>
                  <p className="font-medium">{selectedFarmer.createdAt ? new Date(selectedFarmer.createdAt).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
            </div>
          )}
          <div className="p-4 bg-muted/50 flex justify-end px-6">
            <Button variant="ghost" onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
