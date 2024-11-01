import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { auth } from '../firebase'; // Import your firebase configuration
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link

// Define validation schema
const signupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Signup = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      console.log('User signed up:', data.email);
      navigate('/about'); // Navigate to the About page after successful signup
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-4">Sign Up</h2>
        
        <input
          type="email"
          placeholder="Email"
          {...register('email')}
          className={`mb-2 p-2 border border-gray-300 rounded ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 mb-2">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register('password')}
          className={`mb-2 p-2 border border-gray-300 rounded ${errors.password ? 'border-red-500' : ''}`}
        />
        {errors.password && <p className="text-red-500 mb-2">{errors.password.message}</p>}

        <input
          type="password"
          placeholder="Confirm Password"
          {...register('confirmPassword')}
          className={`mb-4 p-2 border border-gray-300 rounded ${errors.confirmPassword ? 'border-red-500' : ''}`}
        />
        {errors.confirmPassword && <p className="text-red-500 mb-2">{errors.confirmPassword.message}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md px-4 py-2 transition duration-150 ease-in-out mb-2"
        >
          Sign Up
        </button>

        <p>If you already have an account, <Link to="/login" className="text-blue-500 underline">Login</Link></p>
      </form>
    </div>
  );
};

export default Signup;
