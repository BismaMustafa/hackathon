import React, { useState } from 'react'; 
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { auth, db } from '../firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'; 
import { setDoc, doc } from 'firebase/firestore'; 
import { useAuth } from '../context/authContext'; 

const signupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  specialization: Yup.string().required('Specialization is required'),
  contactInfo: Yup.string().required('Contact information is required'),
  schedule: Yup.string().required('Schedule is required'), 
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const DoctorSignup = () => {
  const navigate = useNavigate(); 
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
  });
  const { setUser } = useAuth();

  const [successMessage, setSuccessMessage] = useState(''); 

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      const doctorData = {
        name: data.name,
        specialization: data.specialization,
        contactInfo: data.contactInfo,
        schedule: data.schedule, 
        email: data.email,
        userType : 'doctor'
      };
      await setDoc(doc(db, 'doctors', user.uid), doctorData);
      setUser(doctorData);
      setSuccessMessage('You have registered successfully!'); 
      setTimeout(() => {
        navigate('/doctorLogin'); 
      }, 1000); 
    } catch (error) {
      console.error("Error during signup:", error);
      setSuccessMessage('Registration failed. Please try again.'); 
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-4">Doctor Sign Up</h2>
        
        <input
          type="text"
          placeholder="Name"
          {...register('name')}
          className={`mb-2 p-2 border border-gray-300 rounded ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 mb-2">{errors.name.message}</p>}

        <input
          type="text"
          placeholder="Specialization"
          {...register('specialization')}
          className={`mb-2 p-2 border border-gray-300 rounded ${errors.specialization ? 'border-red-500' : ''}`}
        />
        {errors.specialization && <p className="text-red-500 mb-2">{errors.specialization.message}</p>}

        <input
          type="text"
          placeholder="Contact Information"
          {...register('contactInfo')}
          className={`mb-2 p-2 border border-gray-300 rounded ${errors.contactInfo ? 'border-red-500' : ''}`}
        />
        {errors.contactInfo && <p className="text-red-500 mb-2">{errors.contactInfo.message}</p>}

        <input
          type="text"
          placeholder="Schedule (e.g., Mon-Fri 9am-5pm)"
          {...register('schedule')} 
          className={`mb-2 p-2 border border-gray-300 rounded ${errors.schedule ? 'border-red-500' : ''}`}
        />
        {errors.schedule && <p className="text-red-500 mb-2">{errors.schedule.message}</p>} {/* Error for schedule */} 

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

      {/* Success message */}
      {successMessage && (
        <div className="mt-4 bg-green-200 text-green-800 p-2 rounded">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default DoctorSignup;
