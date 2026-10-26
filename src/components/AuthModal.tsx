import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  Shield,
  KeyRound,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Package,
  LogOut,
  Sparkles,
  Edit3,
  PlusCircle,
  AlertCircle,
  Heart,
  ShoppingBag,
  User as UserIcon,
  MapPin,
  Mail,
  Check,
  Tag,
  Truck,
  FileText,
  Bell,
  Trash2,
  Lock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SnapsterLogo } from './SnapsterLogo';
import { SavedAddress } from '../types/store';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalInitialTab,
    user,
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
    openAdminPostProduct,
    setIsAdminManagerOpen,
    setIsWishlistOpen,
    setIsCartOpen,
    setIsOffersOpen,
    orders,
    refreshOrders,
    setTrackingOrderId,
    setIsOrderTrackingOpen,
    notifications,
    markNotificationRead,
    showToast,
  } = useStore();

  // Selected tab: strictly 'customer' or 'admin'
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');

  // Customer Login Method: 'phone' | 'email' | 'register'
  const [customerAuthMode, setCustomerAuthMode] = useState<'phone' | 'email' | 'register'>('phone');

  // Customer Mobile + Name + OTP states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [otpStep, setOtpStep] = useState<'phone' | 'otp'>('phone');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(30);
  const [isResending, setIsResending] = useState(false);

  // Email / Password states
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin states
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);

  // Customer Profile Tabs (Flipkart-style)
  const [profileTab, setProfileTab] = useState<'profile' | 'orders' | 'addresses' | 'notifications'>('profile');

  // Profile Edit fields
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editGender, setEditGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  // New Address form states
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Vijayawada');
  const [newState, setNewState] = useState('Andhra Pradesh');
  const [newPincode, setNewPincode] = useState('520010');
  const [newIsDefault, setNewIsDefault] = useState(false);

  // Quick order track & Order History state
  const [trackedOrder, setTrackedOrder] = useState('');
  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('All');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Synchronize initial tab and profile values from context when opening
  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalInitialTab);
      setAdminError(null);
      setAuthError(null);
      setEnteredOtp('');
      if (user) {
        setEditName(user.name || '');
        setEditEmail(user.email || '');
        setEditGender(user.gender || 'Male');
      }
    }
  }, [isAuthModalOpen, authModalInitialTab, user]);

  // Timer countdown for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpStep === 'otp' && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpStep, countdown]);

  if (!isAuthModalOpen) return null;

  // Phone OTP Flow
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpStep('otp');
    setCountdown(30);
    setEnteredOtp('');
    showToast(`SNAPSTER SMS: Your OTP is ${code}`, 'info');
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    setIsResending(true);
    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setCountdown(30);
      setIsResending(false);
      showToast(`New OTP sent: ${code}`, 'info');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.length < 4) {
      showToast('Please enter the 4-digit OTP', 'error');
      return;
    }

    if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
      showToast('Incorrect OTP. Try the auto-fill code', 'error');
      return;
    }

    loginCustomer(phoneNumber, enteredOtp, customerName);
    setOtpStep('phone');
    setPhoneNumber('');
    setEnteredOtp('');
    setCustomerName('');
  };

  // Google Sign-In Flow
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setAuthError(err.message || 'Google Sign-in was cancelled or failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Email Sign-In Flow
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Email and password are required');
      return;
    }
    setIsSubmitting(true);
    setAuthError(null);
    const res = await loginWithEmail(authEmail, authPassword);
    setIsSubmitting(false);
    if (!res.success) {
      setAuthError(res.message);
    }
  };

  // Email Register Flow
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim() || !registerName.trim()) {
      setAuthError('Please fill in all required fields');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      return;
    }
    setIsSubmitting(true);
    setAuthError(null);
    const res = await registerWithEmail(authEmail, authPassword, registerName, registerPhone);
    setIsSubmitting(false);
    if (!res.success) {
      setAuthError(res.message);
    }
  };

  // Admin Login Flow
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    if (!adminUsername.trim()) {
      setAdminError('Please enter admin username (use: admin)');
      return;
    }
    if (!adminPassword.trim()) {
      setAdminError('Please enter admin password (use: snapster2026)');
      return;
    }
    const result = loginAdmin(adminUsername, adminPassword);
    if (result.success) {
      setAdminUsername('');
      setAdminPassword('');
    } else {
      setAdminError(result.message);
    }
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    updateUserProfile({
      name: editName.trim(),
      email: editEmail.trim(),
      gender: editGender,
    });
  };

  // Address Add
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newPhone.trim() || !newStreet.trim() || !newPincode.trim()) {
      showToast('Please complete all required address fields', 'error');
      return;
    }
    await addDeliveryAddress({
      fullName: newFullName.trim(),
      phone: newPhone.trim(),
      street: newStreet.trim(),
      city: newCity.trim(),
      state: newState.trim(),
      pincode: newPincode.trim(),
      isDefault: newIsDefault,
    });
    setShowAddAddressForm(false);
    setNewFullName('');
    setNewPhone('');
    setNewStreet('');
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackedOrder.trim()) return;
    setTrackingOrderId(trackedOrder.trim().toUpperCase());
    setIsAuthModalOpen(false);
    setIsOrderTrackingOpen(true);
  };

  // Avatar Initials
  const getInitials = (name: string) => {
    if (!name) return 'S';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={() => setIsAuthModalOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-[#141314] text-[#F6F1E9] border border-white/15 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Branding */}
        <div className="p-4 bg-[#300510] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <SnapsterLogo size="sm" variant="light" />
            <span className="text-[10px] font-mono text-white/60 hidden sm:inline">
              // VIJAYAWADA AP HUB
            </span>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-white/70 hover:text-white transition-opacity cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Top-Level Tab Switcher between Customer Login and Admin Portal */}
        {!user && (
          <div className="flex border-b border-white/10 bg-[#111011] shrink-0 text-xs font-mono">
            <button
              onClick={() => {
                setActiveTab('customer');
                setAdminError(null);
                setAuthError(null);
              }}
              className={`flex-1 py-3 px-4 text-center font-bold tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 border-b-2 ${
                activeTab === 'customer'
                  ? 'border-white text-white bg-white/5'
                  : 'border-transparent text-[#C7BDB7] hover:text-white'
              }`}
            >
              <UserIcon size={14} className="text-emerald-400" />
              <span>Customer Sign In</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('admin');
                setAdminError(null);
                setAuthError(null);
              }}
              className={`flex-1 py-3 px-4 text-center font-bold tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 border-b-2 ${
                activeTab === 'admin'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                  : 'border-transparent text-[#C7BDB7] hover:text-amber-300'
              }`}
            >
              <Shield size={14} className="text-amber-400" />
              <span>Staff / Admin Portal</span>
            </button>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {user ? (
            /* ========================================================================= */
            /* LOGGED-IN CUSTOMER PROFILE OR ADMIN DASHBOARD                             */
            /* ========================================================================= */
            <div className="space-y-6 animate-fade-in">
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shrink-0 shadow-lg"
                  />
                ) : (
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-bold font-headline text-lg sm:text-xl shadow-lg shrink-0 ${
                      isAdmin
                        ? 'bg-amber-500 text-black border-2 border-amber-300'
                        : 'bg-[#4A0718] text-white border-2 border-white/20'
                    }`}
                  >
                    {isAdmin ? <Shield size={26} /> : getInitials(user.name)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black uppercase text-white truncate">
                      {user.name}
                    </h3>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 uppercase tracking-wider font-bold ${
                        isAdmin
                          ? 'bg-amber-400 text-black border border-amber-300'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {isAdmin ? 'MASTER ADMIN' : 'VERIFIED VIP CUSTOMER'}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-[#C7BDB7] truncate">
                    {user.email || user.phone || 'Vijayawada Member'}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 mt-0.5">
                    <MapPin size={11} />
                    <span>MG Road, Vijayawada, AP 520010</span>
                  </div>
                </div>
              </div>

              {/* ADMIN VIEW */}
              {isAdmin ? (
                <div className="space-y-4 bg-amber-950/20 border border-amber-500/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-300 text-xs font-bold font-mono uppercase tracking-wider">
                      <Sparkles size={15} />
                      <span>Admin Management Console</span>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-400/20 text-amber-300 px-2 py-0.5 border border-amber-400/30">
                      FIRESTORE SYNC ACTIVE
                    </span>
                  </div>

                  <p className="text-xs text-[#C7BDB7] leading-relaxed">
                    You have master control to update product pictures, change selling prices & discount percentages, post new inventory to Firestore, manage customer orders, and issue promo codes.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(false);
                        setIsAdminManagerOpen(true);
                      }}
                      className="py-3 px-3 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#F6F1E9] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                    >
                      <Edit3 size={14} />
                      <span>Edit Catalog & Pricing</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsAuthModalOpen(false);
                        openAdminPostProduct();
                      }}
                      className="py-3 px-3 bg-amber-500 text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-amber-400 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                    >
                      <PlusCircle size={14} />
                      <span>+ Post Brand New Piece</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsAuthModalOpen(false);
                        setIsAdminManagerOpen(true);
                      }}
                      className="py-3 px-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer border border-white/15"
                    >
                      <Package size={14} className="text-emerald-400" />
                      <span>Customer Orders ({orders.length})</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsAuthModalOpen(false);
                        setIsOffersOpen(true);
                      }}
                      className="py-3 px-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer border border-white/15"
                    >
                      <Tag size={14} className="text-amber-400" />
                      <span>Store Promo Offers</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* CUSTOMER FLIPKART-STYLE MANAGEMENT VIEW */
                <div className="space-y-4">
                  {/* Sub-tabs */}
                  <div className="flex border-b border-white/15 text-xs font-mono overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => setProfileTab('profile')}
                      className={`px-3 sm:px-4 py-2 font-bold uppercase tracking-wider cursor-pointer border-b-2 whitespace-nowrap transition-colors ${
                        profileTab === 'profile'
                          ? 'border-[#4A0718] text-white bg-white/5'
                          : 'border-transparent text-[#C7BDB7] hover:text-white'
                      }`}
                    >
                      Personal Info
                    </button>

                    <button
                      onClick={() => setProfileTab('orders')}
                      className={`px-3 sm:px-4 py-2 font-bold uppercase tracking-wider cursor-pointer border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                        profileTab === 'orders'
                          ? 'border-[#4A0718] text-white bg-white/5'
                          : 'border-transparent text-[#C7BDB7] hover:text-white'
                      }`}
                    >
                      <span>My Orders</span>
                      <span className="px-1.5 py-0.2 bg-white/15 text-[10px] text-white">
                        {orders.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setProfileTab('addresses')}
                      className={`px-3 sm:px-4 py-2 font-bold uppercase tracking-wider cursor-pointer border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                        profileTab === 'addresses'
                          ? 'border-[#4A0718] text-white bg-white/5'
                          : 'border-transparent text-[#C7BDB7] hover:text-white'
                      }`}
                    >
                      <span>Addresses</span>
                      <span className="px-1.5 py-0.2 bg-white/15 text-[10px] text-white">
                        {user.addresses?.length || 0}
                      </span>
                    </button>

                    <button
                      onClick={() => setProfileTab('notifications')}
                      className={`px-3 sm:px-4 py-2 font-bold uppercase tracking-wider cursor-pointer border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                        profileTab === 'notifications'
                          ? 'border-[#4A0718] text-white bg-white/5'
                          : 'border-transparent text-[#C7BDB7] hover:text-white'
                      }`}
                    >
                      <Bell size={12} />
                      <span>Alerts</span>
                    </button>
                  </div>

                  {/* TAB 1: PERSONAL INFO */}
                  {profileTab === 'profile' && (
                    <form onSubmit={handleSaveProfile} className="space-y-4 bg-white/5 border border-white/10 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase font-bold text-white flex items-center gap-1.5">
                          <UserIcon size={13} className="text-emerald-400" />
                          Personal Information
                        </span>
                        <span className="text-[10px] font-mono text-[#C7BDB7]">
                          Flipkart-style Profile
                        </span>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1 font-bold">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="e.g. Santhi Raju Gonnabattula"
                          className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white font-sans focus:outline-none focus:border-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1 font-bold">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          placeholder="e.g. santhirajugonnabattula@gmail.com"
                          className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white font-sans focus:outline-none focus:border-white"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1 font-bold">
                          Mobile Number
                        </label>
                        <div className="flex items-center justify-between bg-black/40 border border-white/10 px-3 py-2 text-xs font-mono text-[#C7BDB7]">
                          <span>{user.phone || '+91 9876543210'}</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                            <CheckCircle2 size={12} /> Verified
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1.5 font-bold">
                          Gender
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Male', 'Female', 'Other'] as const).map((g) => (
                            <button
                              type="button"
                              key={g}
                              onClick={() => setEditGender(g)}
                              className={`py-2 text-xs font-mono uppercase tracking-wider text-center border cursor-pointer transition-colors ${
                                editGender === g
                                  ? 'bg-white text-black font-bold border-white'
                                  : 'bg-black/40 text-[#C7BDB7] border-white/10 hover:border-white/30'
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-white text-black hover:bg-[#F6F1E9] font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                      >
                        <Check size={14} />
                        <span>Save Profile Changes</span>
                      </button>
                    </form>
                  )}

                  {/* TAB 2: MY ORDERS WITH LIVE FIRESTORE ORDER HISTORY VIEW */}
                  {profileTab === 'orders' && (
                    <div className="space-y-4">
                      {/* Top Action Bar: Search, Status Filter & Live Sync */}
                      <div className="p-3 bg-black/60 border border-white/10 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Package size={15} className="text-emerald-400" />
                            <span className="text-xs font-mono uppercase font-bold text-white tracking-wider">
                              Order History ({orders.length})
                            </span>
                            <span className="hidden sm:inline-block text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5">
                              ● Firestore Live
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={async () => {
                              setIsRefreshingOrders(true);
                              await refreshOrders();
                              setIsRefreshingOrders(false);
                            }}
                            disabled={isRefreshingOrders}
                            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors border border-white/10 disabled:opacity-50"
                            title="Fetch latest orders from Firestore"
                          >
                            <RefreshCw size={12} className={isRefreshingOrders ? 'animate-spin' : ''} />
                            <span>{isRefreshingOrders ? 'Syncing...' : 'Sync Firestore'}</span>
                          </button>
                        </div>

                        {/* Search & Status Filters */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-0.5">
                          <input
                            type="text"
                            value={orderSearchQuery}
                            onChange={(e) => setOrderSearchQuery(e.target.value)}
                            placeholder="Filter by Order ID, item, or BlueDart AWB..."
                            className="flex-1 bg-black/80 border border-white/15 px-2.5 py-1.5 text-xs text-white font-mono placeholder-white/40 focus:outline-none focus:border-white"
                          />
                          <select
                            value={orderFilterStatus}
                            onChange={(e) => setOrderFilterStatus(e.target.value)}
                            className="bg-black border border-white/20 text-white text-xs font-mono px-2 py-1.5 cursor-pointer focus:outline-none"
                          >
                            <option value="All">All Statuses</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Packed at Hub">Packed at Hub</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Paid">Payment: Paid</option>
                            <option value="COD Pending">Payment: COD</option>
                          </select>
                        </div>
                      </div>

                      {/* Orders Cards List */}
                      {(() => {
                        const filtered = orders.filter((ord) => {
                          const matchesStatus =
                            orderFilterStatus === 'All' ||
                            ord.status.toLowerCase() === orderFilterStatus.toLowerCase() ||
                            ord.paymentStatus?.toLowerCase() === orderFilterStatus.toLowerCase();
                          const q = orderSearchQuery.toLowerCase().trim();
                          const matchesSearch =
                            !q ||
                            ord.id.toLowerCase().includes(q) ||
                            ord.awbNumber?.toLowerCase().includes(q) ||
                            ord.items.some((item) => item.name.toLowerCase().includes(q));
                          return matchesStatus && matchesSearch;
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="p-8 bg-white/5 border border-white/10 text-center space-y-2 font-mono">
                              <Package size={30} className="mx-auto text-white/40" />
                              <h4 className="text-xs font-bold text-white uppercase">
                                {orders.length === 0 ? 'No Orders Placed Yet' : 'No Orders Matching Filter'}
                              </h4>
                              <p className="text-[11px] text-[#C7BDB7] max-w-sm mx-auto">
                                {orders.length === 0
                                  ? 'When you purchase via Bag or Express Buy Now, orders save permanently to your Firestore profile.'
                                  : 'Try changing your search query or status filter.'}
                              </p>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                            {filtered.map((ord) => (
                              <div
                                key={ord.id}
                                className="bg-black/80 border border-white/15 p-3.5 space-y-3 shadow-md hover:border-amber-400/40 transition-colors"
                              >
                                {/* Card Header */}
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5 text-xs font-mono">
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <strong className="text-white text-sm font-bold">#{ord.id}</strong>
                                      <span className="text-[10px] text-[#C7BDB7]">
                                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                        })}
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-[#C7BDB7] mt-0.5">
                                      AWB: <span className="text-white font-bold">{ord.awbNumber}</span> • BlueDart Air AP
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {/* Payment status badge */}
                                    <span
                                      className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                                        ord.paymentStatus === 'Paid'
                                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                          : ord.paymentStatus === 'COD Pending'
                                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                      }`}
                                    >
                                      {ord.paymentStatus || 'Pending'}
                                    </span>

                                    {/* Fulfillment status badge */}
                                    <span
                                      className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                                        ord.status === 'Delivered'
                                          ? 'bg-green-600/30 text-green-300 border border-green-500/40'
                                          : ord.status === 'Shipped' || ord.status === 'Out for Delivery'
                                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                      }`}
                                    >
                                      {ord.status}
                                    </span>
                                  </div>
                                </div>

                                {/* Items list */}
                                <div className="space-y-1.5">
                                  {ord.items.map((item, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-3 bg-white/5 p-2 border border-white/5"
                                    >
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-11 h-13 object-cover object-center bg-black shrink-0"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-white truncate">{item.name}</p>
                                        <p className="text-[11px] text-[#C7BDB7] font-mono">
                                          Size {item.size} • {item.color} • Qty {item.quantity}
                                        </p>
                                      </div>
                                      <div className="text-right shrink-0 font-mono text-xs text-white font-bold">
                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Address and Financial summary */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono bg-white/5 p-2.5 border border-white/5">
                                  <div>
                                    <span className="text-[#C7BDB7] text-[10px] uppercase block font-bold">
                                      Delivery Address:
                                    </span>
                                    <p className="text-white truncate">
                                      {ord.shippingAddress?.fullName} ({ord.shippingAddress?.phone})
                                    </p>
                                    <p className="text-[#C7BDB7] truncate">
                                      {ord.shippingAddress?.street}, {ord.shippingAddress?.city} - {ord.shippingAddress?.pincode}
                                    </p>
                                  </div>

                                  <div className="text-right flex flex-col justify-between">
                                    <div>
                                      <span className="text-[#C7BDB7]">Method: </span>
                                      <span className="text-white font-bold">{ord.paymentMethod}</span>
                                    </div>
                                    <div>
                                      <span className="text-[#C7BDB7]">Total: </span>
                                      <strong className="text-sm font-bold text-emerald-400">
                                        ₹{ord.total.toLocaleString('en-IN')}
                                      </strong>
                                    </div>
                                  </div>
                                </div>

                                {/* Actions Bar */}
                                <div className="flex items-center justify-between gap-2 pt-1">
                                  <span className="text-[10px] font-mono text-amber-200/80">
                                    ETA: {ord.estimatedDelivery}
                                  </span>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setTrackingOrderId(ord.id);
                                        setIsAuthModalOpen(false);
                                        setIsOrderTrackingOpen(true);
                                      }}
                                      className="px-3 py-1.5 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#F6F1E9] transition-colors cursor-pointer shadow flex items-center gap-1.5"
                                    >
                                      <Truck size={12} />
                                      <span>Track Live</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Manual Order Tracker Search */}
                      <form onSubmit={handleTrack} className="bg-white/5 border border-white/10 p-3 space-y-2">
                        <label className="text-[10px] font-mono uppercase text-[#C7BDB7] block font-bold">
                          Quick Track by Order ID or BlueDart AWB
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={trackedOrder}
                            onChange={(e) => setTrackedOrder(e.target.value)}
                            placeholder="e.g. SNP-94812"
                            className="flex-1 bg-black/60 border border-white/15 px-2.5 py-1.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-white"
                          />
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-white text-black font-mono text-xs font-bold uppercase hover:bg-[#F6F1E9] cursor-pointer"
                          >
                            Track
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* TAB 3: MULTIPLE SAVED ADDRESSES (FLIPKART WORKFLOW) */}
                  {profileTab === 'addresses' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase font-bold text-white flex items-center gap-1.5">
                          <MapPin size={13} className="text-emerald-400" />
                          Saved Delivery Addresses ({user.addresses?.length || 0})
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                          className="px-2.5 py-1 bg-white text-black text-[10px] font-mono font-bold uppercase hover:bg-[#F6F1E9] cursor-pointer"
                        >
                          {showAddAddressForm ? 'Cancel' : '+ Add Address'}
                        </button>
                      </div>

                      {/* Add Address Form */}
                      {showAddAddressForm && (
                        <form onSubmit={handleAddAddress} className="bg-black/60 border border-white/20 p-4 space-y-3 animate-fade-in">
                          <h5 className="text-xs font-mono font-bold uppercase text-amber-300">
                            New Delivery Address
                          </h5>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={newFullName}
                              onChange={(e) => setNewFullName(e.target.value)}
                              placeholder="Full Name"
                              className="bg-white/5 border border-white/15 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                              required
                            />
                            <input
                              type="tel"
                              value={newPhone}
                              onChange={(e) => setNewPhone(e.target.value)}
                              placeholder="Phone Number"
                              className="bg-white/5 border border-white/15 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                              required
                            />
                          </div>

                          <input
                            type="text"
                            value={newStreet}
                            onChange={(e) => setNewStreet(e.target.value)}
                            placeholder="Street / Flat / Landmark"
                            className="w-full bg-white/5 border border-white/15 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            required
                          />

                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={newCity}
                              onChange={(e) => setNewCity(e.target.value)}
                              placeholder="City"
                              className="bg-white/5 border border-white/15 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                              required
                            />
                            <input
                              type="text"
                              value={newState}
                              readOnly
                              className="bg-white/5 border border-white/15 px-2.5 py-1.5 text-xs text-white/70 focus:outline-none"
                            />
                            <input
                              type="text"
                              value={newPincode}
                              onChange={(e) => setNewPincode(e.target.value)}
                              placeholder="Pincode"
                              className="bg-white/5 border border-white/15 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                              required
                            />
                          </div>

                          <label className="flex items-center gap-2 text-xs font-mono text-[#C7BDB7] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newIsDefault}
                              onChange={(e) => setNewIsDefault(e.target.checked)}
                              className="accent-amber-400"
                            />
                            <span>Make this my primary delivery address</span>
                          </label>

                          <button
                            type="submit"
                            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase"
                          >
                            Save Address
                          </button>
                        </form>
                      )}

                      {/* Address Cards List */}
                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {(user.addresses || []).map((addr) => (
                          <div
                            key={addr.id}
                            className={`p-3 border text-xs font-mono space-y-1 ${
                              addr.isDefault
                                ? 'bg-[#4A0718]/30 border-amber-400/60'
                                : 'bg-black/40 border-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{addr.fullName}</span>
                              {addr.isDefault ? (
                                <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 font-bold uppercase">
                                  Default
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDefaultDeliveryAddress(addr.id)}
                                  className="text-[10px] text-white/70 hover:text-white underline cursor-pointer"
                                >
                                  Set as Default
                                </button>
                              )}
                            </div>
                            <p className="text-[#C7BDB7]">{addr.phone}</p>
                            <p className="text-white/90">
                              {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => deleteDeliveryAddress(addr.id)}
                                className="text-red-400 hover:text-red-300 text-[10px] flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={11} />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: NOTIFICATIONS */}
                  {profileTab === 'notifications' && (
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono uppercase text-[#C7BDB7] flex items-center gap-1.5 font-bold">
                        <Bell size={13} className="text-amber-400" />
                        Account & Delivery Alerts
                      </span>
                      {notifications.length > 0 ? (
                        <div className="space-y-2 max-h-52 overflow-y-auto">
                          {notifications.map((n) => (
                            <div
                              key={n.id}
                              className={`p-3 border text-xs font-mono space-y-1 ${
                                n.read ? 'bg-black/40 border-white/10 text-[#C7BDB7]' : 'bg-white/5 border-amber-400/40 text-white'
                              }`}
                            >
                              <div className="flex items-center justify-between font-bold">
                                <span>{n.title}</span>
                                <span className="text-[9px] text-[#C7BDB7]">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-[11px] leading-relaxed text-[#C7BDB7]">{n.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-white/5 border border-white/10 text-center text-xs text-[#C7BDB7]">
                          No new notifications. All order milestones will appear here.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Customer Quick Shortcuts */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(false);
                        setIsWishlistOpen(true);
                      }}
                      className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                    >
                      <Heart size={13} className="text-red-400" />
                      <span>Saved Pieces</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsAuthModalOpen(false);
                        setIsCartOpen(true);
                      }}
                      className="py-2.5 px-3 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#F6F1E9] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      <ShoppingBag size={13} />
                      <span>My Shopping Bag</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Sign Out Button */}
              <button
                onClick={logout}
                className="w-full py-2.5 bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 border border-white/15 text-xs font-mono uppercase text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut size={13} />
                <span>Sign Out of Account</span>
              </button>
            </div>
          ) : (
            /* ========================================================================= */
            /* UNAUTHENTICATED LOGIN VIEWS (CUSTOMER: GOOGLE / PHONE / EMAIL)           */
            /* ========================================================================= */
            <div>
              {/* TAB 1: CUSTOMER REGISTRATION & LOGIN */}
              {activeTab === 'customer' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="text-left space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                      <span>CUSTOMER SECURE LOGIN</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black uppercase font-headline tracking-wide text-white">
                      LOGIN TO YOUR SNAPSTER ACCOUNT
                    </h3>
                    <p className="text-xs text-[#C7BDB7]">
                      Access your persistent Shopping Bag, Saved Pieces, and Vijayawada AP deliveries.
                    </p>
                  </div>

                  {/* 1. Google One-Tap / Popup Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-white hover:bg-[#F6F1E9] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-md"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-[10px] font-mono text-[#C7BDB7] uppercase">or sign in with</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Customer Sub-Auth Selector: Phone OTP vs Email Sign In */}
                  <div className="flex border border-white/15 bg-black/40 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerAuthMode('phone');
                        setAuthError(null);
                      }}
                      className={`flex-1 py-2 text-center font-bold uppercase transition-colors cursor-pointer ${
                        customerAuthMode === 'phone' ? 'bg-white text-black' : 'text-[#C7BDB7] hover:text-white'
                      }`}
                    >
                      Phone OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerAuthMode('email');
                        setAuthError(null);
                      }}
                      className={`flex-1 py-2 text-center font-bold uppercase transition-colors cursor-pointer ${
                        customerAuthMode === 'email' ? 'bg-white text-black' : 'text-[#C7BDB7] hover:text-white'
                      }`}
                    >
                      Email & Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerAuthMode('register');
                        setAuthError(null);
                      }}
                      className={`flex-1 py-2 text-center font-bold uppercase transition-colors cursor-pointer ${
                        customerAuthMode === 'register' ? 'bg-white text-black' : 'text-[#C7BDB7] hover:text-white'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  {authError && (
                    <div className="p-2.5 bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-1.5">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* MODE A: PHONE OTP */}
                  {customerAuthMode === 'phone' && (
                    <div>
                      {otpStep === 'phone' ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                          <div>
                            <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1 font-bold">
                              Your Full Name
                            </label>
                            <input
                              type="text"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              placeholder="e.g. Santhi Raju Gonnabattula"
                              className="w-full bg-white/5 border border-white/15 px-3 py-2 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white font-sans"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1 font-bold">
                              10-Digit Mobile Number
                            </label>
                            <div className="flex items-center bg-white/5 border border-white/15 focus-within:border-white transition-colors">
                              <div className="px-3 py-2 text-xs font-mono font-bold text-white/90 border-r border-white/15 bg-white/5 flex items-center gap-1.5">
                                <span className="text-emerald-400">🇮🇳</span>
                                <span>+91</span>
                              </div>
                              <input
                                type="tel"
                                maxLength={10}
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                placeholder="98765 43210"
                                className="w-full px-3 py-2 text-sm font-mono text-white bg-transparent focus:outline-none placeholder:text-white/30"
                                required
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 bg-white text-black hover:bg-[#F6F1E9] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
                          >
                            <span>GET VERIFICATION OTP</span>
                            <ArrowRight size={14} />
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                          <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                              <div>
                                <p className="text-[11px] font-mono text-emerald-300 font-bold">
                                  SMS Code: <strong className="text-white underline text-xs">{generatedOtp}</strong>
                                </p>
                                <p className="text-[10px] font-mono text-[#C7BDB7]">
                                  Sent to +91 {phoneNumber}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setEnteredOtp(generatedOtp)}
                              className="px-2.5 py-1 bg-emerald-400 text-black text-[10px] font-mono font-bold uppercase hover:bg-emerald-300 cursor-pointer shadow"
                            >
                              Auto-Fill
                            </button>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-[11px] font-mono text-[#C7BDB7] uppercase font-bold">
                                Enter 4-Digit OTP
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  setOtpStep('phone');
                                  setEnteredOtp('');
                                }}
                                className="text-[10px] font-mono text-white/70 hover:text-white underline cursor-pointer"
                              >
                                Change Number
                              </button>
                            </div>
                            <input
                              type="text"
                              maxLength={4}
                              value={enteredOtp}
                              onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                              placeholder="• • • •"
                              className="w-full bg-white/5 border border-white/20 px-4 py-3 text-center tracking-[0.5em] text-xl font-mono text-white focus:outline-none focus:border-white"
                              autoFocus
                              required
                            />
                          </div>

                          <div className="flex items-center justify-between text-xs font-mono text-[#C7BDB7]">
                            <span>Didn't receive code?</span>
                            {countdown > 0 ? (
                              <span className="text-white/60">Resend in {countdown}s</span>
                            ) : (
                              <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isResending}
                                className="text-white font-bold underline hover:text-white/80 flex items-center gap-1 cursor-pointer"
                              >
                                <RefreshCw size={11} className={isResending ? 'animate-spin' : ''} />
                                <span>Resend OTP</span>
                              </button>
                            )}
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 bg-white text-black hover:bg-[#F6F1E9] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
                          >
                            <CheckCircle2 size={15} />
                            <span>VERIFY & SIGN IN</span>
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* MODE B: EMAIL SIGN IN */}
                  {customerAuthMode === 'email' && (
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                      <div>
                        <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1 font-bold">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full bg-white/5 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1 font-bold">
                          Password
                        </label>
                        <input
                          type="password"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white/5 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-white text-black hover:bg-[#F6F1E9] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg disabled:opacity-50"
                      >
                        <Lock size={14} />
                        <span>SIGN IN WITH EMAIL</span>
                      </button>
                    </form>
                  )}

                  {/* MODE C: EMAIL REGISTRATION */}
                  {customerAuthMode === 'register' && (
                    <form onSubmit={handleEmailRegister} className="space-y-3">
                      <div>
                        <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1 font-bold">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          placeholder="e.g. Santhi Raju"
                          className="w-full bg-white/5 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1 font-bold">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="name@email.com"
                            className="w-full bg-white/5 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1 font-bold">
                            Mobile (Optional)
                          </label>
                          <input
                            type="tel"
                            maxLength={10}
                            value={registerPhone}
                            onChange={(e) => setRegisterPhone(e.target.value)}
                            placeholder="9876543210"
                            className="w-full bg-white/5 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1 font-bold">
                          Create Password (min 6 chars) *
                        </label>
                        <input
                          type="password"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white/5 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg disabled:opacity-50"
                      >
                        <PlusCircle size={14} />
                        <span>CREATE VIP ACCOUNT</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: ADMIN LOGIN (SEPARATED ACCESS) */}
              {activeTab === 'admin' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      <h3 className="text-lg font-black uppercase font-headline tracking-wide text-white">
                        STAFF & ADMIN PORTAL
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 border border-amber-400/20">
                      RESTRICTED ACCESS
                    </span>
                  </div>

                  <p className="text-xs text-[#C7BDB7]">
                    Login credentials are required to modify the store catalog, change selling prices, manage orders in Firestore, and edit inventory.
                  </p>

                  <form onSubmit={handleAdminSubmit} className="space-y-4 pt-1">
                    <div>
                      <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1 font-bold">
                        Admin Username / ID
                      </label>
                      <input
                        type="text"
                        value={adminUsername}
                        onChange={(e) => {
                          setAdminUsername(e.target.value);
                          setAdminError(null);
                        }}
                        placeholder="e.g. admin"
                        className="w-full bg-white/5 border border-white/15 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                        autoFocus
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1 font-bold">
                        Admin Security Password
                      </label>
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => {
                          setAdminPassword(e.target.value);
                          setAdminError(null);
                        }}
                        placeholder="e.g. snapster2026"
                        className="w-full bg-white/5 border border-white/15 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>

                    <div className="bg-amber-950/20 border border-amber-500/30 p-3 text-[11px] font-mono text-amber-200/90 flex flex-col gap-1">
                      <div className="flex items-center justify-between font-bold">
                        <span>Authorized Store Credentials:</span>
                        <span className="text-emerald-400">Vijayawada AP</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/80">
                        <span>User: <strong className="text-amber-300">admin</strong></span>
                        <span>Password: <strong className="text-amber-300">snapster2026</strong></span>
                      </div>
                    </div>

                    {adminError && (
                      <p className="text-xs text-red-400 font-mono flex items-center gap-1">
                        <AlertCircle size={12} />
                        {adminError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-amber-500 text-black hover:bg-amber-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      <Shield size={14} />
                      <span>UNLOCK ADMIN MANAGEMENT</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-black/60 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#C7BDB7] shrink-0">
          <span>YOUR DAY. YOUR DRIP. // VIJAYAWADA AP</span>
          {!user && activeTab === 'customer' && (
            <button
              onClick={() => {
                setActiveTab('admin');
                setAdminError(null);
              }}
              className="text-amber-400 hover:underline cursor-pointer text-[10px] font-bold"
            >
              Are you an Admin? Click here →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
