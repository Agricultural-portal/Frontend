import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getStatusColor, getPriorityColor } from "./taskUtils";

export function TaskViewDialog({ task, open, onOpenChange, onEdit }) {
    if (!task) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Task Details</DialogTitle>
                    <DialogDescription>View complete task information</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div>
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Task Title</Label>
                        <p className="text-lg font-medium text-slate-800 mt-1">{task.title}</p>
                    </div>

                    {task.description && (
                        <div>
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Description</Label>
                            <p className="text-base text-slate-600 mt-1 whitespace-pre-wrap">{task.description}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Category</Label>
                            <div className="mt-1">
                                <Badge variant="outline" className="text-slate-600 border-slate-200">
                                    {task.category}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Status</Label>
                            <div className="mt-1">
                                <Badge variant="secondary" className={cn("rounded-md px-2.5 py-0.5", getStatusColor(task.status))}>
                                    {task.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {task.cropCycle && (
                        <div>
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Related Crop Cycle</Label>
                            <p className="text-base text-slate-700 mt-1">{task.cropCycle}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Due Date</Label>
                            <p className="text-base text-slate-700 mt-1">{task.dueDate}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Priority</Label>
                            <div className="mt-1">
                                <Badge className={cn("rounded-md px-2.5 py-0.5 border-none", getPriorityColor(task.priority))}>
                                    {task.priority} priority
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Estimated Cost</Label>
                        <p className="text-lg font-bold text-slate-700 mt-1">₹{task.cost.toLocaleString()}</p>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                                onOpenChange(false);
                                onEdit(task);
                            }}
                        >
                            Edit Task
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
