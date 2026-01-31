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
import authService from "../services/authService";

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
    // Authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Check authentication on mount
    useEffect(() => {
        const storedToken = authService.getToken();
        const storedUser = authService.getCurrentUser();
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
            setIsAuthenticated(true);
        }
    }, []);

    // Login function
    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        const storedToken = authService.getToken();
        setToken(storedToken);
    };

    // Logout function
    const logout = () => {
        authService.logout();
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
    };

    // State for all entities
    const [products, setProducts] = useState(mockProducts);
    const [orders, setOrders] = useState(mockOrders);
    const [tasks, setTasks] = useState(mockTasks);
    const [cropCycles, setCropCycles] = useState(mockCropCycles);
    const [finances, setFinances] = useState(mockFinances);
    const [schemes, setSchemes] = useState(mockSchemes);
    const [notifications, setNotifications] = useState(mockNotifications);
    const [buyers, setBuyers] = useState(mockBuyers);
    const [farmers, setFarmers] = useState(mockFarmers);
    const [farmerRatings, setFarmerRatings] = useState(mockFarmerRatings);
    const [buyerRatings, setBuyerRatings] = useState(mockBuyerRatings);
    const [cart, setCart] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

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
    const addToCart = (product) => {
        const targetId = product.productId || product.id;
        const existingItem = cart.find((i) => (i.productId || i.id) === targetId);

        if (existingItem) {
            setCart(
                cart.map((i) =>
                    (i.productId || i.id) === targetId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                )
            );
        } else {
            const newItem = {
                productId: product.productId || product.id,
                name: product.name,
                price: product.price,
                unit: product.unit,
                image: product.image,
                farmer: product.farmer || "Rajesh Kumar",
                quantity: 1,
                id: Math.max(0, ...cart.map((i) => i.id)) + 1,
            };
            setCart([...cart, newItem]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter((i) => i.id !== id));
    };

    const updateCartItem = (id, quantity) => {
        setCart(cart.map((i) => (i.id === id ? { ...i, quantity } : i)));
    };

    const clearCart = () => {
        setCart([]);
    };

    // Favorites operations
    const addToFavorites = (productId) => {
        if (!favorites.includes(productId)) {
            setFavorites([...favorites, productId]);
        }
    };

    const removeFromFavorites = (productId) => {
        setFavorites(favorites.filter((id) => id !== productId));
    };

    const value = {
        // Authentication
        isAuthenticated,
        user,
        token,
        login,
        logout,
        // Products
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
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
