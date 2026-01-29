import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

export function TaskFormDialog({
    open,
    onOpenChange,
    formData,
    setFormData,
    onSubmit,
    isEditing,
    cropCycles
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6">
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Task
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Task" : "Add New Task"}</DialogTitle>
                    <DialogDescription>{isEditing ? "Update task information" : "Create a new task for your farm management"}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Task Title</Label>
                        <Input
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter task title"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter task description"
                            className="resize-none h-24"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={v => setFormData({
                                    ...formData,
                                    category: v,
                                    cropCycle: v === "General" ? "" : formData.cropCycle
                                })}
                            >
                                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="General">General</SelectItem>
                                    <SelectItem value="Crop Cycle">Crop Cycle</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Crop Cycle (if applicable)</Label>
                            <Select
                                value={formData.cropCycle}
                                onValueChange={v => setFormData({ ...formData, cropCycle: v })}
                                disabled={formData.category !== "Crop Cycle"}
                            >
                                <SelectTrigger><SelectValue placeholder="Select crop cycle" /></SelectTrigger>
                                <SelectContent>
                                    {cropCycles.map(cycle => (
                                        <SelectItem key={cycle.id} value={cycle.id.toString()}>{cycle.cropName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                                type="date"
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Input
                                type="date"
                                value={formData.dueDate}
                                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Expense (₹)</Label>
                            <Input
                                type="number"
                                value={formData.cost}
                                onChange={e => setFormData({ ...formData, cost: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={formData.priority} onValueChange={v => setFormData({ ...formData, priority: v })}>
                                <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={onSubmit}>
                            {isEditing ? "Update Task" : "Create Task"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
