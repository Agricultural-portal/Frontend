import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Star } from "lucide-react";
import { useAppContext } from "@/lib/AppContext";
import { toast } from "sonner";
import { Button } from "../ui/button";

export function Ratings() {
  const { currentUser } = useAppContext();
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchRatings = async () => {
      if (currentUser?.id && currentUser?.token) {
        try {
          console.log("Fetching recent ratings for farmer:", currentUser.email);
          console.log("Token available:", !!currentUser.token);
          const res = await fetch(`http://localhost:8080/api/farmers/ratings/recent`, {
            headers: {
              'Authorization': `Bearer ${currentUser.token}`
            }
          });
          console.log("Ratings fetch status:", res.status);

          if (res.ok) {
            const data = await res.json();
            console.log("Ratings data:", data);
            setReviews(data);
          } else {
            const errorText = await res.text();
            console.error("Failed to fetch ratings", res.status, "Error:", errorText);
          }
        } catch (error) {
          console.error("Error fetching ratings:", error);
          toast.error("Failed to load reviews");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchRatings();
  }, [currentUser]);

  const fetchAllRatings = async () => {
    if (currentUser?.id && currentUser?.token) {
      try {
        const res = await fetch(`http://localhost:8080/api/farmers/ratings`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setAllReviews(data);
          setShowAll(true);
        } else {
          toast.error("Failed to load all reviews");
        }
      } catch (error) {
        console.error("Error fetching all ratings:", error);
        toast.error("Failed to load all reviews");
      }
    }
  };

  const handleToggleReviews = () => {
    if (showAll) {
      setShowAll(false);
    } else {
      fetchAllRatings();
    }
  };

  // Use currentUser's rating or default to 0
  const averageRating = currentUser?.averageRating ? currentUser.averageRating.toFixed(1) : "0.0";
  const totalRatings = currentUser?.totalRatings || 0;
  const displayedReviews = showAll ? allReviews : reviews;

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
          <h2 className="text-5xl font-black text-primary mb-2">{averageRating}</h2>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-5 h-5 ${i <= parseFloat(averageRating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />)}
          </div>
          <p className="text-sm text-muted-foreground">Average Rating</p>
          <p className="text-xs text-muted-foreground mt-1">Based on {totalRatings} reviews</p>
        </Card>

        <Card className="md:col-span-2 border-none shadow-sm h-[500px] overflow-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{showAll ? "All Reviews" : "Recent Reviews"}</CardTitle>
            {totalRatings >= 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleReviews}
              >
                {showAll ? "Show Recent" : "Show All Reviews"}
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading reviews...</p>
            ) : displayedReviews.length === 0 ? (
              <p className="text-center text-muted-foreground">No reviews yet.</p>
            ) : (
              displayedReviews.map(review => (
                <div key={review.id} className="flex gap-4 pb-6 border-b border-border/50 last:border-0 last:pb-0">
                  <Avatar>
                    <AvatarFallback>{review.buyerName ? review.buyerName.charAt(0) : "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">{review.buyerName}</p>
                      <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className={`w-3 h-3 ${i <= review.stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">• {review.productName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
