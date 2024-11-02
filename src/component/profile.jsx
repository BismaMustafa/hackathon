import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppointmentForm from './appointmentForm'; 
import UpdateProfileForm from './updateProfileForm'; 

const Profile = () => {
  const location = useLocation();
  const { doctorData } = location.state || {};
  const doctorImageURL = 'https://thumbs.dreamstime.com/z/brain-issues-medical-concept-photo-female-doctor-empty-space-neurologist-doctor-brain-specialist-aesthetic-handdrawn-229325148.jpg';

  const [isFormVisible, setFormVisible] = useState(false); 
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false); 
  const [isEditAppointmentVisible, setEditAppointmentVisible] = useState(false); 
  const [appointmentMessage, setAppointmentMessage] = useState(''); 
  const [updatedData, setUpdatedData] = useState(doctorData); 
  const [appointments, setAppointments] = useState([]);
  const [currentAppointment, setCurrentAppointment] = useState(null); 
  const handleAppointmentSubmit = (appointmentData) => {
    setAppointments(prevAppointments => [...prevAppointments, appointmentData]); 
    setAppointmentMessage(`Your appointment is booked for ${appointmentData.date} at ${appointmentData.time}. Notes: ${appointmentData.notes}`);
    setFormVisible(false); 
  };

  const handleUpdate = (updatedProfileData) => {
    setUpdatedData(updatedProfileData); 
    alert(`Profile updated: ${JSON.stringify(updatedProfileData)}`);
    setUpdateFormVisible(false); 
  };

  const handleEditAppointment = (appointment) => {
    setCurrentAppointment(appointment);
    setEditAppointmentVisible(true); 
  };

  const handleUpdateAppointment = (updatedAppointmentData) => {
    setAppointments(prevAppointments => 
      prevAppointments.map((appt) => 
        appt === currentAppointment ? updatedAppointmentData : appt
      )
    );
    setEditAppointmentVisible(false); 
    setCurrentAppointment(null); 
  };

  const handleDeleteAppointment = (appointment) => {
    setAppointments(prevAppointments => prevAppointments.filter(appt => appt !== appointment)); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">{updatedData?.name}</h1>
      <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300 mb-4">
        <img
          src={doctorImageURL} 
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <p>{updatedData?.email}</p>
      {updatedData?.userType === 'patient' && (
        <>
          <h3 className="text-lg font-semibold">Medical History:</h3>
          <p>{updatedData?.medicalHistory || 'No medical history available.'}</p>
        </>
      )}
      <button onClick={() => setUpdateFormVisible(true)} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Update Profile</button>
      <button onClick={() => setFormVisible(true)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Make Appointment</button>

      {isUpdateFormVisible && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Update Profile</h3>
          <UpdateProfileForm 
            initialData={updatedData} 
            onUpdate={handleUpdate} 
            onCancel={() => setUpdateFormVisible(false)} 
          />
        </div>
      )}

      {isFormVisible && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Appointment Form</h3>
          <AppointmentForm onSubmit={handleAppointmentSubmit} onCancel={() => setFormVisible(false)} />
        </div>
      )}

      {appointmentMessage && (
        <div className="mt-4 p-4 border border-green-500 text-green-500 bg-green-100 rounded">
          {appointmentMessage}
        </div>
      )}

      <div className="mt-4 w-full">
        <h3 className="text-lg font-semibold mb-2">Appointments</h3>
        {appointments.length > 0 ? (
          <ul className="list-disc pl-5">
            {appointments.map((appointment, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{appointment.date} at {appointment.time} - {appointment.notes}</span>
                <div>
                  <button onClick={() => handleEditAppointment(appointment)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Update</button>
                  <button onClick={() => handleDeleteAppointment(appointment)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments booked.</p>
        )}
      </div>

  
      {isEditAppointmentVisible && currentAppointment && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Edit Appointment</h3>
          <AppointmentForm 
            onSubmit={handleUpdateAppointment} 
            onCancel={() => { setEditAppointmentVisible(false); setCurrentAppointment(null); }} 
            initialData={currentAppointment}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
