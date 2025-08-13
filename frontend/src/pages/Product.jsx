import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import staricon from '../assets/staricon.png';
import dullstaricon from '../assets/dullstaricon.png';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency,addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [size, setSize] = useState('');

  const fetchProductData = () => {
    const item = products.find((item) => item._id === productId);
    if (item) {
      setProductData(item);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  if (!productData) {
    return <div className="opacity-0"></div>;
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex flex-col sm:flex-row gap-12">
        {/* Product image */}
        <div className="flex-1 flex flex-col gap-3">
          <img
            src={productData.image}
            alt={productData.name || 'Product'}
            className="w-full sm:w-[60%] object-cover rounded-lg"
          />
        </div>

        {/* Product details */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, idx) => (
              <img
                key={idx}
                src={idx < 4 ? staricon : dullstaricon}
                alt="star"
                className="w-3.5"
              />
            ))}
            <p className="pl-2">(122)</p>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>

          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          <div className="flex flex-col gap-4 my-8">
            <p className="font-medium">Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 cursor-pointer ${
                    item === size ? 'border-orange-500 font-semibold bg-white' : ''
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button onClick={()=>addToCart(productData._id,size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 cursor-pointer'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original product</p>
            <p>Cash on delivery is available on this product</p>
            <p>Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>
      {/**Description & reviews section */}
      <div className='mt-20'>
        <div className='flex'>
              <b className='border px-5 py-3 text-sm'>
                Description
              </b>
              <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium repudiandae necessitatibus suscipit quasi provident in inventore ea est voluptas omnis, </p>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero, hic, nam dolor labore quas at praesentium placeat voluptates accusamus illo repellendus suscipit optio magnam esse, incidunt harum! Perferendis, repellendus. Commodi.</p>
        </div>
      </div>

      {/**display related products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>
    </div>
  );
};

export default Product;
