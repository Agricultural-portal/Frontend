import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Star, MapPin, User, Package, Plus, Minus } from 'lucide-react';
import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, addToFavorites, removeFromFavorites, favorites } = useAppContext();
  const [product, setProduct] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id, products]);

  if (!product) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/buyer/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Product Not Found</h2>
            <p className="text-gray-500">The product you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const getDefaultImage = () => {
    const defaultImages = {
      VEGETABLES: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600",
      FRUITS: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600", 
      GRAINS: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600",
      DAIRY: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600",
      SPICES: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600",
      HERBS: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=600"
    };
    return defaultImages[product.category] || "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=600";
  };

  const productImage = imageError || !product.image ? getDefaultImage() : product.image;
  const isFavorite = favorites.includes(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/buyer/cart');
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/buyer/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Dashboard</span>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
        {/* Product Image */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              <Badge className="absolute top-4 left-4 bg-green-600 hover:bg-green-700">
                {product.category}
              </Badge>
            </div>
          </Card>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 text-lg">{product.description || 'Fresh and high-quality product from our farm.'}</p>
          </div>

          {/* Farmer Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sold by {product.farmer}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{product.location || 'Punjab, India'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.floor(parseFloat(product.rating || 4.5))
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold">{product.rating || '4.5'}</span>
            <span className="text-gray-600">({product.reviews || 25} reviews)</span>
          </div>

          {/* Price and Stock */}
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600">
                {typeof product.price === 'string' && product.price.includes('₹')
                  ? product.price
                  : `₹${product.price}`}
              </span>
              <span className="text-gray-600">per {product.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                {product.stock > 0 ? `${product.stock} ${product.unit} available` : 'Out of Stock'}
              </Badge>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="w-10 h-10 p-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
                className="w-10 h-10 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600 ml-2">
                Total: ₹{(parseFloat(product.price.replace('₹', '')) * quantity).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={addedToCart || product.stock === 0}
                className="flex-1 h-12"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                onClick={handleToggleFavorite}
                className="h-12 px-4"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
              </Button>
            </div>
            <Button
              onClick={handleBuyNow}
              variant="secondary"
              disabled={product.stock === 0}
              className="w-full h-12"
            >
              Buy Now
            </Button>
          </div>

          {/* Product Details */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit:</span>
                  <span className="font-medium">{product.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-medium">{product.stock} {product.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">{product.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}