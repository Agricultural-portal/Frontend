"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { API_BASE_URL } from "@/services/config";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ShoppingCart, Trash2, Plus, Minus, PackageCheck, CreditCard, MapPin } from "lucide-react";
import { toast } from "sonner";

export function MyCart() {
  const { cart, removeFromCart, updateCartItem, clearCart, addOrder, addNotification, currentUser, fetchOrdersFromBackend, fetchDashboardStatsFromBackend } = useAppContext();
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: `${currentUser?.firstName} ${currentUser?.lastName}` || "John Smith",
    email: currentUser?.email || "john.smith@email.com",
    phone: "+91 98765 43210",
    address: "123 Main Street, City",
  });

  const [selectedItems, setSelectedItems] = useState([]);

  // Sync selected items with cart updates (select new ones by default or maintain selection)
  // For simplicity, we can select all initially, or let use select. 
  // Let's select all by default when cart loads to be user friendly.
  useState(() => {
    // Intentionally not using useEffect to avoid constant resetting on quantity change if not careful.
    // But standard way:
  });

  // Actually, we can just use useEffect to set initial selection
  const [isSelectionInitialized, setIsSelectionInitialized] = useState(false);
  if (cart.length > 0 && !isSelectionInitialized) {
    setSelectedItems(cart.map(i => i.id));
    setIsSelectionInitialized(true);
  }

  const toggleSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const selectedCartItems = cart.filter(item => selectedItems.includes(item.id));

  const subtotal = selectedCartItems.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price.replace(/[^\d.]|₹/g, '')) || 0;
    return sum + (price * item.quantity);
  }, 0);
  const tax = subtotal * 0.05;
  const delivery = cart.length > 0 ? 50 : 0;
  const total = subtotal + tax + delivery;

  const handleUpdateQuantity = (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty > 0) {
      updateCartItem(id, newQty);
    }
  };

  const handleRemoveItem = (id, name) => {
    removeFromCart(id);
    toast.success(`${name} removed from cart`);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to purchase");
      return;
    }
    setShowCheckoutDialog(true);
  };

  const handlePlaceOrder = async () => {
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Place order via backend API
      const response = await fetch(`${API_BASE_URL}/buyer/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({
          shippingAddress: `${checkoutForm.address}, ${checkoutForm.city || ''}`,
          totalAmount: total // Send the calculated total including taxes and fees
        })
      });

      if (response.ok) {
        const orderData = await response.json();
        console.log("Order placed successfully:", orderData);
        
        // Clear cart after successful order
        clearCart();
        setSelectedItems([]);
        setShowCheckoutDialog(false);
        
        // Refresh orders and dashboard stats to show the new order
        await fetchOrdersFromBackend();
        await fetchDashboardStatsFromBackend();
        
        toast.success("Order placed successfully!", {
          description: "Your order has been submitted and farmers have been notified.",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout Basket</h1>
          <p className="text-muted-foreground font-medium">Review your selections for direct farm procurement</p>
        </div>
        <Badge className="bg-primary/10 text-primary border-none px-4 py-1 font-bold text-sm">
          {cart.length} {cart.length === 1 ? "Product" : "Products"} Selected
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.length === 0 ? (
            <Card className="border-none shadow-none bg-muted/10 h-80 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="text-xl font-bold mb-1">Basket is empty</h3>
                <p className="text-muted-foreground">Add products to your cart to start procurement</p>
              </div>
            </Card>
          ) : (
            cart.map((item) => (
              <Card key={item.id} className="border-none shadow-sm transition-all hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex gap-6 items-center">
                    <div className="w-24 h-24 overflow-hidden rounded-xl bg-muted shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="w-5 h-5 accent-primary cursor-pointer"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleSelection(item.id)}
                          />
                          <div>
                            <h4 className="font-bold text-lg leading-tight truncate">{item.name}</h4>
                            <p className="text-xs text-muted-foreground font-medium">Farmer: {item.farmer || "Direct Farm Source"}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                          onClick={() => handleRemoveItem(item.id, item.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md hover:bg-white"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md hover:bg-white"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-primary">₹{((typeof item.price === 'number' ? item.price : parseFloat(item.price.replace(/[^\d.]|₹/g, '')) || 0) * item.quantity).toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">₹{item.price} / {item.unit}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl ring-1 ring-border/50 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg font-bold">Consignment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3 font-medium">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Market Fee (5%)</span>
                  <span className="font-bold">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pb-4 border-b border-dashed">
                  <span className="text-muted-foreground">Logistics Handling</span>
                  <span className="font-bold">₹{delivery}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-bold">Grand Total</span>
                  <span className="text-2xl font-black text-primary">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>
              <Button
                className="w-full h-12 font-bold shadow-lg shadow-primary/20"
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
              >
                Place Consignment Order ({selectedItems.length})
              </Button>
            </CardContent>
          </Card>

          <div className="p-5 rounded-2xl bg-slate-900 text-white flex gap-4 items-start">
            <div className="p-2 bg-white/10 rounded-lg"><CreditCard className="w-5 h-5 text-white" /></div>
            <p className="text-xs font-medium leading-relaxed opacity-80 italic">
              Note: Payments are processed via escrow. Funds released to farmer only after quality verified receipt.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
            <DialogDescription>Provide delivery details to place your order.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 font-bold">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={checkoutForm.name} onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Email</Label><Input value={checkoutForm.email} onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={checkoutForm.phone} onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} /></div>
            </div>
            <div className="space-y-2">
              <Label>Delivery Address</Label>
              <Input value={checkoutForm.address} onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCheckoutDialog(false)}>Cancel</Button>
            <Button onClick={handlePlaceOrder}>Place Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


