import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X, Loader2 } from "lucide-react";

export function ProductFormDialog({ open, onOpenChange, onSubmit, initialData = null }) {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        category: initialData?.category || "VEGETABLES",
        price: initialData?.price?.toString() || "",
        unit: initialData?.unit || "KG",
        stock: initialData?.quantity?.toString() || initialData?.stock?.toString() || "",
        status: initialData?.status || "active", // Required by backend DTO if part of it, but mostly managed by availability
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(initialData?.image || initialData?.imageUrl || null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = (e) => {
        e.stopPropagation();
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async () => {
        // Basic validation
        if (!formData.name || !formData.price || !formData.stock) {
            // You might want to show a toast here
            return;
        }

        setLoading(true);
        try {
            const submissionData = new FormData();
            // Backend expects 'product' part as JSON and 'image' part as File

            const productDto = {
                name: formData.name,
                description: "", // Add if needed
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                unit: formData.unit.toUpperCase(), // Ensure enum match
                category: formData.category.toUpperCase() // Ensure enum match
            };

            submissionData.append("product", new Blob([JSON.stringify(productDto)], { type: "application/json" }));

            if (imageFile) {
                submissionData.append("image", imageFile);
            }

            await onSubmit(submissionData);
            onOpenChange(false);
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Product" : "Add New Product"}</DialogTitle>
                    <p className="text-sm text-slate-500">
                        {initialData ? "Make changes to your product" : "Add a new product to your inventory"}
                    </p>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Product Name */}
                    <div className="space-y-2">
                        <Label>Product Name <span className="text-red-500">*</span></Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Organic Wheat"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label>Category <span className="text-red-500">*</span></Label>
                        <Select
                            value={formData.category}
                            onValueChange={(v) => setFormData({ ...formData, category: v })}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="VEGETABLES">Vegetables</SelectItem>
                                <SelectItem value="FRUITS">Fruits</SelectItem>
                                <SelectItem value="GRAINS">Grains</SelectItem>
                                <SelectItem value="DAIRY">Dairy</SelectItem>
                                <SelectItem value="OTHERS">Others</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Price and Unit */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Price (₹) <span className="text-red-500">*</span></Label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Unit <span className="text-red-500">*</span></Label>
                            <Select
                                value={formData.unit}
                                onValueChange={(v) => setFormData({ ...formData, unit: v })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="KG">Kg</SelectItem>
                                    <SelectItem value="LITRES">Litres</SelectItem>
                                    <SelectItem value="DOZENS">Dozens</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label>Quantity Available <span className="text-red-500">*</span></Label>
                        <Input
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        />
                    </div>

                    {/* Status - Optional/Hidden if just Active */}

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Product Image</Label>

                        <div
                            className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors relative h-40"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />

                            {imagePreview ? (
                                <>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-full w-full object-contain rounded-lg"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-slate-700 rounded-full h-8 w-8 shadow-sm"
                                        onClick={clearImage}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                    <div className="bg-slate-100 p-3 rounded-full">
                                        <Upload className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <div className="text-xs">
                                        <span className="font-medium text-slate-600">Click to upload</span> or drag and drop
                                    </div>
                                    <p className="text-xs text-slate-400">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        {initialData ? "Update Product" : "Add Product"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
