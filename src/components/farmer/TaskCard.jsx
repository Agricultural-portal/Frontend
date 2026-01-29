import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusColor, getPriorityColor } from "./taskUtils";

export function TaskCard({ task, onView, onEdit, onComplete, onDelete }) {
    return (
        <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden bg-white">
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Left Section: Title & Badges */}
                    <div className="lg:w-1/3 space-y-3">
                        <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-lg text-slate-800 leading-tight">{task.title}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className={cn("rounded-md px-2.5 py-0.5", getStatusColor(task.status))}>
                                {task.status}
                            </Badge>
                            <Badge variant="outline" className="text-slate-600 border-slate-200">
                                {task.category}
                            </Badge>
                            <Badge className={cn("rounded-md px-2.5 py-0.5 border-none", getPriorityColor(task.priority))}>
                                {task.priority} priority
                            </Badge>
                        </div>
                    </div>

                    {/* Middle Section: Details & Progress */}
                    <div className="lg:w-1/3 space-y-4">
                        {task.cropCycle && (
                            <div className="text-sm text-slate-500">
                                Related to: <span className="text-slate-700 font-medium">{task.cropCycle}</span>
                            </div>
                        )}
                        <div className="text-sm text-slate-500">
                            Due Date: <span className="text-slate-700">{task.dueDate}</span>
                        </div>
                    </div>

                    {/* Right Section: Cost & Actions */}
                    <div className="lg:w-1/3 flex flex-col items-end justify-between gap-4">
                        <div className="text-right">
                            <span className="text-xl font-bold text-slate-700">₹{(task.cost || 0).toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-2 w-full lg:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 lg:flex-none border-slate-200 text-slate-600 hover:bg-slate-50"
                                onClick={() => onView(task)}
                            >
                                <Eye className="w-4 h-4 mr-2" /> View
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 lg:flex-none border-slate-200 text-slate-600 hover:bg-slate-50"
                                onClick={() => onEdit(task)}
                            >
                                <Pencil className="w-4 h-4 mr-2" /> Edit
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 lg:flex-none border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => onDelete && onDelete(task.id)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 w-4 h-4 mr-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                Delete
                            </Button>
                            {task.status?.toLowerCase() !== "completed" ? (
                                <Button
                                    size="sm"
                                    className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => onComplete(task.id)}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Complete
                                </Button>
                            ) : (
                                <Button size="sm" disabled className="flex-1 lg:flex-none bg-slate-100 text-slate-400">
                                    Completed
                                </Button>
                            )}
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
