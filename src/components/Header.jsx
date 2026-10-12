import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, cartCount } from "../store/useStore";
import { CURRENCIES, fmt } from "../lib/money";

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Mira Botanics home">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 3c6 5 9 10 9 15a9 9 0 0 1-18 0c0-5 3-10 9-15z" fill="#1f3d2b" />
        <path d="M16 10v18M16 17l-4-3M16 22l4-3" stroke="#f3e0d6" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
      <b>Mira<span>.</span></b>
    </Link>
  );
}

export default function Header() {
  const { currency, setCurrency, cart, openCart, search, setSearch } = useStore();
  const n = cartCount(cart);
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const prevN = useRef(n);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => { if (n > prevN.current) setBump((b) => b + 1); prevN.current = n; }, [n]);

  const goShop = (e) => {
    e?.preventDefault();
    const go = () => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    if (pathname !== "/") { nav("/"); setTimeout(go, 80); } else go();
  };
  const goSection = (id) => (e) => {
    e.preventDefault();
    const go = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    if (pathname !== "/") { nav("/"); setTimeout(go, 80); } else go();
  };

  return (
    <>
      <div className="announce">✨ Free delivery on orders over <b>{fmt(CURRENCIES[currency].free, currency)}</b>{currency === "NGN" ? " · Pay on delivery in Lagos & Abuja" : " · 30-day returns"}</div>
      <header className={`site ${scrolled ? "scrolled" : ""}`}>
        <div className="wrap nav">
          <Logo />
          <nav className="links" aria-label="Main">
            <a href="#shop" onClick={goShop}>Shop</a>
            <a href="#routine" onClick={goSection("routine")}>Routines</a>
            <a href="#reviews" onClick={goSection("reviews")}>Reviews</a>
          </nav>
          <div className="nav-right">
            <label className="search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input
                type="search" placeholder="Search products" aria-label="Search products" value={search}
                onChange={(e) => { setSearch(e.target.value); if (e.target.value) goShop(); }}
              />
            </label>
            <div className="currency" role="group" aria-label="Currency">
              {Object.keys(CURRENCIES).map((c) => (
                <button key={c} className={c === currency ? "on" : ""} onClick={() => setCurrency(c)} aria-pressed={c === currency}>
                  <span className="cur-sym">{CURRENCIES[c].sym}</span>
                </button>
              ))}
            </div>
            <button className="icon-btn" onClick={openCart} aria-label={`Open cart, ${n} items`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 7h12l-1 13H7L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
              <AnimatePresence>
                {n > 0 && (
                  <motion.span
                    key={bump} className="count"
                    initial={{ scale: 0.4 }} animate={{ scale: [1.4, 1] }} exit={{ scale: 0 }}
                    transition={{ duration: 0.35 }}
                  >{n}</motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
