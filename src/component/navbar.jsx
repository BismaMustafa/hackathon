import React, { useState, useEffect } from 'react';
import { Disclosure, DisclosureButton, Menu } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useAuth } from '../context/authContext'; 

const navigation = [
  { name: 'HealthCare', href: '/healthcare', current: true },
  { name: 'Home', href: '/', current: false },
  { name: 'Profile', href: '/profile', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, setUser } = useAuth(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setUser(user);
    });

    return () => unsubscribe(); 
  }, [setUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); 
      navigate('/'); 
    } catch (error) {
      console.error("Error signing out: ", error);
    }
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
            {isLoggedIn && user && (
              <div className="flex items-center mr-4">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 mr-2 flex items-center justify-center bg-blue-500 text-white font-bold">
                  {user.photoURL ? (
                    <img
                      alt="User Profile"
                      src={user.photoURL}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user.email.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-white">{user.displayName || 'User'}</span>
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
              <button
                onClick={handleLogout}
                className="ml-2 bg-red-500 text-white rounded-md px-4 py-1 hover:bg-red-600 transition duration-150 ease-in-out"
              >
                Logout
              </button>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/doctorLogin"
                  className="ml-2 bg-blue-500 text-white rounded-md px-4 py-1 hover:bg-blue-600 transition duration-150 ease-in-out"
                >
                  Dr. Login
                </Link>
                <Link
                  to="/patientLogin"
                  className="ml-2 bg-blue-500 text-white rounded-md px-4 py-1 hover:bg-blue-600 transition duration-150 ease-in-out"
                >
                  Patient Login
                </Link>
              </div>
            )}
            <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* User Menu */}
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                </Menu.Button>
              </div>
              <Menu.Items
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none"
              >
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                    >
                      Your Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/settings" // Adjust the path as necessary
                      className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                    >
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                    >
                      Sign out
                    </button>
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
