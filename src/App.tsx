import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { AdminBar } from './components/AdminBar';
import { HeroSlider } from './components/HeroSlider';
import { CategorySection } from './components/CategorySection';
import { NewArrivalsSection } from './components/NewArrivalsSection';
import { SignatureCollection } from './components/SignatureCollection';
import { BestSellersSection } from './components/BestSellersSection';
import { BenefitsStrip } from './components/BenefitsStrip';
import { TestimonialsSection } from './components/TestimonialsSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { CatalogPage } from './components/CatalogPage';
import { CollectionsPage } from './components/CollectionsPage';
import { AboutPage } from './components/AboutPage';
import { JournalPage } from './components/JournalPage';
import { ContactPage } from './components/ContactPage';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { AdminProductManagerModal } from './components/AdminProductManagerModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { SizeFitHelperModal } from './components/SizeFitHelperModal';
import { ExpressBuyNowModal } from './components/ExpressBuyNowModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { PromoOffersModal } from './components/PromoOffersModal';
import { PoliciesModal } from './components/PoliciesModal';
import { ToastContainer } from './components/ToastContainer';
import { BrandSplashScreen } from './components/BrandSplashScreen';

const MainContent: React.FC = () => {
  const { currentView } = useStore();

  return (
    <main className="min-h-screen flex flex-col bg-[#111011] text-[#F6F1E9]">
      {currentView === 'home' && (
        <>
          <HeroSlider />
          <CategorySection />
          <NewArrivalsSection />
          <SignatureCollection />
          <BestSellersSection />
          <BenefitsStrip />
          <TestimonialsSection />
          <NewsletterSection />
        </>
      )}

      {currentView === 'shop' && <CatalogPage />}
      {currentView === 'collections' && <CollectionsPage />}
      {currentView === 'about' && <AboutPage />}
      {currentView === 'journal' && <JournalPage />}
      {currentView === 'contact' && <ContactPage />}

      <Footer />

      {/* Global Overlays & Modals */}
      <ProductDetailModal />
      <SizeFitHelperModal />
      <ExpressBuyNowModal />
      <OrderTrackingModal />
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <CheckoutModal />
      <AuthModal />
      <AdminProductManagerModal />
      <SizeGuideModal />
      <PromoOffersModal />
      <PoliciesModal />
      <ToastContainer />
    </main>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[#111011] text-[#F6F1E9]">
        <BrandSplashScreen />
        <AdminBar />
        <Header />
        <MainContent />
      </div>
    </StoreProvider>
  );
}
