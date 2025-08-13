// LatestCollection.jsx
import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title.jsx';
import ProductItem from './ProductItem.jsx';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <section className="my-16 px-4">
      <div className="text-center">
        <h2 className="text-4xl font-semibold tracking-wider text-gray-800">
          <Title text1={'LATEST'} text2={'COLLECTION'}/>
        </h2>
        <div className="mt-2 w-20 h-1 bg-gray-300 mx-auto"></div>
        <p className="mt-4 text-base tracking-wide text-gray-600 max-w-xl mx-auto">
          Timeless designs, newly arrived.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {latestProducts.map(item => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </section>
  );
};

export default LatestCollection;
