// src/assets/index.js

// 1) Pull in your JSON array
import productsData from "./products.json";

// 2) Tweak each record so `image` points at `/images/<id>.jpg`
export const products = productsData.map(p => ({
  ...p,
  // if your JSON `image` was "images/15970.jpg", strip that and rebuild:
  image: `/images/${p._id}.jpg`
}));
