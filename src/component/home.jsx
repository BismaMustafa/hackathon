
import React from 'react';

import { useAuth } from '../context/authContext'; 

const Home = () => {
  const { user } = useAuth(); 

  return (
    <div>
      <h2>Home</h2>
      {user ? (
        <div>
          <h3>Your Details:</h3>
          <h1>Name: {user.name}</h1>
          <h1>Specialization: {user.specialization}</h1>
          <h1>Contact Info: {user.contactInfo}</h1>
          <h1>Schedule: {user.schedule}</h1>
          <h1>Email: {user.email}</h1>
        </div>
      ) : (
        <p>Please sign up or log in.</p>
      )}
    </div>
  );
};

export default Home;
