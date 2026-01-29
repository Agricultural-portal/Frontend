import { useState, useEffect } from "react";
import { toast } from "sonner";
import { taskService } from "@/services/taskService";
import { useAppContext } from "@/lib/AppContext";
import { TaskCard } from "../farmer/TaskCard";
import { TaskFormDialog } from "../farmer/TaskFormDialog";
import { TaskViewDialog } from "../farmer/TaskViewDialog";
import { TaskFilters } from "../farmer/TaskFilters";

export function Tasks() {
  const { currentUser, cropCycles } = useAppContext();
  const farmerId = currentUser?.id || 1; // Fallback to 1 for dev if not logged in
  const [selectedTab, setSelectedTab] = useState("All Tasks");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, [farmerId, selectedTab]);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getAllTasks();
      const mappedTasks = data.map(t => ({
        ...t,
        title: t.name,
        cost: t.expense || 0,
      }));
      setAllTasks(mappedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    cropCycle: "",
    startDate: "",
    dueDate: "",
    priority: "medium",
    cost: "0",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "General",
      cropCycle: "",
      startDate: "",
      dueDate: "",
      priority: "medium",
      cost: "0",
    });
    setEditingId(null);
  };

  const handleEditClick = (task) => {
    setFormData({
      title: task.title,
      description: task.description || "",
      category: task.category === "Crop Cycle" ? "Crop Cycle" : "General",
      cropCycle: task.cropCycleId?.toString() || "",
      startDate: task.startDate || "",
      dueDate: task.dueDate,
      priority: task.priority,
      cost: task.cost.toString(),
    });
    setEditingId(task.id);
    setIsFormOpen(true);
  };

  const handleCreateNewClick = () => {
    resetForm();
    setIsFormOpen(true);
  }

  const handleSaveTask = async () => {
    if (!formData.title.trim() || !formData.dueDate) {
      toast.error("Please provide title and due date");
      return;
    }

    const start = new Date(formData.startDate || new Date().toISOString().split('T')[0]);
    const due = new Date(formData.dueDate);

    if (due <= start) {
      toast.error("Due Date must be greater than Start Date");
      return;
    }

    const payload = {
      name: formData.title,
      description: formData.description,
      category: formData.category,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      priority: formData.priority,
      priority: formData.priority,
      // estimatedCost: parseFloat(formData.cost) || 0,
      expense: parseFloat(formData.cost) || 0,
      cropCycleId: formData.cropCycle ? parseInt(formData.cropCycle) : null,
      status: "pending"
    };

    try {
      if (editingId) {
        await taskService.updateTask(editingId, payload);
        toast.success("Task updated!");
      } else {
        await taskService.createTask(payload);
        toast.success("Task created!");
      }
      fetchTasks();
      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
    }
  };

  const handleMarkComplete = async (id) => {
    try {
      await taskService.completeTask(id);
      fetchTasks();
      toast.success("Task marked as complete!");
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to mark task as complete");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      fetchTasks();
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const filteredTasks = allTasks.filter(t => {
    const matchesTab =
      selectedTab === "All Tasks" ? (t.status?.toLowerCase() !== 'deleted') :
        selectedTab === "Completed" ? t.status?.toLowerCase() === "completed" :
          selectedTab === "General" ? (t.category === "General" && t.status?.toLowerCase() !== 'deleted') :
            selectedTab === "Crop Cycle" ? ((t.category === "Crop Cycle" || t.category === "Crop_Cycle") && t.status?.toLowerCase() !== 'deleted') : true;

    return matchesTab;
  });

  const tabs = ["All Tasks", "General", "Crop Cycle", "Completed"];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your farm tasks and activities</p>
        </div>

        <TaskFormDialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) resetForm();
          }}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSaveTask}
          isEditing={!!editingId}
          cropCycles={cropCycles}
        />
      </div>

      {/* Tabs */}
      <TaskFilters
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onView={() => setViewingTask(task)}
            onEdit={handleEditClick}
            onComplete={handleMarkComplete}
            onDelete={handleDeleteTask}
          />
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>No tasks found matching your filters.</p>
          </div>
        )}
      </div>

      {/* View Task Dialog */}
      <TaskViewDialog
        task={viewingTask}
        open={!!viewingTask}
        onOpenChange={(open) => !open && setViewingTask(null)}
        onEdit={handleEditClick}
      />

    </div>
  );
}

