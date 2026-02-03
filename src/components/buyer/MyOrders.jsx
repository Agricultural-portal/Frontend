"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { API_BASE_URL } from "@/services/config";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Search, Package, Star, Eye } from "lucide-react";
import { toast } from "sonner";

export function MyOrders() {
  const { orders, addFarmerRating, markOrderAsRated, currentUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // All orders from backend are already for the current user, no need to filter
  const filteredOrders = orders.filter((order) =>
    order.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    if (!status) return "bg-slate-100 text-slate-500";
    const s = status.toLowerCase();
    switch (s) {
      case "delivered": return "bg-green-100 text-green-700";
      case "pending": return "bg-orange-100 text-orange-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-500";
    }
  };

  const handleRateOrder = (order) => {
    setSelectedOrder(order);
    setShowRatingDialog(true);
  };

  const handleSubmitRating = async () => {
    if (!comment.trim()) {
      toast.error("Please provide feedback content");
      return;
    }

    // Call backend to save rating
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/ratings/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({
          buyerId: currentUser?.id,
          orderId: selectedOrder?.id,
          // Use the first item's product ID since rating is per order which traditionally was 1-item per order in this flow
          // If multi-item orders are fully supported, the UI should ask which product to rate. 
          // For now, defaulting to the first item as per current UI assumption.
          productId: selectedOrder?.items?.[0]?.productId,
          stars: rating,
          comment: comment
        })
      });

      if (response.ok) {
        toast.success("Rating submitted successfully to the farmer!");
        addFarmerRating({
          buyerName: `${currentUser?.firstName} ${currentUser?.lastName}` || "John Smith",
          farmerName: "Rajesh Kumar",
          rating: rating,
          comment: comment,
          date: new Date().toISOString().split("T")[0],
          orderProduct: selectedOrder?.product
        });

        // Update local state to reflect rating immediately
        markOrderAsRated(selectedOrder.id, rating);
      }
    } catch (e) {
      console.error("Failed to submit rating", e);
      toast.error("Failed to submit rating");
    }

    setShowRatingDialog(false);
    setComment("");
    setRating(5);
  };

  return (
    <div className="p-6 space-y-6 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your produce orders.</p>
      </div>

      <Card className="border-none shadow-sm p-1">
        <CardContent className="pt-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filter by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
          <Card key={order.id} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between md:justify-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Order #{order.id}</p>
                      <h3 className="font-bold text-lg">{order.product}</h3>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} border-none capitalize`}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Order Date</p>
                      <p className="font-semibold text-sm">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Quantity</p>
                      <p className="font-semibold text-sm">{order.quantity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Amount</p>
                      <p className="font-bold text-sm text-primary">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto h-fit">
                  {order.status.toLowerCase() === "delivered" && (
                    !order.rated ? (
                      <Button
                        size="sm"
                        className="flex-1 md:flex-none gap-2 font-bold h-10 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 border-none px-6"
                        onClick={() => handleRateOrder(order)}
                      >
                        Rate Order
                      </Button>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <Button
                          size="sm"
                          disabled
                          className="flex-1 md:flex-none gap-2 font-bold h-10 bg-muted text-muted-foreground border-none px-6 opacity-80"
                        >
                          Rated
                        </Button>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < (order.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted/30"}`}
                              strokeWidth={0}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="py-20 text-center bg-muted/10 rounded-2xl">
            <p className="text-muted-foreground">No orders found.</p>
          </div>
        )}
      </div>

      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Order</DialogTitle>
            <DialogDescription>Share your feedback about the produce quality for {selectedOrder?.product}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2 font-bold">
              <Label className="uppercase text-[10px] tracking-widest text-muted-foreground">Rating</Label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-200"
                        }`}
                      strokeWidth={star <= rating ? 0 : 2}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 font-bold">
              <Label className="uppercase text-[10px] tracking-widest text-muted-foreground">Comment</Label>
              <Textarea
                placeholder="How was the quality of the produce?"
                className="min-h-[100px]"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRatingDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitRating}>Submit Rating</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


