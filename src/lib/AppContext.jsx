import React, { createContext, useContext, useState, useEffect } from "react";
import {
    mockProducts,
    mockOrders,
    mockTasks,
    mockCropCycles,
    mockFinances,
    mockSchemes,
    mockNotifications,
    mockBuyers,
    mockFarmers,
    mockFarmerRatings,
    mockBuyerRatings,
} from "./mockData";
import { toast } from "sonner";

const AppContext = createContext(undefined);

// Helper function to get default images based on product category
const getDefaultProductImage = (category) => {
    const defaultImages = {
        VEGETABLES: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
        FRUITS: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400", 
        GRAINS: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
        DAIRY: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
        SPICES: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400",
        HERBS: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400"
    };
    return defaultImages[category] || "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=400";
};

export function AppProvider({ children }) {
    // State for all entities
    const [products, setProducts] = useState([]); // Start empty - will be loaded from backend
    const [orders, setOrders] = useState([]); // Start empty - will be loaded from backend
    const [tasks, setTasks] = useState(mockTasks);
    const [cropCycles, setCropCycles] = useState(mockCropCycles);
    const [finances, setFinances] = useState(mockFinances);
    const [schemes, setSchemes] = useState(mockSchemes);
    const [notifications, setNotifications] = useState(mockNotifications);
    const [buyers, setBuyers] = useState(mockBuyers);
    const [farmers, setFarmers] = useState(mockFarmers);
    const [farmerRatings, setFarmerRatings] = useState(mockFarmerRatings);
    const [buyerRatings, setBuyerRatings] = useState(mockBuyerRatings);
    const [cart, setCart] = useState(() => {
        console.log("Initializing cart state");
        return [];
    });
    const [favorites, setFavorites] = useState([]);
    const [currentUser, setCurrentUser] = useState(() => {
        // Try to restore user from localStorage on app start
        try {
            const savedUser = localStorage.getItem('currentUser');
            console.log('Restoring user from localStorage:', savedUser ? 'Found user data' : 'No user data');
            const user = savedUser ? JSON.parse(savedUser) : null;
            if (user) {
                console.log('Restored user:', user.email, 'Token exists:', !!user.token);
            }
            return user;
        } catch (err) {
            console.error('Failed to restore user from localStorage:', err);
            return null;
        }
    });
    const [dashboardStats, setDashboardStats] = useState({
        totalOrders: 0,
        cartItemsCount: 0,
        totalSpent: 0,
        favoritesCount: 0
    });

    const backendUrl = "http://localhost:8080/api";

    // Persist user to localStorage whenever it changes
    useEffect(() => {
        console.log('User state changed:', currentUser ? `${currentUser.email} (has token: ${!!currentUser.token})` : 'null');
        if (currentUser) {
            console.log('Saving user to localStorage:', currentUser.email);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            console.log('Removing user from localStorage');
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    // Fetch user profile when user logs in
    useEffect(() => {
        if (currentUser?.token) {
            const fetchUserProfile = async () => {
                try {
                    const res = await fetch(`${backendUrl}/users/me`, {
                        headers: {
                            'Authorization': `Bearer ${currentUser.token}`
                        }
                    });
                    if (res.ok) {
                        const profileData = await res.json();
                        setCurrentUser(prev => ({
                            ...prev,
                            ...profileData
                        }));
                    }
                } catch (err) {
                    console.error("Failed to fetch user profile", err);
                }
            };
            fetchUserProfile();
        }
    }, [currentUser?.token]);

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${backendUrl}/buyer/products`);
                if (res.ok) {
                    const data = await res.json();
                    // Transform backend data to match frontend structure
                    const transformedProducts = data.map(p => ({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                        price: `₹${p.price}`,
                        stock: p.stock,
                        unit: p.unit,
                        category: p.category,
                        image: p.imageUrl || getDefaultProductImage(p.category),
                        farmer: p.farmerName || "Unknown Farmer",
                        status: p.stock > 0 ? "Available" : "Out of Stock",
                        rating: "4.5", // Default rating
                        reviews: Math.floor(Math.random() * 50) + 10, // Random reviews count
                        location: "Punjab" // Default location
                    }));
                    setProducts(transformedProducts);
                    console.log("Products loaded from backend:", transformedProducts.length);
                } else {
                    console.log("Backend returned error, setting empty products");
                    setProducts([]);
                }
            } catch (err) {
                console.error("Failed to fetch products from backend", err);
                setProducts([]); // Set empty instead of mock data
            }
        };

        fetchProducts();
    }, []);

    // Fetch cart from backend when user logs in
    useEffect(() => {
        const fetchCartFromBackend = async () => {
            if (!currentUser?.token) {
                console.log("No user token, skipping cart fetch");
                return;
            }
            
            console.log("Fetching cart for user:", currentUser.email);
            console.log("Using token:", currentUser.token.substring(0, 20) + "...");
            
            try {
                const res = await fetch(`${backendUrl}/buyer/cart`, {
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log("Cart API response status:", res.status);
                console.log("Cart API response headers:", Object.fromEntries(res.headers.entries()));
                
                if (res.ok) {
                    const cartData = await res.json();
                    console.log("Cart data from backend:", cartData);
                    
                    if (cartData && cartData.items) {
                        // Map backend CartDTO to frontend structure
                        const mappedItems = cartData.items.map(item => {
                            // Don't depend on products array - use backend data directly
                            return {
                                id: item.id, // CartItem ID
                                productId: item.productId,
                                name: item.productName,
                                price: `₹${item.price}`, // Format price with currency
                                quantity: item.quantity,
                                image: getDefaultProductImage('VEGETABLES'), // Use default image for now
                                unit: "kg", // Default unit
                                farmer: "Direct Source" // Default farmer
                            };
                        });
                        setCart(mappedItems);
                        console.log("Cart loaded from backend:", mappedItems.length, "items");
                        console.log("Mapped cart items:", mappedItems);
                    } else {
                        console.log("No items in cart data");
                        setCart([]);
                    }
                } else {
                    const errorText = await res.text();
                    console.log("Cart API error response:", errorText);
                    
                    if (res.status === 404) {
                        console.log("No cart found - user has empty cart");
                        setCart([]);
                    } else if (res.status === 403) {
                        console.log("Cart access forbidden - user may not have permission");
                        setCart([]);
                    } else {
                        console.log("Cart API error:", res.status, res.statusText);
                        setCart([]);
                    }
                }
            } catch (err) {
                console.error("Failed to load cart - Network error:", err);
                setCart([]);
            }
        };

        console.log("Cart useEffect triggered. User:", currentUser?.email, "Has token:", !!currentUser?.token);
        
        if (currentUser?.token) {
            fetchCartFromBackend();
        } else {
            console.log("No user, clearing cart");
            setCart([]);
        }
    }, [currentUser]); // Only depend on currentUser, not products

    // Update cart items with product details when products are loaded
    useEffect(() => {
        if (products.length > 0 && cart.length > 0) {
            console.log("Updating cart items with product details");
            const updatedCart = cart.map(item => {
                const productDetails = products.find(p => p.id === item.productId);
                if (productDetails) {
                    return {
                        ...item,
                        image: productDetails.image,
                        unit: productDetails.unit,
                        farmer: productDetails.farmer
                    };
                }
                return item;
            });
            setCart(updatedCart);
        }
    }, [products]); // Only run when products change

    // Monitor cart changes for debugging
    useEffect(() => {
        console.log("Cart state changed:", cart.length, "items");
        if (cart.length > 0) {
            console.log("Cart items:", cart.map(item => `${item.name} (qty: ${item.quantity})`));
        }
    }, [cart]);

    // Fetch dashboard stats from backend when user logs in
    const fetchDashboardStatsFromBackend = async () => {
        if (!currentUser?.token) return;
        
        try {
            const res = await fetch(`${backendUrl}/buyer/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            });
            if (res.ok) {
                const stats = await res.json();
                setDashboardStats({
                    totalOrders: stats.totalOrders,
                    cartItemsCount: stats.cartItemsCount,
                    totalSpent: stats.totalSpent,
                    favoritesCount: stats.favoritesCount
                });
                console.log("Dashboard stats loaded from backend:", stats);
            }
        } catch (err) {
            console.error("Failed to fetch dashboard stats", err);
        }
    };

    useEffect(() => {
        if (currentUser?.token) {
            fetchDashboardStatsFromBackend();
        } else {
            setDashboardStats({
                totalOrders: 0,
                cartItemsCount: 0,
                totalSpent: 0,
                favoritesCount: 0
            });
        }
    }, [currentUser]);

    // Fetch favorites from backend when user logs in
    useEffect(() => {
        if (currentUser?.token) {
            const fetchFavorites = async () => {
                try {
                    const res = await fetch(`${backendUrl}/buyer/favorites`, {
                        headers: {
                            'Authorization': `Bearer ${currentUser.token}`
                        }
                    });
                    if (res.ok) {
                        const favoriteProducts = await res.json();
                        // Extract just the product IDs for the favorites array
                        const favoriteIds = favoriteProducts.map(p => p.id);
                        setFavorites(favoriteIds);
                        console.log("Favorites loaded from backend:", favoriteIds.length);
                    }
                } catch (err) {
                    console.error("Failed to fetch favorites", err);
                }
            };
            fetchFavorites();
        } else {
            setFavorites([]);
        }
    }, [currentUser]);

    // Fetch orders from backend when user logs in
    const fetchOrdersFromBackend = async () => {
        if (!currentUser?.token) return;
        
        try {
            const res = await fetch(`${backendUrl}/buyer/orders`, {
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            });
            if (res.ok) {
                const orderHistory = await res.json();
                // Transform backend OrderDTO to frontend structure
                const transformedOrders = orderHistory.orders.map(order => ({
                    id: order.id,
                    product: order.items.map(item => item.productName).join(', '), // Combine product names
                    date: order.createdAt,
                    status: order.status.toLowerCase(), // Convert to lowercase for frontend
                    totalAmount: parseFloat(order.totalAmount),
                    items: order.items,
                    buyer: `${currentUser?.firstName} ${currentUser?.lastName}` || "Buyer", // Add buyer field
                    quantity: order.items.map(item => `${item.quantity} units`).join(', '), // Add quantity field
                    shippingAddress: order.shippingAddress
                }));
                setOrders(transformedOrders);
                console.log("Orders loaded from backend:", transformedOrders.length);
            }
        } catch (err) {
            console.error("Failed to fetch orders", err);
        }
    };

    useEffect(() => {
        if (currentUser?.token) {
            fetchOrdersFromBackend();
        } else {
            setOrders([]);
        }
    }, [currentUser]);

    // Product operations
    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: Math.max(0, ...products.map((p) => p.id)) + 1,
        };
        setProducts([...products, newProduct]);
    };

    const updateProduct = (id, updatedProduct) => {
        setProducts(products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)));
    };

    const deleteProduct = (id) => {
        setProducts(products.filter((p) => p.id !== id));
    };

    // Order operations
    const addOrder = (order) => {
        const newOrder = {
            ...order,
            id: Math.max(0, ...orders.map((o) => o.id)) + 1,
        };
        setOrders([...orders, newOrder]);
    };

    const updateOrder = (id, updatedOrder) => {
        setOrders(orders.map((o) => (o.id === id ? { ...o, ...updatedOrder } : o)));
    };

    const deleteOrder = (id) => {
        setOrders(orders.filter((o) => o.id !== id));
    };

    // Task operations
    const addTask = (task) => {
        const newTask = {
            ...task,
            id: Math.max(0, ...tasks.map((t) => t.id)) + 1,
        };
        setTasks([...tasks, newTask]);
    };

    const updateTask = (id, updatedTask) => {
        setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter((t) => t.id !== id));
    };

    // Crop Cycle operations
    const addCropCycle = (cropCycle) => {
        const newCropCycle = {
            ...cropCycle,
            id: Math.max(0, ...cropCycles.map((c) => c.id)) + 1,
        };
        setCropCycles([...cropCycles, newCropCycle]);
    };

    const updateCropCycle = (id, updatedCropCycle) => {
        setCropCycles(cropCycles.map((c) => (c.id === id ? { ...c, ...updatedCropCycle } : c)));
    };

    const deleteCropCycle = (id) => {
        setCropCycles(cropCycles.filter((c) => c.id !== id));
    };

    // Finance operations
    const addFinance = (finance) => {
        const newFinance = {
            ...finance,
            id: Math.max(0, ...finances.map((f) => f.id)) + 1,
        };
        setFinances([...finances, newFinance]);
    };

    const updateFinance = (id, updatedFinance) => {
        setFinances(finances.map((f) => (f.id === id ? { ...f, ...updatedFinance } : f)));
    };

    const deleteFinance = (id) => {
        setFinances(finances.filter((f) => f.id !== id));
    };

    // Scheme operations
    const addScheme = (scheme) => {
        const newScheme = {
            ...scheme,
            id: Math.max(0, ...schemes.map((s) => s.id)) + 1,
        };
        setSchemes([...schemes, newScheme]);
    };

    const updateScheme = (id, updatedScheme) => {
        setSchemes(schemes.map((s) => (s.id === id ? { ...s, ...updatedScheme } : s)));
    };

    const deleteScheme = (id) => {
        setSchemes(schemes.filter((s) => s.id !== id));
    };

    // Notification operations
    const addNotification = (notification) => {
        const newNotification = {
            ...notification,
            id: Math.max(0, ...notifications.map((n) => n.id)) + 1,
        };
        setNotifications([...notifications, newNotification]);
    };

    const markNotificationAsRead = (id) => {
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter((n) => n.id !== id));
    };

    // Buyer operations
    const addBuyer = (buyer) => {
        const newBuyer = {
            ...buyer,
            id: Math.max(0, ...buyers.map((b) => b.id)) + 1,
        };
        setBuyers([...buyers, newBuyer]);
    };

    const updateBuyer = (id, updatedBuyer) => {
        setBuyers(buyers.map((b) => (b.id === id ? { ...b, ...updatedBuyer } : b)));
    };

    const deleteBuyer = (id) => {
        setBuyers(buyers.filter((b) => b.id !== id));
    };

    // Farmer operations
    const addFarmer = (farmer) => {
        const newFarmer = {
            ...farmer,
            id: Math.max(0, ...farmers.map((f) => f.id)) + 1,
        };
        setFarmers([...farmers, newFarmer]);
    };

    const updateFarmer = (id, updatedFarmer) => {
        setFarmers(farmers.map((f) => (f.id === id ? { ...f, ...updatedFarmer } : f)));
    };

    const deleteFarmer = (id) => {
        setFarmers(farmers.filter((f) => f.id !== id));
    };

    // Rating operations
    const addFarmerRating = (rating) => {
        const newRating = {
            ...rating,
            id: Math.max(0, ...farmerRatings.map((r) => r.id)) + 1,
        };
        setFarmerRatings([...farmerRatings, newRating]);
    };

    const addBuyerRating = (rating) => {
        const newRating = {
            ...rating,
            id: Math.max(0, ...buyerRatings.map((r) => r.id)) + 1,
        };
        setBuyerRatings([...buyerRatings, newRating]);
    };

    // Cart operations
    const addToCart = async (product) => {
        // Always add quantity 1, don't increase existing quantity
        const optimisticItem = {
            productId: product.productId || product.id,
            name: product.name,
            price: product.price,
            unit: product.unit,
            image: product.image,
            farmer: product.farmer || "Rajesh Kumar",
            quantity: 1, // Always add 1
            id: Math.max(0, ...cart.map((i) => i.id)) + 1,
        };
        
        setCart([...cart, optimisticItem]);

        // Backend sync - always add quantity 1
        if (currentUser?.token) {
            try {
                await fetch(`${backendUrl}/buyer/cart/add`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${currentUser.token}`
                    },
                    body: JSON.stringify({
                        productId: product.id,
                        quantity: 1 // Always add 1
                    })
                });
            } catch (err) {
                console.error("Failed to sync cart with backend", err);
                toast.error("Failed to save to cloud");
            }
        }
    };

    const removeFromCart = async (id) => {
        // Remove from local cart first
        const updatedCart = cart.filter((i) => i.id !== id);
        setCart(updatedCart);
        
        // Sync with backend by clearing cart and re-adding remaining items
        if (currentUser?.token) {
            try {
                // Clear backend cart
                await fetch(`${backendUrl}/buyer/cart`, { 
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${currentUser.token}`
                    }
                });
                
                // Re-add remaining items to backend
                for (const item of updatedCart) {
                    await fetch(`${backendUrl}/buyer/cart/add`, {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${currentUser.token}`
                        },
                        body: JSON.stringify({
                            productId: item.productId,
                            quantity: item.quantity
                        })
                    });
                }
                console.log("Cart item removed and synced with backend");
            } catch (error) {
                console.error("Failed to sync cart removal with backend", error);
            }
        }
    };

    const updateCartItem = async (id, quantity) => {
        // Update local cart first
        const updatedCart = cart.map((i) => (i.id === id ? { ...i, quantity } : i));
        setCart(updatedCart);
        
        // Sync with backend by clearing and re-adding all items
        if (currentUser?.token) {
            try {
                // Clear backend cart
                await fetch(`${backendUrl}/buyer/cart`, { 
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${currentUser.token}`
                    }
                });
                
                // Re-add all items with updated quantities
                for (const item of updatedCart) {
                    await fetch(`${backendUrl}/buyer/cart/add`, {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${currentUser.token}`
                        },
                        body: JSON.stringify({
                            productId: item.productId,
                            quantity: item.quantity
                        })
                    });
                }
                console.log("Cart quantity updated and synced with backend");
            } catch (error) {
                console.error("Failed to sync cart update with backend", error);
            }
        }
    };

    const clearCart = async () => {
        setCart([]);
        if (currentUser?.token) {
            try {
                await fetch(`${backendUrl}/buyer/cart`, { 
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${currentUser.token}`
                    }
                });
            } catch (error) {
                console.error("Failed to clear backend cart", error);
            }
        }
    };

    // Favorites operations
    const addToFavorites = async (productId) => {
        if (!favorites.includes(productId)) {
            setFavorites([...favorites, productId]);
            
            // Update dashboard stats immediately
            setDashboardStats(prev => ({
                ...prev,
                favoritesCount: prev.favoritesCount + 1
            }));
            
            // Sync with backend
            if (currentUser?.token) {
                try {
                    await fetch(`${backendUrl}/buyer/favorites/add/${productId}`, {
                        method: "POST",
                        headers: {
                            'Authorization': `Bearer ${currentUser.token}`
                        }
                    });
                } catch (err) {
                    console.error("Failed to sync favorite with backend", err);
                    // Revert dashboard stats on error
                    setDashboardStats(prev => ({
                        ...prev,
                        favoritesCount: prev.favoritesCount - 1
                    }));
                }
            }
        }
    };

    const removeFromFavorites = async (productId) => {
        setFavorites(favorites.filter((id) => id !== productId));
        
        // Update dashboard stats immediately
        setDashboardStats(prev => ({
            ...prev,
            favoritesCount: Math.max(0, prev.favoritesCount - 1)
        }));
        
        // Sync with backend
        if (currentUser?.token) {
            try {
                await fetch(`${backendUrl}/buyer/favorites/remove/${productId}`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`
                    }
                });
            } catch (err) {
                console.error("Failed to remove favorite from backend", err);
                // Revert dashboard stats on error
                setDashboardStats(prev => ({
                    ...prev,
                    favoritesCount: prev.favoritesCount + 1
                }));
            }
        }
    };

    // User profile functions
    const updateUserProfile = async (profileData) => {
        if (!currentUser?.id || !currentUser?.token) return;
        
        try {
            const res = await fetch(`${backendUrl}/users/${currentUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: JSON.stringify(profileData)
            });
            
            if (res.ok) {
                const updatedUser = await res.json();
                setCurrentUser(prev => ({ ...prev, ...updatedUser }));
                return updatedUser;
            }
        } catch (err) {
            console.error("Failed to update profile", err);
            throw err;
        }
    };

    const uploadProfileImage = async (imageFile) => {
        if (!currentUser?.id || !currentUser?.token) return;
        
        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            
            const res = await fetch(`${backendUrl}/users/${currentUser.id}/profile-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: formData
            });
            
            if (res.ok) {
                const result = await res.json();
                setCurrentUser(prev => ({ 
                    ...prev, 
                    profileImageUrl: result.imageUrl 
                }));
                return result.imageUrl;
            }
        } catch (err) {
            console.error("Failed to upload profile image", err);
            throw err;
        }
    };

    const removeProfileImage = async () => {
        if (!currentUser?.id || !currentUser?.token) return;
        
        try {
            const res = await fetch(`${backendUrl}/users/${currentUser.id}/profile-image`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            });
            
            if (res.ok) {
                setCurrentUser(prev => ({ 
                    ...prev, 
                    profileImageUrl: null 
                }));
            }
        } catch (err) {
            console.error("Failed to remove profile image", err);
            throw err;
        }
    };

    // Logout function
    const logout = () => {
        setCurrentUser(null);
        setCart([]);
        setFavorites([]);
        setOrders([]);
        setDashboardStats({
            totalOrders: 0,
            cartItemsCount: 0,
            totalSpent: 0,
            favoritesCount: 0
        });
    };

    const value = {
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        fetchOrdersFromBackend,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        cropCycles,
        addCropCycle,
        updateCropCycle,
        deleteCropCycle,
        finances,
        addFinance,
        updateFinance,
        deleteFinance,
        schemes,
        addScheme,
        updateScheme,
        deleteScheme,
        notifications,
        addNotification,
        markNotificationAsRead,
        deleteNotification,
        buyers,
        addBuyer,
        updateBuyer,
        deleteBuyer,
        farmers,
        addFarmer,
        updateFarmer,
        deleteFarmer,
        farmerRatings,
        buyerRatings,
        addFarmerRating,
        addBuyerRating,
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        favorites,
        addToFavorites,
        removeFromFavorites,
        currentUser,
        setCurrentUser,
        logout,
        dashboardStats,
        fetchDashboardStatsFromBackend,
        updateUserProfile,
        uploadProfileImage,
        removeProfileImage,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}
