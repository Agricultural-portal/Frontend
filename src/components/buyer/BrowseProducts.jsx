"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search, ShoppingCart, Heart, Filter } from "lucide-react";
import { toast } from "sonner";
import ProductCard from "../ProductCard";

export function BrowseProducts() {
  const { products, addToCart, favorites, addToFavorites, removeFromFavorites } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const isAvailable = (product.status || "available").toLowerCase() === "available";
    return matchesSearch && matchesCategory && isAvailable;
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const isFavorite = (id) => favorites.includes(id);
  const toggleFavorite = (id) => {
    if (isFavorite(id)) {
      removeFromFavorites(id);
      toast.success("Removed from favorites");
    } else {
      addToFavorites(id);
      toast.success("Added to favorites");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">Premium quality produce directly from source farms</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-none font-bold">
            {filteredProducts.length} Products Listed
          </Badge>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden p-1">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or variety..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted/20 border-none shadow-inner"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-56 border-none bg-muted/20 shadow-inner">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="border-none shadow-2xl rounded-xl">
                <SelectItem value="all">Everything</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={handleAddToCart}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="border-none shadow-none bg-muted/10 p-20 text-center">
          <Filter className="w-20 h-20 mx-auto mb-6 text-muted-foreground/20" />
          <h3 className="text-xl font-bold">No results found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
          <Button variant="outline" onClick={() => { setSearchTerm(""); setCategoryFilter("all"); }}>Reset Filters</Button>
        </Card>
      )}
    </div>
  );
}
