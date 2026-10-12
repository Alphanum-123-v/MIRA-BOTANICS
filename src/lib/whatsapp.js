import { byId } from "../data/products";
import { fmt } from "./money";
import { subtotal, setDiscount } from "../store/useStore";

// On a live store, put the brand's number here, e.g. "2348012345678".
// Empty means WhatsApp lets the customer pick a chat (fine for a demo).
export const WA_NUMBER = "";

export function waLink(cart, cur, order) {
  const lines = Object.entries(cart).map(([id, q]) => `• ${q} × ${byId(id).name} (${fmt(byId(id).price[cur] * q, cur)})`);
  const disc = setDiscount(cart, cur);
  const msg = [
    `Hi Mira Botanics! I'd like to order${order ? ` (${order})` : ""}:`,
    ...lines,
    ...(disc ? [`Routine set discount: −${fmt(disc, cur)}`] : []),
    "",
    `Total: ${fmt(subtotal(cart, cur) - disc, cur)}`,
  ].join("\n");
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}
