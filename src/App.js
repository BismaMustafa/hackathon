import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
// import About from './component/about'
import Home from './component/home'
// import Contact from './component/contact'
// import Product from './component/product'
import Navbar from './component/navbar'
// import Login from './component/login'
// import Signup from './component/signup'
// import Post from './component/post'
import DoctorSignup from './component/doctorSignup'
import DoctorLogin from './component/doctorLogin'
import PatientLogin from './component/patientLogin'
import PatientSignup from './component/patientSignup'
import { AuthProvider } from './context/authContext';
import Profile from './component/profile'
import AppointmentForm from './component/appointmentForm'
import UpdateProfileForm from './component/updateProfileForm'
// import { CartProvider } from './cartContext'
function App() {
  return (
    <div>
       <AuthProvider>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/'  element={<Home/>} />
        <Route path='/profile'  element={<Profile/>} />
        <Route path='/appointmentForm'  element={<AppointmentForm/>} />
        <Route path='/updateProfileForm'  element={<UpdateProfileForm/>} />

        {/* <Route path='/about'  element={<About/>} /> */}
        <Route path='/doctorLogin'  element={<DoctorLogin/>} />
        <Route path='/doctorSignup'  element={<DoctorSignup/>} />
        <Route path='/patientLogin'  element={<PatientLogin/>} />
        <Route path='/patientSignup'  element={<PatientSignup/>} />

        {/* <Route path='/contact'  element={<Contact/>} />
        <Route path='/product'  element={<Product/>} />
        <Route path='/login'  element={<Login/>} />
        <Route path='/signup'  element={<Signup/>} />
        <Route path='/post'  element={<Post/>} /> */}

      </Routes>
      </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App
