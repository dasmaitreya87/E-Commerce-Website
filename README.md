# E-Commerce Website

[Live demo](https://e-commerce-frontend-nine-theta.vercel.app/) • **Deployed on Vercel**

---

## Overview

This is a full‑stack **MERN** (MongoDB, Express, React, Node.js) e‑commerce web application. It demonstrates how to build and deploy a production‑style online store with features for customers and an admin dashboard to manage products and orders. The project includes integration with two payment gateways: **Stripe** and **Razorpay**, and supports both **Cash on Delivery (COD)** and online payments.

In this tutorial project you will learn how to:

* Build a responsive React frontend for browsing products, adding to cart, and placing orders.
* Create a RESTful backend API with Node.js and Express.
* Persist data using MongoDB.
* Integrate payment gateways (Stripe & Razorpay).
* Build an admin dashboard to manage products and orders.
* Deploy the frontend to Vercel and the backend to a server/provider of your choice.

---

## Live Site

🔗 **Live demo:** [https://e-commerce-frontend-nine-theta.vercel.app/](https://e-commerce-frontend-nine-theta.vercel.app/)

---

## Key Features

* Product listing with filtering and sorting
* Product variants (e.g., sizes) and variant selection in cart
* Add/remove/update cart items
* Checkout flow with delivery address
* Payment options: Cash on Delivery, Stripe, Razorpay
* Order history for users
* Admin dashboard: create, update, delete products; view all orders
* RESTful API built with Node.js + Express
* Persistent storage with MongoDB

---

## Tech Stack

* Frontend: React (Vite or Create React App)
* Backend: Node.js, Express
* Database: MongoDB (Atlas or local)
* Payments: Stripe, Razorpay
* Deployment: Vercel (frontend); any Node host for backend (Heroku, Render, Railway, etc.)

---

## Repo Structure (example)

```
/frontend
  ├─ src/
  ├─ package.json
  └─ ...

/backend
  ├─ controllers/
  ├─ models/
  ├─ routes/
  ├─ server.js (or app.js)
  ├─ package.json
  └─ ...
```

---

## Getting Started — Local Development

> This assumes you have Node.js and npm/yarn installed and a MongoDB instance available (local or Atlas).

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Backend (API)

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following variables (example):

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

Start the backend:

```bash
npm run dev   # or `node server.js` / `nodemon server.js` depending on scripts
```

The API should now be running on the port you configured (e.g., `http://localhost:5000`).

### 3. Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` (or use your framework's env file) in the `frontend` folder with the backend URL and any public keys required:

```
VITE_BACKEND_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

Start the frontend:

```bash
npm run dev   # or `npm start` depending on setup
```

Open your browser at `http://localhost:5173` (or the port Vite/CRA displays).

---

## Environment Variables (recommended)

**Backend (.env)**

```
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<strong_secret>
STRIPE_SECRET_KEY=<stripe_secret_key>
RAZORPAY_KEY_ID=<razorpay_key_id>
RAZORPAY_KEY_SECRET=<razorpay_key_secret>
```

**Frontend (.env)**

```
VITE_BACKEND_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=<stripe_publishable_key>
VITE_RAZORPAY_KEY_ID=<razorpay_key_id>
```

> Replace variable names with the exact ones your code expects (for example `REACT_APP_BACKEND_URL` or `VITE_BACKEND_URL`).

---

## Payment Gateways

This project demonstrates how to integrate two online payment providers:

* **Stripe** — for card payments. Use your Stripe test keys while developing.
* **Razorpay** — widely used in India; use test credentials during development.

Make sure keys are kept secret on the backend (never store secret keys in frontend env files).

---

## Admin Panel

The admin dashboard allows product and order management. You can create an admin user manually in the database or use a provided admin seeding route (if available). For security, protect admin routes using authentication and role checks.

> Tip: Add a `seed` script or an endpoint to create an initial admin account, then delete/disable the endpoint after seeding.

---

## Deployment

**Frontend**: deployed to Vercel — live demo: [https://e-commerce-frontend-nine-theta.vercel.app/](https://e-commerce-frontend-nine-theta.vercel.app/)

**Backend**: deploy to your preferred host (Render, Heroku, Railway, DigitalOcean App Platform, AWS, etc.).

When deploying, update your frontend environment variables to point to the deployed backend URL and set production payment keys.

---

## Troubleshooting

* `CORS` issues: Enable/allow your production frontend origin in the backend CORS configuration.
* Payment failures: Ensure you are using test keys in development and live keys in production. Check the logs returned by Stripe/Razorpay.
* Database connection: Verify `MONGO_URI` and network access settings (for MongoDB Atlas whitelist).

---

## Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes and commit them (`git commit -m "feat: add ..."`)
4. Push to your branch and open a pull request

Please open an issue for major changes or if you want help deciding what to work on.

---

## License

This project is released under the **MIT License**. See the `LICENSE` file for details.

---

## Acknowledgements

* Built using the MERN stack
* Payment integration references: Stripe docs, Razorpay docs
* Thanks to the open source community for libraries and inspiration

---

If you want, I can also:

* Add badges (build, license, version)
* Add sample screenshots and a demo GIF (if you provide images)
* Provide a ready-to-use `seed` script for creating an admin account

Enjoy! 🚀
