import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import QuickView from "./components/QuickView";
import Toast from "./components/Toast";
import MobileCartBar from "./components/MobileCartBar";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import { useStore } from "./store/useStore";

function ScrollManager() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const { cartOpen, quickView, closeCart, closeQuickView } = useStore();
  const locked = cartOpen || !!quickView;

  useEffect(() => {
    document.body.classList.toggle("locked", locked);
    const esc = (e) => { if (e.key === "Escape") { closeCart(); closeQuickView(); } };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [locked, closeCart, closeQuickView]);

  return (
    <MotionConfig reducedMotion="user">
      <ScrollManager />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileCartBar />
      <CartDrawer />
      <QuickView />
      <Toast />
    </MotionConfig>
  );
}
