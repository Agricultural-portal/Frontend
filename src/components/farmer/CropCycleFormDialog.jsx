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
import { useEffect, useState } from "react";

export function CropCycleFormDialog({ isOpen, onOpenChange, onSubmit, initialData, isEditing }) {
    const [formData, setFormData] = useState({
        cropName: "",
        variety: "",
        sowingDate: "",
        expectedHarvestDate: "",
        totalArea: "",
        status: "in-progress",
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    cropName: initialData.cropName || "",
                    variety: initialData.variety || "",
                    sowingDate: initialData.sowingDate || "",
                    expectedHarvestDate: initialData.expectedHarvestDate || "",
                    totalArea: initialData.totalArea || "",
                    status: initialData.status || "in-progress",
                });
            } else {
                setFormData({
                    cropName: "",
                    variety: "",
                    sowingDate: "",
                    expectedHarvestDate: "",
                    totalArea: "",
                    status: "in-progress",
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
                    <DialogTitle>{isEditing ? "Edit Crop Cycle" : "Add New Crop Cycle"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update existing crop cycle details" : "Create a new crop cultivation cycle"}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="crop-name">Crop Name</Label>
                        <Input
                            id="crop-name"
                            value={formData.cropName}
                            onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                            placeholder="e.g., Winter Wheat 2025"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="variety">Variety</Label>
                        <Input
                            id="variety"
                            value={formData.variety}
                            onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                            placeholder="e.g., HD-2967"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="sowing-date">Sowing Date</Label>
                            <Input
                                id="sowing-date"
                                type="date"
                                value={formData.sowingDate}
                                onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="harvest-date">Expected Harvest</Label>
                            <Input
                                id="harvest-date"
                                type="date"
                                value={formData.expectedHarvestDate}
                                onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="area">Total Area (acres)</Label>
                        <Input
                            id="area"
                            type="number"
                            value={formData.totalArea}
                            onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                            placeholder="e.g., 5"
                        />
                    </div>
                    <Button className="w-full shadow-lg" onClick={handleSubmit}>
                        {isEditing ? "Update Crop Cycle" : "Create Crop Cycle"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
