"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Eye,
  Calendar,
  MapPin,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  ListTodo,
} from "lucide-react";
import { useAppContext } from "@/lib/AppContext";
import { toast } from "sonner";

export function CropCycles() {
  const { cropCycles, addCropCycle, updateCropCycle, deleteCropCycle } = useAppContext();

  const [subtasks, setSubtasks] = useState([
    {
      id: 1,
      cropCycleId: 1,
      title: "Apply Fertilizer",
      description: "Apply NPK fertilizer to wheat field",
      dueDate: "2025-01-15",
      status: "completed",
      priority: "high",
      cost: 5000,
    },
    {
      id: 2,
      cropCycleId: 1,
      title: "Irrigation Check",
      description: "Check and maintain irrigation system",
      dueDate: "2025-02-01",
      status: "in-progress",
      priority: "medium",
      cost: 2000,
    },
    {
      id: 4,
      cropCycleId: 2,
      title: "Water Management",
      description: "Monitor water levels in paddy field",
      dueDate: "2025-01-20",
      status: "in-progress",
      priority: "high",
      cost: 3000,
    },
  ]);

  const [isAddCropDialogOpen, setIsAddCropDialogOpen] = useState(false);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [isAddSubtaskDialogOpen, setIsAddSubtaskDialogOpen] = useState(false);
  const [selectedCropCycle, setSelectedCropCycle] = useState(null);

  const [newCrop, setNewCrop] = useState({
    name: "",
    variety: "",
    sowingDate: "",
    expectedHarvest: "",
    totalArea: "",
    status: "in-progress",
  });

  const [newSubtask, setNewSubtask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    cost: "",
  });

  const getStatusColor = (status) => {
    if (status === "completed") return "bg-chart-1 text-white";
    return "bg-chart-4 text-white";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-chart-5 text-white";
      case "medium": return "bg-chart-4 text-white";
      case "low": return "bg-chart-2 text-white";
      default: return "bg-secondary";
    }
  };

  const handleAddCropCycle = () => {
    if (!newCrop.name || !newCrop.variety || !newCrop.sowingDate || !newCrop.expectedHarvest || !newCrop.totalArea) {
      toast.error("Please fill in all required fields");
      return;
    }

    addCropCycle({
      ...newCrop,
      totalArea: parseFloat(newCrop.totalArea),
      progress: 0,
      profit: 0,
      loss: 0,
    });

    toast.success("Crop cycle created successfully!");
    setIsAddCropDialogOpen(false);
    setNewCrop({
      name: "",
      variety: "",
      sowingDate: "",
      expectedHarvest: "",
      totalArea: "",
      status: "in-progress",
    });
  };

  const handleViewDetails = (crop) => {
    setSelectedCropCycle(crop);
    setIsViewDetailsDialogOpen(true);
  };

  const handleAddSubtask = () => {
    if (!newSubtask.title || !newSubtask.dueDate) {
      toast.error("Please fill in required fields (Title and Due Date)");
      return;
    }

    const subtask = {
      id: Math.max(0, ...subtasks.map((s) => s.id)) + 1,
      cropCycleId: selectedCropCycle.id,
      ...newSubtask,
      status: "pending",
      cost: parseFloat(newSubtask.cost) || 0,
    };

    setSubtasks([...subtasks, subtask]);
    toast.success("Subtask created successfully!");
    setIsAddSubtaskDialogOpen(false);
    setNewSubtask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      cost: "",
    });
  };

  const handleDeleteSubtask = (subtaskId) => {
    setSubtasks(subtasks.filter((s) => s.id !== subtaskId));
    toast.success("Subtask deleted successfully!");
  };

  const handleToggleSubtaskStatus = (subtaskId) => {
    setSubtasks(
      subtasks.map((s) =>
        s.id === subtaskId
          ? {
            ...s,
            status: s.status === "completed" ? "pending" : s.status === "pending" ? "in-progress" : "completed",
          }
          : s
      )
    );
  };

  const getCropSubtasks = (cropId) => {
    return subtasks.filter((s) => s.cropCycleId === cropId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Crop Cycles</h1>
          <p className="text-muted-foreground">Manage your crop cultivation cycles</p>
        </div>
        <Button onClick={() => setIsAddCropDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Crop Cycle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cropCycles.map((crop) => {
          const netProfit = crop.profit - crop.loss;
          const isProfitable = netProfit > 0;
          const cropSubtasks = getCropSubtasks(crop.id);
          const completedSubtasks = cropSubtasks.filter((s) => s.status === "completed").length;

          return (
            <Card key={crop.id} className="overflow-hidden border-none shadow-sm">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10 pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold">{crop.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{crop.variety}</p>
                  </div>
                  <Badge className={getStatusColor(crop.status)}>{crop.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Sowing:</span>
                    <span className="font-medium">{crop.sowingDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Harvest:</span>
                    <span className="font-medium">{crop.expectedHarvest}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Total Area:</span>
                  <span className="font-medium">{crop.totalArea} acres</span>
                </div>

                {cropSubtasks.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <ListTodo className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Subtasks:</span>
                    <span className="font-medium text-primary">
                      {completedSubtasks}/{cropSubtasks.length} completed
                    </span>
                  </div>
                )}

                {crop.status === "in-progress" && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Overall Progress</span>
                      <span className="font-bold">{crop.progress}%</span>
                    </div>
                    <Progress value={crop.progress} className="h-2" />
                  </div>
                )}

                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Net Profit/Loss</span>
                    <span className={`font-bold ${isProfitable ? "text-chart-1" : "text-chart-5"}`}>
                      {isProfitable ? "+" : ""}₹{netProfit.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2 mt-2"
                  onClick={() => handleViewDetails(crop)}
                >
                  <Eye className="w-4 h-4" />
                  View Details & Subtasks
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isAddCropDialogOpen} onOpenChange={setIsAddCropDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Crop Cycle</DialogTitle>
            <DialogDescription>Create a new crop cultivation cycle</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="crop-name">Crop Name</Label>
              <Input id="crop-name" value={newCrop.name} onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })} placeholder="e.g., Winter Wheat 2025" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variety">Variety</Label>
              <Input id="variety" value={newCrop.variety} onChange={(e) => setNewCrop({ ...newCrop, variety: e.target.value })} placeholder="e.g., HD-2967" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sowing-date">Sowing Date</Label>
                <Input id="sowing-date" type="date" value={newCrop.sowingDate} onChange={(e) => setNewCrop({ ...newCrop, sowingDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="harvest-date">Expected Harvest</Label>
                <Input id="harvest-date" type="date" value={newCrop.expectedHarvest} onChange={(e) => setNewCrop({ ...newCrop, expectedHarvest: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Total Area (acres)</Label>
              <Input id="area" type="number" value={newCrop.totalArea} onChange={(e) => setNewCrop({ ...newCrop, totalArea: e.target.value })} placeholder="e.g., 5" />
            </div>
            <Button className="w-full shadow-lg" onClick={handleAddCropCycle}>Create Crop Cycle</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCropCycle && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold">{selectedCropCycle.name}</DialogTitle>
                  <Badge className={getStatusColor(selectedCropCycle.status)}>{selectedCropCycle.status}</Badge>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase font-bold">Subtasks</p>
                  <p className="text-xl font-bold">{getCropSubtasks(selectedCropCycle.id).length}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase font-bold">Progress</p>
                  <p className="text-xl font-bold text-primary">{selectedCropCycle.progress}%</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase font-bold">Net Profit</p>
                  <p className="text-xl font-bold text-chart-1">₹{(selectedCropCycle.profit - selectedCropCycle.loss).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Activity Subtasks</h3>
                  <Button size="sm" onClick={() => setIsAddSubtaskDialogOpen(true)}>Add Subtask</Button>
                </div>
                <div className="space-y-3">
                  {getCropSubtasks(selectedCropCycle.id).map(subtask => (
                    <Card key={subtask.id} className="border-none bg-muted/10 shadow-none">
                      <CardContent className="p-4 flex items-center gap-4">
                        <button onClick={() => handleToggleSubtaskStatus(subtask.id)}>
                          {subtask.status === "completed" ? <CheckCircle2 className="text-chart-1" /> : <Circle className="text-muted-foreground" />}
                        </button>
                        <div className="flex-1">
                          <p className={`font-medium ${subtask.status === "completed" ? "line-through opacity-50" : ""}`}>{subtask.title}</p>
                          <p className="text-xs text-muted-foreground">{subtask.dueDate} • {subtask.priority} priority</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSubtask(subtask.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
