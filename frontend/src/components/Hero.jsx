import React from 'react';
import { motion } from 'framer-motion';
import heroImage from '../assets/heroimage.jpg';

const Hero = () => {
  return (
    <section className="border border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col-reverse sm:flex-row items-center">
        {/* Left: Text Section */}
        <motion.div
          className="w-full sm:w-1/2 p-8 sm:p-16 text-gray-800"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="block h-0.5 w-10 bg-gray-800"></span>
            <p className="uppercase tracking-wide text-sm font-medium">Our Bestsellers</p>
          </div>
          <motion.h1
            className="prata-regular text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          >
            Latest Arrivals
          </motion.h1>
          <motion.div
            className="flex items-center gap-2 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <p className="uppercase font-semibold text-base">Shop Now</p>
            <div className="h-0.5 w-10 bg-gray-800 group-hover:w-16 transition-all duration-300"></div>
          </motion.div>
        </motion.div>

        {/* Right: Image Section */}
        <motion.div
          className="w-full sm:w-1/2 h-64 sm:h-[500px] overflow-hidden rounded-t-lg sm:rounded-tr-none sm:rounded-l-lg"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <img
            src={heroImage}
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

