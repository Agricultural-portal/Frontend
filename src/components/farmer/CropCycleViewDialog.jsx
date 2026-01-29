import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Plus, CheckCircle2, Circle } from "lucide-react";

export function CropCycleViewDialog({
    isOpen,
    onOpenChange,
    crop,
    subtasks,
    onEditCrop,
    onAddSubtask,
    onEditSubtask,
    onDeleteSubtask,
    onToggleSubtaskStatus
}) {
    if (!crop) return null;

    const getStatusColor = (status) => {
        const s = status?.toUpperCase();
        if (s === "COMPLETED") return "bg-green-600 text-white hover:bg-green-700";
        if (s === "IN_PROGRESS" || s === "IN-PROGRESS") return "bg-blue-600 text-white hover:bg-blue-700";
        if (s === "PENDING") return "bg-yellow-500 text-white hover:bg-yellow-600";
        return "bg-slate-500 text-white";
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high": return "bg-chart-5 text-white";
            case "medium": return "bg-chart-4 text-white";
            case "low": return "bg-chart-2 text-white";
            default: return "bg-secondary";
        }
    };

    const getCropTotalExpense = (crop) => {
        return crop.totalExpense || 0;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 pb-2 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <DialogTitle className="text-2xl font-bold text-slate-800">
                                    {crop.cropName}
                                </DialogTitle>
                                <Badge className={getStatusColor(crop.status)}>
                                    {crop.status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground font-medium">
                                {crop.variety}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => {
                                    onEditCrop(crop);
                                    onOpenChange(false);
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-pencil"
                                >
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                </svg>
                                Edit
                            </Button>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Crop Details Card */}
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">
                                Crop Details
                            </h3>

                            <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-8">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Sowing Date</p>
                                    <p className="font-semibold text-slate-800">
                                        {crop.sowingDate}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">
                                        Expected Harvest
                                    </p>
                                    <p className="font-semibold text-slate-800">
                                        {crop.expectedHarvestDate}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Total Area</p>
                                    <p className="font-semibold text-slate-800">
                                        {crop.totalArea} acres
                                    </p>
                                </div>
                            </div>

                            {/* Financials Row */}
                            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Total Expense</p>
                                    <p className="text-xl font-bold text-red-500">
                                        ₹{getCropTotalExpense(crop).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Subtasks Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-slate-600">
                                    Subtasks ({subtasks.length})
                                </h3>
                                {crop.status?.toLowerCase() !== "completed" && (
                                    <Button
                                        size="sm"
                                        onClick={onAddSubtask}
                                        className="bg-green-600 hover:bg-green-700 text-white gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Add Subtask
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-3">
                                {subtasks.map((subtask) => (
                                    <div
                                        key={subtask.id}
                                        className="group flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
                                    >
                                        <button
                                            className="mt-1 disabled:cursor-not-allowed"
                                            onClick={() => onToggleSubtaskStatus(subtask.id)}
                                            disabled={crop.status?.toLowerCase() === "completed"}
                                        >
                                            {subtask.status === "completed" ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <Circle
                                                    className={`w-5 h-5 text-slate-300 transition-colors ${crop.status?.toLowerCase() !== "completed"
                                                            ? "group-hover:text-green-600"
                                                            : ""
                                                        }`}
                                                />
                                            )}
                                        </button>

                                        <div className="flex-1 space-y-2">
                                            <div>
                                                <h4
                                                    className={`font-semibold text-slate-800 ${subtask.status === "completed"
                                                            ? "line-through text-slate-500"
                                                            : ""
                                                        }`}
                                                >
                                                    {subtask.taskTitle}
                                                </h4>
                                                <p className="text-sm text-slate-500 line-clamp-1">
                                                    {subtask.description}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                {subtask.status === "completed" && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 rounded-md"
                                                    >
                                                        completed
                                                    </Badge>
                                                )}
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        getPriorityColor(subtask.priority) +
                                                        " border-none px-2 rounded-md"
                                                    }
                                                >
                                                    {subtask.priority}
                                                </Badge>
                                                <div className="flex items-center text-xs text-slate-500 ml-1">
                                                    <Calendar className="w-3.5 h-3.5 mr-1" />
                                                    {subtask.dueDate}
                                                </div>
                                                <div className="text-xs font-medium text-slate-700 ml-2">
                                                    Expense: ₹{subtask.expense?.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        {crop.status?.toLowerCase() !== "completed" && (
                                            <div className="flex flex-col gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onDeleteSubtask(subtask.id)}
                                                    className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onEditSubtask(subtask)}
                                                    className="text-slate-400 hover:text-blue-500 hover:bg-blue-50"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-pencil"
                                                    >
                                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                        <path d="m15 5 4 4" />
                                                    </svg>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {subtasks.length === 0 && (
                                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500">
                                        <p>No subtasks yet. Add one to get started!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
