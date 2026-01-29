import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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
import { useEffect, useState } from "react";

export function SubtaskFormDialog({ isOpen, onOpenChange, onSubmit, initialData, isEditing, cropName }) {
    const [formData, setFormData] = useState({
        taskTitle: "",
        description: "",
        dueDate: "",
        priority: "medium",
        expense: "",
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    taskTitle: initialData.taskTitle || "",
                    description: initialData.description || "",
                    dueDate: initialData.dueDate || "",
                    priority: initialData.priority?.toLowerCase() || "medium",
                    expense: initialData.expense || "",
                });
            } else {
                setFormData({
                    taskTitle: "",
                    description: "",
                    dueDate: "",
                    priority: "medium",
                    expense: "",
                });
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Subtask" : "Add New Subtask"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update subtask details" : `Add a subtask to ${cropName}`}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="subtask-title">Title</Label>
                        <Input
                            id="subtask-title"
                            value={formData.taskTitle}
                            onChange={(e) => setFormData({ ...formData, taskTitle: e.target.value })}
                            placeholder="e.g., Apply Fertilizer"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subtask-desc">Description</Label>
                        <Textarea
                            id="subtask-desc"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Task details..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="subtask-date">Due Date</Label>
                            <Input
                                id="subtask-date"
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subtask-priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => setFormData({ ...formData, priority: value })}
                            >
                                <SelectTrigger id="subtask-priority">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subtask-expense">Expense (₹)</Label>
                        <Input
                            id="subtask-expense"
                            type="number"
                            value={formData.expense}
                            onChange={(e) => setFormData({ ...formData, expense: e.target.value })}
                            placeholder="0.00"
                        />
                    </div>
                    <Button onClick={handleSubmit} className="w-full">
                        {isEditing ? "Update Subtask" : "Add Subtask"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
