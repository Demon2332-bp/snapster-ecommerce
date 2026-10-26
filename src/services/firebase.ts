import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  getDocFromServer,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, CustomerOrder, SavedAddress, AuthUser, CartItem, UserNotification } from '../types/store';
import { PRODUCTS } from '../data/mockData';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with specific database ID if specified
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test Firestore Connection on Boot (Required by skill)
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firestore] Connected successfully to', firebaseConfig.firestoreDatabaseId || '(default)');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firestore] Offline or connection pending, local cache active.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

/* ========================================================================= */
/* 1. AUTHENTICATION SERVICES                                                */
/* ========================================================================= */

// Sign In with Google
export async function signInWithGoogleService(): Promise<AuthUser | null> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const fbUser = cred.user;
    
    // Check if user document exists in Firestore
    const userDocRef = doc(db, 'users', fbUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    let profile: AuthUser;
    if (userDoc.exists()) {
      profile = userDoc.data() as AuthUser;
      profile.id = fbUser.uid;
    } else {
      // Determine if admin by email
      const isAdminEmail = fbUser.email === 'admin@snapster.in' || fbUser.email?.includes('admin');
      profile = {
        id: fbUser.uid,
        name: fbUser.displayName || 'SNAPSTER VIP Member',
        email: fbUser.email || '',
        phone: fbUser.phoneNumber || '',
        role: isAdminEmail ? 'admin' : 'customer',
        photoURL: fbUser.photoURL || undefined,
        gender: 'Male',
        addresses: [
          {
            id: `addr-${Date.now()}`,
            fullName: fbUser.displayName || 'Customer',
            phone: fbUser.phoneNumber || '+91 9876543210',
            street: 'MG Road, Labbipet',
            city: 'Vijayawada',
            state: 'Andhra Pradesh',
            pincode: '520010',
            isDefault: true,
          },
        ],
        loggedInAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, {
        ...profile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    return profile;
  } catch (err: any) {
    console.error('Google Sign-In failed:', err);
    throw new Error(err.message || 'Google sign-in could not be completed.');
  }
}

// Sign In with Email & Password
export async function signInWithEmailService(email: string, pass: string): Promise<AuthUser> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  const fbUser = cred.user;
  
  const userDocRef = doc(db, 'users', fbUser.uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const profile = userDoc.data() as AuthUser;
    profile.id = fbUser.uid;
    return profile;
  }
  
  const isAdminEmail = email.toLowerCase() === 'admin@snapster.in';
  const profile: AuthUser = {
    id: fbUser.uid,
    name: fbUser.displayName || (isAdminEmail ? 'Master Admin' : 'Customer'),
    email: email.trim(),
    role: isAdminEmail ? 'admin' : 'customer',
    gender: 'Male',
    loggedInAt: new Date().toISOString(),
  };
  await setDoc(userDocRef, {
    ...profile,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return profile;
}

// Sign Up with Email & Password
export async function signUpWithEmailService(
  email: string,
  pass: string,
  name: string,
  phone?: string
): Promise<AuthUser> {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  const fbUser = cred.user;
  
  const isAdminEmail = email.toLowerCase() === 'admin@snapster.in';
  const profile: AuthUser = {
    id: fbUser.uid,
    name: name.trim() || 'SNAPSTER VIP Member',
    email: email.trim(),
    phone: phone ? (phone.startsWith('+91') ? phone : `+91 ${phone.replace(/\D/g, '')}`) : '',
    role: isAdminEmail ? 'admin' : 'customer',
    gender: 'Male',
    addresses: [
      {
        id: `addr-${Date.now()}`,
        fullName: name.trim() || 'VIP Member',
        phone: phone || '+91 9876543210',
        street: 'MG Road, Labbipet',
        city: 'Vijayawada',
        state: 'Andhra Pradesh',
        pincode: '520010',
        isDefault: true,
      },
    ],
    loggedInAt: new Date().toISOString(),
  };
  
  await setDoc(doc(db, 'users', fbUser.uid), {
    ...profile,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return profile;
}

// Sign Out
export async function signOutService() {
  await signOut(auth);
}

/* ========================================================================= */
/* 2. USER PROFILE & ADDRESSES                                               */
/* ========================================================================= */

export async function fetchUserProfileService(uid: string): Promise<AuthUser | null> {
  try {
    const d = await getDoc(doc(db, 'users', uid));
    if (d.exists()) {
      return { ...d.data(), id: uid } as AuthUser;
    }
  } catch (e) {
    console.warn('Error fetching profile from Firestore:', e);
  }
  return null;
}

export async function updateUserProfileService(uid: string, updates: Partial<AuthUser>): Promise<void> {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    // If doc does not exist, set it with merge: true
    try {
      await setDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (setErr) {
      handleFirestoreError(setErr, OperationType.WRITE, path);
      throw setErr;
    }
  }
}

/* ========================================================================= */
/* 3. PERSISTENT CART & WISHLIST                                             */
/* ========================================================================= */

export async function fetchUserCartService(uid: string): Promise<CartItem[] | null> {
  try {
    const d = await getDoc(doc(db, 'users', uid, 'cart', 'current'));
    if (d.exists() && Array.isArray(d.data().items)) {
      return d.data().items;
    }
  } catch (e) {
    console.warn('Error loading remote cart:', e);
  }
  return null;
}

export async function saveUserCartService(uid: string, items: CartItem[]): Promise<void> {
  try {
    await setDoc(doc(db, 'users', uid, 'cart', 'current'), {
      items,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Error saving remote cart:', e);
  }
}

export async function fetchUserWishlistService(uid: string): Promise<string[] | null> {
  try {
    const d = await getDoc(doc(db, 'users', uid, 'wishlist', 'current'));
    if (d.exists() && Array.isArray(d.data().productIds)) {
      return d.data().productIds;
    }
  } catch (e) {
    console.warn('Error loading remote wishlist:', e);
  }
  return null;
}

export async function saveUserWishlistService(uid: string, productIds: string[]): Promise<void> {
  try {
    await setDoc(doc(db, 'users', uid, 'wishlist', 'current'), {
      productIds,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Error saving remote wishlist:', e);
  }
}

/* ========================================================================= */
/* 4. PRODUCTS CATALOG (SYNCED IN FIRESTORE)                                 */
/* ========================================================================= */

export async function fetchProductsService(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    if (!snapshot.empty) {
      const list: Product[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Product);
      });
      return list;
    } else {
      // Seed Firestore with initial high-res mock products if empty
      console.log('[Firestore] Seeding initial SNAPSTER products catalog...');
      const seedPromises = PRODUCTS.map((prod) =>
        setDoc(doc(db, 'products', prod.id), {
          ...prod,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      );
      await Promise.all(seedPromises);
      return PRODUCTS;
    }
  } catch (e) {
    console.warn('Firestore products fetch fallback to local:', e);
    return PRODUCTS;
  }
}

export async function saveProductService(product: Product): Promise<void> {
  await setDoc(doc(db, 'products', product.id), {
    ...product,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function deleteProductService(productId: string): Promise<void> {
  await deleteDoc(doc(db, 'products', productId));
}

/* ========================================================================= */
/* 5. ORDERS & LIVE FULFILLMENT                                              */
/* ========================================================================= */

export async function fetchOrdersService(userId?: string, isAdmin?: boolean): Promise<CustomerOrder[]> {
  const path = 'orders';
  try {
    const colRef = collection(db, path);
    let q;
    if (isAdmin) {
      q = query(colRef);
    } else if (userId) {
      q = query(colRef, where('userId', '==', userId));
    } else {
      q = query(colRef);
    }
    
    const snapshot = await getDocs(q);
    const orders: CustomerOrder[] = [];
    snapshot.forEach((snap) => {
      orders.push({ ...snap.data(), id: snap.id } as CustomerOrder);
    });
    // Sort orders by most recent first
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return orders;
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return [];
  }
}

export async function saveOrderService(order: CustomerOrder): Promise<void> {
  await setDoc(doc(db, 'orders', order.id), {
    ...order,
    updatedAt: new Date().toISOString(),
  });
}

export async function updateOrderStatusService(
  orderId: string,
  status: CustomerOrder['status']
): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), {
    status,
    updatedAt: new Date().toISOString(),
  });
}

/* ========================================================================= */
/* 6. NOTIFICATIONS SERVICE                                                  */
/* ========================================================================= */

export async function fetchNotificationsService(uid: string): Promise<UserNotification[]> {
  try {
    const colRef = collection(db, 'users', uid, 'notifications');
    const snapshot = await getDocs(query(colRef, orderBy('createdAt', 'desc')));
    const list: UserNotification[] = [];
    snapshot.forEach((d) => {
      list.push({ ...d.data(), id: d.id } as UserNotification);
    });
    return list;
  } catch (e) {
    return [];
  }
}

export async function addNotificationService(uid: string, notif: Omit<UserNotification, 'id' | 'createdAt'>) {
  const id = `notif-${Date.now()}`;
  const full: UserNotification = {
    ...notif,
    id,
    createdAt: new Date().toISOString(),
  };
  try {
    await setDoc(doc(db, 'users', uid, 'notifications', id), full);
  } catch (e) {
    console.warn('Could not store notification:', e);
  }
}
