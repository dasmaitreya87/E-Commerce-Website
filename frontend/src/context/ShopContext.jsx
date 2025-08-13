import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || ""; // guard missing env

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  // Initialize token from localStorage (synchronously) to avoid flicker
  const readSavedToken = () => {
    const saved = localStorage.getItem("token");
    if (!saved || saved === "null" || saved === "undefined") return "";
    return saved;
  };

  // renamed tokenState -> token for easier use inside file
  const [token, setTokenState] = useState(() => readSavedToken());

  // Wrapper to persist token to localStorage whenever it is set/cleared
  const saveToken = (t) => {
    if (t && t !== "null" && t !== "undefined") {
      localStorage.setItem("token", t);
      setTokenState(t);
      // Immediately fetch server-side cart for this token
      getUserCart(t);
    } else {
      localStorage.removeItem("token");
      setTokenState("");
      // Clear cart on logout / when token removed
      setCartItems({});
    }
  };

  // Optional: logout helper
  const logout = (redirectTo = "/login") => {
    saveToken("");
    try {
      if (typeof navigate === "function") navigate(redirectTo);
    } catch (e) {
      // ignore if navigate not available in some contexts
    }
  };

  // safe structuredClone fallback
  const clone = (obj) => {
    if (typeof structuredClone === "function") return structuredClone(obj);
    return JSON.parse(JSON.stringify(obj));
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    // update UI optimistically
    let cartData = clone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    // persist to backend if logged in
    if (token) {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          { headers }
        );

        if (response.data?.success && response.data?.cartData) {
          // sync with server-authoritative cartData
          setCartItems(response.data.cartData);
        } else {
          // server didn't return updated cart, show message if any
          if (response.data?.message) toast.info(response.data.message);
        }
      } catch (error) {
        console.error("addToCart error:", error);
        toast.error(error?.response?.data?.message || error.message || "Failed to add to cart");
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = clone(cartItems);
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = quantity;
    // remove zero entries locally
    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
    }
    setCartItems(cartData);

    // persist change if logged in
    if (token) {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          { headers }
        );
        if (response.data?.success && response.data?.cartData) {
          setCartItems(response.data.cartData);
        } else if (response.data?.message) {
          toast.info(response.data.message);
        }
      } catch (error) {
        console.error("updateCart error:", error);
        toast.error(error?.response?.data?.message || error.message || "Failed to update cart");
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0 && itemInfo) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.error("Error calculating total:", error);
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    if (!backendUrl) {
      console.warn("VITE_BACKEND_URL not set - skipping product fetch");
      return;
    }
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("getProductsData error:", error);
      toast.error(error.message || "Failed to fetch products");
    }
  };

  // properly implemented getUserCart: uses Authorization Bearer header and accepts optional token argument
  const getUserCart = async (tokenArg = token) => {
    if (!backendUrl) {
      console.warn("VITE_BACKEND_URL not set - skipping cart fetch");
      return;
    }
    if (!tokenArg) {
      // no token: nothing to fetch
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${tokenArg}` };
      const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers });
      if (response.data?.success && response.data?.cartData) {
        setCartItems(response.data.cartData);
      } else if (response.data?.message) {
        toast.info(response.data.message);
      }
    } catch (error) {
      console.error("getUserCart error:", error);
      toast.error(error?.response?.data?.message || error.message || "Failed to fetch cart");
    }
  };

  // fetch products on mount / when backendUrl changes
  useEffect(() => {
    getProductsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendUrl]);

  // when token changes, fetch server-side cart (or clear when token removed)
  useEffect(() => {
    if (token) {
      getUserCart(token);
    } else {
      // keep local cart (guest) or clear — choose to clear to avoid stale server cart
      // setCartItems({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    // expose wrapper so consumers persist token correctly
    setToken: saveToken,
    token, // now consistent name
    logout,
    setCartItems,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
