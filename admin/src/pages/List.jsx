import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import axios from 'axios'
import binicon from '../assets/binicon.png'

export default function List({token}) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`)

      if (response.data && response.data.success) {
        setList(response.data.products || [])
      } else if (response.data && response.data.message) {
        toast.error(response.data.message)
        setList(response.data.products || [])
      } else {
        // fallback
        setList(response.data?.products || [])
      }
    } catch (error) {
      console.error('Fetch products error:', error)
      const message = error.response?.data?.message || error.message || 'Failed to fetch list'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const removeProduct=async(id)=>{
    try {
        const response=await axios.post(backendUrl+'/api/product/remove',{id},{headers:{token}})
        if(response.data.success){
            toast.success(response.data.message)
            await fetchList();
        }else{
            toast.error(response.data.message)
        }
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2'>All Products List</p>

      <div className='flex flex-col gap-2'>
        {/* List Table title */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 font-semibold'>
          <div>Image</div>
          <div>Name</div>
          <div>Category</div>
          <div>Price</div>
          <div className='text-center'>Action</div>
        </div>

        {/* Loading / empty states */}
        {loading && <div>Loading products...</div>}
        {!loading && list.length === 0 && <div>No products found.</div>}

        {/* Product List */}
        {list.map((item, index) => (
          <div
            key={item._id || item.id || index}
            className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-2 border rounded-md'
          >
            <div className='w-20 h-20 flex items-center justify-center'>
              {item.image ? (
                <img src={item.image} alt={item.name || 'product'} className='max-w-full max-h-full object-contain' />
              ) : (
                <div className='text-sm text-gray-500'>No image</div>
              )}
            </div>

            <div>
              <p className='font-medium'>{item.name}</p>
              {item.description && <p className='text-sm text-gray-600'>{item.description}</p>}
            </div>

            <div>{item.category}</div>
            <div>{currency}{item.price}</div>

            <div className='flex items-center justify-center'>
              <button
                onClick={() => removeProduct(item._id)}
                className='px-2 py-1 cursor-pointer'
              >
                <img src={binicon} alt="" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
