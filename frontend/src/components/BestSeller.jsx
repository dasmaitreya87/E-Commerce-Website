import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import Title from './Title.jsx';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <section className="my-16 px-4">
      <div className="text-center">
        <h2 className="text-4xl font-semibold tracking-wider text-gray-800">
          <Title text1={'BEST'} text2={'SELLERS'}/>
        </h2>
        <div className="mt-2 w-20 h-1 bg-gray-300 mx-auto"></div>
        <p className="mt-4 text-base tracking-wide text-gray-600 max-w-xl mx-auto">
          The people's choice
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSeller;
