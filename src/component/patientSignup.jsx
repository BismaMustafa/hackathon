import React, { useState } from 'react';
import { auth } from '../firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase'; 
import { doc, setDoc } from 'firebase/firestore'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';


const signupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  contactDetails: Yup.string().required('Contact details are required'),
  medicalHistory: Yup.string(),
});

const PatientSignup = () => {
  const [successMessage, setSuccessMessage] = useState(''); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate(); 
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      const patientData = {
        name: data.name,
        contactDetails: data.contactDetails,
        medicalHistory: data.medicalHistory || '', 
         userType : 'patient'
      };
      await setDoc(doc(db, 'patients', user.uid) , patientData);

      console.log('Patient signed up:', data.email);
      setSuccessMessage('You have registered successfully!'); 
      setErrorMessage(''); 
      setTimeout(() => {
        navigate('/patientLogin'); 
      }, 1000); 
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage(error.message); 
      setSuccessMessage('');     }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-4">Patient Sign Up</h2>

        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>} {/* Display success message */}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>} {/* Display error message */}

        <input
          type="text"
          placeholder="Name"
          {...register('name')}
          className={`mb-2 p-2 border border-gray-300 rounded ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 mb-2">{errors.name.message}</p>}

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
          type="text"
          placeholder="Contact Details"
          {...register('contactDetails')}
          className={`mb-2 p-2 border border-gray-300 rounded ${errors.contactDetails ? 'border-red-500' : ''}`}
        />
        {errors.contactDetails && <p className="text-red-500 mb-2">{errors.contactDetails.message}</p>}

        <textarea
          placeholder="Medical History (optional)"
          {...register('medicalHistory')}
          className="mb-4 p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md px-4 py-2 transition duration-150 ease-in-out mb-2"
        >
          Sign Up
        </button>

        <p>If you already have an account, <Link to="/patientLogin" className="text-blue-500 underline">Login</Link></p>
      </form>
    </div>
  );
};

export default PatientSignup;
