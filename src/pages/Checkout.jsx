import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProductArt from "../components/ProductArt";
import { useStore, cartCount, subtotal, setDiscount } from "../store/useStore";
import { byId } from "../data/products";
import { CURRENCIES, fmt } from "../lib/money";
import { waLink } from "../lib/whatsapp";

const FIELDS = ["name", "phone", "email", "address", "city", "region"];

export default function Checkout() {
  const { cart, currency, clear } = useStore();
  const c = CURRENCIES[currency];
  const [form, setForm] = useState({});
  const [bad, setBad] = useState({});
  const [shipId, setShipId] = useState(null);
  const [pay, setPay] = useState("card");
  const [done, setDone] = useState(null);

  const ship = c.ship.find((s) => s.id === shipId) || c.ship[0];
  const payMode = pay === "cod" && !c.cod ? "card" : pay;
  const sub = subtotal(cart, currency);
  const disc = setDiscount(cart, currency);
  const base = sub - disc;
  const isFree = (s) => base >= c.free && s.id === c.ship[0].id;
  const shipCost = isFree(ship) ? 0 : ship.p;
  const total = base + shipCost;
  const lines = useMemo(() => Object.entries(cart).filter(([id]) => byId(id)), [cart]);

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setBad({ ...bad, [k]: false }); };
  const submit = (e) => {
    e.preventDefault();
    const b = {};
    FIELDS.forEach((k) => { if (!(form[k] || "").trim()) b[k] = true; });
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) b.email = true;
    setBad(b);
    if (Object.keys(b).length) { document.querySelector(`[name=${Object.keys(b)[0]}]`)?.focus(); return; }
    const order = "MB-" + Math.floor(100000 + Math.random() * 900000);
    if (payMode === "wa") window.open(waLink(cart, currency, order), "_blank", "noopener");
    setDone({ order, total: fmt(total, currency), name: form.name.split(" ")[0], mode: payMode });
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) {
    const how = done.mode === "cod" ? "Have your payment ready when your order arrives." : done.mode === "wa" ? "We'll message you on WhatsApp shortly to confirm." : "On the live store, you'd now be taken to secure payment.";
    return (
      <section className="section wrap">
        <motion.div className="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <motion.div className="tick" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.15 }}>✓</motion.div>
          <h2>Thank you, {done.name}!</h2>
          <p>Order <b>{done.order}</b> ({done.total}) is confirmed. {how}</p>
          <Link className="btn btn-dark" to="/">Continue shopping</Link>
        </motion.div>
      </section>
    );
  }

  if (!cartCount(cart)) {
    return (
      <section className="section wrap center">
        <h2 className="serif">Your cart is empty</h2>
        <p className="muted">Add a few products before checking out.</p><br />
        <Link className="btn btn-dark" to="/">Go to the shop</Link>
      </section>
    );
  }


  return (
    <section className="section checkout">
      <div className="wrap co">
        <form onSubmit={submit} noValidate>
          <Link to="/" className="back">← Continue shopping</Link>
          <h1>Checkout</h1>
          <h4>Contact</h4>
          <div className="two">
            <label className={`field ${bad.name ? "bad" : ""}`}>Full name<input name="name" autoComplete="name" value={form.name || ""} onChange={set("name")} /></label>
            <label className={`field ${bad.phone ? "bad" : ""}`}>Phone (WhatsApp)<input name="phone" type="tel" autoComplete="tel" value={form.phone || ""} onChange={set("phone")} placeholder={currency === "NGN" ? "0803 000 0000" : "+44 7700 900000"} /></label>
          </div>
          <label className={`field ${bad.email ? "bad" : ""}`}>Email<input name="email" type="email" autoComplete="email" value={form.email || ""} onChange={set("email")} /></label>
          <h4>Delivery address</h4>
          <label className={`field ${bad.address ? "bad" : ""}`}>Address<input name="address" autoComplete="street-address" value={form.address || ""} onChange={set("address")} /></label>
          <div className="two">
            <label className={`field ${bad.city ? "bad" : ""}`}>City<input name="city" autoComplete="address-level2" value={form.city || ""} onChange={set("city")} /></label>
            <label className={`field ${bad.region ? "bad" : ""}`}>{currency === "NGN" ? "State" : currency === "USD" ? "State / ZIP" : "Postcode"}<input name="region" value={form.region || ""} onChange={set("region")} /></label>
          </div>
          <h4>Delivery</h4>
          <div className="opts">
            {c.ship.map((s) => (
              <label key={s.id} className={`opt ${ship.id === s.id ? "on" : ""}`}>
                <input type="radio" name="ship" checked={ship.id === s.id} onChange={() => setShipId(s.id)} />
                <span>{s.name}<small>{s.note}</small></span><span className="r">{isFree(s) ? "Free" : fmt(s.p, currency)}</span>
              </label>
            ))}
          </div>
          <h4>Payment</h4>
          <div className="opts">
            <label className={`opt ${payMode === "card" ? "on" : ""}`}><input type="radio" name="pay" checked={payMode === "card"} onChange={() => setPay("card")} /><span>Pay online<small>{c.payNote}</small></span></label>
            {c.cod && <label className={`opt ${payMode === "cod" ? "on" : ""}`}><input type="radio" name="pay" checked={payMode === "cod"} onChange={() => setPay("cod")} /><span>Pay on delivery<small>Lagos & Abuja only</small></span></label>}
            <label className={`opt ${payMode === "wa" ? "on" : ""}`}><input type="radio" name="pay" checked={payMode === "wa"} onChange={() => setPay("wa")} /><span>Confirm on WhatsApp<small>We'll message you to confirm and arrange payment</small></span></label>
          </div>
          <AnimatePresence>
            {Object.values(bad).some(Boolean) && (
              <motion.p className="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>Please fill in the highlighted fields.</motion.p>
            )}
          </AnimatePresence>
          <button className="btn btn-dark btn-block" type="submit">Place order · {fmt(total, currency)}</button>
          <p className="secure">🔒 Demo store: no payment is taken and no data is sent anywhere.</p>
        </form>
        <aside className="summary">
          <h3>Order summary</h3>
          {lines.map(([id, q]) => {
            const p = byId(id);
            return (
              <div key={id} className="s-item">
                <div className="thumb"><ProductArt p={p} k="s" /><span className="n">{q}</span></div>
                <span>{p.name}</span><span>{fmt(p.price[currency] * q, currency)}</span>
              </div>
            );
          })}
          <hr />
          <div className="row"><span>Subtotal</span><span>{fmt(sub, currency)}</span></div>
          {disc > 0 && <div className="row disc"><span>Routine set discount</span><span>−{fmt(disc, currency)}</span></div>}
          <div className="row"><span>Delivery</span><span>{shipCost ? fmt(shipCost, currency) : "Free"}</span></div>
          <div className="row total"><span>Total</span><motion.span key={total} initial={{ opacity: 0.3, y: -4 }} animate={{ opacity: 1, y: 0 }}>{fmt(total, currency)}</motion.span></div>
        </aside>
      </div>
    </section>
  );
}
