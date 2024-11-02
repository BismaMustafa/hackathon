import React, { useState } from 'react';
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore'; 

const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleLoginWithEmail = async (e) => {
    e.preventDefault(); 
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const doctorDocRef = doc(db, 'doctors', user.uid); 
      const doctorSnapshot = await getDoc(doctorDocRef);

      if (doctorSnapshot.exists()) {
        const doctorData = doctorSnapshot.data();
        navigate('/profile' , { state: { doctorData } }); 
      } else {
        setError('No doctor found with this account.'); 
      }
    } catch (error) {
      setError(error.message); 
      console.error("Error during email/password login:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form onSubmit={handleLoginWithEmail} className="flex flex-col bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-4">Doctor Login</h2>
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
        <p>If you don't have an account <Link to="/doctorSignup" className="text-blue-500 underline">Sign Up</Link></p>
      </form>
    </div>
  );
};

export default DoctorLogin;
