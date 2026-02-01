"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
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
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Award,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import adminService from "@/services/adminService";

export function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [stats, setStats] = useState({
    TOTAL: 0,
    ACTIVE: 0,
    INACTIVE: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    schemeName: "",
    description: "",
    benefits: "",
    deadline: "",
    applicationLink: "",
  });

  useEffect(() => {
    fetchSchemes();
    fetchStats();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllSchemes();
      setSchemes(data);
    } catch (error) {
      toast.error(error.message || "Failed to load schemes");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await adminService.getSchemeStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const filteredSchemes = schemes.filter((scheme) => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch =
      scheme.schemeName?.toLowerCase().includes(searchString) ||
      scheme.description?.toLowerCase().includes(searchString) ||
      scheme.benefits?.toLowerCase().includes(searchString);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && scheme.active) ||
      (statusFilter === "inactive" && !scheme.active);

    return matchesSearch && matchesStatus;
  });

  const handleAddScheme = () => {
    setIsEditing(false);
    setSelectedScheme(null);
    resetForm();
    setShowFormDialog(true);
  };

  const handleEditScheme = (scheme) => {
    setIsEditing(true);
    setSelectedScheme(scheme);
    setFormData({
      schemeName: scheme.schemeName || "",
      description: scheme.description || "",
      benefits: scheme.benefits || "",
      deadline: scheme.deadline ? formatDateForInput(scheme.deadline) : "",
      applicationLink: scheme.applicationLink || "",
    });
    setShowFormDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.schemeName || !formData.description || !formData.deadline || !formData.applicationLink) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      
      const submitData = {
        ...formData,
        deadline: new Date(formData.deadline).toISOString(),
      };

      if (isEditing && selectedScheme) {
        await adminService.updateScheme(selectedScheme.id, submitData);
        toast.success("Scheme updated successfully!");
      } else {
        await adminService.createScheme(submitData);
        toast.success("Scheme created successfully!");
      }

      setShowFormDialog(false);
      resetForm();
      fetchSchemes();
      fetchStats();
    } catch (error) {
      toast.error(error.message || "Failed to save scheme");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteScheme = async (scheme) => {
    if (!window.confirm(`Are you sure you want to delete "${scheme.schemeName}"?`)) {
      return;
    }

    try {
      await adminService.deleteScheme(scheme.id);
      toast.success("Scheme deleted successfully!");
      fetchSchemes();
      fetchStats();
    } catch (error) {
      toast.error(error.message || "Failed to delete scheme");
    }
  };

  const handleViewDetails = (scheme) => {
    setSelectedScheme(scheme);
    setShowDetailsDialog(true);
  };

  const resetForm = () => {
    setFormData({
      schemeName: "",
      description: "",
      benefits: "",
      deadline: "",
      applicationLink: "",
    });
    setSelectedScheme(null);
    setIsEditing(false);
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-700 border-none px-3 font-bold flex items-center gap-1 w-fit">
        <CheckCircle className="w-3 h-3" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700 border-none px-3 font-bold flex items-center gap-1 w-fit">
        <XCircle className="w-3 h-3" />
        Inactive
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
          <h1 className="text-3xl font-bold tracking-tight">Government Schemes</h1>
          <p className="text-muted-foreground font-medium">
            Manage agricultural schemes and benefits
          </p>
        </div>
        <Button onClick={handleAddScheme} className="shadow-lg px-6">
          <Plus className="w-4 h-4 mr-2" />
          Add New Scheme
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Catalog", value: stats.TOTAL, color: "text-primary", icon: Award, status: "all" },
          { label: "Active Schemes", value: stats.ACTIVE, color: "text-green-600", icon: CheckCircle, status: "active" },
          { label: "Inactive Schemes", value: stats.INACTIVE, color: "text-red-600", icon: XCircle, status: "inactive" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card
              key={i}
              className="border-none shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setStatusFilter(stat.status)}
            >
              <CardContent className="p-6 relative">
                <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icon className="w-12 h-12" />
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {stat.label}
                </p>
                <h2 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h2>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Schemes Table */}
      <Card className="border-none shadow-lg overflow-hidden ring-1 ring-border/50">
        <CardHeader className="bg-muted/30 pb-4 border-b">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold">Schemes Catalog</CardTitle>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by scheme name..."
                  className="pl-10 bg-background/50 border-none shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-none bg-background shadow-sm">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent className="border-none shadow-xl">
                  <SelectItem value="all">All Schemes</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
                  <TableHead className="py-4 font-bold">Scheme Name</TableHead>
                  <TableHead className="font-bold">Description</TableHead>
                  <TableHead className="font-bold">Deadline</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchemes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No schemes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchemes.map((scheme) => (
                    <TableRow
                      key={scheme.id}
                      className="cursor-default hover:bg-muted/5 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-primary" />
                          <span className="font-bold">{scheme.schemeName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm line-clamp-2 max-w-md">
                          {scheme.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span>{formatDate(scheme.deadline)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(scheme.active)}</TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
                            onClick={() => window.open(scheme.applicationLink, "_blank")}
                            title="Apply"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            onClick={() => handleEditScheme(scheme)}
                            title="Update"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                            onClick={() => handleDeleteScheme(scheme)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Add/Edit Form Dialog */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="max-w-2xl border-none shadow-2xl rounded-2xl overflow-hidden p-0 max-h-[90vh] overflow-y-auto">
          <div className="bg-primary p-6 text-primary-foreground">
            <DialogTitle className="text-xl font-bold">
              {isEditing ? "Edit Scheme" : "Add New Scheme"}
            </DialogTitle>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase">Scheme Name *</Label>
              <Input
                placeholder="Enter scheme name"
                value={formData.schemeName}
                onChange={(e) => setFormData({ ...formData, schemeName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase">Description *</Label>
              <Textarea
                placeholder="Enter scheme description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase">Benefits</Label>
              <Textarea
                placeholder="Enter benefits (optional)"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase">Application Deadline *</Label>
              <Input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
              <p className="text-xs text-muted-foreground italic">
                Status will automatically be set based on deadline
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase">Application Link *</Label>
              <Input
                placeholder="https://example.com/apply"
                value={formData.applicationLink}
                onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
              />
            </div>
          </div>
          <div className="p-4 bg-muted/50 flex justify-end gap-2 px-6">
            <Button
              variant="ghost"
              onClick={() => {
                setShowFormDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting} className="shadow-lg px-6">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isEditing ? "Update Scheme" : "Create Scheme"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
