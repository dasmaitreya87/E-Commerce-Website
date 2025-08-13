// ProductItem.jsx
import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link
      to={`/product/${id}`}
      className="group block text-gray-800 hover:text-gray-900"
    >
      <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-50">
        <img
          src={image}
          alt={name}
          className="object-cover object-center w-full h-full transform transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-4 text-sm font-medium">{name}</h3>
      <p className="mt-1 text-sm text-gray-700">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;
