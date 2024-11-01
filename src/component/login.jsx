import React, { useState } from 'react';
import { auth } from '../firebase'; // Import your firebase configuration
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLoginWithEmail = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Navigate to home page after successful login
    } catch (error) {
      setError(error.message); // Set error message if login fails
      console.error("Error during email/password login:", error);
    }
  };

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User signed in:', result.user);
      navigate('/'); // Navigate to home page after successful login
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setError(error.message); // Set error message if login fails
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form onSubmit={handleLoginWithEmail} className="flex flex-col bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md px-4 py-2 transition duration-150 ease-in-out mb-2"
        >
          Login 
        </button>
        <p>If you don't have an account <Link to="/signup" className="text-blue-500 underline">Sign Up</Link></p>
      </form>
      <div className="text-center mb-4">or</div>
      <button
        onClick={handleLoginWithGoogle}
        className="bg-red-500 text-white rounded-md px-4 py-2 transition duration-150 ease-in-out"
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;
