import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import About from './component/about'
import Home from './component/home'
import Contact from './component/contact'
import Product from './component/product'
import Navbar from './component/navbar'
import Login from './component/login'
import Signup from './component/signup'
import Post from './component/post'
import { CartProvider } from './cartContext'
function App() {
  return (
    <div>
      <CartProvider>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/'  element={<Home/>} />
        <Route path='/about'  element={<About/>} />
        <Route path='/contact'  element={<Contact/>} />
        <Route path='/product'  element={<Product/>} />
        <Route path='/login'  element={<Login/>} />
        <Route path='/signup'  element={<Signup/>} />
        <Route path='/post'  element={<Post/>} />

      </Routes>
      </BrowserRouter>
      </CartProvider>
    </div>
  )
}

export default App
