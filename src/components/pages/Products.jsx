"use client";

import { useState } from "react";
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

export function Products() {
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrder } = useAppContext();

  const [selectedTab, setSelectedTab] = useState("products");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isOrderDetailDialogOpen, setIsOrderDetailDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Vegetables",
    price: "",
    unit: "KG",
    quantity: "",
    status: "active",
    image: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Vegetables",
      price: "",
      unit: "KG",
      quantity: "",
      status: "active",
      image: "",
    });
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    addProduct({
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      image: formData.image || "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400",
    });

    toast.success("Product added successfully!");
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditProduct = () => {
    if (!formData.name || !formData.price || !formData.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateProduct(selectedProduct.id, {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
    });

    toast.success("Product updated successfully!");
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
    resetForm();
  };

  const openEditDialog = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      unit: product.unit,
      quantity: product.quantity.toString(),
      status: product.status,
      image: product.image,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
      toast.success("Product deleted successfully!");
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    updateOrder(orderId, { status: newStatus });
    toast.success(`Order status updated to ${newStatus}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-chart-1 text-white";
      case "inactive": return "bg-muted text-foreground";
      case "delivered": return "bg-chart-1 text-white";
      case "in-transit": return "bg-chart-4 text-white";
      case "pending": return "bg-chart-2 text-white";
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
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 shadow-lg">
          <Plus className="w-4 h-4" />
          Add New Product
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="products">My Products ({products.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders Received ({orders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          {products.length === 0 ? (
            <Card className="border-none shadow-sm">
              <CardContent className="p-12 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-bold">No Products Yet</h3>
                <p className="text-muted-foreground mb-6">Start selling by adding your first product</p>
                <Button onClick={() => setIsAddDialogOpen(true)}>Add First Product</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden border-none shadow-sm group">
                  <div className="aspect-video w-full overflow-hidden bg-muted relative">
                    <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <Badge className={`absolute top-3 right-3 ${getStatusColor(product.status)}`}>{product.status}</Badge>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</p>
                      </div>
                      <p className="text-xl font-bold text-primary">₹{product.price.toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/{product.unit}</span></p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="w-4 h-4" />
                      <span>Stock: {product.quantity} {product.unit}s</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(product)}><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-bold">#{order.id}</TableCell>
                        <TableCell>{order.buyer}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell className="text-right font-bold text-primary">₹{order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Select value={order.status} onValueChange={(val) => handleUpdateOrderStatus(order.id, val)}>
                            <SelectTrigger className="h-8 border-none bg-transparent hover:bg-muted">
                              <SelectValue><Badge className={getStatusColor(order.status)}>{order.status}</Badge></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-transit">In Transit</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedOrder(order); setIsOrderDetailDialogOpen(true); }}><Eye className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Product Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Fresh Tomatoes" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Price (₹)</Label><Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></div>
              <div className="space-y-2"><Label>Unit</Label>
                <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KG">kg</SelectItem>
                    <SelectItem value="LITRE">litre</SelectItem>
                    <SelectItem value="DOZEN">dozen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Available Stock</Label><Input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} /></div>
            <Button className="w-full mt-2" onClick={handleAddProduct}>Publish Product</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
