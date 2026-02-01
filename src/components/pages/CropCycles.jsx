import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useAppContext } from "@/lib/AppContext";
import { toast } from "sonner";
import { subtaskService } from "@/services/subtaskService";
import { cropCycleService } from "@/services/cropCycleService";
import { CropCycleCard } from "@/components/farmer/CropCycleCard";
import { CropCycleFormDialog } from "@/components/farmer/CropCycleFormDialog";
import { CropCycleViewDialog } from "@/components/farmer/CropCycleViewDialog";
import { SubtaskFormDialog } from "@/components/farmer/SubtaskFormDialog";

export function CropCycles() {
  const { cropCycles, addCropCycle, updateCropCycle, deleteCropCycle, refreshCropCycles } = useAppContext();

  const [subtasks, setSubtasks] = useState([]);

  const [isAddCropDialogOpen, setIsAddCropDialogOpen] = useState(false);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [isAddSubtaskDialogOpen, setIsAddSubtaskDialogOpen] = useState(false);
  const [selectedCropCycle, setSelectedCropCycle] = useState(null);
  const [editingCropId, setEditingCropId] = useState(null);
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);

  // State for forms passed to dialogs
  const [currentCropData, setCurrentCropData] = useState(null);
  const [currentSubtaskData, setCurrentSubtaskData] = useState(null);

  const handleAddCropCycle = (formData) => {
    if (!formData.cropName || !formData.variety || !formData.sowingDate || !formData.expectedHarvestDate || !formData.totalArea) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(formData.expectedHarvestDate) <= new Date(formData.sowingDate)) {
      toast.error("Expected harvest date must be after the sowing date");
      return;
    }

    if (editingCropId) {
      updateCropCycle(editingCropId, {
        ...formData,
        totalArea: parseFloat(formData.totalArea),
        status: formData.status // Maintain current status or allow edit if field added
      });
      toast.success("Crop cycle updated successfully!");
    } else {
      addCropCycle({
        ...formData,
        totalArea: parseFloat(formData.totalArea),
        progress: 0,
        totalExpense: 0,
      });
      toast.success("Crop cycle created successfully!");
    }

    setIsAddCropDialogOpen(false);
    setEditingCropId(null);
    setCurrentCropData(null);
  };

  const handleEditCropCycle = (crop) => {
    setEditingCropId(crop.id);
    setCurrentCropData(crop);
    setIsAddCropDialogOpen(true);
  };

  const fetchSubtasks = async (cropId) => {
    try {
      const data = await subtaskService.getSubtasksByCropId(cropId);
      setSubtasks(data);
    } catch (error) {
      console.error("Error fetching subtasks:", error);
      toast.error("Failed to load subtasks");
    }
  };

  const handleViewDetails = (crop) => {
    setSelectedCropCycle(crop);
    setSubtasks([]); // Clear previous
    fetchSubtasks(crop.id);
    setIsViewDetailsDialogOpen(true);
  };

  const handleAddSubtask = async (formData) => {
    if (!formData.taskTitle || !formData.dueDate) {
      toast.error("Please fill in required fields (Title and Due Date)");
      return;
    }

    if (new Date(formData.dueDate) > new Date(selectedCropCycle.expectedHarvestDate)) {
      toast.error("Subtask due date cannot be later than the expected harvest date");
      return;
    }

    try {
      if (editingSubtaskId) {
        await subtaskService.updateSubtask(editingSubtaskId, {
          ...formData,
          expense: parseFloat(formData.expense) || 0,
        });
        toast.success("Subtask updated successfully!");
      } else {
        await subtaskService.createSubtask(selectedCropCycle.id, {
          ...formData,
          status: "pending", // Backend enum
          expense: parseFloat(formData.expense) || 0,
        });
        toast.success("Subtask created successfully!");
      }

      fetchSubtasks(selectedCropCycle.id);
      refreshCropCycles();
      // Refresh selected crop to get updated total expense
      const updatedCrop = await cropCycleService.getCropCycleById(selectedCropCycle.id);
      setSelectedCropCycle(updatedCrop);

      setIsAddSubtaskDialogOpen(false);
      setEditingSubtaskId(null);
      setCurrentSubtaskData(null);
    } catch (error) {
      console.error(error);
      toast.error(error.message || (editingSubtaskId ? "Failed to update subtask" : "Failed to create subtask"));
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await subtaskService.deleteSubtask(subtaskId);
      setSubtasks(subtasks.filter((s) => s.id !== subtaskId));
      refreshCropCycles();
      // Refresh selected crop to get updated total expense
      if (selectedCropCycle) {
        const updatedCrop = await cropCycleService.getCropCycleById(selectedCropCycle.id);
        setSelectedCropCycle(updatedCrop);
      }
      toast.success("Subtask deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete subtask");
    }
  };

  const handleDeleteCropCycle = (cropId) => {
    if (confirm("Are you sure you want to delete this crop cycle?")) {
      deleteCropCycle(cropId);
      toast.success("Crop cycle deleted successfully!");
    }
  };

  const handleToggleSubtaskStatus = async (subtaskId) => {
    const task = subtasks.find(s => s.id === subtaskId);
    if (!task) return;

    // Cycle: PENDING -> IN_PROGRESS -> COMPLETED -> PENDING
    // Note: Backend might expect uppercase
    let nextStatus = "PENDING";
    const current = task.status?.toUpperCase() || "PENDING";
    if (current === "PENDING") nextStatus = "IN_PROGRESS";
    else if (current === "IN_PROGRESS" || current === "IN-PROGRESS") nextStatus = "COMPLETED";
    else if (current === "COMPLETED") nextStatus = "PENDING";

    try {
      // Optimistic update
      const previousSubtasks = [...subtasks];

      // Update local subtasks state immediately
      setSubtasks(subtasks.map(s => s.id === subtaskId ? { ...s, status: nextStatus } : s));

      // Call API
      await subtaskService.updateSubtaskStatus(subtaskId, nextStatus);

      // Refresh global context to sync expenses/progress properly in background
      refreshCropCycles();
    } catch (error) {
      // Revert on failure
      setSubtasks(previousSubtasks);
      console.error("Status update failed", error);
      toast.error("Failed to update status");
    }
  };

  const handleEditSubtask = (subtask) => {
    setEditingSubtaskId(subtask.id);
    setCurrentSubtaskData(subtask);
    setIsAddSubtaskDialogOpen(true);
  };

  const getCropTotalExpense = (crop) => {
    // Use backend computed value
    return crop.totalExpense || 0;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Crop Cycles</h1>
          <p className="text-muted-foreground">Manage your crop cultivation cycles</p>
        </div>
        <Button onClick={() => {
          setEditingCropId(null);
          setCurrentCropData(null);
          setIsAddCropDialogOpen(true);
        }} className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Crop Cycle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cropCycles.map((crop) => (
          <CropCycleCard
            key={crop.id}
            crop={crop}
            onEdit={handleEditCropCycle}
            onDelete={handleDeleteCropCycle}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Crop Cycle Summary */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Crop Cycle Summary</h2>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Cycles</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{cropCycles.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">In Progress</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {cropCycles.filter(c => c.status === 'in-progress').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Area</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {cropCycles.reduce((sum, c) => sum + (parseFloat(c.totalArea) || 0), 0)} acres
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Expense</p>
                <p className="text-2xl font-bold text-red-500 mt-1">
                  ₹{cropCycles.reduce((sum, c) => sum + getCropTotalExpense(c), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CropCycleFormDialog
        isOpen={isAddCropDialogOpen}
        onOpenChange={setIsAddCropDialogOpen}
        onSubmit={handleAddCropCycle}
        initialData={currentCropData}
        isEditing={!!editingCropId}
      />

      <CropCycleViewDialog
        isOpen={isViewDetailsDialogOpen}
        onOpenChange={setIsViewDetailsDialogOpen}
        crop={selectedCropCycle}
        subtasks={subtasks}
        onEditCrop={handleEditCropCycle}
        onAddSubtask={() => {
          setEditingSubtaskId(null);
          setCurrentSubtaskData(null);
          setIsAddSubtaskDialogOpen(true);
        }}
        onEditSubtask={handleEditSubtask}
        onDeleteSubtask={handleDeleteSubtask}
        onToggleSubtaskStatus={handleToggleSubtaskStatus}
      />

      <SubtaskFormDialog
        isOpen={isAddSubtaskDialogOpen}
        onOpenChange={setIsAddSubtaskDialogOpen}
        onSubmit={handleAddSubtask}
        initialData={currentSubtaskData}
        isEditing={!!editingSubtaskId}
        cropName={selectedCropCycle?.cropName}
      />
    </div >
  );
}
