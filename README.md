# Mira Botanics: 3D e-commerce demo

A portfolio demo store by **BoostLine**, built with **React**, **Three.js** (React Three Fiber + drei), **Framer Motion**, **Zustand** and **Vite**.
Mira Botanics is a fictional brand. No real payments are taken.

## Features
- Interactive 3D hero: floating products that follow the mouse or finger, with an animated particle and colour background that reacts to scrolling
- "View in 3D" quick view and product pages with drag-to-rotate models
- All 3D products are generated in code (no 3D files to download), and the 3D code loads only when needed
- Falls back to 2D pictures if a device has no WebGL, and respects "reduce motion" settings
- Currency switch (₦ / $ / £) with matching delivery options and free-delivery threshold
- Filter, sort and search with animated grid, cart drawer, Glow Routine Set discount
- Checkout with validation, pay on delivery (Nigeria), and "Order on WhatsApp" with the order typed out
- Cart saved between visits, fully responsive from phones to desktops

## Run it
```bash
npm install
npm run dev       # open the link it prints, e.g. http://localhost:5173
```

## Publish it
```bash
npm run build     # creates the dist folder
```
Drag the `dist` folder onto https://app.netlify.com/drop, or deploy the project on Vercel.
A ready-built `dist` folder is already included.

## Project structure
```
src/
  three/       3D: Bottle (procedural models), HeroScene, ViewerScene, Lighting, Scene3D (lazy loading + fallbacks)
  components/  Header, ProductCard, CartDrawer, QuickView, Toast, ...
  pages/       Home, ProductPage, Checkout, NotFound
  store/       Zustand store (cart, currency, UI)
  data/        Product catalogue
  lib/         Money formatting, WhatsApp order link
```

## For a real client
- Replace the products in `src/data/products.js`
- Put the brand's WhatsApp number in `src/lib/whatsapp.js` (`WA_NUMBER`)
- Connect Paystack or Stripe in `src/pages/Checkout.jsx`
