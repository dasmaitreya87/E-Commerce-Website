import React from 'react'
import logo from '../assets/logo-svg.svg'
const Footer = () => {
  return (
    <div>
    <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm' >
      <div>
        <img src={logo} className='mb-5 w-32' alt="" />
        <p className='w-full md:w-2/3 text-gray-600'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, dolores? Fugiat nemo voluptatem tempore, optio labore at obcaecati nulla mollitia est exercitationem, dicta error a sit recusandae voluptatum maiores impedit.
        </p>
      </div>
      <div>
        <p className='text-xl font-medium mb-5'>COMPANY</p>
        <ul className='flex flex-col gap-1 text-gray-600'>
          <li>Home</li>
          <li>About Us</li>
          <li>Delivery</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
      <div>
        <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
        <ul className='flex flex-col gap-1 text-gray-600'>
          <li>+9476418660</li>
          <li>dasmaitreya87@gmail.com</li>
        </ul>
      </div>

      
    </div>
    <div>
        <hr />
        <p className="py-5 text-sm text-center text-gray-500">
    © 2025 - All Rights Reserved
  </p>
      </div>
    </div>
  )
}

export default Footer
