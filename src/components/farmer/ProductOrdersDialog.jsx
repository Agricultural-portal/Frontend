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
import { Loader2 } from "lucide-react";
import { orderService } from "@/services/orderService";
import { format } from "date-fns";

export function ProductOrdersDialog({ open, onOpenChange, product }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && product?.id) {
            loadOrders();
        }
    }, [open, product]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await orderService.getOrdersByProduct(product.id);
            setOrders(data);
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
            case "delivered":
                return "bg-green-500 hover:bg-green-600";
            case "pending":
                return "bg-yellow-500 hover:bg-yellow-600";
            case "cancelled":
                return "bg-red-500 hover:bg-red-600";
            case "shipped":
            case "in-transit":
                return "bg-blue-500 hover:bg-blue-600";
            default:
                return "bg-gray-500 hover:bg-gray-600";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Orders for {product?.name}</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        View all orders for this product
                    </p>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                        No orders found for this product.
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Buyer</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">#{item.orderId}</TableCell>
                                        <TableCell>{item.buyerName || "Unknown"}</TableCell>
                                        <TableCell>{item.quantity} {item.productUnit || "Unit"}</TableCell>
                                        <TableCell>
                                            {item.orderDate
                                                ? format(new Date(item.orderDate), "yyyy-MM-dd")
                                                : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(item.status)}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ₹{item.totalAmount?.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
