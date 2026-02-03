import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
    mockProducts,
    mockOrders,
    mockTasks,
    mockFinances,
    mockSchemes,
    mockNotifications,
    mockBuyers,
    mockFarmers,
    mockFarmerRatings,
    mockBuyerRatings,
} from "./mockData";
import { toast } from "sonner";
import { cropCycleService } from "@/services/cropCycleService";
import notificationService from "@/services/notificationService";
import weatherService from "@/services/weatherService";
import walletService from "@/services/walletService";

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
    const [tasks, setTasks] = useState([]);
    const [cropCycles, setCropCycles] = useState([]);
    const [finances, setFinances] = useState([]);
    const [schemes, setSchemes] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [notificationUnreadCount, setNotificationUnreadCount] = useState(0);
    const [buyers, setBuyers] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [farmerRatings, setFarmerRatings] = useState([]);
    const [buyerRatings, setBuyerRatings] = useState([]);
    const [cart, setCart] = useState(() => {
        console.log("Initializing cart state");
        return [];
    });
    const [favorites, setFavorites] = useState([]);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
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

    const backendUrl = `${import.meta.env.VITE_API_URL || "https://backend-089c.onrender.com/api"}";

    // Persist user to localStorage whenever it changes
    useEffect(() => {
        console.log('User state changed:', currentUser ? `${currentUser.email} (has token: ${!!currentUser.token})` : 'null');
        if (currentUser) {
            console.log('Saving user to localStorage:', currentUser.email);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            // Also save token separately for services that read it directly
            if (currentUser.token) {
                localStorage.setItem('token', currentUser.token);
            }
        } else {
            console.log('Removing user from localStorage');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
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
                        farmerRating: p.farmerRating ? p.farmerRating.toString() : "0",
                        status: p.stock > 0 ? "Available" : "Out of Stock",
                        rating: p.averageRating ? p.averageRating.toString() : "0",
                        reviews: p.totalRatings || 0,
                        location: p.location
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
    }, [currentUser]);

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

        if (currentUser?.token && currentUser?.role === 'BUYER') {
            fetchCartFromBackend();
        } else {
            console.log("Not a buyer or no user, clearing cart");
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
        if (currentUser?.token && currentUser?.role === 'BUYER') {
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
        if (currentUser?.token && currentUser?.role === 'BUYER') {
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
            // Admin fetches all orders, Buyer fetches their orders
            const endpoint = currentUser.role === 'ADMIN' 
                ? `${backendUrl}/admin/orders` 
                : `${backendUrl}/buyer/orders`;
            
            const res = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            });
            if (res.ok) {
                if (currentUser.role === 'ADMIN') {
                    // Admin gets list of Order entities directly
                    const allOrders = await res.json();
                    const transformedOrders = allOrders.map(order => ({
                        id: order.id,
                        product: order.orderItems?.map(item => item.productName).join(', ') || "N/A",
                        date: order.createdAt,
                        status: order.status?.toLowerCase() || "pending",
                        totalAmount: parseFloat(order.totalAmount || 0),
                        items: order.orderItems || [],
                        buyer: order.buyer ? `${order.buyer.first_name || ''} ${order.buyer.Last_name || ''}`.trim() : "Unknown",
                        quantity: order.orderItems?.map(item => `${item.quantity} units`).join(', ') || "N/A",
                        shippingAddress: order.shippingAddress,
                        rated: order.rated || false,
                        rating: order.rating
                    }));
                    setOrders(transformedOrders);
                    console.log("Admin orders loaded from backend:", transformedOrders.length);
                } else {
                    // Buyer gets OrderHistoryDTO
                    const orderHistory = await res.json();
                    const transformedOrders = orderHistory.orders.map(order => ({
                        id: order.id,
                        product: order.items.map(item => item.productName).join(', '),
                        date: order.createdAt,
                        status: order.status.toLowerCase(),
                        totalAmount: parseFloat(order.totalAmount),
                        items: order.items,
                        buyer: `${currentUser?.first_name || ''} ${currentUser?.Last_name || ''}`.trim() || "Buyer",
                        quantity: order.items.map(item => `${item.quantity} units`).join(', '),
                        shippingAddress: order.shippingAddress,
                        rated: order.rated,
                        rating: order.rating
                    }));
                    setOrders(transformedOrders);
                    console.log("Buyer orders loaded from backend:", transformedOrders.length);
                }
            }
        } catch (err) {
            console.error("Failed to fetch orders", err);
        }
    };

    useEffect(() => {
        if (currentUser?.token && (currentUser?.role === 'BUYER' || currentUser?.role === 'ADMIN')) {
            fetchOrdersFromBackend();
        } else {
            setOrders([]);
        }
    }, [currentUser]);

    // Fetch farmers and buyers data for Admin
    useEffect(() => {
        const fetchAdminData = async () => {
            if (!currentUser?.token || currentUser?.role !== 'ADMIN') {
                setBuyers([]);
                setFarmers([]);
                return;
            }

            try {
                // Fetch all farmers
                const farmersRes = await fetch(`${backendUrl}/admin/farmers`, {
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`
                    }
                });
                if (farmersRes.ok) {
                    const farmersData = await farmersRes.json();
                    const transformedFarmers = farmersData.map(farmer => ({
                        id: farmer.id,
                        name: `${farmer.first_name || ''} ${farmer.Last_name || ''}`.trim(),
                        email: farmer.email,
                        phone: farmer.phone || "N/A",
                        location: farmer.city ? `${farmer.city}, ${farmer.state}` : farmer.state || "N/A",
                        status: farmer.status?.toLowerCase() || "active",
                        joinDate: farmer.createdAt,
                        totalRevenue: 0,
                        totalProducts: 0,
                        rating: farmer.averageRating || "0",
                        profileImageUrl: farmer.profileImageUrl || "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&h=400&fit=crop"
                    }));
                    setFarmers(transformedFarmers);
                    console.log("Farmers loaded from backend:", transformedFarmers.length);
                }

                // Fetch all buyers
                const buyersRes = await fetch(`${backendUrl}/admin/buyers`, {
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`
                    }
                });
                if (buyersRes.ok) {
                    const buyersData = await buyersRes.json();
                    const transformedBuyers = buyersData.map(buyer => ({
                        id: buyer.id,
                        name: `${buyer.first_name || ''} ${buyer.Last_name || ''}`.trim(),
                        email: buyer.email,
                        phone: buyer.phone || "N/A",
                        location: buyer.city ? `${buyer.city}, ${buyer.state}` : buyer.state || "N/A",
                        status: buyer.status?.toLowerCase() || "active",
                        joinDate: buyer.createdAt,
                        totalOrders: 0, // TODO: Calculate from orders if needed
                        totalSpent: 0,
                        profileImageUrl: buyer.profileImageUrl || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
                    }));
                    setBuyers(transformedBuyers);
                    console.log("Buyers loaded from backend:", transformedBuyers.length);
                }
            } catch (err) {
                console.error("Failed to fetch admin data", err);
                setBuyers([]);
                setFarmers([]);
            }
        };

        fetchAdminData();
    }, [currentUser]);

    // Update farmer revenue and product counts when orders or products change
    useEffect(() => {
        if (currentUser?.role === 'ADMIN' && farmers.length > 0 && orders.length > 0) {
            const updatedFarmers = farmers.map(farmer => {
                // Calculate revenue from delivered orders for this farmer
                const farmerOrders = orders.filter(order => {
                    if (order.status !== 'DELIVERED' && order.status !== 'delivered') return false;
                    // Check if any order item belongs to this farmer
                    return order.items?.some(item => item.farmer?.id === farmer.id || item.farmer?.email === farmer.email);
                });
                
                const totalRevenue = farmerOrders.reduce((sum, order) => {
                    // Sum only the items from this farmer
                    const farmerItems = order.items?.filter(item => 
                        item.farmer?.id === farmer.id || item.farmer?.email === farmer.email
                    ) || [];
                    
                    const farmerOrderTotal = farmerItems.reduce((itemSum, item) => 
                        itemSum + (item.price * item.quantity), 0
                    );
                    
                    return sum + farmerOrderTotal;
                }, 0);
                
                // Count products from this farmer
                const totalProducts = products.filter(p => p.farmerId === farmer.id).length;
                
                return {
                    ...farmer,
                    totalRevenue,
                    totalProducts
                };
            });
            
            setFarmers(updatedFarmers);
        }
    }, [orders, products]);

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

    const markOrderAsRated = (orderId, rating) => {
        setOrders(orders.map(order =>
            order.id === orderId
                ? { ...order, rated: true, rating: rating }
                : order
        ));
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
    const fetchCropCycles = async () => {
        // Only fetch crop cycles if user is a FARMER
        if (currentUser?.token && currentUser?.role === "FARMER") {
            try {
                const data = await cropCycleService.getAllCropCycles();
                setCropCycles(data);
                console.log("Crop cycles loaded:", data.length);
            } catch (err) {
                console.error("Failed to load crop cycles", err);
                // Don't show toast for 403 errors (user not farmer) to avoid spam
                if (err.status !== 403) {
                    toast.error("Failed to load crop cycles");
                }
            }
        } else {
            setCropCycles([]);
        }
    };

    useEffect(() => {
        fetchCropCycles();
    }, [currentUser?.token, currentUser?.role]);

    const addCropCycle = async (cropCycle) => {
        try {
            const newCrop = await cropCycleService.createCropCycle(cropCycle);
            setCropCycles([...cropCycles, newCrop]);
            return newCrop;
        } catch (err) {
            console.error("Failed to add crop cycle", err);
            toast.error("Failed to create crop cycle");
            throw err;
        }
    };

    const updateCropCycle = async (id, updatedCropCycle) => {
        try {
            const updated = await cropCycleService.updateCropCycle(id, updatedCropCycle);
            setCropCycles(cropCycles.map((c) => (c.id === id ? updated : c)));
            return updated;
        } catch (err) {
            console.error("Failed to update crop cycle", err);
            throw err;
        }
    };

    const deleteCropCycle = async (id) => {
        try {
            await cropCycleService.deleteCropCycle(id);
            setCropCycles(cropCycles.filter((c) => c.id !== id));
        } catch (err) {
            console.error("Failed to delete crop cycle", err);
            throw err;
        }
    };

    const refreshCropCycles = fetchCropCycles;

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
    const fetchNotifications = useCallback(async () => {
        if (!currentUser?.id) {
            console.log('[Notifications] No currentUser.id, skipping fetch');
            return;
        }
        try {
            console.log('[Notifications] Fetching notifications for user:', currentUser.id);
            const response = await notificationService.getNotifications(currentUser.id, 0, 50);
            console.log('[Notifications] Response received:', response);
            
            if (response && response.notifications) {
                const formattedNotifications = response.notifications.map(n => ({
                    id: n.id,
                    type: n.type.toLowerCase(),
                    title: n.title,
                    message: n.message,
                    timestamp: notificationService.formatTimestamp(n.createdAt),
                    read: n.isRead,
                    priority: n.priority,
                    data: n.data,
                    createdAt: n.createdAt
                }));
                console.log('[Notifications] Formatted notifications:', formattedNotifications.length);
                console.log('[Notifications] Unread count from API:', response.unreadCount);
                setNotifications(formattedNotifications);
                setNotificationUnreadCount(response.unreadCount || 0);
                console.log('[Notifications] State updated - Count:', response.unreadCount);
            } else {
                console.warn('[Notifications] Response missing notifications array');
                setNotifications([]);
                setNotificationUnreadCount(0);
            }
        } catch (error) {
            console.error('[Notifications] Error fetching notifications:', error);
            console.error('[Notifications] Error details:', {
                message: error.message,
                response: error.response,
                status: error.response?.status
            });
            // Don't break the app if notifications fail - just set empty state
            setNotifications([]);
            setNotificationUnreadCount(0);
        }
    }, [currentUser?.id]);

    const addNotification = async (notification) => {
        if (!currentUser?.id) return;
        try {
            const createDto = {
                userId: currentUser.id,
                type: notification.type.toUpperCase(),
                title: notification.title,
                message: notification.message,
                data: notification.data || null,
                priority: notification.priority || 'MEDIUM'
            };
            await notificationService.createNotification(createDto);
            await fetchNotifications();
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    };

    const markNotificationAsRead = async (id) => {
        if (!currentUser?.id) return;
        try {
            await notificationService.markAsRead(id, currentUser.id);
            // Remove notification from list when marked as read
            const notification = notifications.find(n => n.id === id);
            setNotifications(notifications.filter((n) => n.id !== id));
            if (notification && !notification.read) {
                setNotificationUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllNotificationsAsRead = async () => {
        if (!currentUser?.id) return;
        try {
            await notificationService.markAllAsRead(currentUser.id);
            // Clear all notifications from the list
            setNotifications([]);
            setNotificationUnreadCount(0);
            toast.success('All notifications cleared');
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Failed to clear notifications');
        }
    };

    const deleteNotification = async (id) => {
        if (!currentUser?.id) return;
        try {
            await notificationService.deleteNotification(id, currentUser.id);
            const notification = notifications.find(n => n.id === id);
            setNotifications(notifications.filter((n) => n.id !== id));
            if (notification && !notification.read) {
                setNotificationUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    // Fetch notifications when user logs in
    useEffect(() => {
        if (currentUser?.id && currentUser?.token) {
            console.log('[Notifications] Setting up auto-fetch for user:', currentUser.id);
            
            // Fetch immediately
            fetchNotifications();
            
            // Poll for new notifications every 30 seconds
            const interval = setInterval(() => {
                console.log('[Notifications] Auto-polling notifications...');
                fetchNotifications();
            }, 30000);
            
            return () => {
                console.log('[Notifications] Cleaning up notification polling');
                clearInterval(interval);
            };
        } else {
            // Clear notifications when user logs out
            console.log('[Notifications] Clearing notifications - no user');
            setNotifications([]);
            setNotificationUnreadCount(0);
        }
    }, [currentUser?.id, currentUser?.token, fetchNotifications]);

    // Debug: Track notification count changes
    useEffect(() => {
        console.log('[Notifications] notificationUnreadCount changed to:', notificationUnreadCount);
        console.log('[Notifications] Total notifications in state:', notifications.length);
    }, [notificationUnreadCount, notifications.length]);

    // Fetch weather data when user logs in
    useEffect(() => {
        const fetchWeather = async () => {
            if (!currentUser?.city) {
                // Try to get weather by default city or user location
                try {
                    const weatherData = await weatherService.getCurrentWeather('Punjab', 'IN');
                    setCurrentWeather(weatherData);
                } catch (error) {
                    console.error('Error fetching weather:', error);
                }
                return;
            }

            try {
                const weatherData = await weatherService.getCurrentWeather(currentUser.city, 'IN');
                setCurrentWeather(weatherData);
            } catch (error) {
                console.error('Error fetching weather for user city:', error);
            }
        };

        if (currentUser) {
            fetchWeather();
            // Refresh weather every 30 minutes
            const interval = setInterval(fetchWeather, 1800000);
            return () => clearInterval(interval);
        }
    }, [currentUser?.id, currentUser?.city]);

    // Fetch wallet balance when user logs in
    useEffect(() => {
        const fetchWalletBalance = async () => {
            if (!currentUser?.token) return;
            
            try {
                const response = await walletService.getBalance();
                setWalletBalance(response.balance || 0);
            } catch (error) {
                console.error('Error fetching wallet balance:', error);
            }
        };

        if (currentUser) {
            fetchWalletBalance();
            
            // Poll wallet balance every 5 seconds to catch real-time changes
            const walletInterval = setInterval(() => {
                fetchWalletBalance();
            }, 5000);
            
            return () => clearInterval(walletInterval);
        }
    }, [currentUser?.id, currentUser?.token]);

    // Wallet operations
    const addMoneyToWallet = async (amount) => {
        if (!currentUser?.token) return;
        
        try {
            const response = await walletService.addMoney(amount);
            setWalletBalance(response.newBalance);
            toast.success(`₹${amount} added to wallet successfully`);
            return response;
        } catch (error) {
            console.error('Error adding money to wallet:', error);
            toast.error('Failed to add money to wallet');
            throw error;
        }
    };

    const fetchWalletBalance = async () => {
        if (!currentUser?.token) return;
        
        try {
            const response = await walletService.getBalance();
            setWalletBalance(response.balance || 0);
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
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
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
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
        markOrderAsRated,
        fetchOrdersFromBackend,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        cropCycles,
        addCropCycle,
        updateCropCycle,
        deleteCropCycle,
        refreshCropCycles,
        finances,
        addFinance,
        updateFinance,
        deleteFinance,
        schemes,
        addScheme,
        updateScheme,
        deleteScheme,
        notifications,
        notificationUnreadCount,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        fetchNotifications,
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
        currentWeather,
        walletBalance,
        addMoneyToWallet,
        fetchWalletBalance,
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

