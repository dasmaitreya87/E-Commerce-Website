import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/logo-svg.svg';
import profilepic from '../assets/profile-pic.png';
import carticon from '../assets/carticon.png';
import menuicon from '../assets/menuicon.svg';
import dropdown from '../assets/dropdown.png';
import searchicon from '../assets/searchicon.svg';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false); // sidebar on mobile
  const [profileOpen, setProfileOpen] = useState(false); // profile dropdown state
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, logout } = useContext(ShopContext);

  // Close profile menu when clicking outside
  const profileRef = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleLogout = () => {
  if (typeof logout === 'function') {
    logout('/login');
  } else {
    // fallback if logout isn't available
    localStorage.removeItem('token');
    if (typeof setToken === 'function') setToken('');
    if (typeof setCartItems === 'function') setCartItems({});
    navigate('/login');
  }
};

  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'COLLECTIONS', path: '/collection' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  const cartCount = typeof getCartCount === 'function' ? getCartCount() : 0;

  return (
    <div className="flex items-center justify-between py-5 font-medium relative">
      <Link to="/">
        <img src={logo} className="w-36" alt="AuraMart logo" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        {navItems.map(({ name, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 ${isActive ? 'font-semibold text-black' : ''}`
            }
          >
            <p>{name}</p>
            <hr
              className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${
                location.pathname === path ? '' : 'invisible'
              }`}
            />
          </NavLink>
        ))}
      </ul>

      <div className="flex items-center gap-6">
        <button
          onClick={() => setShowSearch(true)}
          aria-label="Open search"
          className="p-0"
        >
          <img src={searchicon} className="w-6 cursor-pointer" alt="Search" />
        </button>

        <div className="relative" ref={profileRef}>
          <img
            onClick={() => {
              if (token) setProfileOpen((s) => !s);
              else navigate('/login');
            }}
            src={profilepic}
            className="w-7 cursor-pointer rounded-full"
            alt="User profile"
          />

          {/* profile menu: visible on click (works on mobile too) */}
          {token && profileOpen && (
            <div className="absolute right-0 mt-3 z-20">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-md">
                <p className="cursor-pointer hover:text-black" onClick={() => { setProfileOpen(false); navigate('/profile'); }}>
                  My Profile
                </p>
                <p className="cursor-pointer hover:text-black" onClick={() => { setProfileOpen(false); navigate('/orders'); }}>
                  Orders
                </p>
                <p onClick={handleLogout} className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative inline-block" aria-label="Cart">
          <img src={carticon} className="w-6" alt="Cart" />
          {cartCount > 0 && (
            <span
              className="
                absolute -right-1 -bottom-1 w-4 h-4 bg-white text-black text-[8px]
                flex items-center justify-center rounded-full border border-gray-300 z-10
              "
            >
              {cartCount}
            </span>
          )}
        </Link>

        <button
          onClick={() => setVisible(true)}
          className="w-5 cursor-pointer sm:hidden p-0"
          aria-label="Open menu"
        >
          <img src={menuicon} alt="menu icon" />
        </button>
      </div>

      {/* Sidebar menu for small screen */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 z-40 bg-white transition-all overflow-auto
          ${visible ? 'w-full' : 'w-0 pointer-events-none'}
        `}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img className="h-4 rotate-90" src={dropdown} alt="back" />
            <p>Back</p>
          </div>

          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/">
            HOME
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/collection">
            COLLECTIONS
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/about">
            ABOUT
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/contact">
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
