"use client";

import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Plus, Eye, Edit, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { mockTasks, mockCropCycles } from "@/lib/mockData";
import { toast } from "sonner";

export function Tasks() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [allTasks, setAllTasks] = useState(mockTasks);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    dueDate: "",
    priority: "medium",
    cost: "0",
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-chart-1 text-white";
      case "in-progress": return "bg-chart-4 text-white";
      default: return "bg-muted text-foreground";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-chart-5 text-white";
      case "medium": return "bg-chart-4 text-white";
      default: return "bg-chart-2 text-white";
    }
  };

  const handleCreateTask = () => {
    if (!formData.title.trim() || !formData.dueDate) {
      toast.error("Please provide title and due date");
      return;
    }

    const newTask = {
      id: Math.max(0, ...allTasks.map(t => t.id)) + 1,
      ...formData,
      status: "pending",
      progress: 0,
      cost: parseFloat(formData.cost) || 0,
    };

    setAllTasks([newTask, ...allTasks]);
    setIsAddDialogOpen(false);
    toast.success("Task created!");
  };

  const handleMarkComplete = (id) => {
    setAllTasks(allTasks.map(t => t.id === id ? { ...t, status: "completed", progress: 100 } : t));
    toast.success("Task completed!");
  };

  const filteredTasks = allTasks.filter(t => {
    if (selectedTab === "all") return true;
    if (selectedTab === "completed") return t.status === "completed";
    return t.category.toLowerCase() === selectedTab;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground">Stay organized with your farm activities</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg"><Plus className="w-4 h-4" /> New Task</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Task Title</Label><Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} /></div>
                <div className="space-y-2"><Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={v => setFormData({ ...formData, priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={handleCreateTask}>Save Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="completed">Completed</TabsTrigger></TabsList>
        <div className="mt-6 space-y-4">
          {filteredTasks.map(task => (
            <Card key={task.id} className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{task.title}</h3>
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                  {task.status !== "completed" && <Progress value={task.progress} className="h-1.5 w-1/2" />}
                </div>
                <div className="flex gap-2">
                  {task.status !== "completed" && <Button size="sm" onClick={() => handleMarkComplete(task.id)}><CheckCircle2 className="w-4 h-4 mr-2" /> Complete</Button>}
                  <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
