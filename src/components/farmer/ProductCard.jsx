import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, Package } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function ProductCard({ product, onEdit, onDelete, onViewOrders }) {
    return (
        <Card className="overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group bg-white rounded-xl">
            {/* Image Section */}
            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                <ImageWithFallback
                    src={product.imageUrl || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                    <Badge
                        className={`
                    ${product.status === 'AVAILABLE' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-700'}
                    border-none px-2.5 py-0.5 font-medium
                `}
                    >
                        {product.status === 'AVAILABLE' ? 'Available' : (product.status === 'OUT_OF_STOCK' ? 'Out of Stock' : product.status)}
                    </Badge>
                </div>
            </div>

            {/* Content Section */}
            <CardContent className="p-5 space-y-4">
                <div className="space-y-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 leading-tight">{product.name}</h3>
                            <p className="text-sm text-slate-500">{product.category}</p>
                        </div>
                    </div>
                    <div className="pt-2">
                        <p className="text-xl font-bold text-slate-800">
                            ₹{product.price.toLocaleString()}
                            <span className="text-sm text-slate-400 font-normal ml-1">/ {product.unit}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span>Available: <span className="font-semibold text-slate-800">{product.stock || product.quantity} {product.unit}s</span></span>
                </div>
            </CardContent>

            {/* Action Buttons */}
            <CardFooter className="p-5 pt-0 flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-200 text-slate-600 hover:text-green-700 hover:border-green-200 hover:bg-green-50"
                    onClick={() => onEdit(product)}
                >
                    <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-200 text-slate-600 hover:text-green-700 hover:border-green-200 hover:bg-green-50"
                    onClick={() => onViewOrders && onViewOrders(product)}
                >
                    <Eye className="w-4 h-4 mr-2" /> Orders
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="px-3 border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                    onClick={() => onDelete(product.id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
