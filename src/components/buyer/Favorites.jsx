"use client";

import { useAppContext } from "@/lib/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Heart, ShoppingCart, X } from "lucide-react";
import { toast } from "sonner";

export function Favorites({ onNavigate }) {
  const { products, favorites, removeFromFavorites, addToCart } = useAppContext();

  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  );

  const handleRemoveFavorite = (productId, name) => {
    removeFromFavorites(productId);
    toast.success(`${name} removed from favorites`);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        <p className="text-muted-foreground">
          {favoriteProducts.length} {favoriteProducts.length === 1 ? "product" : "products"} saved for later.
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <Card className="border-none shadow-none bg-muted/10 py-12 text-center">
          <CardContent className="space-y-4">
            <Heart className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
            <h3 className="font-bold">No favorites yet</h3>
            <p className="text-sm text-muted-foreground">Start adding products to your favorites from the marketplace.</p>
            <Button onClick={() => onNavigate?.("browse")}>Browse Marketplace</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <Card key={product.id} className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm text-red-500 hover:bg-white"
                  onClick={() => handleRemoveFavorite(product.id, product.name)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-4 space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold truncate">{product.name}</h3>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold shrink-0">{product.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Farmer: {product.farmer || "Rajesh Kumar"}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-primary">₹{product.price}<span className="text-xs text-muted-foreground font-medium">/{product.unit}</span></p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Stock: {product.quantity}</p>
                </div>

                <Button
                  className="w-full h-10 font-bold"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.status.toLowerCase() !== "available"}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
