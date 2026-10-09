# The Nayaika Bangles — Online Boutique

A bespoke, responsive ecommerce storefront for **The Nayaika Bangles**, based on your own logo, supplied product photographs and price screenshots.

## Included
- Elegant desktop and mobile home page, 15 designs (14 priced, one price-on-request)
- Collection filters, product search, sorting, wishlist and close-up product views
- Size preferences, shopping bag, quantity controls, checkout form
- Working WhatsApp checkout to **+91 80556 65134**, with customer details and line items
- A second contact link **+91 72191 26273**
- Razorpay serverless payment order creation and signature verification — **disabled until you configure it**
- Images optimised as local WebP assets; no database or paid template required

## Deploy on Vercel for free
1. Create a GitHub repository and upload the *contents* of this folder (not the ZIP file).
2. Sign in to [vercel.com](https://vercel.com/) and choose **Add New → Project → Import Git Repository**.
3. Choose this repository. Framework Preset: **Other**. No build command is required; leave **Output Directory** blank.
4. Click **Deploy** and open the `.vercel.app` URL. The shop and WhatsApp ordering should work immediately.
5. You can then add your own domain in **Project → Settings → Domains**, following the DNS instructions Vercel displays.

## Enable online payments (optional, before public use)
Create and verify your business account with [Razorpay](https://razorpay.com/), then in the Vercel project go to **Settings → Environment Variables** and add:

- `RAZORPAY_KEY_ID` — your live Razorpay key ID
- `RAZORPAY_KEY_SECRET` — secret key; do not share it or put it in JavaScript
- `SHIPPING_FEE_INR` — a **shipping fee chosen and verified by the shop owner**, such as `0` if and only if you have explicitly decided to offer free shipping.

Redeploy. The online payment button will automatically become available when all three are configured. Use Razorpay **test keys** for testing first. This basic starter verifies payment signatures; it does **not** yet provide a persistent order database, automated shipping calculations, refunds, customer login, or a full fulfilment/admin panel. Before taking live orders, set up operational order reconciliation, formal shipping/returns/privacy terms and a reliable fulfilment process.

## Edit products, photos, contact details
- Edit `data/products.json` for names, descriptions, category, exact prices and photo filename. A `price` value of `null` displays "Price on request".
- Swap product images in `assets/` and keep the JSON filename matching.
- Main WhatsApp contact: `918055665134` in `app.js` and links in `index.html`.
- Secondary number and address appear in `index.html`.
- Colours / fonts are in `style.css`.

## Check locally
The frontend needs a web server, not a `file://` URL. From the project root you can run `python -m http.server 8000` and visit `http://localhost:8000`. The payment endpoints only run on Vercel (or `vercel dev`), so the pay online button correctly remains disabled in a normal local preview.

### Note about prices
The prices were matched to the supplied screenshots. **Kesari Ghungroo Glow** had no unambiguous screenshot price, so its price is deliberately *on request*. Please check design-to-price pairings before launching.
