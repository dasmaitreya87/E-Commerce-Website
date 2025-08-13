import React, { useState, useEffect } from 'react'
import uploadicon from '../assets/uploadicon.png'
import axios from 'axios'
import { backendUrl } from '../App'

const Add = ({ token }) => {
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('Men')
    const [subCategory, setSubCategory] = useState('Topwear')
    const [bestseller, setBestSeller] = useState(false)
    const [sizes, setSizes] = useState([])

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    // Create preview URL and revoke on cleanup to avoid memory leaks
    useEffect(() => {
        if (!image) {
            setImagePreview(null)
            return
        }

        const url = URL.createObjectURL(image)
        setImagePreview(url)

        return () => {
            URL.revokeObjectURL(url)
        }
    }, [image])

    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0]
        if (file) {
            setImage(file)
        }
    }

    const toggleSize = (size) => {
        setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
    }

    // NOTE: async added here (main bug fix)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage(null)
        setLoading(true)

        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('price', price || '0')
            formData.append('category', category)
            formData.append('subCategory', subCategory)
            formData.append('bestseller', bestseller ? 'true' : 'false')

            // If your backend expects sizes as an array (multiple fields), use this:
            // sizes.forEach((s) => formData.append('sizes', s))
            // If it expects a JSON string, use the line below instead:
            formData.append('sizes', JSON.stringify(sizes))

            if (image) formData.append('image', image)

            // axios will set the correct multipart boundary automatically in browser,
            // but adding the header is okay too
            const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
                headers: {
                    token
                }
            })

            // handle success
            setMessage({ type: 'success', text: 'Product added successfully.' })

            // optional: clear form
            setImage(null)
            setName('')
            setDescription('')
            setPrice('')
            setCategory('Men')
            setSubCategory('Topwear')
            setBestSeller(false)
            setSizes([])
        } catch (error) {
            console.error('Add product error:', error)
            // friendly error message — you can inspect error.response for backend details
            const errText = error?.response?.data?.message || error.message || 'Upload failed'
            setMessage({ type: 'error', text: errText })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {message && (
                <div
                    className={`px-3 py-2 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col w-full items-start gap-3">
                <div className="w-full mx-auto">
                    <p className="mb-2 text-sm font-semibold text-gray-700">Upload Image</p>

                    <label
                        htmlFor="image"
                        className="flex flex-col w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-200 overflow-hidden"
                    >
                        <img
                            className={`w-full h-full object-cover rounded-lg ${!imagePreview ? 'p-4' : ''}`}
                            src={!imagePreview ? uploadicon : imagePreview}
                            alt="Upload Preview"
                        />
                        <input type="file" id="image" hidden accept="image/*" onChange={handleImageChange} />
                    </label>

                    {image && (
                        <div className="mt-2 text-xs text-gray-500 truncate">
                            <p>{image.name}</p>
                        </div>
                    )}
                </div>

                <div className="w-full">
                    <p className="mb-2">Product Name</p>
                    <input
                        className="w-full max-w-[500px] px-3 py-2 border rounded"
                        type="text"
                        placeholder="Type here..."
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="w-full">
                    <p className="mb-2">Product Description</p>
                    <input
                        className="w-full max-w-[500px] px-3 py-2 border rounded"
                        type="text"
                        placeholder="Write content here..."
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
                    <div>
                        <p className="mb-2">Product category</p>
                        <select
                            className="w-full px-3 py-2 border rounded"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Kids">Kids</option>
                        </select>
                    </div>

                    <div>
                        <p className="mb-2">Sub category</p>
                        <select
                            className="w-full px-3 py-2 border rounded"
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                        >
                            <option value="Topwear">Topwear</option>
                            <option value="Bottomwear">Bottomwear</option>
                            <option value="Winterwear">Winterwear</option>
                        </select>
                    </div>

                    <div>
                        <p className="mb-2">Product Price</p>
                        <input
                            className="w-full px-3 py-2 sm:w-[120px] border rounded"
                            type="number"
                            placeholder="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                <div>
                    <p className="mb-2">Product Sizes</p>
                    <div className="flex gap-3">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                            const selected = sizes.includes(sz)
                            return (
                                <button
                                    key={sz}
                                    type="button"
                                    onClick={() => toggleSize(sz)}
                                    className={`px-3 py-1 rounded ${selected ? 'bg-black text-white' : 'bg-slate-200 text-slate-800'}`}
                                >
                                    {sz}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="flex gap-2 mt-2 items-center">
                    <input
                        type="checkbox"
                        id="bestseller"
                        checked={bestseller}
                        onChange={(e) => setBestSeller(e.target.checked)}
                    />
                    <label className="cursor-pointer" htmlFor="bestseller">
                        Add to bestseller
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-28 py-3 mt-4 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black'} text-white cursor-pointer rounded`}
                >
                    <p>{loading ? 'Saving...' : 'Submit'}</p>
                </button>
            </form>
        </>
    )
}

export default Add
