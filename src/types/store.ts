export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface SizeMeasurement {
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  chest: string;
  length: string;
  shoulder: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  sizePurchased: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'T-Shirts' | 'Shirts' | 'Hoodies' | 'Joggers' | 'Cargos' | 'Denim';
  price: number;
  originalPrice?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  image: string;
  secondaryImage?: string;
  gallery?: string[];
  colors: ProductColor[];
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[];
  description: string;
  fabric: string;
  gsm: number;
  fit: 'Oversized' | 'Relaxed Boxy' | 'Straight Leg' | 'Tactical Utility';
  stock: number;
  rating: number;
  reviewCount: number;
  measurements?: SizeMeasurement[];
  reviews?: ProductReview[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  quantity: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
  tagline: string;
}

export interface CampaignSlide {
  id: number;
  headline: string;
  statement: string;
  ctaText: string;
  image: string;
  accent: string;
  subtitle: string;
}

export interface Testimonial {
  id: string;
  author: string;
  city: string;
  rating: number;
  review: string;
  productPurchased: string;
}

export type UserRole = 'customer' | 'admin';

export interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system';
  read: boolean;
  createdAt: string;
}

export interface AuthUser {
  id?: string;
  role: UserRole;
  name: string;
  phone?: string;
  email?: string;
  gender?: 'Male' | 'Female' | 'Other';
  avatar?: string;
  photoURL?: string;
  addresses?: SavedAddress[];
  loggedInAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  quantity: number;
}

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded' | 'COD Pending' | 'COD Collected';
export type OrderStatus = 'Confirmed' | 'Processing' | 'Packed at Hub' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface CustomerOrder {
  id: string;
  userId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: OrderStatus;
  awbNumber: string;
  estimatedDelivery: string;
}
