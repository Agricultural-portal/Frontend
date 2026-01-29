"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Edit, Eye, Package, Plus, Trash2 } from "lucide-react";
import { useAppContext } from "@/lib/AppContext";
import { toast } from "sonner";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ProductCard } from "../farmer/ProductCard";
import { ProductFormDialog } from "../farmer/ProductFormDialog";
import { ProductOrdersDialog } from "../farmer/ProductOrdersDialog";
import { OrderDetailDialog } from "../farmer/OrderDetailDialog";
import { productService } from "@/services/productService";

export function Products() {
  const { updateOrder, currentUser } = useAppContext();
  // Fallback farmer ID if not logged in (for dev)
  const farmerId = currentUser?.id || 1;

  const [myProducts, setMyProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]); // Local state for orders
  const [selectedTab, setSelectedTab] = useState("products");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isOrderDetailDialogOpen, setIsOrderDetailDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [selectedProductForOrders, setSelectedProductForOrders] = useState(null);
  const [isProductOrdersOpen, setIsProductOrdersOpen] = useState(false);

  // Fetch products and orders on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await productService.getProducts();
        setMyProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products");
      }

      try {
        const ordersData = await orderService.getOrders();
        setMyOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders");
      }
    };

    fetchData();
  }, [currentUser]); // Refetch if user changes

  const handleOpenProductOrders = (product) => {
    setSelectedProductForOrders(product);
    setIsProductOrdersOpen(true);
  };


  const handleAddProduct = async (submissionData) => {
    try {
      const newProduct = await productService.addProduct(submissionData);
      setMyProducts([...myProducts, newProduct]);
      toast.success("Product added successfully!");
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    }
  };

  const handleEditProduct = async (submissionData) => {
    if (!selectedProduct) return;

    try {
      const updatedProduct = await productService.updateProduct(selectedProduct.id, submissionData);
      setMyProducts(myProducts.map(p => p.id === selectedProduct.id ? updatedProduct : p));
      toast.success("Product updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    }
  };

  const openEditDialog = (product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(productId);
        setMyProducts(myProducts.filter(p => p.id !== productId));
        toast.success("Product deleted successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete product");
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setMyOrders(myOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    try {
      await orderService.updatePaymentStatus(orderId, newStatus);
      setMyOrders(myOrders.map(o => o.id === orderId ? { ...o, paymentStatus: newStatus } : o));
      toast.success(`Payment status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update payment status");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED": return "bg-blue-500 text-white hover:bg-blue-600";
      case "SHIPPED": return "bg-chart-4 text-white hover:bg-chart-4/90";
      case "DELIVERED": return "bg-green-500 text-white hover:bg-green-600";
      case "PENDING": return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "CANCELLED": return "bg-red-500 text-white hover:bg-red-600";
      default: return "bg-muted text-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Products & Orders</h1>
          <p className="text-muted-foreground">Manage your products and track orders</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 shadow-lg bg-green-600 hover:bg-green-700 text-white rounded-lg px-6">
          <Plus className="w-5 h-5 mr-2" />
          Add New Product
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="products">My Products ({myProducts.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders Received ({myOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          {myProducts.length === 0 ? (
            <Card className="border-none shadow-sm">
              <CardContent className="p-12 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-bold">No Products Yet</h3>
                <p className="text-muted-foreground mb-6">Start selling by adding your first product</p>
                <Button onClick={() => setIsAddDialogOpen(true)}>Add First Product</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteProduct}
                  onViewOrders={() => handleOpenProductOrders(product)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          {myOrders.length === 0 ? (
            <Card className="border-none shadow-sm">
              <CardContent className="p-12 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-bold">No Orders Yet</h3>
                <p className="text-muted-foreground mb-6">Orders placed by buyers will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Total Amount</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myOrders.map((item) => (
                        <TableRow key={item.orderItemId || item.id}>
                          <TableCell className="font-bold">#{item.orderId}</TableCell>
                          <TableCell>{item.buyerName || "Unknown Buyer"}</TableCell>
                          <TableCell>{item.productName || "Unknown Product"}</TableCell>
                          <TableCell>{item.quantity} {item.productUnit || "Unit"}</TableCell>
                          <TableCell>{item.orderDate ? new Date(item.orderDate).toLocaleDateString() : "N/A"}</TableCell>
                          <TableCell>
                            <Select value={item.status} onValueChange={(val) => handleUpdateOrderStatus(item.orderId, val)}>
                              <SelectTrigger className="h-8 border-none bg-transparent hover:bg-muted p-0">
                                <SelectValue><Badge className={getStatusColor(item.status)}>{item.status}</Badge></SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                <SelectItem value="SHIPPED">Shipped</SelectItem>
                                <SelectItem value="DELIVERED">Delivered</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select value={item.paymentStatus || 'PENDING'} onValueChange={(val) => handleUpdatePaymentStatus(item.orderId, val)}>
                              <SelectTrigger className={`h-8 border-none p-0 ${item.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>
                                <SelectValue>
                                  <Badge variant={item.paymentStatus === 'PAID' ? 'success' : 'destructive'}
                                    className={item.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none' : 'bg-red-100 text-red-700 hover:bg-red-200 border-none'}>
                                    {item.paymentStatus || 'UNPAID'}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right font-bold text-primary">₹{item.totalAmount?.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedOrder(item); setIsOrderDetailDialogOpen(true); }}><Eye className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <ProductFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddProduct}
      />

      <ProductFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditProduct}
        initialData={selectedProduct}
        key={selectedProduct?.id} // Force re-render when product changes
      />

      <ProductOrdersDialog
        open={isProductOrdersOpen}
        onOpenChange={setIsProductOrdersOpen}
        product={selectedProductForOrders}
      />

      <OrderDetailDialog
        open={isOrderDetailDialogOpen}
        onOpenChange={setIsOrderDetailDialogOpen}
        order={selectedOrder}
      />
    </div >
  );
}
