import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import stripelogo from '../assets/stripelogo.svg'
import razorpaylogo from '../assets/Razorpay_logo.svg'
import { ShopContext } from '../context/ShopContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const countries = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'JP', name: 'Japan' },
  { code: 'FR', name: 'France' },
  { code: 'CN', name: 'China' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'RU', name: 'Russia' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'PH', name: 'Philippines' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CH', name: 'Switzerland' },
]

const countryCodes = [
  { dial: '+91', label: 'India (+91)', country: 'IN' },
  { dial: '+1', label: 'USA (+1)', country: 'US' },
  { dial: '+44', label: 'UK (+44)', country: 'GB' },
  { dial: '+61', label: 'Australia (+61)', country: 'AU' },
  { dial: '+1', label: 'Canada (+1)', country: 'CA' },
  { dial: '+49', label: 'Germany (+49)', country: 'DE' },
  { dial: '+81', label: 'Japan (+81)', country: 'JP' },
  { dial: '+33', label: 'France (+33)', country: 'FR' },
  { dial: '+86', label: 'China (+86)', country: 'CN' },
  { dial: '+55', label: 'Brazil (+55)', country: 'BR' },
  { dial: '+52', label: 'Mexico (+52)', country: 'MX' },
  { dial: '+39', label: 'Italy (+39)', country: 'IT' },
  { dial: '+34', label: 'Spain (+34)', country: 'ES' },
  { dial: '+7', label: 'Russia (+7)', country: 'RU' },
  { dial: '+966', label: 'Saudi Arabia (+966)', country: 'SA' },
  { dial: '+27', label: 'South Africa (+27)', country: 'ZA' },
  { dial: '+234', label: 'Nigeria (+234)', country: 'NG' },
  { dial: '+63', label: 'Philippines (+63)', country: 'PH' },
  { dial: '+82', label: 'South Korea (+82)', country: 'KR' },
  { dial: '+41', label: 'Switzerland (+41)', country: 'CH' }
]

export default function PlaceOrder() {
  const [method, setMethod] = useState('cod')
  const shopCtx = useContext(ShopContext) || {}

  const {
    backendUrl = '',
    token: ctxToken = '',
    cartItems = {},
    setCartItems = () => {},
    getCartAmount = () => 0,
    delivery_fee = 0,
    products = [],
    user: ctxUser = null,
    userId: ctxUserId = null,
    navigate: ctxNavigate
  } = shopCtx

  const navigateFromRouter = useNavigate()
  const navigate = ctxNavigate ?? navigateFromRouter

  // defensive defaults in case arrays are undefined
  const defaultCountry = (Array.isArray(countries) && countries.length && countries[0].code) ? countries[0].code : 'IN'
  const defaultDial = (Array.isArray(countryCodes) && countryCodes.length && countryCodes[0].dial) ? countryCodes[0].dial : '+91'

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: defaultCountry,
    dialCode: defaultDial,
    phone: '',
  })

  const [loading, setLoading] = useState(false)

  const getTokenFallback = () =>
    ctxToken ||
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken') ||
    ''

  const getUserFallback = () => {
    if (ctxUser) return ctxUser
    try {
      const raw =
        localStorage.getItem('user') ||
        localStorage.getItem('authUser') ||
        localStorage.getItem('profile') ||
        null
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  }

  const tokenFallback = getTokenFallback()
  const userFallback = getUserFallback()
  const userIdFallback =
    (userFallback && (userFallback._id || userFallback.id)) || ctxUserId || null

  useEffect(() => {
    const match = Array.isArray(countryCodes) ? countryCodes.find(cc => cc.country === formData.country) : null
    if (match && match.dial && match.dial !== formData.dialCode) {
      setFormData(d => ({ ...d, dialCode: match.dial }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.country])

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setFormData(data => ({ ...data, [name]: value }))
  }

  const buildOrderItemsFromCart = () => {
    const orderItems = []
    for (const [productId, sizes] of Object.entries(cartItems || {})) {
      if (!sizes || typeof sizes !== 'object') continue
      for (const [sizeKey, qty] of Object.entries(sizes)) {
        const quantity = Number(qty || 0)
        if (!quantity || quantity <= 0) continue
        const prod = products.find(p => String(p._id) === String(productId))
        if (!prod) continue
        const itemInfo = { ...prod, size: sizeKey, quantity }
        orderItems.push(itemInfo)
      }
    }
    return orderItems
  }

  const validateForm = (orderItems) => {
    if (!orderItems.length) {
      toast.error('Your cart is empty.')
      return false
    }
    const required = ['firstName', 'email', 'street', 'city', 'zip', 'phone']
    for (const field of required) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        toast.warn(`Please fill ${field}`)
        return false
      }
    }

    if (!tokenFallback && !userIdFallback) {
      toast.info('Please log in to place an order.')
      navigate('/login')
      return false
    }
    return true
  }

  // dynamic load of Razorpay checkout script
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  const openRazorpayCheckout = async ({ order, orderId, razorpayKey }) => {
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      toast.error('Failed to load Razorpay SDK. Please try again.')
      setLoading(false)
      return
    }

    const key = razorpayKey || import.meta.env.VITE_RAZORPAY_KEY_ID || ''

    if (!key) {
      toast.error('Razorpay key not configured. Contact support.')
      setLoading(false)
      return
    }

    const name = 'Your Shop Name' // change to your site/shop name
    const description = 'Order Payment'
    const prefill = {
      name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
      email: formData.email || '',
      contact: (formData.phone ? `${formData.dialCode} ${formData.phone}` : '')
    }

    const options = {
      key,
      amount: order.amount, // amount is in paise from server
      currency: order.currency || 'INR',
      name,
      description,
      order_id: order.id,
      prefill,
      notes: {
        orderId: orderId?.toString() || '',
      },
      handler: async function (response) {
        // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
        try {
          const verifyPayload = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderId, // our DB order id (receipt)
            userId: userIdFallback
          }

          const headers = { 'Content-Type': 'application/json' }
          if (tokenFallback) headers['Authorization'] = `Bearer ${tokenFallback}`

          const verifyResp = await fetch(`${backendUrl}/api/order/razorpay/verify`, {
            method: 'POST',
            headers,
            body: JSON.stringify(verifyPayload)
          })
          const verifyData = await verifyResp.json().catch(() => ({}))

          if (!verifyResp.ok || !verifyData.success) {
            console.error('Razorpay verification failed', verifyData)
            toast.error(verifyData?.message || 'Payment verification failed.')
            setLoading(false)
            return
          }

          // verified -> clear cart and navigate
          try {
            setCartItems && setCartItems({})
          } catch (e) {
            console.warn('Failed to clear cart in context:', e)
          }

          toast.success('Payment successful and verified.')
          setLoading(false)
          navigate('/orders')
        } catch (err) {
          console.error('Error verifying Razorpay payment', err)
          toast.error('Payment verification error. Check console.')
          setLoading(false)
        }
      },
      // on dismiss (user closes checkout)
      modal: {
        ondismiss: function () {
          setLoading(false)
          toast.info('Payment cancelled.')
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      const orderItems = buildOrderItemsFromCart()
      if (!validateForm(orderItems)) {
        setLoading(false)
        return
      }

      const amount = Number(getCartAmount ? getCartAmount() : 0) + Number(delivery_fee || 0)
      const userId = userIdFallback || null

      const address = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        phone: `${formData.dialCode} ${formData.phone}`,
      }

      let endpoint = '/api/order/place'
      if (method === 'stripe') endpoint = '/api/order/stripe'
      if (method === 'razorpay') endpoint = '/api/order/razorpay'

      const payload = { userId, items: orderItems, amount, address }

      const headers = { 'Content-Type': 'application/json' }
      const fetchOpts = {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      }

      if (tokenFallback) {
        headers['Authorization'] = `Bearer ${tokenFallback}`
      } else {
        fetchOpts.credentials = 'include'
      }

      console.debug('Placing order:', {
        url: `${backendUrl}${endpoint}`,
        payload,
        headers,
        credentials: fetchOpts.credentials,
      })

      const resp = await fetch(`${backendUrl}${endpoint}`, fetchOpts)
      const data = await resp.json().catch(() => ({}))

      if (resp.status === 401 || resp.status === 403) {
        console.warn('Auth failed when placing order:', data)
        toast.error(data?.message || 'Authorization failed — please login again.')
        setLoading(false)
        navigate('/login')
        return
      }

      if (!resp.ok) {
        console.error('Order placement error:', data)
        toast.error(data?.message || 'Could not place order. Check console for details.')
        setLoading(false)
        return
      }

      // If Stripe, redirect to Stripe Checkout session URL returned by backend.
      if (method === 'stripe') {
        if (data && (data.session_url || data.sessionUrl)) {
          const sessionUrl = data.session_url || data.sessionUrl
          // do NOT clear cart here — wait for webhook/verify to mark payment complete.
          window.location.href = sessionUrl
          return
        } else {
          toast.error('Stripe session creation failed. Try again.')
          setLoading(false)
          return
        }
      }

      // If Razorpay, backend should return { success:true, order, orderId, razorpayKey }
      if (method === 'razorpay') {
        if (data && data.success && data.order) {
          // open razorpay checkout - this function will call verify endpoint on success
          await openRazorpayCheckout({
            order: data.order,
            orderId: data.orderId || data.order?.receipt,
            razorpayKey: data.razorpayKey
          })
          // openRazorpayCheckout will setLoading(false) on its own when done/dismissed.
          return
        } else {
          console.error('Razorpay order creation failed', data)
          toast.error(data?.message || 'Could not create Razorpay order.')
          setLoading(false)
          return
        }
      }

      // For COD or other non-Stripe flows, clear cart and navigate to orders
      try {
        setCartItems && setCartItems({})
      } catch (e) {
        console.warn('Failed to clear cart in context:', e)
      }

      toast.success('Order placed successfully.')
      setLoading(false)
      navigate('/orders')
    } catch (error) {
      console.error('onSubmitHandler error:', error)
      toast.error('Something went wrong. Check console.')
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      >
        {/* Left Side */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1="DELIVERY" text2="INFORMATION" />
          </div>

          <div className="flex gap-3">
            <input
              name="firstName"
              value={formData.firstName}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="First name"
            />
            <input
              name="lastName"
              value={formData.lastName}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="Last name"
            />
          </div>

          <input
            name="email"
            value={formData.email}
            onChange={onChangeHandler}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="email"
            placeholder="Email Address"
          />

          <input
            name="street"
            value={formData.street}
            onChange={onChangeHandler}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Street"
          />

          <div className="flex gap-3">
            <input
              name="city"
              value={formData.city}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="City"
            />
            <input
              name="state"
              value={formData.state}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="State"
            />
          </div>

          <div className="flex gap-3">
            <input
              name="zip"
              value={formData.zip}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="Zip Code"
            />
            <select
              name="country"
              value={formData.country}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 items-center">
            <select
              name="dialCode"
              value={formData.dialCode}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded py-1.5 px-3.5"
            >
              {countryCodes.map(cc => (
                <option key={cc.label} value={cc.dial}>
                  {cc.label}
                </option>
              ))}
            </select>
            <input
              name="phone"
              value={formData.phone}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded py-1.5 px-3.5 flex-1"
              type="tel"
              placeholder="Phone Number"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="mt-8">
          <div className="mt-8 min-w-80">
            <CartTotal />
          </div>

          <div className="mt-12">
            <Title text1="PAYMENT" text2="METHOD" />

            {/* Payment Method Selection */}
            <div className="flex gap-3 flex-col lg:flex-row">
              <div
                onClick={() => setMethod('stripe')}
                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'stripe' ? 'border-green-500' : ''}`}
              >
                <span className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`} />
                <img className="h-12 mx-4" src={stripelogo} alt="Stripe logo" />
              </div>
              <div
                onClick={() => setMethod('razorpay')}
                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'razorpay' ? 'border-green-500' : ''}`}
              >
                <span className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`} />
                <img className="h-10 mx-4" src={razorpaylogo} alt="Razorpay logo" />
              </div>
              <div
                onClick={() => setMethod('cod')}
                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'cod' ? 'border-green-500' : ''}`}
              >
                <span className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`} />
                <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
              </div>
            </div>

            <div className="w-full text-end mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`bg-black text-white px-16 py-3 text-sm cursor-pointer ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
