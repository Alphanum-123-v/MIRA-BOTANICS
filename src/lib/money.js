export const CURRENCIES = {
  NGN: {
    sym: "₦", free: 40000, cod: true,
    ship: [
      { id: "lagos", name: "Lagos delivery", note: "1–2 days", p: 2500 },
      { id: "ng", name: "Rest of Nigeria", note: "3–5 days", p: 4500 },
    ],
    payNote: "Card, bank transfer or USSD via Paystack",
  },
  USD: {
    sym: "$", free: 50, cod: false,
    ship: [
      { id: "std", name: "Standard shipping", note: "5–8 days", p: 6 },
      { id: "exp", name: "Express shipping", note: "2–3 days", p: 15 },
    ],
    payNote: "Card, Apple Pay or Google Pay via Stripe",
  },
  GBP: {
    sym: "£", free: 40, cod: false,
    ship: [
      { id: "std", name: "Royal Mail tracked", note: "2–4 days", p: 4 },
      { id: "exp", name: "Next-day delivery", note: "1 day", p: 9 },
    ],
    payNote: "Card, Apple Pay or Google Pay via Stripe",
  },
};

export function fmt(n, cur) {
  const sym = CURRENCIES[cur].sym;
  if (cur === "NGN") return sym + Math.round(n).toLocaleString("en-NG");
  const r = Math.round(n * 100) / 100;
  return sym + r.toLocaleString("en-US", { minimumFractionDigits: r % 1 ? 2 : 0, maximumFractionDigits: 2 });
}
