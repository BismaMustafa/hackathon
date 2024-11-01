import React, { useState, useEffect } from 'react';
import { Disclosure, DisclosureButton, Menu } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { auth } from '../firebase'; // Import your firebase configuration
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useCart } from '../cartContext'; // Import the custom cart hook

const navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'About', href: '/about', current: false },
  { name: 'Contact', href: '/contact', current: false },
  { name: 'Product', href: '/product', current: false },
  { name: 'Post', href: '/post', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart(); // Destructure removeFromCart
  const [isCartOpen, setIsCartOpen] = useState(false); // State for cart dropdown visibility

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setUser(user);
    });

    return () => unsubscribe(); // Clean up subscription
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect or show success message after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-start sm:items-stretch sm:justify-start">
            {isLoggedIn && (
              <div className="flex items-center mr-4">
                <img
                  alt="User Profile"
                  src={user?.photoURL}
                  className="h-8 w-8 rounded-full mr-2"
                />
                <span className="text-white">{user?.displayName}</span>
              </div>
            )}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isLoggedIn ? (
              <>
                {/* Shopping Cart Icon with Count */}
                <div className="relative">
                  <img
                    src="https://cdn.pixabay.com/photo/2021/09/13/22/02/add-6622547_640.png"
                    alt="Shopping Cart"
                    className="h-8 w-8 mr-2 cursor-pointer"
                    onClick={toggleCart} // Toggle cart dropdown
                  />
                  {cartItems.length > 0 && (
                    <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 bg-red-500 text-white rounded-md px-4 py-1 hover:bg-red-600 transition duration-150 ease-in-out"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="ml-2 bg-blue-500 text-white rounded-md px-4 py-1 hover:bg-blue-600 transition duration-150 ease-in-out"
              >
                Login
              </Link>
            )}
            <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  {cartItems.length === 0 ? (
                    <span className="block px-4 py-2 text-gray-700">Cart is empty</span>
                  ) : (
                    cartItems.map(item => (
                      <div key={item.id} className="block px-4 py-2 text-gray-700 flex justify-between items-center">
                        {item.name}
                        <button
                          onClick={() => removeFromCart(item.id)} // Remove item from cart
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                  <button
                    onClick={clearCart}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:text-red-700"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}

            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                </Menu.Button>
              </div>
              <Menu.Items
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="#"
                      className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                    >
                      Your Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="#"
                      className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                    >
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="#"
                      className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                    >
                      Sign out
                    </Link>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
