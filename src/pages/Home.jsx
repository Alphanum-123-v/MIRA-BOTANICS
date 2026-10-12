import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import ProductArt from "../components/ProductArt";
import Reveal from "../components/Reveal";
import { Hero3D } from "../three/Scene3D";
import { useStore } from "../store/useStore";
import { PRODUCTS, FILTERS, SET, SET_DISCOUNT, REVIEWS, byId } from "../data/products";
import { fmt } from "../lib/money";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } } };

function HeroFallback() {
  return (
    <div className="hero-fallback">
      {["spf", "vitc", "shea"].map((id) => <ProductArt key={id} p={byId(id)} noBg k="hf" />)}
    </div>
  );
}

function Hero() {
  const openQuickView = useStore((s) => s.openQuickView);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
          <motion.span variants={fadeUp} className="eyebrow">🌿 New: Vitamin C Glow Serum</motion.span>
          <motion.h1 variants={fadeUp}>Skincare made for <em>melanin-rich</em> skin.</motion.h1>
          <motion.p variants={fadeUp} className="lead">Plant-powered serums, moisturisers and SPF that fade dark spots, calm breakouts and leave no white cast. Made in Lagos, loved worldwide.</motion.p>
          <motion.div variants={fadeUp} className="hero-ctas">
            <button className="btn btn-dark" onClick={() => scrollTo("shop")}>Shop bestsellers →</button>
            <button className="btn btn-ghost" onClick={() => scrollTo("routine")}>Build my routine</button>
          </motion.div>
          <motion.div variants={fadeUp} className="proof">
            <div className="avatars"><i style={{ background: "#8d5a3b" }} /><i style={{ background: "#5e3b26" }} /><i style={{ background: "#b27a52" }} /><i style={{ background: "#3f2a1d" }} /></div>
            <div><span className="stars">★★★★★</span><br />4.8 from 2,300+ reviews</div>
          </motion.div>
        </motion.div>
        <motion.div className="hero-art" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}>
          <Hero3D fallback={<HeroFallback />} onSelect={openQuickView} />
          <motion.div className="float-card fc2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}><span className="dot">🌞</span><div><b>No white cast</b>Mineral SPF 50</div></motion.div>
          <motion.div className="float-card fc1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}><span className="dot">⭐</span><div><b>Bestseller</b>12k+ sold this year</div></motion.div>
          <span className="hint hero-hint">Move to explore · tap a product</span>
        </motion.div>
      </div>
    </section>
  );
}

function Trust() {
  const items = [["🚚", "Fast delivery", "1–3 days in Lagos"], ["🐰", "Cruelty-free", "Never tested on animals"], ["💳", "Pay your way", "Card, transfer or on delivery"], ["↩️", "30-day returns", "Love it or your money back"]];
  return (
    <div className="trust">
      <div className="wrap trust-row">
        {items.map(([ic, t, s], i) => (
          <Reveal key={t} delay={i * 0.08} y={12}><span className="ic">{ic}</span><span><b>{t}</b>{s}</span></Reveal>
        ))}
      </div>
    </div>
  );
}

function Shop() {
  const { currency, search, setSearch } = useStore();
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("pop");
  const list = useMemo(() => {
    let l = PRODUCTS.filter((p) => filter === "all" || p.f.includes(filter));
    const q = search.trim().toLowerCase();
    if (q) l = l.filter((p) => `${p.name} ${p.tag} ${p.desc}`.toLowerCase().includes(q));
    const pr = (p) => p.price[currency];
    return [...l].sort((a, b) => sort === "low" ? pr(a) - pr(b) : sort === "high" ? pr(b) - pr(a) : sort === "rating" ? b.rating - a.rating : a.pop - b.pop);
  }, [filter, sort, search, currency]);

  return (
    <section className="section" id="shop">
      <div className="wrap">
        <Reveal className="head"><div><h2>Shop by skin concern</h2><p>Find exactly what your skin needs. Tap “View in 3D” to see any product up close.</p></div></Reveal>
        <div className="toolbar">
          <div className="chips">
            {FILTERS.map(([id, label]) => (
              <button key={id} className={`chip ${filter === id ? "on" : ""}`} onClick={() => setFilter(id)} aria-pressed={filter === id}>
                <span>{label}</span>
              </button>
            ))}
          </div>
          <select className="sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
            <option value="pop">Most popular</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
        {search && <p className="search-note">Showing results for “{search}” · <button onClick={() => setSearch("")}>Clear</button></p>}
        <motion.div layout className="grid">
          <AnimatePresence mode="popLayout">
            {list.map((p) => <ProductCard key={p.id} p={p} />)}
          </AnimatePresence>
          {!list.length && <div className="empty">No products match “{search}”. Try another search.</div>}
        </motion.div>
      </div>
    </section>
  );
}

function Routine() {
  const { currency, add, showToast } = useStore();
  const full = SET.reduce((s, id) => s + byId(id).price[currency], 0);
  return (
    <section className="wrap" id="routine">
      <Reveal className="routine">
        <div>
          <h2>The Glow Routine Set</h2>
          <p>Our 4 bestsellers in one box: everything you need for clear, even, glowing skin in 4 simple steps.</p>
          <div className="steps">{["Cleanse", "Treat", "Moisturise", "Protect"].map((s, i) => <span key={s}>{i + 1} · {s}</span>)}</div>
          <button className="btn btn-light" onClick={() => { SET.forEach((id) => add(id, 1, { silent: true })); showToast("Added the Glow Routine Set (15% off)", true); }}>Add the set to cart</button>
          <span className="save">{fmt(full * (1 - SET_DISCOUNT), currency)} (save {fmt(full * SET_DISCOUNT, currency)})</span>
        </div>
        <div className="routine-art">
          {SET.map((id, i) => (
            <motion.div key={id} initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 * i, type: "spring", stiffness: 200, damping: 18 }}>
              <ProductArt p={byId(id)} noBg k="r" />
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Reviews() {
  return (
    <section className="section" id="reviews">
      <div className="wrap">
        <Reveal className="head"><div><h2>Real skin, real results</h2><p>What our customers say after 4 weeks.</p></div></Reveal>
        <div className="reviews">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.1} className="review">
              <span className="stars">★★★★★</span>
              <p>“{r.text}”</p>
              <div className="who"><i style={{ background: r.color }} /><div><b>{r.name}</b><small>{r.where} · Verified buyer</small></div></div>
            </Reveal>
          ))}
        </div>
        <p className="note">Sample reviews for this demo store.</p>
      </div>
    </section>
  );
}

function Newsletter() {
  const showToast = useStore((s) => s.showToast);
  return (
    <section className="wrap" id="about">
      <Reveal className="news">
        <h2>Get 10% off your first order</h2>
        <p>Join 18,000+ subscribers for skincare tips and early access to new drops.</p>
        <form onSubmit={(e) => { e.preventDefault(); e.target.reset(); showToast("🎉 Your code is GLOW10"); }}>
          <input type="email" required placeholder="Your email address" aria-label="Email address" />
          <button className="btn btn-dark" type="submit">Get my code</button>
        </form>
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (<><Hero /><Trust /><Shop /><Routine /><Reviews /><Newsletter /></>);
}
