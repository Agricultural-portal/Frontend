import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Eye, Trash2 } from "lucide-react";

export function CropCycleCard({ crop, onEdit, onDelete, onViewDetails }) {
    const getStatusColor = (status) => {
        const s = status?.toUpperCase();
        if (s === "COMPLETED") return "bg-green-600 text-white hover:bg-green-700";
        if (s === "IN_PROGRESS" || s === "IN-PROGRESS") return "bg-blue-600 text-white hover:bg-blue-700";
        if (s === "PENDING") return "bg-yellow-500 text-white hover:bg-yellow-600";
        return "bg-slate-500 text-white";
    };

    const getCropTotalExpense = (crop) => {
        return crop.totalExpense || 0;
    };

    return (
        <Card className="overflow-hidden border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <div className="bg-[#f0fdf4] p-5 border-b border-[#dcfce7]">
                <div className="flex items-start justify-between mb-1">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{crop.cropName}</h3>
                        <p className="text-sm text-slate-500 font-medium">{crop.variety}</p>
                    </div>
                    <div className="flex gap-2">
                        <Badge className={`${getStatusColor(crop.status)} px-3 py-1`}>{crop.status}</Badge>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-400 hover:text-red-500 hover:bg-red-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(crop.id);
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <CardContent className="p-5 space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-slate-500 w-24">Sowing:</span>
                        <span className="font-semibold text-slate-700">{crop.sowingDate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-slate-500 w-24">Expected Harvest:</span>
                        <span className="font-semibold text-slate-700">{crop.expectedHarvestDate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-slate-500 w-24">Total Area:</span>
                        <span className="font-semibold text-slate-700">{crop.totalArea} acres</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Total Expense</span>
                        <span className="font-semibold text-red-500">₹{getCropTotalExpense(crop).toLocaleString()}</span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="w-full gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-300 transition-colors"
                    onClick={() => onViewDetails(crop)}
                >
                    <Eye className="w-4 h-4" />
                    View Details & Subtasks
                </Button>
            </CardContent>
        </Card>
    );
}
