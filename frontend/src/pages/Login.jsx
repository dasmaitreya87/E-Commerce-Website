import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { setToken, navigate, backendUrl, token } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // redirect away if already authenticated
  useEffect(() => {
    if (token) {
      if (typeof navigate === 'function') navigate('/');
    }
  }, [token, navigate]);

  // simple password strength check for sign-up
  const validatePassword = (pwd) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[0-9]/.test(pwd)) return 'Password should contain at least one digit.';
    if (!/[A-Z]/.test(pwd)) return 'Password should contain at least one uppercase letter.';
    return null;
  };

  const resetFields = () => {
    setName('');
    setEmail('');
    setPassword('');
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Client-side check before request (only for Sign Up)
    if (currentState === 'Sign Up') {
      const pwdErr = validatePassword(password);
      if (pwdErr) {
        toast.error(pwdErr);
        setLoading(false);
        return;
      }
    }

    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        // If backend returns token:
        if (response.data?.token) {
          setToken(response.data.token); // ShopContext.saveToken persists to localStorage
          toast.success('Registration successful!');
          if (typeof navigate === 'function') navigate('/');
        } else {
          // If no token but success message from server:
          toast.success(response.data?.message || 'Registered successfully');
          resetFields();
          setCurrentState('Login');
        }
      } else {
        // Login
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (response.data?.token) {
          setToken(response.data.token);
          toast.success('Login successful!');
          if (typeof navigate === 'function') navigate('/');
        } else {
          toast.error(response.data?.message || 'Login failed');
        }
      }
    } catch (err) {
      // Show server-provided message when available
      const serverMsg = err?.response?.data?.message;
      if (serverMsg) {
        toast.error(serverMsg);
      } else {
        toast.error(err.message || 'Something went wrong');
      }
      console.error('Auth error:', err?.response || err);
    } finally {
      setLoading(false);
    }
  };

  const switchToSignUp = () => {
    setCurrentState('Sign Up');
    resetFields();
  };

  const switchToLogin = () => {
    setCurrentState('Login');
    // clear name because login doesn't need it
    setName('');
    setPassword('');
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-md m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <div className="h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === 'Login' ? null : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
          aria-label="Name"
        />
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
        aria-label="Email"
      />

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
        aria-label="Password"
      />

      {currentState === 'Sign Up' && (
        <p className="text-xs text-gray-600 self-start mt-1">
          Use at least 8 characters, one uppercase letter and one digit.
        </p>
      )}

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password ?</p>
        {currentState === 'Login' ? (
          <p onClick={switchToSignUp} className="cursor-pointer">
            Create Account
          </p>
        ) : (
          <p onClick={switchToLogin} className="cursor-pointer">
            Login Here
          </p>
        )}
      </div>

      <button
        type="submit"
        className="bg-black text-white font-light px-8 py-2 mt-4 cursor-pointer disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Please wait...' : currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;
