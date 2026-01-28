"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
import { Search, Star, MessageSquare, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

export function ConnectFarmers() {
  const { farmers, farmerRatings } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [message, setMessage] = useState("");

  const filteredFarmers = farmers.filter(
    (farmer) =>
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFarmerRating = (farmerName) => {
    const ratings = farmerRatings.filter((r) => r.farmerName === farmerName);
    if (ratings.length === 0) return 0;
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    return avg.toFixed(1);
  };

  const handleSendMessage = (farmer) => {
    setSelectedFarmer(farmer);
    setShowMessageDialog(true);
  };

  const handleSubmitMessage = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    toast.success(`Message sent to ${selectedFarmer?.name}!`);
    setShowMessageDialog(false);
    setMessage("");
  };

  return (
    <div className="p-6 space-y-6 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Connect with Farmers</h1>
        <p className="text-muted-foreground font-medium">Build direct relationships with local producers.</p>
      </div>

      <Card className="border-none shadow-sm p-1">
        <CardContent className="pt-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFarmers.map((farmer) => {
          const rating = getFarmerRating(farmer.name);
          return (
            <Card key={farmer.id} className="border-none shadow-sm group hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 shadow-sm">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${farmer.name}`}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {farmer.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{farmer.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs font-bold text-slate-700">
                        {rating > 0 ? rating : "New"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{farmer.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Farm Size:</span>
                    <span>{farmer.farmSize}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Products</p>
                    <p className="text-sm font-bold">{farmer.totalProducts}</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Experience</p>
                    <p className="text-sm font-bold">Verified</p>
                  </div>
                </div>

                <Button
                  className="w-full font-bold h-10 gap-2"
                  onClick={() => handleSendMessage(farmer)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message to {selectedFarmer?.name}</DialogTitle>
            <DialogDescription>Inquire about products or discuss custom orders.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 font-bold">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Your Message</Label>
              <Textarea
                placeholder="Type your message here..."
                className="min-h-[150px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
