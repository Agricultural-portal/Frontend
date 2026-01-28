"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";

const reviews = [
  { id: 1, user: "Amit Singh", rating: 5, date: "2 Jan 2025", comment: "Great quality wheat! Highly recommended.", avatar: "A" },
  { id: 2, user: "Suresh Rao", rating: 4, date: "28 Dec 2024", comment: "Good service, timely delivery.", avatar: "S" },
  { id: 3, user: "Meena Devi", rating: 5, date: "20 Dec 2024", comment: "Very fresh vegetables directly from the farm.", avatar: "M" },
];

export function Ratings() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ratings & Reviews</h1>
          <p className="text-muted-foreground">What buyers are saying about your products</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm flex flex-col items-center justify-center p-8 text-center bg-primary/5">
          <h2 className="text-5xl font-black text-primary mb-2">4.8</h2>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-primary text-primary" />)}
          </div>
          <p className="text-sm text-muted-foreground">Average Rating</p>
          <p className="text-xs text-muted-foreground mt-1">Based on 124 reviews</p>
        </Card>

        <Card className="md:col-span-2 border-none shadow-sm">
          <CardHeader><CardTitle className="text-lg">Recent Reviews</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="flex gap-4 pb-6 border-b border-border/50 last:border-0 last:pb-0">
                <Avatar><AvatarFallback>{review.avatar}</AvatarFallback></Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{review.user}</p>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={`w-3 h-3 ${i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                  <div className="flex gap-4 pt-2">
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><ThumbsUp className="w-3 h-3" /> Helpful</button>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><MessageSquare className="w-3 h-3" /> Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
