"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { API_BASE_URL } from "@/services/config";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
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
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    state: "",
    pincode: "",
    addresss: "",
  });

  const filteredBuyers = buyers.filter((buyer) => {
    const matchesSearch =
      buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || buyer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddBuyer = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
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
        password: formData.password
      };

      const response = await fetch(`${API_BASE_URL}/auth/signup/buyer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success("Buyer registered successfully!");
        setShowAddDialog(false);
        resetForm();
        window.location.reload();
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Failed to register buyer");
      }
    } catch (error) {
      console.error("Error adding buyer:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleEditBuyer = async () => {
    if (!selectedBuyer || !formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
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
        pincode: formData.pincode
      };

      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedBuyer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success("Buyer updated successfully!");
        setShowEditDialog(false);
        resetForm();
        window.location.reload();
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Failed to update buyer");
      }
    } catch (error) {
      console.error("Error updating buyer:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDeleteBuyer = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          toast.success("Buyer removed from system");
          window.location.reload();
        } else {
          toast.error("Failed to delete buyer");
        }
      } catch (error) {
        console.error("Error deleting buyer:", error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleStatusToggle = async (buyer) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/users/${buyer.id}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const newStatus = buyer.status === "active" ? "suspended" : "active";
        toast.success(`Account ${newStatus === "active" ? "activated" : "suspended"}`);
        window.location.reload();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("An error occurred. Please try again.");
    }
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
    });
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
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={buyer.profileImageUrl} alt={buyer.name} />
                          <AvatarFallback className="bg-accent/10 text-accent font-bold">
                            {buyer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600" onClick={() => { 
                          setSelectedBuyer(buyer); 
                          const nameParts = buyer.name.split(' ');
                          const locationParts = buyer.location ? buyer.location.split(',').map(s => s.trim()) : ['', ''];
                          setFormData({
                            firstName: nameParts[0] || '',
                            lastName: nameParts.slice(1).join(' ') || '',
                            email: buyer.email,
                            phone: buyer.phone,
                            city: locationParts[0] || '',
                            state: locationParts[1] || '',
                            pincode: '',
                            addresss: buyer.location || '',
                            password: ''
                          });
                          setShowEditDialog(true); 
                        }}>
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

      {/* Add Buyer Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl border-none shadow-2xl rounded-2xl overflow-hidden p-0 max-h-[90vh] overflow-y-auto">
          <div className="bg-primary p-6 text-primary-foreground">
            <DialogTitle className="text-xl font-bold">Register New Buyer</DialogTitle>
            <DialogDescription className="text-primary-foreground/70">Create a new buyer account</DialogDescription>
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
                  placeholder="john@example.com" 
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
          </div>
          <div className="p-4 bg-muted/50 flex justify-end gap-2 px-6">
            <Button variant="ghost" onClick={() => { setShowAddDialog(false); resetForm(); }}>Discard</Button>
            <Button onClick={handleAddBuyer} className="shadow-lg px-8">Register Buyer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Buyer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl border-none shadow-2xl rounded-2xl overflow-hidden p-0 max-h-[90vh] overflow-y-auto">
          <div className="bg-blue-600 p-6 text-white">
            <DialogTitle className="text-xl font-bold">Edit Buyer Profile</DialogTitle>
            <DialogDescription className="text-white/70">Update buyer information</DialogDescription>
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
                  placeholder="john@example.com" 
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
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase">Address</Label>
              <Input 
                value={formData.addresss} 
                onChange={(e) => setFormData({ ...formData, addresss: e.target.value })} 
                placeholder="Full address" 
              />
            </div>
          </div>
          <div className="p-4 bg-muted/50 flex justify-end gap-2 px-6">
            <Button variant="ghost" onClick={() => { setShowEditDialog(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEditBuyer} className="shadow-lg px-8">Update Profile</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Buyer Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl border-none shadow-2xl rounded-2xl overflow-hidden p-0">
          <div className="bg-green-600 p-6 text-white">
            <DialogTitle className="text-xl font-bold">Buyer Profile Details</DialogTitle>
            <DialogDescription className="text-white/70">Complete information about the buyer</DialogDescription>
          </div>
          {selectedBuyer && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Full Name</Label>
                  <p className="text-base font-semibold">{selectedBuyer.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Email</Label>
                  <p className="text-base font-semibold">{selectedBuyer.email}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Phone</Label>
                  <p className="text-base font-semibold">{selectedBuyer.phone}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Location</Label>
                  <p className="text-base font-semibold">{selectedBuyer.location}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Status</Label>
                  <Badge className={selectedBuyer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                    {selectedBuyer.status?.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Total Orders</Label>
                  <p className="text-base font-semibold">{selectedBuyer.totalOrders || 0}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Total Spent</Label>
                  <p className="text-base font-semibold">₹{selectedBuyer.totalSpent?.toLocaleString() || 0}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Rating</Label>
                  <p className="text-base font-semibold">{getAverageRating(selectedBuyer.id)}/5</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Join Date</Label>
                  <p className="text-base font-semibold">{selectedBuyer.joinDate || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
          <div className="p-4 bg-muted/50 flex justify-end gap-2 px-6">
            <Button onClick={() => { setShowDetailsDialog(false); setSelectedBuyer(null); }}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}



