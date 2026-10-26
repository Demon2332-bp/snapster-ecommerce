import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Currency, AuthUser, CustomerOrder, SavedAddress, UserNotification } from '../types/store';
import { PRODUCTS } from '../data/mockData';
import {
  auth,
  signInWithGoogleService,
  signInWithEmailService,
  signUpWithEmailService,
  signOutService,
  fetchUserProfileService,
  updateUserProfileService,
  fetchUserCartService,
  saveUserCartService,
  fetchUserWishlistService,
  saveUserWishlistService,
  fetchProductsService,
  saveProductService,
  deleteProductService,
  fetchOrdersService,
  saveOrderService,
  updateOrderStatusService as updateOrderStatusFirebase,
  fetchNotificationsService,
  addNotificationService,
} from '../services/firebase';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface BuyNowData {
  product: Product;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  quantity: number;
}

interface StoreContextType {
  // Products & Admin Management
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  isAdminManagerOpen: boolean;
  setIsAdminManagerOpen: (open: boolean) => void;
  isPostingNew: boolean;
  setIsPostingNew: (open: boolean) => void;
  openAdminEditProduct: (product: Product) => void;
  openAdminPostProduct: () => void;

  // Navigation & Views
  currentView: 'home' | 'shop' | 'collections' | 'about' | 'journal' | 'contact';
  setCurrentView: (view: 'home' | 'shop' | 'collections' | 'about' | 'journal' | 'contact') => void;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  goBack: () => void;
  canGoBack: boolean;
  viewHistory: Array<{ view: 'home' | 'shop' | 'collections' | 'about' | 'journal' | 'contact'; category: string | null }>;

  // Currency
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceInINR: number) => string;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalInitialTab: 'customer' | 'admin';
  setAuthModalInitialTab: (tab: 'customer' | 'admin') => void;
  openAuthModal: (tab?: 'customer' | 'admin') => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isSizeFitHelperOpen: boolean;
  setIsSizeFitHelperOpen: (open: boolean) => void;
  isOrderTrackingOpen: boolean;
  setIsOrderTrackingOpen: (open: boolean) => void;
  isOffersOpen: boolean;
  setIsOffersOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Buy Now Flow (Flipkart style direct express checkout)
  buyNowData: BuyNowData | null;
  setBuyNowData: (data: BuyNowData | null) => void;
  triggerBuyNow: (product: Product, size?: 'S' | 'M' | 'L' | 'XL' | 'XXL', color?: string, quantity?: number) => boolean;

  // Size helper recommendation
  recommendedSize: ('S' | 'M' | 'L' | 'XL' | 'XXL') | null;
  setRecommendedSize: (size: ('S' | 'M' | 'L' | 'XL' | 'XXL') | null) => void;

  // Expected Delivery calculations
  getExpectedDeliveryDate: (pin?: string) => string;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL', color: string, quantity?: number) => boolean;
  updateQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  discountAmount: number;
  appliedPromo: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  freeShippingThreshold: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;

  // Recently Viewed
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;

  // Search & Catalog
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Auth User & Admin state
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  updateUserProfile: (updates: Partial<AuthUser>) => Promise<{ success: boolean; message: string }>;
  isAdmin: boolean;
  loginCustomer: (phone: string, otp: string, name?: string) => { success: boolean; message: string };
  loginAdmin: (username: string, password: string) => { success: boolean; message: string };
  loginWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  registerWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;

  // Addresses Management
  addDeliveryAddress: (address: Omit<SavedAddress, 'id'>) => Promise<void>;
  deleteDeliveryAddress: (addressId: string) => Promise<void>;
  setDefaultDeliveryAddress: (addressId: string) => Promise<void>;

  // Orders & Live Tracking
  orders: CustomerOrder[];
  addOrder: (order: CustomerOrder) => void;
  updateOrderStatus: (orderId: string, status: CustomerOrder['status']) => void;
  refreshOrders: () => Promise<void>;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;

  // Notifications
  notifications: UserNotification[];
  markNotificationRead: (id: string) => void;

  // Policy Modals (Standard E-Commerce compliance)
  isPoliciesOpen: boolean;
  policiesTab: 'shipping' | 'returns' | 'fabric' | 'terms';
  setPoliciesTab: (tab: 'shipping' | 'returns' | 'fabric' | 'terms') => void;
  openPolicyModal: (tab: 'shipping' | 'returns' | 'fabric' | 'terms') => void;
  setIsPoliciesOpen: (open: boolean) => void;

  // Pending protected actions
  pendingAction: 'cart' | 'wishlist' | 'track_order' | null;
  setPendingAction: (action: 'cart' | 'wishlist' | 'track_order' | null) => void;

  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CURRENCY_RATES: { [key in Currency]: { rate: number; symbol: string; prefix: boolean } } = {
  INR: { rate: 1, symbol: '₹', prefix: true },
  USD: { rate: 0.012, symbol: '$', prefix: true },
  EUR: { rate: 0.011, symbol: '€', prefix: true },
  GBP: { rate: 0.0094, symbol: '£', prefix: true },
};

const PRODUCTS_STORAGE_KEY = 'snapster_catalog_v3';
const USER_STORAGE_KEY = 'snapster_auth_user_v2';
const CART_STORAGE_KEY = 'snapster_cart_v1';
const WISHLIST_STORAGE_KEY = 'snapster_wishlist_v1';
const ORDERS_STORAGE_KEY = 'snapster_orders_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  type ViewType = 'home' | 'shop' | 'collections' | 'about' | 'journal' | 'contact';
  interface HistoryEntry {
    view: ViewType;
    category: string | null;
  }
  const [currentView, setCurrentViewState] = useState<ViewType>('home');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewHistory, setViewHistory] = useState<HistoryEntry[]>([]);

  const setCurrentView = (nextView: ViewType) => {
    if (nextView !== currentView) {
      setViewHistory((prev) => [...prev, { view: currentView, category: activeCategory }]);
      setCurrentViewState(nextView);
    }
  };

  const goBack = () => {
    if (viewHistory.length > 0) {
      const prevEntries = [...viewHistory];
      const last = prevEntries.pop();
      setViewHistory(prevEntries);
      if (last) {
        setCurrentViewState(last.view);
        setActiveCategory(last.category);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    if (currentView !== 'home') {
      setCurrentViewState('home');
      setActiveCategory(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    }
  };

  const canGoBack = currentView !== 'home';
  const [currency, setCurrency] = useState<Currency>('INR');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSizeFitHelperOpen, setIsSizeFitHelperOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'customer' | 'admin'>('customer');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Admin Management State
  const [isAdminManagerOpen, setIsAdminManagerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isPostingNew, setIsPostingNew] = useState(false);

  // Products state with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return PRODUCTS;
  });

  // User state with localStorage persistence
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return null;
  });

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  // Persist user
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const isAdmin = user?.role === 'admin';

  // Buy Now state
  const [buyNowData, setBuyNowData] = useState<BuyNowData | null>(null);
  const [recommendedSize, setRecommendedSize] = useState<('S' | 'M' | 'L' | 'XL' | 'XXL') | null>(null);

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(['prod-na-1', 'prod-na-3', 'prod-bs-1']);

  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Orders state persisted in localStorage
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  // Policy Modal state
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);
  const [policiesTab, setPoliciesTab] = useState<'shipping' | 'returns' | 'fabric' | 'terms'>('shipping');

  const openPolicyModal = (tab: 'shipping' | 'returns' | 'fabric' | 'terms') => {
    setPoliciesTab(tab);
    setIsPoliciesOpen(true);
  };

  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  // 1. Fetch live products from Firestore on boot
  useEffect(() => {
    let mounted = true;
    fetchProductsService().then((prods) => {
      if (mounted && prods && prods.length > 0) {
        setProducts(prods);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Firebase Auth listener for persistent user, cart, wishlist, orders
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await fetchUserProfileService(fbUser.uid);
          if (profile) {
            setUser(profile);
          }
          // Load persistent cart
          const remoteCart = await fetchUserCartService(fbUser.uid);
          if (remoteCart && remoteCart.length > 0) {
            setCart(remoteCart);
          }
          // Load persistent wishlist
          const remoteWishlist = await fetchUserWishlistService(fbUser.uid);
          if (remoteWishlist && remoteWishlist.length > 0) {
            setWishlist(remoteWishlist);
          }
          // Load orders
          const remoteOrders = await fetchOrdersService(
            fbUser.uid,
            profile?.role === 'admin' || fbUser.email === 'admin@snapster.in'
          );
          if (remoteOrders && remoteOrders.length > 0) {
            setOrders(remoteOrders);
          }
          // Load notifications
          const notifs = await fetchNotificationsService(fbUser.uid);
          if (notifs) {
            setNotifications(notifs);
          }
        } catch (e) {
          console.warn('[Firebase] Auth state hydration warning:', e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const addOrder = (order: CustomerOrder) => {
    if (user?.id) {
      order.userId = user.id;
      order.customerName = user.name;
      order.customerEmail = user.email;
      order.customerPhone = user.phone;
    }
    setOrders((prev) => [order, ...prev]);
    setTrackingOrderId(order.id);
    saveOrderService(order).catch(console.warn);
    if (user?.id) {
      addNotificationService(user.id, {
        title: `Order Placed (#${order.id})`,
        message: `Order for ₹${order.total.toLocaleString('en-IN')} confirmed. Dispatched via BlueDart Air from Vijayawada AP Hub.`,
        type: 'order',
        read: false,
      }).catch(console.warn);
    }
  };

  const updateOrderStatus = (orderId: string, status: CustomerOrder['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    updateOrderStatusFirebase(orderId, status).catch(console.warn);
    showToast(`Order #${orderId} marked as "${status}"`, 'success');
  };

  const refreshOrders = async () => {
    try {
      const remoteOrders = await fetchOrdersService(
        user?.id,
        user?.role === 'admin' || user?.email === 'admin@snapster.in'
      );
      if (remoteOrders) {
        setOrders(remoteOrders);
        showToast(`Synced ${remoteOrders.length} order(s) from Firestore`, 'info');
      }
    } catch (e) {
      console.warn('Could not refresh orders:', e);
    }
  };

  // Sync cart to Firestore & localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      if (user?.id) {
        saveUserCartService(user.id, cart).catch(console.warn);
      }
    } catch {}
  }, [cart, user?.id]);

  // Sync wishlist to Firestore & localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      if (user?.id) {
        saveUserWishlistService(user.id, wishlist).catch(console.warn);
      }
    } catch {}
  }, [wishlist, user?.id]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const [pendingAction, setPendingAction] = useState<'cart' | 'wishlist' | 'track_order' | null>(null);

  const freeShippingThreshold = 2499;

  const formatPrice = (priceInINR: number): string => {
    const config = CURRENCY_RATES[currency];
    const converted = Math.round(priceInINR * config.rate);
    return `${config.symbol}${converted.toLocaleString('en-US')}`;
  };

  const getExpectedDeliveryDate = (pin?: string): string => {
    const targetDate = new Date();
    // Default to Vijayawada 520001
    const cleanPin = pin ? pin.replace(/\D/g, '') : '520001';
    const isVijayawada = cleanPin.startsWith('520');
    const isAP = cleanPin.startsWith('51') || cleanPin.startsWith('52') || cleanPin.startsWith('53');
    const addedDays = isVijayawada ? 1 : isAP ? 2 : 3;
    targetDate.setDate(targetDate.getDate() + addedDays);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return targetDate.toLocaleDateString('en-IN', options);
  };

  const addRecentlyViewed = (id: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item !== id);
      return [id, ...filtered].slice(0, 8);
    });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const openAuthModal = (tab: 'customer' | 'admin' = 'customer') => {
    setAuthModalInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const openAdminEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsPostingNew(false);
    setIsAdminManagerOpen(true);
  };

  const openAdminPostProduct = () => {
    setEditingProduct(null);
    setIsPostingNew(true);
    setIsAdminManagerOpen(true);
  };

  // Auth Operations
  const loginCustomer = (phone: string, otp: string, name?: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return { success: false, message: 'Invalid 10-digit number' };
    }
    if (!otp || otp.length < 4) {
      showToast('Please enter the 4-digit OTP received', 'error');
      return { success: false, message: 'Invalid OTP' };
    }

    const trimmedName = name && name.trim().length > 0 ? name.trim() : `Member ${cleanPhone.slice(-4)}`;

    const newUser: AuthUser = {
      role: 'customer',
      name: trimmedName,
      phone: `+91 ${cleanPhone.slice(-10)}`,
      gender: 'Male',
      addresses: [
        {
          id: 'addr-default',
          fullName: trimmedName,
          phone: `+91 ${cleanPhone.slice(-10)}`,
          street: 'MG Road, Labbipet',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          pincode: '520010',
          isDefault: true,
        },
      ],
      loggedInAt: new Date().toISOString(),
    };

    setUser(newUser);
    showToast(`Welcome, ${trimmedName}! Access granted to your drip.`, 'success');
    setIsAuthModalOpen(false);

    // If an action was pending prior to login (Cart, Wishlist, Track Order), open it automatically
    if (pendingAction === 'cart') {
      setIsCartOpen(true);
    } else if (pendingAction === 'wishlist') {
      setIsWishlistOpen(true);
    } else if (pendingAction === 'track_order') {
      setIsOrderTrackingOpen(true);
    }
    setPendingAction(null);

    return { success: true, message: 'Logged in successfully' };
  };

  const loginAdmin = (username: string, pass: string) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();
    if (
      (cleanUser === 'admin' || cleanUser === 'snapster_admin') &&
      (cleanPass === 'snapster2026' || cleanPass === 'admin123')
    ) {
      const adminUser: AuthUser = {
        role: 'admin',
        name: 'SNAPSTER Operations Admin',
        email: 'admin@snapster.store',
        phone: '+91 866 248 9000',
        loggedInAt: new Date().toISOString(),
      };
      setUser(adminUser);
      showToast('Admin access unlocked // Catalog privileges granted', 'success');
      setIsAuthModalOpen(false);
      setIsAdminManagerOpen(true);
      return { success: true, message: 'Logged in as Admin' };
    }
    showToast('Invalid admin credentials. Please re-check username and password.', 'error');
    return { success: false, message: 'Invalid admin credentials. Use admin / snapster2026' };
  };

  const updateUserProfile = async (updates: Partial<AuthUser>): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      showToast('No active customer session found', 'error');
      return { success: false, message: 'No active customer session found' };
    }
    const updated = { ...user, ...updates };
    setUser(updated);
    if (user.id) {
      try {
        await updateUserProfileService(user.id, updates);
        showToast('Profile saved to Firestore successfully!', 'success');
        return { success: true, message: 'Profile saved successfully' };
      } catch (err: any) {
        const errorMsg = err?.message || 'Failed to update profile in Firestore.';
        showToast(errorMsg, 'error');
        return { success: false, message: errorMsg };
      }
    } else {
      showToast('Profile saved locally', 'success');
      return { success: true, message: 'Profile saved locally' };
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const profile = await signInWithGoogleService();
      if (profile) {
        setUser(profile);
        showToast(`Welcome, ${profile.name}! Signed in via Google.`, 'success');
        setIsAuthModalOpen(false);
        if (pendingAction === 'cart') setIsCartOpen(true);
        else if (pendingAction === 'wishlist') setIsWishlistOpen(true);
        else if (pendingAction === 'track_order') setIsOrderTrackingOpen(true);
        setPendingAction(null);
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'Google sign-in error', 'error');
      return false;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const profile = await signInWithEmailService(email, pass);
      setUser(profile);
      showToast(`Welcome back, ${profile.name}!`, 'success');
      setIsAuthModalOpen(false);
      if (pendingAction === 'cart') setIsCartOpen(true);
      else if (pendingAction === 'wishlist') setIsWishlistOpen(true);
      else if (pendingAction === 'track_order') setIsOrderTrackingOpen(true);
      setPendingAction(null);
      return { success: true, message: 'Logged in successfully' };
    } catch (err: any) {
      const msg = err.message || 'Invalid email or password.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string, phone?: string) => {
    try {
      const profile = await signUpWithEmailService(email, pass, name, phone);
      setUser(profile);
      showToast(`Welcome to SNAPSTER, ${profile.name}! VIP Account registered.`, 'success');
      setIsAuthModalOpen(false);
      if (pendingAction === 'cart') setIsCartOpen(true);
      else if (pendingAction === 'wishlist') setIsWishlistOpen(true);
      else if (pendingAction === 'track_order') setIsOrderTrackingOpen(true);
      setPendingAction(null);
      return { success: true, message: 'Registered successfully' };
    } catch (err: any) {
      const msg = err.message || 'Registration failed.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    signOutService().catch(console.warn);
    setUser(null);
    setIsAdminManagerOpen(false);
    showToast('Logged out of SNAPSTER account', 'info');
  };

  // Multiple Delivery Addresses Management (Flipkart-style)
  const addDeliveryAddress = async (addrData: Omit<SavedAddress, 'id'>) => {
    if (!user) return;
    const newAddr: SavedAddress = {
      ...addrData,
      id: `addr-${Date.now()}`,
    };
    const currentAddrs = user.addresses || [];
    const updatedAddrs = newAddr.isDefault
      ? [newAddr, ...currentAddrs.map((a) => ({ ...a, isDefault: false }))]
      : [...currentAddrs, newAddr];
    updateUserProfile({ addresses: updatedAddrs });
    showToast('Delivery address saved to your profile!', 'success');
  };

  const deleteDeliveryAddress = async (addressId: string) => {
    if (!user) return;
    const currentAddrs = user.addresses || [];
    const updatedAddrs = currentAddrs.filter((a) => a.id !== addressId);
    updateUserProfile({ addresses: updatedAddrs });
    showToast('Delivery address removed', 'info');
  };

  const setDefaultDeliveryAddress = async (addressId: string) => {
    if (!user) return;
    const currentAddrs = user.addresses || [];
    const updatedAddrs = currentAddrs.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    updateUserProfile({ addresses: updatedAddrs });
    showToast('Primary delivery address updated', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Product Operations (Admin)
  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    saveProductService(newProduct).catch(console.warn);
    showToast(`Successfully posted new piece: "${newProduct.name}" to Firestore`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    let targetProd: Product | null = null;
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          targetProd = updated;
          return updated;
        }
        return item;
      })
    );

    if (targetProd) {
      saveProductService(targetProd).catch(console.warn);
    }

    if (quickViewProduct?.id === id) {
      setQuickViewProduct((prev) => (prev ? { ...prev, ...updates } : null));
    }
    if (buyNowData?.product.id === id) {
      setBuyNowData((prev) => (prev ? { ...prev, product: { ...prev.product, ...updates } } : null));
    }

    showToast('Product images & pricing permanently saved in Firestore!', 'success');
  };

  const deleteProduct = (id: string) => {
    const item = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    deleteProductService(id).catch(console.warn);
    if (quickViewProduct?.id === id) {
      setQuickViewProduct(null);
    }
    showToast(`Deleted "${item?.name || 'piece'}" from catalog & database`, 'info');
  };

  const resetProducts = () => {
    setProducts(PRODUCTS);
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    showToast('Catalog reset to standard collection', 'info');
  };

  const addToCart = (
    product: Product,
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL',
    color: string,
    quantity = 1
  ): boolean => {
    if (!user) {
      setPendingAction('cart');
      openAuthModal('customer');
      showToast('Please log in with mobile number to add items to Bag', 'info');
      return false;
    }

    if (!size) {
      showToast('Please select your size first (S, M, L, XL, XXL)', 'error');
      return false;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.size === size && item.color === color
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [
          ...prev,
          {
            id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size,
            color,
            quantity,
          },
        ];
      }
    });

    addRecentlyViewed(product.id);
    showToast(`Added ${product.name} (${size}) to bag`, 'success');
    setIsCartOpen(true);
    return true;
  };

  const triggerBuyNow = (
    product: Product,
    size?: 'S' | 'M' | 'L' | 'XL' | 'XXL',
    color?: string,
    quantity = 1
  ): boolean => {
    if (!user) {
      setPendingAction('cart');
      openAuthModal('customer');
      showToast('Please log in with mobile number to place an order', 'info');
      return false;
    }

    const selectedSize = size || recommendedSize || product.sizes[0];
    const selectedColor = color || (product.colors && product.colors[0]?.name) || 'Black';

    setBuyNowData({
      product,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    addRecentlyViewed(product.id);
    return true;
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    const item = cart.find((i) => i.id === itemId);
    setCart((prev) => prev.filter((i) => i.id !== itemId));
    if (item) {
      showToast(`Removed ${item.name} from bag`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    if (!user) {
      setPendingAction('wishlist');
      openAuthModal('customer');
      showToast('Please log in with mobile number to save items to Wishlist', 'info');
      return;
    }

    const product = products.find((p) => p.id === productId) || PRODUCTS.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`Removed ${product?.name || 'piece'} from saved`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved ${product?.name || 'piece'} to wishlist`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const discountAmount = appliedPromo === 'EDGE20'
    ? Math.round(cartSubtotal * 0.2)
    : appliedPromo === 'EDGE10' || appliedPromo === 'SNAP10'
    ? Math.round(cartSubtotal * 0.1)
    : 0;

  const shippingFee = cartSubtotal === 0 || cartSubtotal >= freeShippingThreshold || appliedPromo === 'FREESHIP' ? 0 : 149;

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'EDGE20') {
      setAppliedPromo('EDGE20');
      showToast('Promo EDGE20 applied: 20% discount!', 'success');
      return { success: true, message: '20% off applied!' };
    }
    if (clean === 'EDGE10' || clean === 'SNAP10') {
      setAppliedPromo('EDGE10');
      showToast('Promo EDGE10 applied: 10% discount!', 'success');
      return { success: true, message: '10% off applied!' };
    }
    if (clean === 'FREESHIP') {
      setAppliedPromo('FREESHIP');
      showToast('Promo FREESHIP applied: Free shipping unlocked!', 'success');
      return { success: true, message: 'Free shipping applied!' };
    }
    showToast('Invalid promo code. Try EDGE20, EDGE10, or FREESHIP', 'error');
    return { success: false, message: 'Invalid promo code' };
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        editingProduct,
        setEditingProduct,
        isAdminManagerOpen,
        setIsAdminManagerOpen,
        isPostingNew,
        setIsPostingNew,
        openAdminEditProduct,
        openAdminPostProduct,
        currentView,
        setCurrentView,
        activeCategory,
        setActiveCategory,
        goBack,
        canGoBack,
        viewHistory,
        currency,
        setCurrency,
        formatPrice,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isMenuOpen,
        setIsMenuOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalInitialTab,
        setAuthModalInitialTab,
        openAuthModal,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isSizeFitHelperOpen,
        setIsSizeFitHelperOpen,
        isOrderTrackingOpen,
        setIsOrderTrackingOpen,
        isOffersOpen,
        setIsOffersOpen,
        quickViewProduct,
        setQuickViewProduct,
        buyNowData,
        setBuyNowData,
        triggerBuyNow,
        recommendedSize,
        setRecommendedSize,
        getExpectedDeliveryDate,
        recentlyViewed,
        addRecentlyViewed,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        discountAmount,
        appliedPromo,
        applyPromoCode,
        freeShippingThreshold,
        wishlist,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlist.length,
        searchQuery,
        setSearchQuery,
        user,
        setUser,
        updateUserProfile,
        isAdmin,
        loginCustomer,
        loginAdmin,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        addDeliveryAddress,
        deleteDeliveryAddress,
        setDefaultDeliveryAddress,
        pendingAction,
        setPendingAction,
        orders,
        addOrder,
        updateOrderStatus,
        refreshOrders,
        trackingOrderId,
        setTrackingOrderId,
        notifications,
        markNotificationRead,
        isPoliciesOpen,
        setIsPoliciesOpen,
        policiesTab,
        setPoliciesTab,
        openPolicyModal,
        toasts,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );

};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
