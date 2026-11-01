import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Edit3,
  PlusCircle,
  Image as ImageIcon,
  DollarSign,
  Percent,
  Check,
  Trash2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers,
  RotateCcw,
  Tag,
  Eye,
  Package,
  Truck,
  Clock,
  User,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, CustomerOrder } from '../types/store';

// Curated high quality streetwear preset images for rapid admin testing
const SAMPLE_PRESET_IMAGES = [
  { label: 'Oversized Burgundy Tee', url: '/images/prod_oversized_graphic_tee.jpg' },
  { label: 'Acid Wash Boxy Tee', url: '/images/prod_acid_wash_tee.jpg' },
  { label: 'French Terry Hoodie', url: '/images/prod_heavyweight_hoodie.jpg' },
  { label: 'Denim Trucker Jacket', url: '/images/prod_denim_jacket.jpg' },
  { label: 'Tactical Ripstop Cargos', url: '/images/prod_tactical_cargos.jpg' },
  { label: 'Boxy Camp Shirt', url: '/images/prod_camp_collar_shirt.jpg' },
  { label: 'Relaxed Street Joggers', url: '/images/prod_relaxed_joggers.jpg' },
  { label: 'Raw Edge Denim Pants', url: '/images/prod_raw_edge_denim.jpg' },
  { label: 'Cyberpunk Black Jacket', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80' },
  { label: 'Oversized Minimalist Hoodie', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80' },
  { label: 'Japanese Streetwear Bomber', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80' },
  { label: 'Industrial Cargo Pants', url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80' },
];

export const AdminProductManagerModal: React.FC = () => {
  const {
    isAdminManagerOpen,
    setIsAdminManagerOpen,
    isAdmin,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    editingProduct,
    setEditingProduct,
    isPostingNew,
    setIsPostingNew,
    orders,
    updateOrderStatus,
    formatPrice,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'edit' | 'post' | 'orders'>('edit');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Edit / Form state
  const [formId, setFormId] = useState<string>('');
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<Product['category']>('T-Shirts');
  const [formPrice, setFormPrice] = useState<number>(1899);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(2799);
  const [formPrimaryImage, setFormPrimaryImage] = useState<string>('');
  const [formSecondaryImage, setFormSecondaryImage] = useState<string>('');
  const [formGsm, setFormGsm] = useState<number>(280);
  const [formFabric, setFormFabric] = useState<string>('100% Combed Heavyweight Cotton');
  const [formFit, setFormFit] = useState<Product['fit']>('Oversized');
  const [formStock, setFormStock] = useState<number>(45);
  const [formDescription, setFormDescription] = useState<string>('');

  // Sync when editingProduct or isPostingNew changes
  useEffect(() => {
    if (isPostingNew) {
      setActiveTab('post');
      setFormId(`snap-${Date.now()}`);
      setFormName('');
      setFormCategory('T-Shirts');
      setFormPrice(1999);
      setFormOriginalPrice(2999);
      setFormPrimaryImage(SAMPLE_PRESET_IMAGES[0].url);
      setFormSecondaryImage(SAMPLE_PRESET_IMAGES[1].url);
      setFormGsm(280);
      setFormFabric('100% Heavyweight Cotton Single Jersey');
      setFormFit('Oversized');
      setFormStock(50);
      setFormDescription('Signature heavy-drape streetwear silhouette engineered for all-day comfort.');
    } else if (editingProduct) {
      setActiveTab('edit');
      setFormId(editingProduct.id);
      setFormName(editingProduct.name);
      setFormCategory(editingProduct.category);
      setFormPrice(editingProduct.price);
      setFormOriginalPrice(editingProduct.originalPrice || Math.round(editingProduct.price * 1.35));
      setFormPrimaryImage(editingProduct.image);
      setFormSecondaryImage(editingProduct.secondaryImage || '');
      setFormGsm(editingProduct.gsm || 280);
      setFormFabric(editingProduct.fabric || '100% Combed Cotton');
      setFormFit(editingProduct.fit || 'Oversized');
      setFormStock(editingProduct.stock || 25);
      setFormDescription(editingProduct.description || '');
    } else if (products.length > 0 && !formId) {
      // Pick first product as default selection
      const first = products[0];
      setFormId(first.id);
      setFormName(first.name);
      setFormCategory(first.category);
      setFormPrice(first.price);
      setFormOriginalPrice(first.originalPrice || Math.round(first.price * 1.35));
      setFormPrimaryImage(first.image);
      setFormSecondaryImage(first.secondaryImage || '');
      setFormGsm(first.gsm || 280);
      setFormFabric(first.fabric || '100% Combed Cotton');
      setFormFit(first.fit || 'Oversized');
      setFormStock(first.stock || 25);
      setFormDescription(first.description || '');
    }
  }, [editingProduct, isPostingNew, isAdminManagerOpen]);

  if (!isAdminManagerOpen || !isAdmin) return null;

  // Calculate live discount percentage
  const calculatedDiscount =
    formOriginalPrice > formPrice
      ? Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100)
      : 0;

  // Quick discount adjustment buttons
  const applyQuickDiscount = (discountPercent: number) => {
    if (formOriginalPrice <= 0) return;
    const newPrice = Math.round(formOriginalPrice * (1 - discountPercent / 100));
    setFormPrice(newPrice);
    showToast(`Set price to ${discountPercent}% discount: ₹${newPrice}`, 'info');
  };

  const handleSelectProductToEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsPostingNew(false);
    setActiveTab('edit');
    setFormId(prod.id);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormPrice(prod.price);
    setFormOriginalPrice(prod.originalPrice || Math.round(prod.price * 1.35));
    setFormPrimaryImage(prod.image);
    setFormSecondaryImage(prod.secondaryImage || '');
    setFormGsm(prod.gsm || 280);
    setFormFabric(prod.fabric || '100% Combed Cotton');
    setFormFit(prod.fit || 'Oversized');
    setFormStock(prod.stock || 25);
    setFormDescription(prod.description || '');
  };

  const handleSaveEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Product name cannot be empty', 'error');
      return;
    }
    if (!formPrimaryImage.trim()) {
      showToast('Primary image URL is required', 'error');
      return;
    }

    updateProduct(formId, {
      name: formName,
      category: formCategory,
      price: Number(formPrice),
      originalPrice: Number(formOriginalPrice),
      image: formPrimaryImage,
      secondaryImage: formSecondaryImage || undefined,
      gsm: Number(formGsm),
      fabric: formFabric,
      fit: formFit,
      stock: Number(formStock),
      description: formDescription,
    });
  };

  const handlePostNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Please enter a product title', 'error');
      return;
    }
    if (!formPrimaryImage.trim()) {
      showToast('Primary image is required', 'error');
      return;
    }

    const newProd: Product = {
      id: `prod-admin-${Date.now()}`,
      name: formName,
      category: formCategory,
      price: Number(formPrice),
      originalPrice: Number(formOriginalPrice),
      isNew: true,
      image: formPrimaryImage,
      secondaryImage: formSecondaryImage || formPrimaryImage,
      gallery: [formPrimaryImage, formSecondaryImage || formPrimaryImage],
      colors: [
        { name: 'Oxblood Burgundy', hex: '#4A0718' },
        { name: 'Onyx Black', hex: '#111011' },
        { name: 'Bone White', hex: '#F6F1E9' },
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: formDescription || 'Engineered for contemporary luxury streetwear enthusiasts.',
      fabric: formFabric,
      gsm: Number(formGsm),
      fit: formFit,
      stock: Number(formStock),
      rating: 4.9,
      reviewCount: 1,
      measurements: [
        { size: 'S', chest: '44"', length: '28"', shoulder: '21"' },
        { size: 'M', chest: '46"', length: '29"', shoulder: '22"' },
        { size: 'L', chest: '48"', length: '30"', shoulder: '23"' },
        { size: 'XL', chest: '50"', length: '31"', shoulder: '24"' },
        { size: 'XXL', chest: '52"', length: '32"', shoulder: '25"' },
      ],
      reviews: [
        {
          id: `rev-${Date.now()}`,
          author: 'Verified Streetwear Collector',
          rating: 5,
          date: 'Just now',
          comment: 'Incredible heavyweight drape and exact oversized proportions.',
          verified: true,
          sizePurchased: 'L',
        },
      ],
    };

    addProduct(newProd);
    handleSelectProductToEdit(newProd);
  };

  // Filtered product list for sidebar
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === 'All' || p.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={() => setIsAdminManagerOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-5xl h-[92vh] max-h-[880px] bg-[#141314] text-[#F6F1E9] border border-amber-500/40 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 bg-[#211116] border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-500 text-black flex items-center justify-center font-bold">
              <Shield size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black uppercase font-headline tracking-wider text-white">
                  SNAPSTER ADMIN MANAGEMENT CONSOLE
                </h2>
                <span className="bg-amber-400 text-black text-[10px] font-mono px-2 py-0.5 font-black uppercase tracking-wider">
                  MASTER CONTROLS
                </span>
              </div>
              <p className="text-[11px] font-mono text-amber-200/70">
                Live catalog editing: pictures (primary + hover secondary), cost, discount & instant posting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetProducts}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] font-mono text-[#C7BDB7] hover:text-white transition-colors cursor-pointer"
              title="Reset catalog back to defaults"
            >
              <RotateCcw size={12} />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={() => setIsAdminManagerOpen(false)}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
              aria-label="Close admin modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#1A181A] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('edit');
                setIsPostingNew(false);
              }}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#C7BDB7] hover:text-white bg-white/5'
              }`}
            >
              <Edit3 size={13} />
              <span>Edit Existing Pieces ({products.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('post');
                setIsPostingNew(true);
              }}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'post'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-[#C7BDB7] hover:text-white bg-white/5'
              }`}
            >
              <PlusCircle size={13} />
              <span>+ Post Brand New Piece</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                setIsPostingNew(false);
              }}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-emerald-500 text-black shadow-md font-black'
                  : 'text-[#C7BDB7] hover:text-white bg-white/5'
              }`}
            >
              <Package size={13} />
              <span>Customer Orders ({orders.length})</span>
            </button>
          </div>

          <span className="hidden md:inline-block text-[11px] font-mono text-emerald-400">
            ● Real-Time Persistence Enabled
          </span>
        </div>

        {/* Content Body */}
        {activeTab === 'orders' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-black/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm sm:text-base font-bold font-mono uppercase text-white flex items-center gap-2">
                  <Package size={16} className="text-emerald-400" />
                  <span>Customer Orders Fulfillment Console ({orders.length})</span>
                </h3>
                <p className="text-xs text-[#C7BDB7]">
                  Dispatching from Central Hub: MG Road, Vijayawada, AP 520010 via BlueDart Air
                </p>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1">
                ● Live Database Active
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 border border-white/10 bg-white/5 text-center space-y-2">
                <Package size={32} className="mx-auto text-white/40" />
                <h4 className="text-sm font-bold text-white uppercase font-mono">No Orders Placed Yet</h4>
                <p className="text-xs text-[#C7BDB7] max-w-md mx-auto">
                  When customers place orders via the Cart Checkout or Express Buy Now, they will appear here with customer contact details, address, and live delivery status controls.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 sm:p-5 bg-[#1A181A] border border-white/15 space-y-4 shadow-lg hover:border-amber-400/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold font-mono text-white">ORDER #{ord.id}</span>
                          <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 text-white">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 font-bold uppercase">
                            {ord.paymentMethod}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-amber-200/80 mt-1">
                          {ord.awbNumber || ord.estimatedDelivery
                            ? <>Tracking: <strong className="text-white">{ord.awbNumber || 'Awaiting AWB'}</strong> • ETA: {ord.estimatedDelivery || 'Pending'}</>
                            : 'Tracking details will be added after the order is dispatched.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#C7BDB7]">Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as CustomerOrder['status'])}
                          className="bg-black border border-white/30 text-white font-mono text-xs px-2.5 py-1.5 font-bold cursor-pointer focus:border-amber-400 focus:outline-none"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed at Hub">Packed at Hub</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      {/* Customer & Address Details */}
                      <div className="space-y-1 bg-black/40 p-3 border border-white/10">
                        <span className="text-[10px] uppercase text-[#C7BDB7] block font-bold mb-1">
                          Delivery Customer Coordinates:
                        </span>
                        <div className="text-white font-bold">{ord.shippingAddress.fullName}</div>
                        <div className="text-[#C7BDB7]">{ord.shippingAddress.phone}</div>
                        <div className="text-[#C7BDB7]">
                          {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.pincode}
                        </div>
                      </div>

                      {/* Financials */}
                      <div className="space-y-1 bg-black/40 p-3 border border-white/10 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#C7BDB7]">Subtotal:</span>
                          <span className="text-white font-bold">₹{ord.subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        {ord.discount > 0 && (
                          <div className="flex items-center justify-between text-xs text-emerald-400">
                            <span>Discount:</span>
                            <span>-₹{ord.discount.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#C7BDB7]">Shipping:</span>
                          <span className="text-white">{ord.shipping === 0 ? 'FREE' : `₹${ord.shipping}`}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                          <span className="text-[#C7BDB7]">Payment status:</span>
                          <span className={`font-bold ${ord.paymentStatus === 'Paid' || ord.paymentStatus === 'COD Collected' ? 'text-emerald-400' : 'text-amber-300'}`}>
                            {ord.paymentStatus || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                          <span className="text-white font-bold">Grand Total:</span>
                          <span className="text-amber-400 font-bold text-sm">₹{ord.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Items Purchased in Order */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] uppercase font-mono text-[#C7BDB7] font-bold block">
                        Ordered Items ({ord.items.length}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 bg-black/50 border border-white/10">
                            <img src={it.image} alt={it.name} className="w-10 h-10 object-cover shrink-0 border border-white/10" />
                            <div className="text-[11px] font-mono leading-tight truncate">
                              <p className="text-white font-bold truncate">{it.name}</p>
                              <p className="text-[#C7BDB7]">Size: {it.size} • Qty: {it.quantity}</p>
                              <p className="text-amber-300">₹{it.price.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
            {/* Left Column: Product Selector (when in Edit mode) */}
            {activeTab === 'edit' && (
              <div className="md:col-span-4 border-r border-white/10 flex flex-col bg-black/40 overflow-hidden h-full">
              {/* Search & Filter Header */}
              <div className="p-3 border-b border-white/10 space-y-2 shrink-0">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search piece by title..."
                  className="w-full bg-white/5 border border-white/15 px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400"
                />
                <div className="flex gap-1 overflow-x-auto pb-1 text-[10px] font-mono scrollbar-none">
                  {['All', 'T-Shirts', 'Hoodies', 'Shirts', 'Joggers', 'Cargos', 'Denim'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-2 py-1 uppercase whitespace-nowrap cursor-pointer ${
                        selectedCategoryFilter === cat
                          ? 'bg-[#4A0718] text-white font-bold'
                          : 'bg-white/5 text-[#C7BDB7] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product List */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2 space-y-1">
                {filteredProducts.map((p) => {
                  const isSelected = p.id === formId;
                  const discountPct = p.originalPrice
                    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                    : 0;

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProductToEdit(p)}
                      className={`p-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors group ${
                        isSelected
                          ? 'bg-amber-500/15 border border-amber-500/50'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-12 h-14 bg-black/60 shrink-0 overflow-hidden relative border border-white/10">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/prod_oversized_graphic_tee.jpg';
                            }}
                          />
                          {p.secondaryImage && (
                            <span
                              className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border border-black"
                              title="Has hover secondary image"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                            {p.name}
                          </h4>
                          <p className="text-[10px] font-mono text-[#C7BDB7] uppercase">
                            {p.category} · {p.fit}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs font-mono font-bold text-white">
                              {formatPrice(p.price)}
                            </span>
                            {discountPct > 0 && (
                              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                {discountPct}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProduct(p.id);
                          }}
                          className="p-1 text-white/30 hover:text-red-400 transition-colors"
                          title="Delete piece"
                        >
                          <Trash2 size={13} />
                        </button>
                        <span className="text-[9px] font-mono text-white/40">
                          Stock: {p.stock}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Right Column: Editor / Poster Form */}
          <div
            className={`${
              activeTab === 'edit' ? 'md:col-span-8' : 'md:col-span-12'
            } flex-1 overflow-y-auto p-4 sm:p-6 space-y-6`}
          >
            <form onSubmit={activeTab === 'edit' ? handleSaveEdits : handlePostNew} className="space-y-6">
              
              {/* Top Status & Live Discount Ribbon */}
              <div className="bg-[#1D171A] border border-white/10 p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                    {activeTab === 'edit' ? 'LIVE EDITING MODE' : 'NEW PIECE PUBLISHING'}
                  </span>
                  <h3 className="text-lg font-black uppercase font-headline text-white">
                    {formName || 'Untitled Piece'}
                  </h3>
                </div>

                <div className="flex items-center gap-3 bg-black/60 px-3.5 py-2 border border-white/10">
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-[#C7BDB7] uppercase">Discount Calculation</p>
                    <p className="text-sm font-mono font-bold text-emerald-400">
                      {calculatedDiscount > 0 ? `${calculatedDiscount}% DISCOUNT` : 'No Discount'}
                    </p>
                  </div>
                  <Tag size={18} className="text-emerald-400" />
                </div>
              </div>

              {/* SECTION 1: PICTURES EDITING (Primary & Secondary Hover) */}
              <div className="space-y-4 bg-white/[0.03] border border-white/10 p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 className="text-xs font-mono uppercase font-bold text-amber-300 flex items-center gap-2">
                    <ImageIcon size={14} />
                    <span>Product Pictures (Primary & Hover Secondary)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-[#C7BDB7]">
                    Secondary image shows smoothly on card hover
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primary Image */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase font-bold block">
                      Primary Picture URL *
                    </label>
                    <input
                      type="text"
                      value={formPrimaryImage}
                      onChange={(e) => setFormPrimaryImage(e.target.value)}
                      placeholder="e.g. /images/prod_heavyweight_hoodie.jpg"
                      className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                    {/* Primary Image Preview */}
                    <div className="h-44 bg-black/50 border border-white/10 overflow-hidden relative flex items-center justify-center">
                      {formPrimaryImage ? (
                        <img
                          src={formPrimaryImage}
                          alt="Primary preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/prod_oversized_graphic_tee.jpg';
                          }}
                        />
                      ) : (
                        <span className="text-xs font-mono text-white/30">No Primary Image URL</span>
                      )}
                      <span className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 text-[9px] font-mono uppercase text-white font-bold border border-white/15">
                        Primary Front
                      </span>
                    </div>
                  </div>

                  {/* Secondary Image for Hover Interaction */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase font-bold block">
                      Secondary Picture URL (Hover Interaction)
                    </label>
                    <input
                      type="text"
                      value={formSecondaryImage}
                      onChange={(e) => setFormSecondaryImage(e.target.value)}
                      placeholder="e.g. /images/prod_heavyweight_hoodie_back.jpg"
                      className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                    {/* Secondary Image Preview */}
                    <div className="h-44 bg-black/50 border border-white/10 overflow-hidden relative flex items-center justify-center">
                      {formSecondaryImage ? (
                        <img
                          src={formSecondaryImage}
                          alt="Secondary preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/prod_oversized_graphic_tee.jpg';
                          }}
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Eye size={20} className="mx-auto text-white/30 mb-1" />
                          <span className="text-xs font-mono text-white/40 block">
                            No hover secondary picture set.
                          </span>
                          <span className="text-[10px] font-mono text-white/30">
                            Card will show primary on hover.
                          </span>
                        </div>
                      )}
                      <span className="absolute top-2 left-2 bg-emerald-950/80 text-emerald-300 px-2 py-0.5 text-[9px] font-mono uppercase font-bold border border-emerald-500/30">
                        Hover Back / Angle
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1-Click Streetwear Image Presets */}
                <div className="pt-2 border-t border-white/10">
                  <p className="text-[10px] font-mono text-[#C7BDB7] uppercase font-bold mb-2">
                    Quick Preset Streetwear Assets (Click to assign):
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 text-[10px] font-mono">
                        <span className="text-white/80">{preset.label}</span>
                        <button
                          type="button"
                          onClick={() => setFormPrimaryImage(preset.url)}
                          className="text-amber-400 hover:underline px-1 uppercase font-bold cursor-pointer"
                        >
                          Primary
                        </button>
                        <span className="text-white/20">|</span>
                        <button
                          type="button"
                          onClick={() => setFormSecondaryImage(preset.url)}
                          className="text-emerald-400 hover:underline px-1 uppercase font-bold cursor-pointer"
                        >
                          Hover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 2: COST & DISCOUNT EDITING */}
              <div className="space-y-4 bg-white/[0.03] border border-white/10 p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 className="text-xs font-mono uppercase font-bold text-amber-300 flex items-center gap-2">
                    <DollarSign size={14} />
                    <span>Cost, MRP & Discount Options</span>
                  </h4>
                  <span className="text-[10px] font-mono text-[#C7BDB7]">
                    Real-time INR price conversion across entire website
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Selling Price (Cost) */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase font-bold block">
                      Selling Price (Cost to Buyer) *
                    </label>
                    <div className="flex items-center bg-black/60 border border-white/15 px-3 py-2">
                      <span className="text-xs font-mono text-white/50 mr-2">₹</span>
                      <input
                        type="number"
                        min={0}
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="w-full bg-transparent text-sm font-mono font-bold text-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* MRP (Original Price) */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase font-bold block">
                      MRP / Original Price (Strikethrough)
                    </label>
                    <div className="flex items-center bg-black/60 border border-white/15 px-3 py-2">
                      <span className="text-xs font-mono text-white/50 mr-2">₹</span>
                      <input
                        type="number"
                        min={0}
                        value={formOriginalPrice}
                        onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                        className="w-full bg-transparent text-sm font-mono font-bold text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Stock Quantity */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase font-bold block">
                      Inventory Stock
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/15 px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Quick Discount Presets */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[10px] font-mono text-[#C7BDB7] uppercase font-bold">
                    Quick Discount Presets:
                  </span>
                  {[10, 20, 25, 30, 40, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => applyQuickDiscount(pct)}
                      className="px-2.5 py-1 bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-500/50 border border-white/15 text-[10px] font-mono text-white cursor-pointer transition-colors"
                    >
                      {pct}% OFF
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 3: PRODUCT SPECIFICATIONS & DETAILS */}
              <div className="space-y-4 bg-white/[0.03] border border-white/10 p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 className="text-xs font-mono uppercase font-bold text-amber-300 flex items-center gap-2">
                    <Layers size={14} />
                    <span>Product Silhouette & Details</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase font-bold block">
                      Piece Title / Name *
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Tactical Cargo Utility Pant"
                      className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase font-bold block">
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Shirts">Shirts</option>
                      <option value="Hoodies">Hoodies</option>
                      <option value="Joggers">Joggers</option>
                      <option value="Cargos">Cargos</option>
                      <option value="Denim">Denim</option>
                    </select>
                  </div>

                  {/* Silhouette Fit */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase font-bold block">
                      Fit Silhouette
                    </label>
                    <select
                      value={formFit}
                      onChange={(e) => setFormFit(e.target.value as any)}
                      className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Oversized">Oversized</option>
                      <option value="Relaxed Boxy">Relaxed Boxy</option>
                      <option value="Straight Leg">Straight Leg</option>
                      <option value="Tactical Utility">Tactical Utility</option>
                    </select>
                  </div>

                  {/* Fabric & GSM */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-[#C7BDB7] uppercase font-bold block">
                        GSM Weight
                      </label>
                      <input
                        type="number"
                        value={formGsm}
                        onChange={(e) => setFormGsm(Number(e.target.value))}
                        className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs font-mono text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-[#C7BDB7] uppercase font-bold block">
                        Fabric Name
                      </label>
                      <input
                        type="text"
                        value={formFabric}
                        onChange={(e) => setFormFabric(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs font-mono text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-[#C7BDB7] uppercase font-bold block">
                    Product Description
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Enter editorial description..."
                    className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAdminManagerOpen(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-xs font-mono uppercase text-white cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Check size={14} />
                  <span>
                    {activeTab === 'edit'
                      ? 'SAVE EDITS (PICTURES & PRICING)'
                      : 'PUBLISH NEW PIECE TO STORE'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
