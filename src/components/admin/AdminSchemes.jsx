"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  FileText,
  DollarSign,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import { toast } from "sonner";

export function AdminSchemes() {
  const { schemes, addScheme, updateScheme, deleteScheme } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    eligible: true,
    status: "active",
    amount: "",
    deadline: "",
    eligibility: "",
    link: "",
  });

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || scheme.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddScheme = () => {
    if (!formData.name || !formData.description || !formData.amount || !formData.deadline) {
      toast.error("Required fields missing");
      return;
    }

    addScheme(formData);
    toast.success("Policy/Scheme added to platform database");
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditScheme = () => {
    if (!selectedScheme || !formData.name || !formData.description || !formData.amount || !formData.deadline) {
      toast.error("Required fields missing");
      return;
    }

    updateScheme(selectedScheme.id, formData);
    toast.success("Policy/Scheme updated successfully");
    setShowAddDialog(false);
    resetForm();
  };

  const handleDeleteScheme = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" catalog entry?`)) {
      deleteScheme(id);
      toast.success("Scheme entry removed");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      eligible: true,
      status: "active",
      amount: "",
      deadline: "",
      eligibility: "",
      link: "",
    });
    setSelectedScheme(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "inactive": return "bg-yellow-100 text-yellow-700";
      case "expired": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Governance & Welfare</h1>
          <p className="text-muted-foreground font-medium">Curating essential government schemes and subsidies for the farming community</p>
        </div>
        <Button onClick={() => { resetForm(); setShowAddDialog(true); }} className="shadow-lg shadow-primary/20 scale-105 transition-transform hover:scale-110">
          <Plus className="w-4 h-4 mr-2" />
          Register New Policy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Catalog", value: schemes.length, color: "text-primary", icon: FileText },
          { label: "Active Subsidy", value: schemes.filter(s => s.status === 'active').length, color: "text-chart-1", icon: TrendingUp },
          { label: "Pending Policy", value: schemes.filter(s => s.status === 'inactive').length, color: "text-yellow-600", icon: Users },
          { label: "Coverage", value: `~${(schemes.length * 150)}k Farmers`, color: "text-accent", icon: Award }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden group">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><stat.icon className="w-12 h-12" /></div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
              <h2 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-muted/20 p-1">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search policy database..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-none bg-background shadow-inner"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-56 border-none bg-background shadow-sm">
                <SelectValue placeholder="Policy Status" />
              </SelectTrigger>
              <SelectContent className="border-none shadow-2xl rounded-xl">
                <SelectItem value="all">Complete Database</SelectItem>
                <SelectItem value="active">Active Enrollment</SelectItem>
                <SelectItem value="inactive">System Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id} className="border-none shadow-sm hover:shadow-xl transition-all group overflow-hidden border-t-4 border-t-primary/0 hover:border-t-primary">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold leading-tight">{scheme.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground border-border/50">
                      {scheme.eligible ? "Open Recruitment" : "Restricted Access"}
                    </Badge>
                  </div>
                </div>
                <Badge className={`${getStatusColor(scheme.status)} border-none shadow-sm px-3 font-bold uppercase text-[10px]`}>
                  {scheme.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {scheme.description}
              </p>

              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-2xl">
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Benefit Valuation</p>
                  <p className="text-lg font-black">{scheme.amount}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">Enrollment Deadline</p>
                  <p className="text-lg font-black">{new Date(scheme.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 font-bold shadow-sm"
                  onClick={() => { setSelectedScheme(scheme); setShowDetailsDialog(true); }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Audit History
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-blue-100 hover:text-blue-700 rounded-full"
                  onClick={() => { setSelectedScheme(scheme); setFormData(scheme); setShowAddDialog(true); }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-destructive hover:text-white rounded-full"
                  onClick={() => handleDeleteScheme(scheme.id, scheme.name)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
