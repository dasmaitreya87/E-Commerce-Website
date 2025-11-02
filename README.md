# E‑Commerce Web Application

[Live demo](https://e-commerce-frontend-nine-theta.vercel.app/) • **Deployed on Vercel**

---

## Project Summary

A full‑stack **MERN** (MongoDB, Express, React, Node.js) e‑commerce application implemented as a production‑style tutorial project. The app demonstrates how to build a responsive storefront and an admin dashboard, handle orders and user accounts, and integrate online payments (Stripe and Razorpay) alongside Cash on Delivery (COD).

**Highlights:**

* Customer-facing storefront with product catalog, filtering, variants and cart
* Checkout flow with delivery addresses and multiple payment options
* Admin dashboard to manage products and orders
* RESTful API built with Node.js + Express and MongoDB persistence
* Payment gateway integrations: Stripe (cards) and Razorpay (India)
* Production-ready deployment example (frontend on Vercel)

---

## Live Demo

🔗 **Live site:** [https://e-commerce-frontend-nine-theta.vercel.app/](https://e-commerce-frontend-nine-theta.vercel.app/)

---

## Key Features

* Product listing with filtering, sorting and search
* Product variants (size, color, etc.) and selection in cart
* Add / remove / update cart items and quantity
* Checkout with address form, order review and payment selection
* Payment methods: Cash on Delivery (COD), Stripe (card), Razorpay
* User order history and order details
* Admin panel with product CRUD and order management
* Secure routes with JWT authentication and role checks

---

## Tech Stack

* **Frontend:** React (Vite or Create React App)
* **Backend:** Node.js, Express
* **Database:** MongoDB ( Atlas or local )
* **Payments:** Stripe, Razorpay
* **Deployment:** Vercel for frontend; any Node hosting for backend (Render, Railway, Heroku, DigitalOcean App Platform, AWS)

---

## Quick Start — Local Development

> Requirements: Node.js (v16+ recommended), npm or yarn, and a MongoDB instance (local or Atlas).

### 1. Clone

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Backend (API)

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory. Example variables (use your own values):

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/mydb?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

Start the backend (development):

```bash
npm run dev   # or `nodemon server.js` / `node server.js` depending on scripts
```

The API should be available on `http://localhost:5000` (or the port you configured).

### 3. Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` folder (or use the framework's env format — e.g., `VITE_` prefix for Vite):

```
VITE_BACKEND_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

Start the frontend:

```bash
npm run dev   # or `npm start` depending on setup
```

Open the browser at the port shown by your dev server (e.g., `http://localhost:5173`).

---

## Environment Variables — Reference

**Backend (`backend/.env`)**

```
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<strong_jwt_secret>
STRIPE_SECRET_KEY=<stripe_secret_key>
RAZORPAY_KEY_ID=<razorpay_key_id>
RAZORPAY_KEY_SECRET=<razorpay_key_secret>
```

**Frontend (`frontend/.env`)**

```
VITE_BACKEND_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=<stripe_publishable_key>
VITE_RAZORPAY_KEY_ID=<razorpay_key_id>
```

> **Security note:** *Never store secret keys (Stripe secret, Razorpay secret, JWT secrets) in the frontend or commit `.env` files to source control.*

---

## Payment Integrations

* **Stripe** — used for card payments. Use test keys for development. The secret key must only exist in the backend. The frontend should only hold the publishable key.
* **Razorpay** — popular in India; use test credentials for development. Keep the key secret on the server side.

**Implementation notes:**

* Prefer server-side payment intent / order creation to avoid exposing secret keys.
* Save minimal payment metadata in your DB (status, provider id, amount) and rely on webhook verification from the provider for final confirmation in production.

---

## Admin Panel

The admin dashboard supports product CRUD and order overview. Protect admin routes by:

1. Requiring authentication (JWT) on protected endpoints.
2. Checking `role === 'admin'` (or similar) server-side before performing admin actions.

**Create an admin user** — two options:

* **Manual creation** in MongoDB (insert user with role `admin` and a hashed password).
* **Seed route** (if provided) — be careful: seed routes should be disabled or removed in production.

**Example seed script snippet (backend)**

```js
// scripts/seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const hashed = await bcrypt.hash('admin_password_here', 10);
  await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    password: hashed,
    role: 'admin'
  });
  console.log('Admin user created');
  process.exit();
}

seed().catch(err => console.error(err));
```

Run it with:

```bash
node scripts/seedAdmin.js
```

---

## Deployment

**Frontend**

* Example: Deploy to Vercel. Set frontend environment variables (publishable keys and API base URL) in the Vercel project settings.

**Backend**

* Deploy to a Node host (Render, Railway, Heroku, DigitalOcean App Platform, AWS, etc.).
* Set backend environment variables in your host's dashboard (do not expose secret keys publicly).
* If the frontend and backend are on different domains, configure CORS accordingly.

**Production checklist**

* Switch Stripe/Razorpay test keys to live keys
* Use strong JWT secrets and rotate periodically
* Enable HTTPS and webhooks verification
* Disable any dev-only seed routes
* Monitor logs and set up alerting for payment/webhook failures

---

## Troubleshooting

* **CORS errors:** Make sure your backend `cors` middleware allows your frontend origin in production.
* **Payment failures:** Verify you are using the corresponding test or live keys for the environment. Check provider dashboards and backend logs for error details.
* **Database connection issues:** Verify the `MONGO_URI`, IP whitelist (for Atlas), and network rules.
* **Missing environment variables:** Double-check `.env` names match those used in code (e.g., `VITE_BACKEND_URL` vs `REACT_APP_BACKEND_URL`).

---

## Testing & Webhooks

* For Stripe: use the CLI to forward webhook events locally and verify signature checking in your server.
* For Razorpay: use their test webhooks / simulate payments if available.
* Log payment-related events and store provider IDs to reconcile later.

---

## Project Structure (example)

```
root/
├─ backend/
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ scripts/ (seed scripts)
│  ├─ server.js
│  └─ package.json
└─ frontend/
   ├─ src/
   ├─ public/
   └─ package.json
```

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with clear messages: `git commit -m "feat: add ..."`
4. Push and open a pull request

Please open an issue for major changes or to request guidance before implementing large features.

---

## Suggested Improvements (future)

* Add unit / integration tests for critical backend routes
* Add CI/CD (tests + linting) on PRs
* Add role management UI and better admin analytics
* Add order status webhooks and automatic email notifications

---

## Screenshots & Demo GIF

Consider adding screenshots and a short GIF demonstrating a purchase flow. Place images in `/docs/images` and reference them in this README for clarity.

---

## License

This project is released under the **MIT License**. See the `LICENSE` file for details.

---

## Acknowledgements

* Built using the MERN stack
* Payment integration references: Stripe documentation, Razorpay documentation
* Thank you to the open source community for libraries and examples

---

If you would like, I can also:

* Add repository badges (build, license, version)
* Add sample screenshots and a demo GIF (if you provide images)
* Create a ready‑to‑use `seed` script and a short admin setup guide

Enjoy! 🚀
