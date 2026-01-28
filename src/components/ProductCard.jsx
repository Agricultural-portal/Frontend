import React, { useState } from 'react';
import { Heart, ShoppingBag, ShoppingCart, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, showSimple = false, addToCart, toggleFavorite, isFavorite }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    // Default image based on category or fallback
    const getDefaultImage = () => {
        const defaultImages = {
            VEGETABLES: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
            FRUITS: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400", 
            GRAINS: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
            DAIRY: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
            SPICES: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400",
            HERBS: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400"
        };
        return defaultImages[product.category] || "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=400";
    };

    const productImage = imageError || !product.image ? getDefaultImage() : product.image;

    const handleProductClick = () => {
        console.log('Product clicked:', product.name);
        // Add product to cart and redirect to cart page
        addToCart(product);
        navigate('/buyer/cart');
    };

    const handleAddToCart = (e) => {
        e?.stopPropagation();
        addToCart(product);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleBuyNow = (e) => {
        e?.stopPropagation();
        addToCart(product);
        navigate('/buyer/cart');
    };

    const handleToggleFavorite = (e) => {
        e?.stopPropagation();
        toggleFavorite(product.id);
    };

    const favorite = isFavorite ? isFavorite(product.id) : false;

    if (showSimple) {
        return (
            <div 
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:-translate-y-1 flex flex-col h-full group cursor-pointer" 
                onClick={handleProductClick}
            >
                <img 
                    src={productImage} 
                    alt={product.name} 
                    className="w-full h-[200px] object-cover shrink-0"
                    onError={() => setImageError(true)}
                />
                <div className="p-4 flex flex-col flex-1 bg-white">
                    <h6 className="font-bold text-slate-900 mb-1 leading-snug truncate group-hover:text-[#2d5a2d] transition-colors">{product.name}</h6>
                    <p className="text-[#6c757d] text-[0.85rem] mb-2">by {product.farmer || 'Unknown Farmer'}</p>
                    <div className="flex items-center gap-1 mb-2">
                        <span className="text-[#ffc107] text-lg">★</span>
                        <span className="text-sm font-medium text-slate-700">{product.rating || '4.5'}</span>
                    </div>
                    <p className="text-[#2d5a2d] font-bold mt-auto">
                        {typeof product.price === 'string' && product.price.includes('₹')
                            ? product.price
                            : `₹${product.price} / ${product.unit}`}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:-translate-y-1 flex flex-col h-full group relative cursor-pointer"
            onClick={handleProductClick}
        >
            <div className="relative h-[250px] w-full shrink-0 overflow-hidden">
                <img 
                    src={productImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-500"
                    onError={() => setImageError(true)}
                />
                <span className="absolute top-4 left-4 bg-[#28a745] text-white px-3 py-1 rounded-full text-[0.85rem] font-medium z-10 shadow-sm uppercase tracking-tighter">
                    {product.category}
                </span>
                <button
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full border-none flex items-center justify-center cursor-pointer transition-all z-10 shadow-md ${favorite ? 'bg-[#fff5f7]' : 'bg-white hover:bg-[#f8f9fa]'}`}
                    onClick={handleToggleFavorite}
                >
                    <Heart
                        size={20}
                        className={favorite ? 'fill-[#c2185b] text-[#c2185b]' : 'text-[#495057]'}
                    />
                </button>
            </div>
            <div className="p-6 flex flex-col flex-1">
                <h5 className="font-bold text-[1.1rem] mb-2 text-slate-900 tracking-tight group-hover:text-[#2d5a2d] transition-colors">{product.name}</h5>
                <p className="text-[#6c757d] text-[0.9rem] mb-1 font-medium">by {product.farmer}</p>
                <p className="text-[#6c757d] text-[0.85rem] mb-3 flex items-center gap-1 italic">{product.location || 'Punjab'}</p>
                <div className="flex items-center gap-1.5 mb-4">
                    <span className="text-[#ffc107]">★</span>
                    <span className="font-bold text-slate-700">{product.rating}</span>
                    <small className="text-[#6c757d] font-bold uppercase tracking-tighter text-[10px]">({product.reviews} reviews)</small>
                </div>
                <div className="flex justify-between items-center mt-auto gap-4 flex-wrap">
                    <h5 className="font-black text-[#2d5a2d] text-[1.1rem]">
                        {typeof product.price === 'string' && product.price.includes('₹')
                            ? product.price
                            : `₹${product.price} / ${product.unit}`}
                    </h5>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            className={`font-bold transition-all h-9 px-4 rounded-xl ${addedToCart ? 'bg-slate-500 hover:bg-slate-600' : 'bg-[#28a745] hover:bg-[#218838] shadow-md shadow-green-900/10'}`}
                            onClick={handleAddToCart}
                            disabled={addedToCart}
                        >
                            {addedToCart ? (
                                <span className="flex items-center gap-1.5"><ShoppingCart size={14} /> Added!</span>
                            ) : (
                                'Add to Cart'
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-9 px-3 rounded-xl font-bold bg-orange-100 text-orange-700 hover:bg-orange-200 hover:text-orange-800"
                            onClick={handleBuyNow}
                            title="Buy Now"
                        >
                            <ShoppingBag size={16} className="mr-1" /> Buy
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
