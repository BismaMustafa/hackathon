import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import the initialized Firebase
import { collection, addDoc, getDocs } from 'firebase/firestore';

const AppointmentForm = ({ onSubmit, onCancel, initialData }) => {
  const [date, setDate] = useState(initialData ? initialData.date : '');
  const [time, setTime] = useState(initialData ? initialData.time : '');
  const [notes, setNotes] = useState(initialData ? initialData.notes : '');
  const [appointments, setAppointments] = useState([]); // State to hold appointments

  useEffect(() => {
    // Fetch existing appointments from Firestore
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(db, 'appointments'));
      const fetchedAppointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAppointments(fetchedAppointments);
    };
    
    fetchAppointments(); // Call the fetch function on mount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const appointmentData = { date, time, notes };

    try {
      // Save appointment data to Firestore
      const docRef = await addDoc(collection(db, 'appointments'), appointmentData);
      console.log("Appointment written with ID: ", docRef.id);
      onSubmit(appointmentData); // Call the onSubmit prop to update the parent component state
      alert('Appointment booked successfully!');

      // Update appointments list after adding a new appointment
      setAppointments(prev => [...prev, { id: docRef.id, ...appointmentData }]);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="border border-gray-300 p-2 rounded"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="border border-gray-300 p-2 rounded"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          className="border border-gray-300 p-2 rounded"
        />
        <div className="flex space-x-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {initialData ? 'Update Appointment' : 'Book Appointment'}
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
        </div>
      </form>

      {/* Display appointments */}
      <h2 className="mt-4 text-xl">Appointments</h2>
      <ul>
        {appointments.map(appointment => (
          <li key={appointment.id}>
            {`${appointment.date} at ${appointment.time}: ${appointment.notes}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentForm;
