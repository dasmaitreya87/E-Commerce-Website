import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'

const Verify = () => {
  const shopCtx = useContext(ShopContext) || {}
  const {
    backendUrl: ctxBackendUrl = '',
    token: ctxToken = '',
    setCartItems = () => {}
  } = shopCtx

  const [searchParams] = useSearchParams()
  const navigateFromRouter = useNavigate()
  // prefer navigate from context if provided, otherwise router navigate
  const navigate = shopCtx.navigate ?? navigateFromRouter

  const successParam = searchParams.get('success')
  const orderId = searchParams.get('orderId')

  const [loading, setLoading] = useState(true)

  // reliable token fallback (matches your PlaceOrder approach)
  const getTokenFallback = () =>
    ctxToken ||
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken') ||
    ''

  const tokenFallback = getTokenFallback()
  // backend url fallback (ensure you have this in env if needed)
  const backendUrl = ctxBackendUrl || process.env.REACT_APP_BACKEND_URL || ''

  useEffect(() => {
    // run verification once when component mounts and we have orderId
    const verifyPayment = async () => {
      try {
        if (!orderId) {
          toast.error('Missing order id.')
          setLoading(false)
          navigate('/cart')
          return
        }

        // If you require auth to verify, ensure tokenFallback is provided
        if (!tokenFallback) {
          toast.info('Please login to verify payment.')
          setLoading(false)
          navigate('/login')
          return
        }

        if (!backendUrl) {
          toast.error('Backend URL not configured.')
          setLoading(false)
          return
        }

        const headers = {
          Authorization: `Bearer ${tokenFallback}`,
          'Content-Type': 'application/json'
        }

        // send success and orderId to backend verify endpoint
        const resp = await axios.post(
          `${backendUrl}/api/order/verifyStripe`,
          { success: successParam, orderId },
          { headers }
        )

        const data = resp && resp.data ? resp.data : {}

        if (data.success) {
          try {
            setCartItems && setCartItems({})
          } catch (e) {
            console.warn('Failed to clear cart in context:', e)
          }
          toast.success(data.message || 'Payment verified. Order placed.')
          setLoading(false)
          navigate('/orders')
        } else {
          // verification failed / cancelled
          toast.error(data.message || 'Payment not completed or verification failed.')
          setLoading(false)
          navigate('/cart')
        }
      } catch (err) {
        console.error('verifyPayment error:', err)
        toast.error(err?.response?.data?.message || err.message || 'Verification failed.')
        setLoading(false)
        // send user back to cart so they can retry
        navigate('/cart')
      }
    }

    verifyPayment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      {loading ? (
        <div className="text-center">
          <p className="text-lg font-medium">Verifying payment — please wait...</p>
        </div>
      ) : (
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      )}
    </div>
  )
}

export default Verify

//actual method is using web hooks temporary verification method has been used
