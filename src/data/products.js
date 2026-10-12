// Demo catalogue for Mira Botanics (a fictional brand).
// `shape` picks the 3D model and the 2D illustration; `c` is [main colour, accent colour].
export const PRODUCTS = [
  {
    id: "vitc", name: "Vitamin C Glow Serum", tag: "Serum", f: ["spots", "glow"], shape: "dropper",
    c: ["#f6a04d", "#e07b2c"], bg: "#fbe7d3", label: "VIT C", badge: "Bestseller", size: "30ml",
    price: { NGN: 18500, USD: 24, GBP: 19 }, was: { NGN: 22000, USD: 29, GBP: 23 }, rating: 4.9, reviews: 842, pop: 1,
    desc: "A stable 15% vitamin C serum that fades dark spots and post-acne marks and brightens dull skin, without stinging.",
    points: ["Fades dark spots in 4–6 weeks", "Gentle enough for daily use", "Fragrance-free"],
    ingr: "Ascorbyl glucoside 15%, ferulic acid, vitamin E, aloe",
    how: "Apply 3–4 drops to clean skin every morning, before moisturiser and SPF.",
  },
  {
    id: "nia", name: "Niacinamide 10% Clarifying Serum", tag: "Serum", f: ["acne", "spots"], shape: "dropper",
    c: ["#7fb08a", "#4e8a5f"], bg: "#e3efe4", label: "NIA 10", size: "30ml",
    price: { NGN: 15000, USD: 19, GBP: 15 }, rating: 4.8, reviews: 615, pop: 2,
    desc: "Calms breakouts, controls shine and tightens the look of pores. Your daily clear-skin essential.",
    points: ["Reduces oil within 2 weeks", "Calms redness and bumps", "Works under makeup"],
    ingr: "Niacinamide 10%, zinc PCA 1%, green tea extract",
    how: "Use morning and night after cleansing. Pairs well with the Vitamin C serum.",
  },
  {
    id: "shea", name: "Shea & Oat Rich Moisturiser", tag: "Moisturiser", f: ["dry"], shape: "jar",
    c: ["#efe2c8", "#c9ad7f"], bg: "#f4ece0", label: "SHEA", size: "50ml",
    price: { NGN: 16500, USD: 21, GBP: 17 }, rating: 4.8, reviews: 430, pop: 4,
    desc: "A rich, non-greasy cream with Nigerian shea butter and colloidal oat for 48-hour hydration.",
    points: ["48-hour hydration", "Repairs dry, ashy patches", "Non-comedogenic"],
    ingr: "Shea butter, colloidal oat, ceramides, glycerin",
    how: "Massage a pea-sized amount into face and neck, morning and night.",
  },
  {
    id: "clean", name: "Gentle Foaming Cleanser", tag: "Cleanser", f: ["acne", "dry"], shape: "pump",
    c: ["#bcd6e6", "#6f9fbd"], bg: "#e5eff5", label: "CLEANSE", size: "150ml",
    price: { NGN: 11000, USD: 14, GBP: 11 }, rating: 4.7, reviews: 390, pop: 5,
    desc: "A low-foam, pH-balanced cleanser that removes makeup and sunscreen without stripping your skin.",
    points: ["pH 5.5, never tight", "Removes SPF and makeup", "Suits sensitive skin"],
    ingr: "Coco-glucoside, glycerin, panthenol, chamomile",
    how: "Lather 1–2 pumps with water, massage for 30 seconds, rinse.",
  },
  {
    id: "spf", name: "Invisible Mineral SPF 50", tag: "Sunscreen", f: ["spots", "glow"], shape: "tube",
    c: ["#f6d36b", "#d9a032"], bg: "#fbf1d2", label: "SPF 50", badge: "No white cast", size: "50ml",
    price: { NGN: 14500, USD: 18, GBP: 15 }, rating: 4.9, reviews: 1120, pop: 3,
    desc: "A tinted mineral sunscreen that disappears on deep skin tones. Prevents dark spots from coming back.",
    points: ["Zero white cast", "Broad-spectrum SPF 50", "Doubles as a primer"],
    ingr: "Zinc oxide, iron oxides, squalane, niacinamide",
    how: "Apply two finger-lengths as the last step of your morning routine. Reapply every 2 hours outdoors.",
  },
  {
    id: "mask", name: "Turmeric Brightening Mask", tag: "Mask", f: ["glow", "spots"], shape: "jar",
    c: ["#f2b84b", "#d98f22"], bg: "#fcebc9", label: "GLOW", badge: "New", size: "75ml",
    price: { NGN: 13000, USD: 17, GBP: 13 }, rating: 4.6, reviews: 205, pop: 6,
    desc: "A 10-minute clay mask with turmeric and honey for an instant, even glow before big days.",
    points: ["Instant glow in 10 minutes", "Unclogs pores", "No yellow stains"],
    ingr: "Kaolin clay, turmeric, raw honey, licorice root",
    how: "Apply an even layer 1–2 times a week, leave for 10 minutes, rinse with warm water.",
  },
  {
    id: "toner", name: "Hydrating Rose Toner", tag: "Toner", f: ["dry", "glow"], shape: "bottle",
    c: ["#f0b3bd", "#d98593"], bg: "#f9e4e7", label: "ROSE", size: "120ml",
    price: { NGN: 10500, USD: 13, GBP: 11 }, rating: 4.7, reviews: 310, pop: 7,
    desc: "An alcohol-free toner with rose water and hyaluronic acid that preps skin to absorb your serum.",
    points: ["Alcohol-free", "Instant hydration", "Smells naturally of roses"],
    ingr: "Rose water, hyaluronic acid, beta-glucan",
    how: "Pat into skin with your hands or a cotton pad after cleansing.",
  },
  {
    id: "retinol", name: "Night Repair Retinol Oil", tag: "Treatment", f: ["spots", "acne"], shape: "dropper",
    c: ["#a98bc9", "#7a5ca8"], bg: "#ece4f4", label: "NIGHT", size: "30ml",
    price: { NGN: 21000, USD: 28, GBP: 22 }, rating: 4.8, reviews: 276, pop: 8,
    desc: "A gentle encapsulated retinol in a nourishing oil blend. Smooths texture and fades marks while you sleep.",
    points: ["Smoother skin in 3 weeks", "Low-irritation formula", "Use 2–3 nights a week"],
    ingr: "Encapsulated retinol 0.3%, bakuchiol, rosehip & marula oils",
    how: "Press 3 drops into clean, dry skin at night. Always wear SPF the next day.",
  },
];

export const byId = (id) => PRODUCTS.find((p) => p.id === id);

export const FILTERS = [
  ["all", "All"],
  ["spots", "Dark spots"],
  ["acne", "Acne & oily"],
  ["dry", "Dry skin"],
  ["glow", "Glow"],
];

// The Glow Routine Set: 4 products, 15% off when all 4 are in the cart
export const SET = ["clean", "vitc", "shea", "spf"];
export const SET_DISCOUNT = 0.15;

export const REVIEWS = [
  { name: "Adaeze O.", where: "Lagos", color: "#7a4a2e", text: "My hyperpigmentation has faded so much. The Vitamin C serum doesn't sting and my skin finally looks even." },
  { name: "Tolu A.", where: "London", color: "#4d3121", text: "The first sunscreen that doesn't leave me looking grey. I wear it every single day now." },
  { name: "Kemi B.", where: "Abuja", color: "#a06a45", text: "Ordered on WhatsApp, got it the next day. The niacinamide serum calmed my breakouts in 3 weeks." },
];
