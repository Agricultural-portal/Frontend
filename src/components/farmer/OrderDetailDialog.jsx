import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, MapPin, Calendar, CreditCard } from "lucide-react";
import { orderService } from "@/services/orderService";
import { format } from "date-fns";

export function OrderDetailDialog({ open, onOpenChange, order }) {
    const [fullOrder, setFullOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && order?.id) {
            loadOrderDetails();
        } else {
            setFullOrder(null);
        }
    }, [open, order]);

    const loadOrderDetails = async () => {
        setLoading(true);
        try {
            // Fetch the full order details using the ID from the partial order object
            const data = await orderService.getOrderById(order.id);
            setFullOrder(data);
        } catch (error) {
            console.error("Failed to load order details", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case "DELIVERED": return "bg-green-500 hover:bg-green-600";
            case "PENDING": return "bg-yellow-500 hover:bg-yellow-600";
            case "CANCELLED": return "bg-red-500 hover:bg-red-600";
            default: return "bg-gray-500 hover:bg-gray-600";
        }
    };

    if (!order) return null;

    // Use fullDetails if available, otherwise fallback to the partial order prop
    const displayOrder = fullOrder || order;

    // Items list is ONLY available in fullOrder
    const items = fullOrder?.items || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pr-8">
                    <DialogTitle className="text-xl flex items-center justify-between">
                        <span>Order #{displayOrder.id}</span>
                        <Badge className={`ml-4 ${getStatusColor(displayOrder.status)}`}>
                            {displayOrder.status}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Order Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                                <h3 className="font-semibold text-sm text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Customer Details
                                </h3>
                                <p className="font-medium text-lg">{displayOrder.user?.fullName || "Guest User"}</p>
                                <p className="text-slate-500 text-sm">{displayOrder.user?.email}</p>
                                <p className="text-slate-500 text-sm mt-1">{displayOrder.user?.phone || "No phone provided"}</p>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                                <h3 className="font-semibold text-sm text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Shipping Address
                                </h3>
                                <p className="text-sm leading-relaxed">{displayOrder.shippingAddress || "No shipping address provided"}</p>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                                <h3 className="font-semibold text-sm text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Order Date
                                </h3>
                                <p className="text-lg font-medium">
                                    {displayOrder.createdAt ? format(new Date(displayOrder.createdAt), "PPP") : "N/A"}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {displayOrder.createdAt ? format(new Date(displayOrder.createdAt), "p") : ""}
                                </p>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                                <h3 className="font-semibold text-sm text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> Payment Info
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Status</span>
                                    <Badge variant={displayOrder.paymentStatus === 'PAID' ? 'success' : 'outline'}
                                        className={displayOrder.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700 border-none' : ''}>
                                        {displayOrder.paymentStatus || 'UNPAID'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-slate-500">Total Amount</span>
                                    <span className="font-bold text-lg">₹{displayOrder.totalAmount?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Items Table */}
                        <div className="border rounded-lg overflow-hidden">
                            <div className="bg-slate-50 p-3 border-b flex items-center justify-between">
                                <h3 className="font-semibold">Order Items ({items.length})</h3>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.length > 0 ? (
                                        items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <p className="font-medium">{item.product?.name || "Unknown Product"}</p>
                                                        <p className="text-xs text-slate-500">{item.product?.category}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>₹{item.priceAtPurchase?.toLocaleString()}</TableCell>
                                                <TableCell>{item.quantity} {item.product?.unit}</TableCell>
                                                <TableCell className="text-right font-bold">
                                                    ₹{((item.priceAtPurchase || 0) * (item.quantity || 0)).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                No items found in this order.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
